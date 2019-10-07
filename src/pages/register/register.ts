import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LoginPage } from '../login/login';
import { FormBuilder, FormGroup, Validator, Validators, FormControl } from '@angular/forms'
import { HomePage } from '../home/home';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  user: any;
  user_admin: any = {
    username: "",
    email: "",
    password1: "",
    identificacion: "",
    nombre: "",
    apellido: "",
    ciudad: "",
    direccion: "",
    telefono: "",
  };

  myForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restProvider: RestProvider,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public tc: ToastController) {

    this.myForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password1: ['', [Validators.pattern(/^[a-z0-9_-]{6,15}$/), Validators.required]],
      identificacion:[ '',[Validators.maxLength(10), Validators.minLength(10), Validators.required ]], 
      nombre: ['',[Validators.required]],
      apellido:['', [Validators.required]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  public cancelar() {
    this.navCtrl.push(LoginPage);
  }

  public goPage2() {
    this.navCtrl.pop();
  }

  //GUARDA DATOS DE USUARIO
  saveUser() {
    this.user_admin.password2 = this.user_admin.password1;
    this.restProvider.registroUser(this.user_admin)
      .then((result) => {
        //this.navCtrl.push(LoginPage);
        let alert = this.alertCtrl.create({
          title: 'Paciente Registrado',
          buttons: ['Ok']
        });
        alert.present();
        localStorage.setItem('user', JSON.stringify(result['data_login'][0]));
        this.navCtrl.setRoot(HomePage);

        console.log(result, 'INFO RESULT');
      }, (err) => {
        let toast = this.tc.create({
          message: this.getError(err),
          duration: 3000,
          position: 'top',
          //cssClass: 'toast'
        });
        toast.present();

        //this.navCtrl.setRoot(RegistroPage);
        console.log(err);
      });
  }

  getError(err) {
    let message = '';

    switch (err.status) {
      case 404:
        message = 'Servidor no encontrado'
        return message;
      case 400:
        if (err.error.email) {
          message = 'Ingrese un email valido';
        } else {
          if (err.error.password1) {
            message = 'Esta contraseña es demasiado corta. Debe contener almenos 8 caracteres';
          } else {
            if (err.error.username) {
              message = 'Nombre de usuario ya esta registrado';
            }
          }
        }
        return message;
      case 500:
        message = 'Error en el servidor'
        return message;
      default:
        return message;
    }
  }
}
