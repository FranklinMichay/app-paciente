import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  [x: string]: any;

  email: any;
  passInfoSuccess: any = false;
  resetPassForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public restProvider: RestProvider,
    public tc: ToastController,
  ) {
    this.resetPassForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

  onSubmitRecovery() {
    const data = { type: 'paciente', email: this.resetPassForm.value.email }
    console.log(data, 'Datos para server..!!');
    this.restProvider.recoveryPassword(data).subscribe(data => {
      console.log('datos para enviar', data);
      if (data.result === 'success') {
        let toast = this.tc.create({
          message: 'Pedido enviado, Revise su correo',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.passInfoSuccess = true;
      } else
        console.log('Error enviando, intentelo de nuevo');
        let toast = this.tc.create({
          message: 'Error, intentelo de nuevo',
          duration: 3000,
          position: 'top'
        });
    }, (err) => {
      console.log('Error en el servidor, intentar luego');
      let toast = this.tc.create({
        message: 'Correo electrónico inválido',
        duration: 3000,
        position: 'top'
      });
    });
  }

}
