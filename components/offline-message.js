export default class HTMLOfflineMessageElement extends HTMLParagraphElement {
	constructor() {
		super();
		this.hidden = navigator.onLine;
		window.addEventListener('online', async () => {
			await this.animate([
				{opacity: 1},
				{opacity: 0},
			], {
				duration: 250,
				easing: 'ease-in-out',
				fill: 'both',
			}).finished;
			this.hidden = true;
		});
		window.addEventListener('offline', async () => {
			this.hidden = false;
			await this.animate([
				{opacity: 0},
				{opacity: 1},
			], {
				duration: 250,
				easing: 'ease-in-out',
				fill: 'both'
			}).finished;
		});
	}
}

customElements.define('offline-message', HTMLOfflineMessageElement, {extends: 'p'});
