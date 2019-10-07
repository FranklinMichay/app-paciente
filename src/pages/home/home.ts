import { Component } from '@angular/core';
import { NavController, ToastController, Platform, MenuController } from 'ionic-angular';
import { Info } from '../../mock/months';
import { RestProvider } from '../../providers';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LoginPage } from '../login/login';
import * as _ from 'lodash';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: any;

  slides: any = [
    {
      src: 'https://png.pngtree.com/png-clipart/20190517/original/pngtree-dna-logo-with-chemical-structure-vector-template-icon-for-biotechnology-png-image_3654529.jpg',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud'
    },
    {
      src: 'https://png.pngtree.com/png-clipart/20190516/original/pngtree-abstract-hexagon-background--technology-polygonal-concept-vector-illustration-png-image_3786359.jpg',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud'
    },
    {
      src: 'https://png.pngtree.com/png-clipart/20190516/original/pngtree-pills-polygonal-two-capsule-pills-made-of-line-png-image_3786353.jpg',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud'
    }];
  connection: any;
  dataHome: any;


  constructor(public navCtrl: NavController,
    public toast: ToastController,
    public restProvider: RestProvider,
    public platform: Platform,
    public backgroundMode: BackgroundMode,
    public localNotifications: LocalNotifications,
    public menuControler: MenuController,
  ) {

  }

  ngOnInit() {

    this.getDataPac();
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user');
    const pkPaciente = user ? user.pk : 1;
    this.data = Info.categories;
    const fields: any = { pkPaciente: pkPaciente };
    this.connection = this.restProvider.getMeetingData(fields).subscribe((data: any) => {
      if (data.dataNews && data.medicName) {
        if (this.platform.is('cordova')) {
          if (this.backgroundMode.isScreenOff()) {
            this.backgroundMode.wakeUp();
            this.localNotifications.schedule({
              id: 1,
              text: data.type,
              sound: this.platform.is('android') ? 'file://assets/sound/sound.mp3' : 'file://assets/sound/sorted.m4r',
              data: { secret: 'key' },
              wakeup: true,
              title: data.medicName,
              actions: 'click',
              launch: true
            })
          }
        }
      }
    }, (err) => {
      let alert = this.toast.create({
        message: err.message,
        duration: 3000,
        position: 'top'
      });
      alert.present();
      console.log(err);
    });
  }

  getDataPac() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user');
    const pkPaciente = user ? user.pk : null;
    const _data = { pkPaciente: pkPaciente };
    this.restProvider.getMeetingAccepted(_data).then(
      d => {
        console.log(d, 'DATOS DE PACIENTE');
        this.dataHome = _.first(d['data_agenda']);
        console.log(this.dataHome);
      });
  }

  goToMenu(component) {
    if (component) {
      this.navCtrl.push(component)
    } else {
      let toast = this.toast.create({
        message: 'Componente en Construccion',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  logout() {

    localStorage.removeItem('user');
    this.navCtrl.setRoot(LoginPage);
    this.connection.unsubscribe();
  }
}
