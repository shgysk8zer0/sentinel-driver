import {$} from '/js/std-js/functions.js';
import HTMLDriverElement from '/components/driver-element/driver-element.js';

export default class HTMLVehicleElement extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('vehicle-element-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));
	}

	get uid() {
		return this.getAttribut('uid');
	}

	set uid(id) {
		this.setAttribute('uid', id);
	}

	get driver() {
		return this.shadowRoot.querySelector('slot[name="driver"]').assignedNodes()[0];
	}

	set driver(driver) {
		if (! (driver instanceof HTMLDriverElement)) {
			throw new Error('Expected driver to be an instance of <driver-element>');
		}
	}
}

$('link[name="VehicleElement"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('vehicle-element', HTMLVehicleElement);
});
