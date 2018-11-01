import {$} from '../../js/std-js/functions.js';

export default class HTMLDriverListElement extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('driver-list-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));
	}

	get drivers() {
		return [...this.shadowRoot.querySelector('slot[name="drivers"]').assignedNodes()];
	}

	find(id) {
		return this.drivers.find(driver => driver.uid === id);
	}
}

$('link[name="DriverList"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('driver-list', HTMLDriverListElement);
});
