const unsupported = Object.keys(Object.fromEntries(Object.entries({
	fetch: fetch instanceof Function,
	classList: 'classList' in Element.prototype,
	DragEvent: window.DragEvent instanceof Function,
	AnimationAPI: Element.prototype.animate instanceof Function,
	ScriptNoModule: HTMLScriptElement.prototype.hasOwnProperty('noModule'),
	ShadowDOM: HTMLElement.prototype.attachShadow instanceof Function,
	HTMLTemplateElement: ! (document.createElement('template') instanceof HTMLUnknownElement),
	CSSGrid: CSS.supports('display', 'grid'),
	sessionStorage: window.sessionStorage !== undefined,
}).filter(test => ! test[1])));

class HTMLUnsupportedBrowserElement extends HTMLDivElement {
	constructor() {
		super();
		document.addEventListener('unsupported', event => {
			if (Array.isArray(event.detail) && event.detail.length !== 0) {
				this.hidden = false;
				this.style.setProperty('display', 'block', 'important');
				console.error({unsupported: event.detail});
			}
		});

		if (Object.keys(unsupported).length !== 0) {
			document.dispatchEvent(new CustomEvent('unsupported', {detail: unsupported}));
		}
	}

	set unsupported(features) {
		const list = document.createElement('ul');
		const heading = document.createElement('h3');
		const items = features.map(item => {
			const li = document.createElement('li');
			li.textContent = item;
			return li;
		});

		heading.textContent = 'Unsupported Features';
		list.append(...items);
		this.append(heading, list);
	}
}

customElements.define('unsupported-browser', HTMLUnsupportedBrowserElement, {extends: 'div'});
