import {$} from '/js/std-js/functions.js';

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
		this.addEventListener('dragstart', event => {
			event.dataTransfer.setData('text/plain', event.target.uid);
			event.dropEffect = 'move';
		});
	}

	get uid() {
		return this.getAttribute('uid');
	}

	set uid(id) {
		this.setAttribute('uid', id);
	}
}

$('link[name="DriverElement"]').import('template').then(frag => {
	document.body.append(frag);
	customElements.define('driver-element', HTMLDriverElement);
});
