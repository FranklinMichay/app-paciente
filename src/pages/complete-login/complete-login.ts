import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestProvider } from '../../providers';
import { HomePage } from '../home/home';

/**
 * Generated class for the CompleteLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complete-login',
  templateUrl: 'complete-login.html',
})
export class CompleteLoginPage {

  identification: any;
  identificationForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public restProvider: RestProvider,
    public tc: ToastController,

  ) {
    this.identificationForm = this.fb.group({
      identification: ['', [Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/), Validators.required]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompleteLoginPage');
  }

  registerSocial() {
    let _data: any = {};

    this.restProvider.registerSocial(_data)
      .then((result) => {
        console.log(result, 'INFO DATOS from login');
        if (result['result'] === 'success') {
          console.log(result['data_login'][0], 'datos enviadossss');
          localStorage.setItem('user', JSON.stringify(result['data_login'][0]));
          //this.menu.enable(true)
          this.navCtrl.setRoot(HomePage);
        } else {
          let toast = this.tc.create({
            message: result['data_login'],
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      }, (err) => {
       
        console.log(err);
      });
    //this.navCtrl.setRoot(PerfilPage);
  }
 


}
