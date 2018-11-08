import {$} from '../../js/std-js/functions.js';
import {confirm} from '../../js/std-js/asyncDialog.js';

export default class HTMLVehicleElement extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('vehicle-element-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));
		this.setAttribute('dropzone', 'move, copy');
		this.classList.add('card', 'shadow');

		this.addEventListener('drop', event => {
			event.preventDefault();
			const data = JSON.parse(event.dataTransfer.getData('application/json'));
			this.classList.remove('dragging');
			if (data.vehicle) {
				const vehicle = this.list.find(data.vehicle.uid);
				vehicle.driver = null;
			}
			this.driver = data.uid;
		});

		this.addEventListener('dragover', event => {
			event.preventDefault();
			this.classList.add('dragging');
		});

		this.addEventListener('dragleave', event => {
			event.preventDefault();
			this.classList.remove('dragging');
		});

		$('[data-action="clear-driver"]', this.shadowRoot).click(async () => {
			const driver = this.driver;
			if (driver instanceof HTMLElement && await confirm(`Are you sure you want to remove ${this.driver.name} from ${this.name}?`)) {
				this.driver = null;
			}
		});
	}

	toJSON() {
		return {
			uid: this.uid,
			name: this.name,
			odometer: this.odometer.value,
		};
	}

	get uid() {
		return parseInt(this.getAttribute('uid'));
	}

	set uid(id) {
		this.setAttribute('uid', id);
	}

	get name() {
		const nodes = this.shadowRoot.querySelector('slot[name="name"]').assignedNodes();
		return nodes.length === 0 ? undefined : nodes[0].textContent;
	}

	set name(name) {
		const el = document.createElement('span');
		el.textContent = name;
		el.slot = 'name';
		this.title = name;
		this.append(el);
	}

	get driver() {
		const drivers = this.shadowRoot.querySelector('slot[name="driver"]').assignedNodes();
		return drivers.length !== 0 ? drivers[0]: undefined;
	}

	set driver(driver) {
		const drivers = document.querySelector('driver-list');
		const driverEl = drivers.find(driver) || this.list.findDriver(driver);
		const currentDriver = this.driver;

		if (driver === null && currentDriver instanceof HTMLElement) {
			this.removeAttribute('driverUid');
			currentDriver.remove();
			$('[data-action="clear-driver"]', this.shadowRoot).hide();
		} else if (driverEl instanceof HTMLElement) {
			if (currentDriver instanceof HTMLElement) {
				currentDriver.remove();
			}
			driverEl.slot = 'driver';
			driverEl.classList.remove('dragging');
			this.append(driverEl.cloneNode(true));
			$('[data-action="clear-driver"]', this.shadowRoot).unhide();
		}
	}

	get odometer() {
		return this.shadowRoot.querySelector('[name="odometer"]');
	}

	get list() {
		return document.querySelector('vehicle-list');
	}
}

$('link[name="VehicleElement"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('vehicle-element', HTMLVehicleElement);
});
