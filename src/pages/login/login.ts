import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
// import { RegistroPage } from '../registro/registro';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus/';
import { HttpClient } from '@angular/common/http';
import { Firebase } from '@ionic-native/firebase';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})


export class LoginPage {

  isLoggedIn: boolean = false
  googleInfo: boolean = false
  userFacebook: any;
  dataG: any;
  user: any = {};
  userGoogle: any = {}
  items: any;
  data: any;
  responseData: any;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  data_login: any = {
    nombre: "",
    apellido: "",
    centro_medico: "",
    ciudad: "",
    direccion: "",
    telefono: ""
  };

  //FORM VALIDADACION LOGIN
  form_login: FormGroup;
  user2: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restProvider: RestProvider,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public tc: ToastController,
    public menu: MenuController,
    private facebook: Facebook,
    private gp: GooglePlus,
    private http: HttpClient,
    private firebase: Firebase


  ) {
    //this.getUsers('user_list');

    //VALIDADCION DE CAMPOS LOGIN
    this.form_login = this.fb.group({
      usuario: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.pattern(/^[a-z0-9_-]{6,18}$/)]]
    });
  }

  login() {
    this.facebook.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        console.log(res)
        if (res.status === "connected") {
          this.getUserDetails(res.authResponse.userID)
        } else {
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  getUserDetails(userid) {
    this.facebook.api("/" + userid + "/?fields=id,email,name,picture", ["public_profile"])
      .then(res => {
        this.isLoggedIn = true
        this.userFacebook = res
        localStorage.setItem('user', JSON.stringify(res));
        this.validateLoginFacebook();
        this.navCtrl.setRoot(HomePage)
      })
      .catch(e => {
        console.log(e);
      });
  }

  loginWithGP() {
    // var webClientId = '606633412500-qpb3ioll8fbi40lqnr8e3c0pvh9hmitc.apps.googleusercontent.com';
    this.gp.login(
      {
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': '606633412500-olctcvi744f5e0fijbkmvhsufq0qs39v.apps.googleusercontent.com',
        // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true
      }
    ).then(res => {
      localStorage.setItem('user', JSON.stringify(res));
      this.googleInfo = true
      this.dataG = JSON.parse(localStorage.getItem('user'));
      this.dataG.user.displayName
      this.dataG.user.email
      //this.navCtrl.setRoot(HomePage)
    })
      .catch(err => {
        let toast = this.tc.create({
          message: err,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        //this.navCtrl.setRoot(HomePage)
      })
  }

  loginUser(): void {
    this.gp.login({
      'webClientId': '606633412500-olctcvi744f5e0fijbkmvhsufq0qs39v.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then(success => {
          localStorage.setItem('user', JSON.stringify(res));
          this.googleInfo = true
          this.dataG = JSON.parse(localStorage.getItem('user'));
          this.dataG.user.displayName
          this.dataG.user.email
          let toast = this.tc.create({
            message: JSON.stringify(success),
            duration: 3000,
            position: 'top'
          });
          toast.present();
          //console.log("Firebase success: " + JSON.stringify(success));
        })
        .catch(error => {
          let toast = this.tc.create({
            message: JSON.stringify(error),
            duration: 3000,
            position: 'top'
          });
          toast.present();
          //console.log("Firebase success: " + JSON.stringify(success));
        })
    }).catch(err => {
      let toast = this.tc.create({
        message: err,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    })
  }

  getData() {
    //let token = this.userGoogle.accessToken;
    this.http.get('https://www.googleapis.com/plus/v1/people/me?access_token=' + this.userGoogle.accessToken)
      .subscribe((data: any) => {
        localStorage.setItem('user', JSON.stringify(data));
        this.userGoogle.name = data.displayName;
        this.userGoogle.image = data.image.url;

      })
  }

  validateLoginFacebook() {
    //const data = { type: 'paciente', email: this.resetPassForm.value.email }
    /* console.log(data, 'Datos para server..!!'); */
    let dataFacebook = JSON.parse(localStorage.getItem('user'));
    this.restProvider.validateLoginFacebook(dataFacebook).subscribe(data => {
      //console.log('datos para enviar', dataFacebook);
      if (data.result === 'success') {
        let toast = this.tc.create({
          message: 'Email enviado',
          duration: 3000,
          position: 'top'
        });
        toast.present();
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

  public onLoginHandler() {
    this.menu.enable(true)
  }

  /* public logout() {
    this.menu.enable(false)
  } */

  guarda_user() {
    alert(JSON.stringify(this.form_login.value));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  setFilteredItems() {
    this.items = this.filterItems(this.user.email);
  }

  filterItems(searchTerm) {
    return this.data.filter((item) => {
      return item.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
  saveUser() {
    let _data: any = {};
    _data.username = this.user.username.toString();
    _data.password = this.user.password.toString();
    this.restProvider.login(_data)
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
        let toast = this.tc.create({
          message: this.getError(err),
          duration: 3000,
          position: 'top'
        });
        toast.present();
        //this.navCtrl.setRoot(LoginPage);
        console.log(err);
      });
    //this.navCtrl.setRoot(PerfilPage);
  }

  getError(err) {
    let message = 'Error desconocido';
    switch (err.status) {
      case 404:
        message = 'Servidor no encontrado'
      case 400:
        if (err.error.non_field_errors) {
          message = 'Usuario y/o contraseña incorrectos';
        }
        return message;
      default:
        return message;
    }
  }

  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }

  goForgotPass() {
    this.navCtrl.push(ForgotPasswordPage);
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
