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
  MyLocation
} from '@ionic-native/google-maps';

import { GeoProvider } from '../../providers/geo/geo';

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
    public geoProvider: GeoProvider
  ) {
  }

  ionViewDidLoad() {
    this.loadMap();
    // this.geoProvider.setLocation('2',  [8.1478383, 125.6611933])
    // this.geoProvider.getLocations(500, [10.1478383, 125.6611933]);

    // this.geoProvider.hits.subscribe(hits => {
    //   console.log(hits)
    // })
  }

  async loadMap() {
   
    const mapOptions: GoogleMapOptions = {
      controls: {
        myLocationButton: true
      }
    };

    const myLocationOption: MyLocationOptions = { enableHighAccuracy: true }

    this.map = this.googleMaps.create(this.mapRef.nativeElement, mapOptions);

    // Wait the MAP_READY before using any methods.
    await this.map.one(GoogleMapsEvent.MAP_READY)
    // Now you can use all methods safely.
    console.log('Map is ready!');

    const myLocation = await this.map.getMyLocation(myLocationOption);
    const lat = myLocation.latLng.lat
    const lng = myLocation.latLng.lng;

    //  Camera settings
    this.map.setCameraTarget(myLocation.latLng);
    this.map.setCameraZoom(17);
    this.map.setCameraTilt(30);

    this.geoProvider.setLocation('1', [Number.parseFloat(lat.toFixed(2)), lng])
    this.geoProvider.setLocation('2', [lat, Number.parseFloat(lng.toFixed(2))])
    this.geoProvider.getLocations(1, [lat, lng]);

    this.geoProvider.hits.subscribe(hits => {
      hits.forEach(hit => {
        const markerOptions: MarkerOptions = {
          title: 'A toilet',
          snippet: 'distance: ' + hit.distance.toFixed(2) + ' km',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: hit.location[0],
            lng: hit.location[1]
          }
        };

        this.map.addMarker(markerOptions)
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                // Do something
              });
          });
      });
    })


  }

}
