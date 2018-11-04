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

	get vehicles() {
		return [...this.shadowRoot.querySelector('slot[name="vehicles"]').assignedNodes()];
	}

	find(id) {
		return this.vehicles.find(vehicle => vehicle.uid === id);
	}

	findDriver(id) {
		id = parseInt(id);
		const vehicle = this.vehicles.find(vehicle => vehicle.driver instanceof HTMLElement && vehicle.driver.uid === id);
		return vehicle instanceof HTMLElement ? vehicle.driver : undefined;
	}

	add(...vehicles) {
		vehicles.forEach(vehicle => {
			vehicle.slot = 'vehicles';
		});
		this.append(...vehicles);
	}
}

$('link[name="VehicleList"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('vehicle-list', HTMLVehicleListElement);
});
