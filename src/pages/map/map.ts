import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
	GoogleMaps,
	GoogleMap,
	GoogleMapsEvent,
	GoogleMapOptions,
	MarkerOptions,
	Marker,
	MyLocationOptions,
	LatLng
} from '@ionic-native/google-maps';

import { ToiletProvider } from '../../providers/toilet/toilet';

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
	geoQuery: any;
	currentLocation: LatLng;
	markers = {};
	@ViewChild('map') mapRef: ElementRef;



	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public googleMaps: GoogleMaps,
		public toiletProvider: ToiletProvider
	) {
	}

	async initMap() {
		const mapOptions: GoogleMapOptions = {
			controls: {
				myLocationButton: true
			}
		};

		// Create new map
		this.map = this.googleMaps.create(this.mapRef.nativeElement, mapOptions);

		// Wait the MAP_READY before using any methods.
		await this.map.one(GoogleMapsEvent.MAP_READY);
	}

	async initCurrentLocation() {
		const myLocationOption: MyLocationOptions = { enableHighAccuracy: true };

		// Get device's location
		const myLocation = await this.map.getMyLocation(myLocationOption);
		this.currentLocation = myLocation.latLng;

		// Set camera settings every update for current location
		this.map.setCameraTarget(this.currentLocation);
		this.map.setCameraZoom(17);
		this.map.setCameraTilt(30);

	}

	startQuery() {
		const lat = this.currentLocation.lat;
		const lng = this.currentLocation.lng;
		this.geoQuery = this.toiletProvider.queryNearbyToilets(1, [lat, lng]);

		// Listen for events
		this.geoQuery.on('key_entered', (key, location, distance) => {
			this.addMarker(key, location);
		});

		this.geoQuery.on('key_moved', (key, location, distance) => {
			// Update marker position
			this.markers[key].setPosition(new LatLng(location[0], location[1]));
		});

		this.geoQuery.on('key_exited', (key, location, distance) => {
			// Remove marker
			this.markers[key].remove();
			delete this.markers[key];
		});
	}

	async addMarker(key, location) {
		const markerOptions: MarkerOptions = {
			icon: 'blue',
			animation: 'DROP',
			position: {
				lat: location[0],
				lng: location[1]
			}
		};

		const marker: Marker = await this.map.addMarker(markerOptions);

		// Sync toilet data and marker
		this.syncMarkerWithToiletData(marker, key);

		// Push currently added marker to markers object
		this.markers[key] = marker;
	}

	syncMarkerWithToiletData(marker: Marker, key) {
		this.toiletProvider.getToiletbyKey(key).subscribe(toilet => {
			marker.setTitle(toilet.name);
			marker.setSnippet(`Owner: ${toilet.owner}`);
			if (marker.isInfoWindowShown()) marker.showInfoWindow();
		});
	}

	async ionViewDidLoad() {
		await this.initMap();
		await this.initCurrentLocation();
		this.startQuery();

		// Insert dummy data
		this.toiletProvider.addToilet({
			name: 'Toilet A',
			owner: 'Gong2',
			cost: 10,
			description: 'qwertyui'
		}, [this.currentLocation.lat - .0005, this.currentLocation.lng])
	}

}
