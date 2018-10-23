import './std-js/deprefixer.js';
import './std-js/shims.js';
import {ready, $} from './std-js/functions.js';

ready().then(async () => {
	$(document.documentElement).replaceClass('no-js', 'js');
});
