import {$} from '../../js/std-js/functions.js';
import {API} from '../../js/consts.js';

export default class HTMLDriverListElement extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('driver-list-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));
		this.setAttribute('dropzone', 'move');

		this.addEventListener('drop', event => {
			event.preventDefault();
			const vehicleList = document.querySelector('[is="vehicle-list"]');
			const data = JSON.parse(event.dataTransfer.getData('application/json'));
			this.classList.remove('dragging');

			if (data.vehicle) {
				const vehicle = vehicleList.find(data.vehicle.uid);
				vehicle.driver = null;
			}
		});

		this.addEventListener('dragover', event => {
			event.preventDefault();
			this.classList.add('dragging');

		});

		this.addEventListener('dragleave', event => {
			event.preventDefault();
			this.classList.remove('dragging');
		});

		document.addEventListener('login', async () => {
			try {
				this.clear();
				await customElements.whenDefined('driver-element');
				const HTMLDriverElement = customElements.get('driver-element');
				const url = new URL(`alldrivers/${sessionStorage.getItem('token')}`, API);
				const headers = new Headers({Accept: 'application/json'});
				const resp = await fetch(url, {
					headers,
					mode: 'cors',
				});

				if (resp.ok) {
					const json = await resp.json();
					if ('error' in json) {
						throw new Error(`${resp.messager} [${resp.error}]`);
					} else {
						const drivers = json.map(driver => {
							const el = new HTMLDriverElement();
							el.name = driver.name;
							el.uid = driver.driverid;
							el.slot = 'driver';
							el.classList.add('card', 'shadow', 'block');
							return el;
						});
						this.append(...drivers);
						this.dispatchEvent(new CustomEvent('load', {
							detail: drivers,
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

	toJSON() {
		return this.drivers;
	}

	get drivers() {
		return [...this.shadowRoot.querySelector('slot[name="driver"]').assignedNodes()];
	}

	async load() {
		if (this.drivers.length !== 0) {
			return this.drivers;
		} else {
			return await new Promise(resolve => {
				this.addEventListener('load', event => resolve(event.detail));
			});
		}
	}

	find(id) {
		id = parseInt(id);
		return this.drivers.find(driver => driver.uid === id);
	}

	clear() {
		this.drivers.forEach(el => el.remove());
	}
}

$('link[name="DriverList"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('driver-list', HTMLDriverListElement, {extends: 'aside'});
});
