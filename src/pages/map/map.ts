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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public googleMaps: GoogleMaps
  ) {
  }

  ionViewDidLoad() {
    this.loadMap();
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

    //  Camera settings
    this.map.setCameraTarget(myLocation.latLng);
    this.map.setCameraZoom(17);
    this.map.setCameraTilt(30);

    const markerOptions: MarkerOptions = {
      title: 'This is You!',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: myLocation.latLng.lat,
        lng: myLocation.latLng.lng
      }
    };

    const marker = await this.map.addMarker(markerOptions);

    marker.on(GoogleMapsEvent.MARKER_CLICK)
      .subscribe(() => {
        alert('clicked');
      });
  }

}
