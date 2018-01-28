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
  dbRef: any;
  geoFire: any;

  hits = new BehaviorSubject([]);

  constructor(
    public afdb: AngularFireDatabase
  ) {
    this.dbRef = this.afdb.list('toilet-location').query.ref;
    this.geoFire = new GeoFire(this.dbRef);
  }

  async setLocation(key: string, coords: Array<number>) {
    try {
      await this.geoFire.set(key, coords);
    } catch (error) {
      console.log(error);
    }
  }

  getLocationRef(key: string) {
    return this.afdb.object(`toilet-location/${key}`).query.ref
  }

  getLocations(radius: number, coords: Array<number>) {
    this.geoFire.query({
      center: coords,
      radius: radius
    })
      .on('key_entered', (key, location, distance) => {
        const hit = {
          location: location,
          distance: distance,
          key: key
        }

        const currentHits = this.hits.value;
        currentHits.push(hit);
        this.hits.next(currentHits);
      })
  }

}
