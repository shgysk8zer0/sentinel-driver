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
			console.log({driver: driverUID, vehicle: this.uid});
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
	}

	get uid() {
		return this.getAttribute('uid');
	}

	set uid(id) {
		this.setAttribute('uid', id);
	}

	get driver() {
		return this.getAttribute('driverUid');
	}

	set driver(driver) {
		this.setAttribute('driverUid', driver);
	}
}

$('link[name="VehicleElement"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('vehicle-element', HTMLVehicleElement);
});
