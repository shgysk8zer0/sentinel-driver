import {$} from '../../js/std-js/functions.js';
import {confirm} from '../../js/std-js/asyncDialog.js';
import {API} from '../../js/consts.js';

export default class HTMLVehicleElement extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('vehicle-element-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));
		this.setAttribute('dropzone', 'move, copy');
		this.classList.add('card', 'shadow');

		this.classList.toggle('no-pointer-event', ! navigator.onLine);
		window.addEventListener('offline', () => this.classList.add('no-pointer-events'));
		window.addEventListener('online', () => this.classList.remove('no-pointer-events'));
		$('form', this.shadowRoot).submit(event => event.preventDefault());

		this.odometer.addEventListener('change', event => {
			const mileage = event.target.valueAsNumber;
			const min = parseInt(event.target.min);

			if (! Number.isNaN(mileage) && mileage > min) {
				this.dispatchEvent(new CustomEvent('odometerchange', {
					detail: {
						vehicleid: this.uid,
						mileage: event.target.valueAsNumber,
					}
				}));
			}
		}, {
			passive: true,
		});

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

		this.addEventListener('updateerror', console.error);

		this.addEventListener('odometerchange', async event => {
			try {
				const url = new URL('dragdrop', API);
				const headers = new Headers();
				const {mileage, vehicleid} = event.detail;
				const token = sessionStorage.getItem('token');
				const body = JSON.stringify([{
					mileage,
					vehicleid,
					token
				}]);
				headers.set('Content-Type', 'application/json');
				headers.set('Accept', 'application/json');
				const resp = await fetch(url, {
					method: 'POST',
					headers,
					body,
					mode: 'cors',
				});

				if (resp.ok) {
					const json = await resp.json();
					if ('error' in json) {
						throw new Error(`${json.message} [${json.error}]`);
					}
				} else {
					throw new Error(`<${resp.url}> [${resp.status} ${resp.statusText}]`);
				}
			} catch(err) {
				this.dispatchEvent(new ErrorEvent('updateerror', {
					error: err,
					message: `${err.message} [odometerchage]`,
					filename: err.fileName,
					lineno: err.lineNumber,
				}));
			}
		});

		this.addEventListener('driverchange', async event => {
			try {
				const url = new URL('dragdrop', API);
				const headers = new Headers();
				const {driverid, vehicleid} = event.detail;
				const token = sessionStorage.getItem('token');
				const body = JSON.stringify([{
					driverid: driverid || '0',
					vehicleid,
					token
				}]);
				headers.set('Content-Type', 'application/json');
				headers.set('Accept', 'application/json');
				const resp = await fetch(url, {
					method: 'POST',
					headers,
					body,
					mode: 'cors',
				});

				if (resp.ok) {
					const json = await resp.json();
					if ('error' in json) {
						throw new Error(`${json.message} [${json.error}]`);
					}
				} else {
					throw new Error(`<${resp.url}> [${resp.status} ${resp.statusText}]`);
				}
			} catch(err) {
				this.dispatchEvent(new ErrorEvent('updateerror', {
					error: err,
					message: `${err.message} [driverchage]`,
					filename: err.fileName,
					lineno: err.lineNumber,
				}));
			}
		});

		$('[data-action="clear-driver"]', this.shadowRoot).click(async () => {
			const driver = this.driver;
			if (driver instanceof HTMLElement && await confirm(`Are you sure you want to remove ${this.driver.name} from ${this.name}?`)) {
				this.driver = null;
			}
		});
	}

	static get observedAttributes() {
		return [
			'driveruid',
		];
	}

	connectedCallback() {
		this.dispatchEvent(new Event('connected'));
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (this.isConnected) {
			switch(name.toLowerCase()) {
			case 'driveruid':
				this.dispatchEvent(new CustomEvent('driverchange', {
					detail: {
						vehicleid: this.uid,
						driverid: parseInt(newValue) || null,
						oldDriver: parseInt(oldValue) || null
					},
				}));
			}
		}
	}

	toJSON() {
		return {
			uid: this.uid,
			name: this.name,
			odometer: this.odometer.value,
		};
	}

	get connected() {
		return new Promise(resolve => {
			if (this.isConnected) {
				resolve(this);
			} else {
				this.addEventListener('connected', () => resolve(this));
			}
		});
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
		const driverEl = drivers.find(driver);
		const currentDriver = this.driver;

		if (driver === null && currentDriver instanceof HTMLElement) {
			this.removeAttribute('driverUid');
			currentDriver.remove();
			$('[data-action="clear-driver"]', this.shadowRoot).hide();
		} else if (driverEl instanceof HTMLElement) {
			if (currentDriver instanceof HTMLElement) {
				currentDriver.remove();
			}
			this.list.vehicles.forEach(vehicle => {
				if (vehicle !== this && vehicle.driver instanceof HTMLElement && vehicle.driver.uid === driver) {
					vehicle.driver = null;
				}
			});
			this.setAttribute('driverUid', driver);
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
