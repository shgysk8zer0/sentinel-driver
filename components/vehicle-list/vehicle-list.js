import {$} from '../../js/std-js/functions.js';

export default class HTMLVehicleListElement extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('vehicle-list-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));
	}

	set vehicles(vehicles) {
		if (Array.isArray(vehicles)) {
			console.log(vehicles);
		}
	}

	add(...vehicles) {
		vehicles.forEach(vehicle => {
			vehicle.slot = 'vehicles';
		});
		this.append(...vehicles);
	}

	findDriver(id) {
		return this.shadowRoot.querySelectorAll('vehicle-element').find(vehicle => vehicle.uid === id);
	}


}

$('link[name="VehicleList"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('vehicle-list', HTMLVehicleListElement);
});
