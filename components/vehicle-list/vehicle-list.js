import {$} from '../../js/std-js/functions.js';
import {API} from '../../js/consts.js';

export default class HTMLVehicleListElement extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('vehicle-list-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));

		document.addEventListener('login', async () => {
			try {
				this.clear();
				await customElements.whenDefined('vehicle-element');
				const HTMLVehicleElement = customElements.get('vehicle-element');
				const url = new URL(`allout/${sessionStorage.getItem('token')}`, API);
				const headers = new Headers({Accept: 'application/json'});
				const resp = await fetch(url, {
					headers,
					mode: 'cors',
				});

				if (resp.ok) {
					const json = await resp.json();
					if ('error' in json) {
						throw new Error(`${json.message} [${json.error}]`);
					} else {
						await customElements.whenDefined('driver-list');
						await document.querySelector('driver-list').load();
						const vehicles = json.map(vehicle => {
							const el = new HTMLVehicleElement();
							el.name = vehicle.model;
							el.uid = vehicle.vehicleid;
							el.odometer.value = vehicle.mileage;
							el.odometer.min = vehicle.mileage;
							if (vehicle.driverid !== '') {
								el.driver = vehicle.driverid;
							}
							return el;
						});
						this.add(...vehicles);
						this.dispatchEvent(new CustomEvent('load', {
							detail: vehicles,
						}));
					}
				} else {
					throw new Error(`<${resp.url}> [${resp.status} ${resp.statusText}]`);
				}
			} catch(err) {
				console.error(err);
			}
		});
		document.addEventListener('logout', () => this.clear());
	}

	set vehicles(vehicles) {
		if (Array.isArray(vehicles)) {
			console.log(vehicles);
		}
	}

	get vehicles() {
		return [...this.shadowRoot.querySelector('slot[name="vehicles"]').assignedNodes()];
	}

	async load() {
		if (this.vehicles.length !== 0) {
			return this.vehicles;
		} else {
			return await new Promise(resolve => {
				this.addEventListener('load', event => resolve(event.detail));
			});
		}
	}

	clear() {
		this.vehicles.forEach(el => el.remove());
	}

	find(id) {
		return this.vehicles.find(vehicle => vehicle.uid === id);
	}

	findDriver(id) {
		id = parseInt(id);
		const vehicle = this.vehicles.find(vehicle => vehicle.driver instanceof HTMLElement && vehicle.driver.uid === id);
		return vehicle instanceof HTMLElement ? vehicle.driver : undefined;
	}

	findByDriver(id) {
		id = parseInt(id);
		const vehicle = this.vehicles.find(vehicle => vehicle.driver instanceof HTMLElement && vehicle.driver.uid === id);
		return vehicle instanceof HTMLElement ? vehicle : undefined;
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
