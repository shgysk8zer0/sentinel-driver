import './std-js/deprefixer.js';
import './std-js/shims.js';
import {ready, $} from './std-js/functions.js';

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
		const body = new FormData(event.target);
		console.log(Object.fromEntries(body.entries()));
	});
});
