import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController, ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RestProvider } from '../../providers';
import { DayPage } from '../day/day';
import { MeetingsPage } from '../meetings/meetings';

/**
 * Generated class for the ModalCancelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-cancel',
  templateUrl: 'modal-cancel.html',
})
export class ModalCancelPage {

  medic: any;
  state = 'Disponible';

  connection: any;

  pkPaciente: any;
  acceptedMeetings: any;
  newMeetings: any;
  postponedMeetings: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private restProvider: RestProvider,
    public mdlCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    public viewCtrl: ViewController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalCancelPage');
    this.medic = this.navParams.get('medic');
    console.log(this.medic, 'datos para eliminar');
    const paciente = JSON.parse(localStorage.getItem('user'));
    this.pkPaciente = paciente.pk;
    console.log(this.pkPaciente, 'pk de paciente');

    //this.state = this.navParams.get('state');

  }
  
  cancelModal() {
    this.viewCtrl.dismiss();
  }

  cancel(v) {
    this.cancelMeeting(v);
    this.cancelModal();
    this.navCtrl.push(MeetingsPage);
  }

  goDay() {
    this.viewCtrl.dismiss();
  }


  cancelMeeting(v) {
    console.log(v, 'valor de V');

    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    const fields: any = {
      pkPaciente: v.pkPaciente,
      fecha: v.fecha,
      hora: v.hora
    };
    const medicName = v ? v.medNom + ' ' + v.medApe : '';
    this.restProvider.cancelMeeting(fields)
      .then((data) => {
        if (data['result'] === 'success') {
          let alert = this.toast.create({
            message: 'Cita cancelada con éxito',
            duration: 3000,
            position: 'top'
          });
          alert.present();
          this.getData();
          this.restProvider.sendNotify({
            fecha: v.fecha,
            client: v.pkPaciente,
            pkMedico: v.pkMed,
            clientName: v.pacApe + ' ' + v.pacNom,
            type: 'Cita Cancelada'
          });
        } else {
          let alert = this.toast.create({
            message: 'Error al cancelar la cita',
            duration: 3000,
            position: 'top'
          });
          alert.present();
        }
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
  getData() {
    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    const fields: any = { pkPaciente: this.pkPaciente };
    this.connection = this.restProvider.getMeetingData(fields).subscribe((data: any) => {
      console.log(data, 'data del server');
      if (data.dataAccepted && data.dataNews && data.dataPostponed) {
        console.log(data, 'data del if');
        this.acceptedMeetings = data.dataAccepted['data_agenda'];
        this.newMeetings = data.dataNews['data_agenda'];
        this.postponedMeetings = data.dataPostponed['data_agenda'];
        //this.filterData(this.currentYear, this.currentMonth, this.day);
      }
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
    this.restProvider.sendResponse({ client: this.pkPaciente });
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }


}
