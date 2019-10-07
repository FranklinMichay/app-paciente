import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { RestProvider } from '../../providers';
import { ProfileMedicPage } from '../../pages/profile-medic/profile-medic';
import * as _ from 'lodash';  // tslint:disable-line
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { ChatPage } from '../chat/chat';
import { FormControl } from '@angular/forms'
import 'rxjs/add/operator/debounceTime';


@IonicPage()
@Component({
  selector: 'page-search-medic',
  templateUrl: 'search-medic.html',
})

export class SearchMedicPage {
  timeNumber: number = 0;
  medics: any = [];
  medicsOriginal: any = [];
  searching: boolean = true;
  speciality: any = '';
  city: any = '';
  medicFiltered: any;
  specialties: any;
  items: any;
  params: any = {
    fields: {
      ciudad: '',
      especialidad: ''
    }
  };
  medicalCenter: any;

  searchTerm: string = '';
  searchControl: FormControl;
  item: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private restProvider: RestProvider,
    public loadingCtrl: LoadingController,
    public mdlCtrl: ModalController,
    public toast: ToastController) {
    this.medicFiltered;
    this.searchControl = new FormControl();


  }

  ngOnInit() {


    const fromSpeciality = this.navParams.get('specialty');
    if (fromSpeciality) {
      this.medicsOriginal = fromSpeciality;
      this.medics = fromSpeciality;
      console.log(fromSpeciality, 'from especialidades');
    } else {
      this.getDataList();
      this.getSpecialities();
    }
  };

  getSpecialities() {
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchMedicPage');

  }



  onInput(keydata) {
    console.log(keydata.target.value, 'in ipnut');
    let query: any;
    if (keydata.target.value) {
      setTimeout(() => {
        query = keydata.target.value;
        this.searchProduct(query);
      }, 700);
    } else {
      this.medics = this.medicFiltered;
    }
  }

  getDataList() {
    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    this.restProvider.getMedics()
      .then((data) => {
        this.medics = data['data_medicos'];
        this.medicsOriginal = data['data_medicos'];
        this.medicFiltered = data['data_medicos'];
        console.log(data, 'data from api');

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

  
  searchMedics(query: any) {
    let val = query.target.value.toLowerCase();
    if (val && val.trim() != '') {
      this.medicFiltered = this.medicFiltered.filter((item) => {
        /* const text = (item.fields.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1) + ' ' + 
        (item.fields.apellido.toLowerCase().indexOf(val.toLowerCase()) > -1); */
        return (item.fields.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1)
        //return (val.test(text))
      });
    } else {
      this.medicFiltered = this.medics;
    }
  }

  searchProduct(query: any) {
    console.log(query, 'query');
    const patt = new RegExp(query.toLowerCase());
    if (query && query.length > 3) {
      console.log(this.medicFiltered, 'un metod sharch22');
      const res = _.filter(this.medicFiltered, o => {
        const statement =
          o.fields.nombre.toLowerCase() + ' ' +
          o.fields.apellido.toLowerCase();
        //o.fields.especialidad.toLowerCase() + ' ' +
        //o.fields.ciudad.toLowerCase();
        return (patt.test(statement));
      });
      this.medics = res;
    } else {
      this.medics = this.medicFiltered;
    }
  }

  buscar(event) {
    console.log(event);

  }



  filterModal() {
    console.log(this.medics, 'medicos sin filtrar');
    let modal = this.mdlCtrl.create(ChatPage);
    //this.navCtrl.create(GetMeetingPage, {hour: _info});
    modal.present();
    modal.onDidDismiss((v) => {
      console.log(v, 'valores para filtrar');
      if (v) {
        this.params.fields = v.params;
        this.filterData();
        if (v.medicalCenter && this.filterData) {
          this.filterMedicalCenter(v.medicalCenter);
          this.medicalCenter = v.medicalCenter
        }
        else {
          this.medicalCenter = ''
        }
      }
    }
    );
  }

  filterMedicalCenter(cMedico) {
    console.log('in medical center filter', this.medics);
    this.medics = _.filter(this.medics, (v) => {
      console.log(v, 'is v');
      const r = _.filter(v.fields.centroMedico, (c) => {
        console.log(c, 'is c');
        if (c.nombre === cMedico)
          return true;
      });
      console.log(r, 'is r');
      if (r.length > 0) return v
    });
  }

  filterData() {
    console.log(this.medics, 'this.origin', this.params);
    this.medics = _.filter(this.medicsOriginal, _.matches(this.params));
    console.log(this.medics, 'this.origin after', this.params);
    if (this.medics.length != 0)
      return true;
    return false
  }

  goBack() {
    this.navCtrl.pop();
  }

  goItem(id: string) {
    // this.navCtrl.push(ProductDetailsPage, {id: id});
  }

  goToDetails(medic) {
    console.log(medic, 'medic for details');
    this.navCtrl.push(ProfileMedicPage, { medic: medic });
  }
}
