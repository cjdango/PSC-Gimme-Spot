import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

/*
  Generated class for the ToiletProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToiletProvider {

  constructor(public afdb: AngularFireDatabase) {
    console.log('Hello ToiletProvider Provider');
  }

  getToilet(key) {
    return this.afdb.object(`toilets/${key}`).snapshotChanges();
  }
}
