import {Component, OnInit} from '@angular/core';
import {Health, HealthData} from '@ionic-native/health/ngx';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  steps: HealthData[];
  stepsSum: HealthData[];
  activity: any;

  constructor(private health: Health, private platform: Platform) { }

  ngOnInit() {
    this.isReady();
  }
  async isReady() {
    const ready = !!await this.platform.ready();
    if (ready) {
      this.health.isAvailable()
          .then((available: boolean) => {
            console.log(available);
            this.health.requestAuthorization([
              'distance', 'steps', // lettura e scrittura
              {
                read: ['weight'],       // sola lettura
                write: ['nutrition', 'gender']  // sola scrittura
              }
            ])
                .then(res => console.log(res))
                .catch(e => console.log(e));
          })
          .catch(e => console.log(e)); }
  }

  query() {
    this.health.query({
      startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000 ),
// a partire da trenta giorni fa…
      endDate: new Date(), // ad adesso…
      dataType: 'steps',	// informazioni circa i passi
      limit: 1000
    }).then(data => {
      console.log(data);
      this.steps = data;
    }).catch(e => {
      console.log('error ' + e);
    });
  }

  sumSteps() {
    this.health.queryAggregated({
      startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000 ),
      endDate: new Date(),
      dataType: 'steps',
      bucket: 'month'
    }).then(data => {
      console.log(data);
      this.stepsSum = data;
    }).catch(e => {
      console.log('error ' + e);
    });

  }

  saveData() {
    this.health.store({
      startDate: new Date(new Date().getTime() - 30 * 60 * 1000 ),
      endDate: new Date(),
      dataType: 'steps',
      value: '180',
      sourceName: 'mia-app',
      sourceBundleId: 'com.miodominio.mia-app'
    }).then(data => {
      console.log(data);
      this.activity = data;
    }).catch(e => {
      console.log('error ' + e);
    });

  }

}
