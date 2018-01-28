import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
	GoogleMaps,
	GoogleMap,
	GoogleMapsEvent,
	GoogleMapOptions,
	CameraPosition,
	MarkerOptions,
	Marker,
	MyLocationOptions,
	MyLocation,
	LatLng
} from '@ionic-native/google-maps';

import { GeoProvider } from '../../providers/geo/geo';
import { ToiletProvider } from '../../providers/toilet/toilet';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase'

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-map',
	templateUrl: 'map.html',
})
export class MapPage {
	map: GoogleMap;
	@ViewChild('map') mapRef: ElementRef;

	markers: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public googleMaps: GoogleMaps,
		public geoProvider: GeoProvider,
		public toiletProvider: ToiletProvider
	) {
	}



	// //////////////////////////////////////////////////////////////////
	// **** LIFE CYCLE METHODS ****
	// //////////////////////////////////////////////////////////////////
	ionViewDidLoad() {
		this.loadMap();

		// this.geoProvider.getLocations(500, [10.1478383, 125.6611933]);
		// this.geoProvider.setLocation('10',  [8.1478383, 125.6611933])  

		// this.geoProvider.hits.subscribe(hits => {
		//   console.log(hits.length)
		//   hits.forEach(hit => {
		//     this.toiletProvider.getToilet(hit.key).subscribe((toilet: any) => {
		//       console.log(hit)
		//     })
		//   })
		// })

		// let isNew = true;
		// this.geoProvider.dbRef.limitToLast(1).on('child_added', (updated) => {
		// 	if (isNew) isNew = !isNew;
		// 	else this.geoProvider.getLocations(500, [10.1478383, 125.6611933]);			
		// })

		// Temp
		// this.geoProvider.setLocation('1',  [8.1478383, 125.6611933])


		// // Watch for changes in toilet-location
		// this.geoProvider.dbRef.on('child_added', (child) => {
		// console.log('TEST')
		// Query nearby toilets based on device's coordinates
		// this.geoProvider.getLocations(500, [10.1478383, 125.6611933]);
		// });

		// Watch for changes in hits
		// this.geoProvider.hits.subscribe(hits => {
		// 	this.addMarker(hits[hits.length - 1]);
		// 	console.log(hits)
		// })

		// // Temp
		// setTimeout(() => {
		// 	this.geoProvider.setLocation('3',  [8.1478383, 125.662])
		// }, 10000)
	}



	// //////////////////////////////////////////////////////////////////
	// **** ASYNC METHODS ****
	// //////////////////////////////////////////////////////////////////
	async loadMap() {
		const mapOptions: GoogleMapOptions = {
			controls: {
				myLocationButton: true
			}
		};

		const myLocationOption: MyLocationOptions = { enableHighAccuracy: true }

		// Create new map
		this.map = this.googleMaps.create(this.mapRef.nativeElement, mapOptions);

		// Wait the MAP_READY before using any methods.
		await this.map.one(GoogleMapsEvent.MAP_READY)

		// Get device's location
		const myLocation = await this.map.getMyLocation(myLocationOption);
		const lat = myLocation.latLng.lat
		const lng = myLocation.latLng.lng

		//  Set camera settings
		this.map.setCameraTarget(myLocation.latLng);
		this.map.setCameraZoom(17);
		this.map.setCameraTilt(30);

		// Temp
		// this.geoProvider.setLocation('1', [Number.parseFloat(lat.toFixed(2)), lng])
		// this.geoProvider.setLocation('2', [lat, Number.parseFloat(lng.toFixed(2))])

		this.geoProvider.getLocations(1, [lat, lng]);

		// // Watch for changes in toilet-location
		let isNew = true;
		// this.geoProvider.dbRef.limitToLast(1).on('child_added', (updated) => {
		// 	// if (isNew) isNew = !isNew;
		// 	// else 
		// 	this.geoProvider.getLocations(1, [lat, lng]);
		// })		

		// Watch for changes in hits
		this.geoProvider.hits.subscribe(hits => {
			if (isNew) isNew = !isNew;
			else {
				alert('tast')
				this.addMarker(hits[hits.length - 1]);
			}
		})

		// Temp
		// setTimeout(() => {
		// 	this.geoProvider.setLocation('3', [lat, Number.parseFloat(lng.toFixed(4))])
		// }, 10000)
	}

	async addMarker(hit) {
		const toilet: any = await this.getToiletByKey(hit.key);
		const toiletRef: firebase.database.Reference = toilet.ref;
		const locationRef = this.geoProvider.getLocationRef(hit.key);

		const getSnippet = (owner) => {
			return `distance: ${hit.distance.toFixed(2)} km | owner: ${owner}`
		}

		const markerOptions: MarkerOptions = {
			title: toilet.val.name,
			snippet: getSnippet(toilet.val.owner),
			icon: 'blue',
			animation: 'DROP',
			position: {
				lat: hit.location[0],
				lng: hit.location[1]
			}
		};

		const marker: Marker = await this.map.addMarker(markerOptions);

		// Watch for toilet changes		
		toiletRef.on('child_changed', (updated) => {
			const val = updated.val();
			switch (updated.key) {
				case 'name': marker.setTitle(val); break;
				case 'owner': marker.setSnippet(getSnippet(val));
			}
			marker.showInfoWindow();
		});

		// Watch for toilet's location changes
		locationRef.on('child_changed', (updated) => {
			const lat = updated.val()[0];
			const lng = updated.val()[1];
			marker.setPosition(new LatLng(lat, lng));
		});

		// marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
		// 	// Do something
		// });
	}



	// //////////////////////////////////////////////////////////////////
	// **** NORMAL METHODS ****
	// //////////////////////////////////////////////////////////////////
	getHits() {
		return new Promise((resolve, reject) => {
			this.geoProvider.hits.subscribe(
				hits => resolve(hits),
				err => reject(err)
			);
		});
	}

	getToiletByKey(key) {
		return new Promise((resolve, reject) => {
			this.toiletProvider.getToilet(key).subscribe(
				toilet => resolve({ val: toilet.payload.val(), ref: toilet.payload.ref }),
				err => reject(err)
			);
		});
	}

}
