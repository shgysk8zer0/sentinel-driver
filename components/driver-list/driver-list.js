import {$} from '../../js/std-js/functions.js';

export default class HTMLDriverListElement extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('driver-list-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));
	}
}

$('link[name="DriverList"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('driver-list', HTMLDriverListElement);
});
