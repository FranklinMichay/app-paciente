import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SchedulePage } from '../schedule/schedule';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-profile-medic',
  templateUrl: 'profile-medic.html',
})
export class ProfileMedicPage {
  medic: any = {
    nombre: '',
    apellido: '',
    especialidadNombre: ''
  };

  slides: any = [
    {
      src: 'https://static.dentalhuelin.com/media/images/instalaciones/6.jpg',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud'
    },
    {
      
      src: 'https://odontoquito.com/wp-content/uploads/2019/03/DSC06027reduc.jpg',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud'
    },
    {
      src: 'http://mundoodontologo.com/wp-content/uploads/2014/10/sillones.png',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud'
    }];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.medic = this.navParams.get('medic');
    console.log('ionViewDidLoad ProfileMedicPage', this.medic);
  }

  goToBack() {
    this.navCtrl.pop();
  }

  goToSchedule() {
    console.log('in go to Schedule');
    this.navCtrl.push(SchedulePage, { medic: this.medic });
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }
}
