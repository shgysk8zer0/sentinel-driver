import {$} from '../../js/std-js/functions.js';

export default class HTMLVehicleElement extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('vehicle-element-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));
		this.setAttribute('dropzone', 'move');
		this.classList.add('card', 'shadow');
		this.addEventListener('drop', event => {
			event.preventDefault();
			const driverUID = event.dataTransfer.getData('text/plain');
			this.shadowRoot.lastElementChild.classList.remove('dragging');
			this.driver = driverUID;
		});
		this.addEventListener('dragover', event => {
			event.preventDefault();
			this.shadowRoot.lastElementChild.classList.add('dragging');
			event.dataTransfer.dropEffect = 'move';
		});
		this.addEventListener('dragleave', event => {
			event.preventDefault();
			this.shadowRoot.lastElementChild.classList.remove('dragging');
		});

		$('[data-action="clear-driver"]', this.shadowRoot).click(() => {
			const driver = this.driver;
			if (driver instanceof HTMLElement) {
				const drivers = document.querySelector('driver-list');
				driver.slot = 'drivers';
				drivers.append(driver);
			}
		});
	}

	get uid() {
		return parseInt(this.getAttribute('uid'));
	}

	set uid(id) {
		this.setAttribute('uid', id);
	}

	get driver() {
		const drivers = this.shadowRoot.querySelector('slot[name="driver"]').assignedNodes();
		return drivers.length !== 0 ? drivers[0]: undefined;
	}

	set driver(driver) {
		const drivers = document.querySelector('driver-list');
		const driverEl = drivers.find(driver);
		this.setAttribute('driverUid', driver);
		if (driverEl instanceof HTMLElement) {
			if (this.driver instanceof HTMLElement) {
				drivers.append(this.driver);
			}
			driverEl.slot = 'driver';
			this.append(driverEl);
		}

	}
}

$('link[name="VehicleElement"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('vehicle-element', HTMLVehicleElement);
});
