import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  image: any;
  userInfo: any = {};

  form_editar_profile: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public restProv: RestProvider,
    public tc: ToastController,

  ) {
    this.form_editar_profile = this.fb.group({
      nombre: '',
      apellido: '',
      profile_pic: '',
      direccion: '',
      edad: "",
      ciudad: "",
      fuenteIngreso: "",
      identificacion: "",
      lugarNaci: "",
      ocupacion: "",
      sexo: "",
      fecha: "",
      telefonoFijo: "",
      tipoSeguro: "",
      telefonoCelular: ''
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditarPerfilPage');
    this.userInfo = this.navParams.get('infoProfile');
    console.log(this.userInfo, 'datosssssss');
  }

  returnPage() {
    this.navCtrl.setRoot(ProfilePage);
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  updateUser() {
    this.restProv.updatePaciente(this.userInfo)
      .then((result) => {
        console.log(result, 'DATOS DESDE LOGIN');
        if (result['result'] === 'success') {
          //console.log(result['data_login'], 'DATOS DE USUARIO');
          localStorage.setItem('user', JSON.stringify(result['dataUpdatePaciente'][0]));
          this.navCtrl.setRoot(ProfilePage);
        } else {
          let toast = this.tc.create({
            message: result['data_login'],
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      }, (err) => {
        let toast = this.tc.create({
          message: err.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        //this.navCtrl.setRoot(LoginPage);
        console.log(err);
      });
    //this.navCtrl.setRoot(PerfilPage);
  }
}
