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
				const url = new URL(`${API}logins`);
				const headers = new Headers();
				const body = JSON.stringify([Object.fromEntries(form.entries())]);
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

					document.dispatchEvent(new CustomEvent('login', {
						detail: {
							resp: json,
							ownerInfo: await getOwnerInfo({userid, token}),
						}
					}));
					this.reset();
				}
			} catch(err) {
				console.error(err);
				notify('Error logging in', {
					body: err.message,
					icon: new URL('/img/octicons/alert.svg', document.baseURI)
				});
			}
		});
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

	showModal() {
		this.dialog.showModal();
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
