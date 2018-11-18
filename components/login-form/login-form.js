import {$, notify} from '../../js/std-js/functions.js';
import {API} from '../../js/consts.js';
import {getOwnerInfo} from '../../js/functions.js';

export default class LoginForm extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('login-form-template');
		this.attachShadow({mode: 'open'}).append(document.importNode(template.content, true));

		this.form.addEventListener('reset', () => {
			this.close();
		});

		this.form.addEventListener('submit', async event => {
			event.preventDefault();
			try {
				const form = new FormData(this.form);
				const data = Object.fromEntries(form.entries());
				this.login({
					userid: data.userid,
					password: data.password,
				});
			} catch(err) {
				console.error(err);
				notify('Error logging in', {
					body: err.message,
					icon: new URL('/img/octicons/alert.svg', document.baseURI)
				});
			}
		});

		$('.dialog-container', this.shadowRoot).pickClass('no-dialog', 'dialog', document.createElement('dialog') instanceof HTMLUnknownElement);
	}

	async loginWithCreds() {
		if ('credentials' in navigator && window.PasswordCredential instanceof Function) {
			const creds = await navigator.credentials.get({
				password: true,
				mediation: 'required',
			});
			if (creds instanceof PasswordCredential) {
				return this.login({
					userid: creds.id,
					password: creds.password,
					store: false,
				});
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	async login({userid, password, store = true}) {
		const headers = new Headers();
		const url = new URL(`${API}logins`);
		const body = JSON.stringify([{userid, password}]);
		headers.set('Content-Type', 'application/json');
		headers.set('Accept', 'application/json');
		const resp = await fetch(url, {
			mode: 'cors',
			method: 'POST',
			headers,
			body,
		});
		if (resp.ok) {
			const json = await resp.json();
			if ('error' in json) {
				throw new Error(`"${json.message}" [${json.error}]`);
			}

			const {token, userid} = json;
			const ownerInfo = await getOwnerInfo({userid, token});

			document.dispatchEvent(new CustomEvent('login', {
				detail: {
					resp: json,
					ownerInfo,
				}
			}));
			if (store && window.PasswordCredential instanceof Function) {
				const creds = new PasswordCredential({
					id: userid,
					name: ownerInfo.name,
					password: password,
					iconURL: new URL('/img/adwaita-icons/status/avatar-default.svg', document.baseURI),
				});
				await navigator.credentials.store(creds);
			}
			this.reset();
			return true;
		} else {
			return false;
		}
	}

	get method() {
		return this.form.method;
	}

	set method(method) {
		this.form.method = method;
	}

	get action() {
		return new URL(this.form.action);
	}

	set action(url) {
		this.form.action = new URL(url, document.baseURI);
	}

	get dialog() {
		return this.shadowRoot.querySelector('dialog');
	}

	get form() {
		return this.shadowRoot.querySelector('form');
	}

	async showModal() {
		if ('credentials' in navigator && window.PasswordCredential instanceof Function) {
			const creds = await navigator.credentials.get({
				password: true,
				mediation: 'required',
			});
			if (creds instanceof PasswordCredential) {
				this.login({
					userid: creds.id,
					password: creds.password,
					store: false,
				});
			} else {
				this.dialog.showModal();
			}
		} else {
			this.dialog.showModal();
		}
	}

	close() {
		this.dialog.close();
	}

	reset() {
		this.form.reset();
	}
}

$('link[name="LoginForm"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('login-form', LoginForm);
});
