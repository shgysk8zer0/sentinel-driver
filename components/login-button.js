class HTMLLoginButtonElement extends HTMLButtonElement {
	constructor() {
		super();
		this.hidden = sessionStorage.hasOwnProperty('token');
		this.addEventListener('click', async () =>  this.form.showModal());
		document.addEventListener('login', () => this.hidden = true);
		document.addEventListener('logout', () => this.hidden = false);
	}

	get form() {
		return document.querySelector('login-form');
	}
}

customElements.define('login-button', HTMLLoginButtonElement, {extends: 'button'});
