class HTMLCurentYearElement extends HTMLTimeElement {
	constructor() {
		const now = new Date();
		super();
		this.textContent = now.getFullYear();
		this.dateTime = now.toISOString();
	}
}

customElements.define('current-year', HTMLCurentYearElement, {extends: 'time'});
