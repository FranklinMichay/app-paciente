import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers';
import { SearchMedicPage } from '../search-medic/search-medic';

@IonicPage()
@Component({
  selector: 'page-specialties',
  templateUrl: 'specialties.html',
})
export class SpecialtiesPage {
  specialties: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public restProvider: RestProvider,
    public loadingCtrl: LoadingController,
    public toast: ToastController) {
  }

  ngOnInit() {
    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    this.restProvider.getSpecialties()
    .then((data) => {
      this.specialties = data['data_especi'];
      console.log(this.specialties, 'especialidades');
      loading.dismiss();
    }, (err) => {
      let alert = this.toast.create({
        message: err.message,
        duration: 3000,
        position: 'top'
      });
      loading.dismiss();
      alert.present();

      console.log(err);
    });
  }

  goToSpecialty({pk}) {
    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    this.restProvider.getMedicSpecialties(pk)
    .then((data) => {
      console.log(data, pk , 'logo para enviar')
      this.navCtrl.push(SearchMedicPage,{specialty: data['data_medico_espec']});
      console.log(this.specialties, 'especialidades');
      loading.dismiss();
    }, (err) => {
      let alert = this.toast.create({
        message: err.message,
        duration: 3000,
        position: 'top'
      });
      loading.dismiss();
      alert.present();
      console.log(err, 'error in get specialties');
    });
  }
}
