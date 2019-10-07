import { Component } from '@angular/core';
import { IonicPage, NavController,
  NavParams, ViewController,
  LoadingController, ToastController,
  AlertController,
  MenuController} from 'ionic-angular';
import { RestProvider } from '../../providers';
import { MeetingsPage } from '../meetings/meetings';

@IonicPage()
@Component({
  selector: 'page-get-meeting',
  templateUrl: 'get-meeting.html',
})
export class GetMeetingPage {
  hour: any;
  pkPaciente: any;
  namePatient: any;
  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    public restProvider: RestProvider,
    private alertCtrl: AlertController,
    private menu: MenuController) {
  }

  ngOnInit() {
    this.hour = this.navParams.get('hour');
    console.log(this.hour, 'hora modal');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user from local storage');
    this.pkPaciente = user ? user.pk : 1;
    this.namePatient = user ? user.nombre +  ' ' + user.apellido : 'Sin Nombre';
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  sendRequest() {
    
    let fields: any = {}
    const { pk } = this.hour.medic;
    const { hora , fecha, pkCentroMed } = this.hour;
    fields.pkMedico = pk;
    fields.hora = hora;
    fields.fecha = fecha;
    fields.pkPaciente = this.pkPaciente;
    fields.pkCentroMed = pkCentroMed;
    
    let loading = this.loadingCtrl.create({spinner: 'crecent'});
    loading.present();
    this.restProvider.sendRequest(fields)
    .then((result) => {
      loading.dismiss();
      console.log(result, ' data from api');
      if (result['result'] === 'success') {
        this.restProvider.sendNotify({
          fecha: this.hour.fecha,
          client: this.pkPaciente,
          pkMedico: pk,
          data: fields.hora,
          clientName: this.namePatient,
          type: 'Cita Nueva' });
        this.goToMeetings();
      } else {
        let alert = this.toast.create({
          message: result['data_agenda'],
          duration: 3000,
          position: 'top'
        });
        alert.present();
      }
      this.cancel();
    }, (err) => {
      loading.dismiss();
      console.log(err, 'error from api');
      let alert = this.toast.create({
        message: err.message,
        duration: 3000,
        position: 'top'
      });
      alert.present();
      this.cancel();
    });
  }

  goToMeetings() {
    let alert = this.alertCtrl.create({
      title: 'PEDIDO ENVIADO',
      buttons: [
        {
          text: 'Quedarme Aqui',
          role: 'cancel',
          handler: () => {
            this.cancel();
          }
        },
        {
          text: 'Ir a Mis Citas',
          handler: () => {
            this.cancel();
            this.navCtrl.push(MeetingsPage);
          }
        }
      ]
    });
    alert.present();
  }
}
