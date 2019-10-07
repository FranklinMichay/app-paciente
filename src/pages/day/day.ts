import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController, ToastController, Row } from 'ionic-angular';
import { Info } from '../../mock/months';
import { RestProvider } from '../../providers';
import * as _ from 'lodash';  // tslint:disable-line
import { GetMeetingPage } from '../get-meeting/get-meeting';
import { HomePage } from '../home/home';
import { ModalCancelPage } from '../modal-cancel/modal-cancel';
import { MeetingsPage } from '../meetings/meetings';

@IonicPage()
@Component({
  selector: 'page-day',
  templateUrl: 'day.html',
})
export class DayPage {

  pkMedico: any;
  //medic: any;
  pacienteId: any;
  disableBackB = false;
  connection: any;
  medic: any;
  pkPaciente: any;
  acceptedMeetings: any;
  newMeetings: any;
  postponedMeetings: any;
  state = 'Nueva';
  posponed: boolean = false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public mdlCtrl: ModalController,
    private restProvider: RestProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toast: ToastController) {

  }
  

  ionViewDidLoad() {
    //this.getDataList();
    this.state = this.navParams.get('state');
    this.medic = this.navParams.get('medic');
    this.posponed =  this.navParams.get('posponed');
    console.log(this.medic, 'medico seleccionado');
    const paciente = JSON.parse(localStorage.getItem('user'));
    this.pkPaciente = paciente.pk;
    console.log(this.pkPaciente, 'pk de paciente');
    
  }

 
  openModal(medic) {
    //this.navCtrl.push(ModalCancelPage)
    console.log(medic, 'medic desde day');
    let modal = this.mdlCtrl.create(ModalCancelPage, {medic: medic});
    modal.present();
  }

  
  cancel(v) {
    console.log(v, 'in cancel');
    let alert = this.alertCtrl.create({
      title: 'Seguro de cancelar esta cita',
      message: 'Esta acción no se puede deshacer',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('in cancel');
          }
        },
        {
          text: 'Si, Cancelar',
          handler: () => {
            this.cancelMeeting(v);
          }
        }
      ]
    });
    alert.present();
  }

  cancelMeeting(v) {
    console.log(v,'valor de V');
    
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
    const loading = this.loadingCtrl.create({ spinner: 'crescent'});
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
  accept(response, v) {
    console.log('for response', v);
    let fields: any = {}
    fields.estadoCita = response;
    fields.pkMedico = v.pkMed;
    fields.fecha = v.fecha;
    fields.hora = v.hora;
    fields.paciente_id = v.pkPaciente;
    fields.estadoAgenda = 'unavailable';
    fields.pkCentroMed = v.pkCentroMed || 1;
    fields.detalleCancelado = ''
    let loading = this.loadingCtrl.create({ spinner: 'crecent' });
    loading.present();
    console.log(fields, 'respuesta');
    this.restProvider.acceptMeeting(fields)
      .then((result) => {
        console.log(result, ' data from api');
        //this.setData(result['data_agenda']);
        loading.dismiss();
        let alert = this.toast.create({
          message: 'Cita reagendada',
          duration: 3000,
          position: 'top'
        });
        this.restProvider.sendNotify({
          fecha: v.fecha,
          client: v.pkPaciente,
          pkMedico: v.pkMed,
          clientName: v.pacApe + ' ' + v.pacNom,
          type: 'Cita Aceptada'
        });
        alert.present();
        this.getData();
        this.navCtrl.push(MeetingsPage);
      }, (err) => {
        console.log(err, 'erro from api');
        let alert = this.toast.create({
          message: err.message,
          duration: 3000,
          position: 'top'
        });
        loading.dismiss();
        alert.present();
        this.getData();
      });
  }

}

