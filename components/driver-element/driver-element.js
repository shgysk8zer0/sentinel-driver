import {$} from '../../js/std-js/functions.js';

/**
 * [template description]
 * @type {[type]}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 */
export default class HTMLDriverElement extends HTMLElement {
	constructor() {
		super();
		this.draggable = true;
		const template = document.getElementById('driver-element-template').content;
		this.attachShadow({mode: 'open'}).appendChild(document.importNode(template, true));
		this.classList.toggle('no-pointer-event', ! navigator.onLine);
		window.addEventListener('offline', () => this.classList.add('no-pointer-events'));
		window.addEventListener('online', () => this.classList.remove('no-pointer-events'));

		this.addEventListener('dragstart', event => {
			this.classList.add('dragging');
			event.dataTransfer.dropEffect = this.matches('driver-list driver-element') ? 'copy' : 'move';
			event.dataTransfer.effectAllowed = this.matches('driver-list driver-element') ? 'copy' : 'move';
			event.dataTransfer.setData('application/json', JSON.stringify(this));
		}, {
			capture: true,
			passive: true,
		});

		this.addEventListener('dragend', () => {
			this.classList.remove('dragging');
		}, {
			capture: true,
			passive: true,
		});
	}

	toJSON() {
		return {
			uid: this.uid,
			name: this.name,
			vehicle: this.vehicle,
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
		el.slot = 'name';
		el.textContent = name;
		this.title = name;
		this.append(el);
	}

	get vehicle() {
		return this.isConnected ? this.closest('vehicle-element') : null;
	}
}

$('link[name="DriverElement"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('driver-element', HTMLDriverElement);
});
