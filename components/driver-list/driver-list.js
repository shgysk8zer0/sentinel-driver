import {$} from '../../js/std-js/functions.js';

export default class HTMLDriverListElement extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('driver-list-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));
		this.setAttribute('dropzone', 'move');
		this.addEventListener('drop', event => {
			event.preventDefault();
			console.log(event);
			const driverUID = event.dataTransfer.getData('text/plain');
			const driver = document.querySelector('vehicle-list').findDriver(driverUID);
			this.classList.remove('dragging');
			if (driver instanceof HTMLElement) {
				this.append(driver);
			}
		});
		this.addEventListener('dragover', event => {
			event.preventDefault();
			console.log(event);
			this.classList.add('dragging');
			event.dataTransfer.dropEffect = 'move';
		});
		this.addEventListener('dragleave', event => {
			event.preventDefault();
			console.log(event);
			this.classList.remove('dragging');
		});
	}

	get drivers() {
		return [...this.shadowRoot.querySelector('slot[name="driver"]').assignedNodes()];
	}

	find(id) {
		id = parseInt(id);
		return this.drivers.find(driver => driver.uid === id);
	}
}

$('link[name="DriverList"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('driver-list', HTMLDriverListElement);
});
