import {$} from '/js/std-js/functions.js';

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
			const form = new FormData(this.form);
			const url = this.action;
			const data = Object.fromEntries(form.entries());
			[...form.entries()].forEach(([key, val]) => url.searchParams.set(key, val));
			const resp = await fetch(url);
			const json = await resp.json();

			document.dispatchEvent(new CustomEvent('login', {
				detail: {
					url,
					userID: data.userID,
					data: json,
				}
			}));
			this.reset();
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
