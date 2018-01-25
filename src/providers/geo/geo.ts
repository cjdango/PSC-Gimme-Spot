import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import * as GeoFire from 'geofire';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireList } from 'angularfire2/database/interfaces';

/*
  Generated class for the GeoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeoProvider {
  dbRef: AngularFireList<{}>;
  geoFire: any;

  hits = new BehaviorSubject([]);

  constructor(
    public afdb: AngularFireDatabase
  ) {
    this.dbRef = this.afdb.list('/toilet-location');
    this.geoFire = new GeoFire(this.dbRef.query.ref);
  }

  async setLocation(key: string, coords: Array<number>) {
    try {
      await this.geoFire.set(key, coords);
      console.log('location updated');
    } catch (error) {
      console.log(error);
    }
  }

  getLocations(radius: number, coords: Array<number>) {
    this.geoFire.query({
      center: coords,
      radius: radius
    })
    .on('key_entered', (key, location, distance) => {
      const hit = {
        location: location,
        distance: distance
      }

      const currentHits = this.hits.value;
      currentHits.push(hit);
      this.hits.next(currentHits);
    })
  }

}
