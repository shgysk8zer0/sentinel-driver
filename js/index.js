import './std-js/deprefixer.js';
import './std-js/shims.js';
import {ready, $} from './std-js/functions.js';
import {confirm, prompt} from './std-js/asyncDialog.js';

ready().then(async () => {
	$(document.documentElement).replaceClass('no-js', 'js');

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

	$('form[name="login"]').submit(async event => {
		event.preventDefault();
		$('[data-show-modal="#login-dialog"]').hide();
		const form = new FormData(event.target);
		const url = new URL(event.target.action);

		console.log({data: Object.fromEntries(form.entries()), url});
		const tmp = document.getElementById('vehicle-template').content;
		const main = document.querySelector('main');

		for (let n = 3; n !== 0; n--) {
			const vehicle = main.appendChild(tmp.cloneNode(true).firstElementChild);
			vehicle.addEventListener('click', async () => {
				let miles = NaN;
				let ask = false;

				if (! vehicle.classList.contains('selected') && await confirm('Check out this vehicle')) {
					await $('.vehicle-opt.selected', vehicle.parentElement).removeClass('selected');
					vehicle.classList.add('selected');
					ask = true;
				} else if(vehicle.classList.contains('selected') && await confirm('Check in this vehicle')) {
					vehicle.classList.remove('selected');
					ask = true;
				}

				if (ask) {
					while (miles !== null && Number.isNaN(miles)) {
						miles = await prompt('Enter odomoter reading');
						if (miles !== null) {
							miles = parseInt(miles);
						}
					}
				}
			}, {
				passive: true,
			});
		}
		event.target.closest('dialog').close();
	});
});
