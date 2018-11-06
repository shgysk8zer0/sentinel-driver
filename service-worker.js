const config = {
	version: '1.0.1',
	caches: [
		'/',
		// JS
		'/js/index.js',
		'/js/std-js/deprefixer.js',
		'/js/std-js/shims.js',
		'/js/std-js/functions.js',
		'/js/std-js/Notification.js',
		'/js/consts.js',
		'/js/std-js/esQuery.js',
		'/js/functions.js',
		// Custom Elements
		'/components/login-form/login-form.js',
		'/components/login-button.js',
		'/components/logout-button.js',
		'/components/current-year.js',
		'/components/vehicle-list/vehicle-list.js',
		'/components/vehicle-element/vehicle-element.js',
		'/components/driver-list/driver-list.js',
		'/components/driver-element/driver-element.js',
		// CSS
		'/css/styles/index.css',
		'/css/core-css/viewport.css',
		'/css/normalize/normalize.css',
		'/css/styles/vars.css',
		'/css/core-css/rem.css',
		'/css/core-css/element.css',
		'/css/core-css/class-rules.css',
		'/css/animate.css/animate.css',
		'/css/core-css/animations.css',
		'/css/core-css/fonts.css',
		'/css/styles/layout.css',
		'/css/core-css/utility.css',
		'/css/styles/header.css',
		'/css/styles/nav.css',
		'/css/styles/sidebar.css',
		'/css/styles/main.css',
		'/css/styles/footer.css',
		// Images
		'/img/icons.svg',
		'/img/favicon.svg',
		// Templates
		'/components/login-form/login-form.html',
		'/components/vehicle-element/vehicle-element.html',
		'/components/vehicle-list/vehicle-list.html',
		'/components/driver-list/driver-list.html',
		'/components/driver-element/driver-element.html',

		// Logos
		// '/img/logos/facebook.svg',
		// '/img/logos/twitter.svg',
		// '/img/logos/linkedin.svg',
		// '/img/logos/google-plus.svg',
		// '/img/logos/reddit.svg',
		// '/img/logos/gmail.svg',

		// Fonts
		'/fonts/Alice.woff2',
		'/fonts/roboto.woff2',
	].map(path => new URL(path, location.origin)),
	ignored: [
		'/service-worker.js',
		'/manifest.json',
	],
	paths: [
		'/js/',
		'/css/',
		'/img/',
	],
	hosts: [
		'secure.gravatar.com',
		'i.imgur.com',
		'cdn.polyfill.io',
	],
};

addEventListener('install', async () => {
	const cache = await caches.open(config.version);
	await cache.addAll(config.caches);
	skipWaiting();
});

addEventListener('activate', event => {
	event.waitUntil(async function() {
		clients.claim();
	}());
});

function isValid(req) {
	try {
		const url = new URL(req.url);
		const isGet = req.method === 'GET';
		const allowedHost = config.hosts.includes(url.host);
		const isHome = ['/', '/index.html', '/index.php'].some(path => url.pathname === path);
		const notIgnored = config.ignored.every(path => url.pathname !== path);
		const allowedPath = config.paths.some(path => url.pathname.startsWith(path));

		return isGet && (allowedHost || (isHome || (allowedPath && notIgnored)));
	} catch(err) {
		console.error(err);
		return false;
	}
}

async function get(request) {
	const cache = await caches.open(config.version);
	const cached = await cache.match(request);

	if (cached instanceof Response) {
		return cached;
	}
}

addEventListener('fetch', async event => {
	if (isValid(event.request)) {
		// console.log(event.request.url);
		event.respondWith(get(event.request));
	}
});
