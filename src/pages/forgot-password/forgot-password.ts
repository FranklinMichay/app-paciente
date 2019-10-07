import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ConfirmPasswordResetPage } from '../confirm-password-reset/confirm-password-reset';

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
  formPass: any = false;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

  sendPasswordRequest() {

    this.formPass = true;
    //this.auth.requestPasswordReset(this.email);
    //this.navCtrl.push(ConfirmPasswordResetPage);
  }

  onSubmitRecovery() {
    if (this.recoveryForm.invalid) {
      return;
    }
    this.submittedRecovery = true;
    console.log(this.recoveryForm.value, 'el form');
    const data = { type: 'paciente', email: this.recoveryForm.value.email }
    this.auth.recoveryPassword(data).subscribe(data => {
      console.log('datos agenda', data);
      if (data.result === 'success') {
        this.openSnackBar('Pedido enviado, revise su correo');
      } else
        this.openSnackBar('Error enviando, intentelo de nuevo');
    }, (err) => {
      this.openSnackBar('Error en el servidor, intentelo mas tarde');
    });
  }

}
