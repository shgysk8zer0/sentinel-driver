import {$} from '/js/std-js/functions.js';

export default class HTMLDriverElement extends HTMLElement {
	constructor() {
		super();
	}

	get uid() {
		return this.getAttribute('uid');
	}

	set uid(id) {
		this.setAttribute('uid', id);
	}
}

$('link[name="DriverElement"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('driver-element', HTMLDriverElement);
});
