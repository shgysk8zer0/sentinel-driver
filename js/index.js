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

ready().then(async () => {
	$(document.documentElement).replaceClass('no-js', 'js');

	document.addEventListener('login', async event => {
		console.log(event);
		sessionStorage.setItem('userID', event.detail.userID);
		await customElements.whenDefined('vehicle-element');
		await customElements.whenDefined('driver-element');
		const VehicleElement = customElements.get('vehicle-element');
		const DriverElement = customElements.get('driver-element');
		const VehicleList = document.querySelector('vehicle-list');
		const DriverList = document.querySelector('driver-list');
		const vehicles = event.detail.data.vehicles.map(vehicle => {
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
			}
			return el;
		});
		const drivers = event.detail.data.drivers.map(driver => {
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
	});

	document.addEventListener('logout', () => {
		sessionStorage.removeItem('userID');
		$('vehicle-element, driver-element').remove();
	});

	$('[data-show-modal]').click(event => {
		$(event.target.closest('[data-show-modal]').dataset.showModal).showModal();
	}, {
		passive: true,
	});

	$('[data-close]').click(event => {
		$(event.target.closest('[data-close]').dataset.close).close();
	}, {
		passive: true,
	});

	$('[name="icons"]').import('svg').then(icons => {
		icons.querySelector('svg').setAttribute('hidden', '');
		document.body.append(icons);
	});
});
