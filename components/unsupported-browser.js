class HTMLUnsupportedBrowserElement extends HTMLDivElement {}

customElements.define('unsupported-browser', HTMLUnsupportedBrowserElement, {extends: 'div'});
