class HTMLLoginButtonElement extends HTMLButtonElement {
	constructor() {
		super();
		this.hidden = sessionStorage.hasOwnProperty('token');
		this.addEventListener('click', () => document.querySelector('login-form').showModal());
		document.addEventListener('login', () => this.hidden = true);
		document.addEventListener('logout', () => this.hidden = false);
	}
}

customElements.define('login-button', HTMLLoginButtonElement, {extends: 'button'});
