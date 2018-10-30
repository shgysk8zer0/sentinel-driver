class HTMLLogoutButtonElement extends HTMLButtonElement {
	constructor() {
		super();
		this.hidden = ! sessionStorage.hasOwnProperty('token');
		document.addEventListener('login', () => this.hidden = false);
		document.addEventListener('logout', () => this.hidden = true);
		this.addEventListener('click', () => document.dispatchEvent(new CustomEvent('logout')));
	}
}

customElements.define('logout-button', HTMLLogoutButtonElement, {extends: 'button'});
