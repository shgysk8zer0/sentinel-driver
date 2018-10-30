import './std-js/deprefixer.js';
import './std-js/shims.js';
import {ready, $} from './std-js/functions.js';
import '/components/login-form/login-form.js';
import '/components/vehicle-element/vehicle-element.js';
import '/components/driver-element/driver-element.js';
import '/components/login-button.js';
import '/components/logout-button.js';
import '/components/current-year.js';
import {VEHICLE} from './consts.js';

async function loadData() {
	await customElements.whenDefined('vehicle-element');
	await customElements.whenDefined('driver-element');
	const VehicleElement = customElements.get('vehicle-element');
	const DriverElement = customElements.get('driver-element');
	const VehicleList = document.querySelector('vehicle-list');
	const DriverList = document.querySelector('driver-list');
	const resp = await fetch(new URL('user.json', document.baseURI));
	const data = await resp.json();
	const vehicles = data.vehicles.map(vehicle => {
		const el = new VehicleElement();
		const name = document.createElement('span');
		name.textContent = vehicle.model;
		name.slot = 'name';
		el.append(name);
		el.uid = vehicle.uid;

		if ('image' in vehicle) {
			const img = new Image();
			img.slot = 'image';
			img.src = new URL(vehicle.image, VEHICLE.imgDir);
			el.append(img);
		}
		return el;
	});
	const drivers = data.drivers.map(driver => {
		const el = new DriverElement();
		const name = document.createElement('span');
		name.textContent = driver.name;
		name.slot = 'name';
		el.append(name);
		el.uid = driver.uid;
		return el;
	});
	VehicleList.append(...vehicles);
	DriverList.append(...drivers);
}

ready().then(async () => {
	$(document.documentElement).replaceClass('no-js', 'js');
	$('link[name="icons"]').import('svg').then(icons => document.body.append(icons));

	document.addEventListener('login', async event => {
		if (event.detail !== null && event.detail.hasOwnProperty('resp')) {
			sessionStorage.setItem('token', event.detail.resp.token);
		}
		loadData();
	});

	document.addEventListener('logout', () => {
		sessionStorage.clear();
		$('vehicle-element, driver-element').remove();
	});

	if (sessionStorage.hasOwnProperty('token')) {
		document.dispatchEvent(new CustomEvent('login'));
	}
});
