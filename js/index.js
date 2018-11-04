import './std-js/deprefixer.js';
import './std-js/shims.js';
import {ready, $, notify} from './std-js/functions.js';
import '../components/login-form/login-form.js';
import '../components/vehicle-list/vehicle-list.js';
import '../components/vehicle-element/vehicle-element.js';
import '../components/driver-list/driver-list.js';
import '../components/driver-element/driver-element.js';
import '../components/login-button.js';
import '../components/logout-button.js';
import '../components/current-year.js';
import {loadData} from './functions.js';

ready().then(async () => {
	$(document.documentElement).replaceClass('no-js', 'js');
	$('link[name="icons"]').import('svg').then(icons => {
		$('svg', icons).attr({hidden: true});
		document.body.append(icons);
	});

	document.addEventListener('login', async event => {
		if (event.detail !== null && event.detail.hasOwnProperty('resp') && event.detail.hasOwnProperty('ownerInfo')) {
			const {token, userid} = event.detail.resp;
			const {ownerid, name} = event.detail.ownerInfo;
			sessionStorage.setItem('token', token);
			sessionStorage.setItem('userId', userid);
			sessionStorage.setItem('ownerId', ownerid);
			sessionStorage.setItem('companyName', name);
			notify('Login successful', {
				body: `Welcome back, ${name}`,
				icon: new URL('/img/icon-192.png', document.baseURI),
			});
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
