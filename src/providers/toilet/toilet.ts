import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as GeoFire from 'geofire';
import { AngularFireList } from 'angularfire2/database/interfaces';
import { Toilet } from '../../models/toilet-model';

/*
  Generated class for the ToiletProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToiletProvider {
  toilets: AngularFireList<{}>;
  geoFire: any;

  constructor(
    public afdb: AngularFireDatabase
  ) {
    this.toilets = this.afdb.list('toilets');
    this.geoFire = new GeoFire(this.afdb.list('toilets_location').query.ref)
  }

  async addToilet(toilet: Toilet, coords: Array<number>) {
    try {
      const aToiletRef = await this.toilets.push(toilet);
      await this.geoFire.set(aToiletRef.key, coords);
    } catch (error) {
      alert(error);
    }
  }

  getToiletbyKey(key) {
    return this.afdb.object<Toilet>(`toilets/${key}`).valueChanges();
  }

  queryNearbyToilets(radius: number, coords: Array<number>) {
    return this.geoFire.query({
      center: coords,
      radius: radius
    });
  }

}
