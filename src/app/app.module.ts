import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { GoogleMaps } from '@ionic-native/google-maps';

import { MyApp } from './app.component';

import { firebaseConfig } from './firebaseCredentials';
import { GeoProvider } from '../providers/geo/geo';
import { ToiletProvider } from '../providers/toilet/toilet';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    AngularFireDatabase,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GeoProvider,
    ToiletProvider,
    ToiletProvider
  ]
})
export class AppModule { }
