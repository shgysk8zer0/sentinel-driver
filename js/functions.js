import {API, VEHICLE} from './consts.js';
import {notify} from './std-js/functions.js';

export async function getUnits({ownerid, token}) {
	const url = new URL(`trees/${ownerid}/${token}`, API);
	const resp = await fetch(url);
	if (resp.ok) {
		const json = await resp.json();
		if ('error' in json) {
			throw new Error(`"${json.message}" [${json.error}]`);
		} else {
			return json.filter(org => org.hasOwnProperty('units')).reduce((units, org) => {
				org.units.forEach(unit => {
					units.vehicles.add(unit);
					if (typeof unit.drivername === 'string' && unit.drivername !== '') {
						units.drivers.add({
							name: unit.drivername,
							id: parseInt(unit.driverid),
						});
					}
				});
				return units;
			}, {
				drivers: new Set(),
				vehicles: new Set(),
			});
		}
	} else {
		throw new Error(`<${resp.url}>  [${resp.status} ${resp.statusText}]`);
	}
}

export async function getOwnerInfo({userid, token}) {
	const url = new URL(`owners/${userid}/${token}`, API);
	const resp = await fetch(url);
	const data = await resp.json();
	return data[0];
}

export async function loadData() {
	await customElements.whenDefined('vehicle-element');
	await customElements.whenDefined('driver-element');
	const VehicleElement = customElements.get('vehicle-element');
	const DriverElement = customElements.get('driver-element');
	const VehicleList = document.querySelector('vehicle-list');
	const DriverList = document.querySelector('driver-list');
	const units = await getUnits({
		ownerid: sessionStorage.getItem('ownerId'),
		token: sessionStorage.getItem('token'),
	});
	try {
		const vehicles = [...units.vehicles].map(vehicle => {
			const el = new VehicleElement();
			const name = document.createElement('span');
			name.textContent = vehicle.vehicle;
			name.slot = 'name';
			el.append(name);
			el.uid = vehicle.vehicleid;

			if ('image' in vehicle) {
				const img = new Image();
				img.slot = 'image';
				img.src = new URL(vehicle.image, VEHICLE.imgDir);
				el.append(img);
			}
			return el;
		});
		const drivers = [...units.drivers].map(driver => {
			const el = new DriverElement();
			el.slot = 'drivers';
			const name = document.createElement('span');
			name.textContent = driver.name;
			name.slot = 'name';
			el.append(name);
			el.uid = driver.id;
			return el;
		});
		VehicleList.add(...vehicles);
		DriverList.append(...drivers);
	} catch(err) {
		console.error(err);
		document.dispatchEvent(new CustomEvent('logout'));
		notify('An error occured', {
			body: err.message,
			icon: new URL('/img/octicons/bug.svg', document.baseURI),
		});
	}
}
