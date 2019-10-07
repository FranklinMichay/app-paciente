import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams,
  LoadingController, ToastController,
  AlertController, MenuController
} from 'ionic-angular';
import { RestProvider } from '../../providers';
import { Info } from '../../mock/months';
import * as _ from 'lodash';  // tslint:disable-line
import { DayPage } from '../day/day';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-meetings',
  templateUrl: 'meetings.html',
})
export class MeetingsPage {
  newMeetings: any;
  acceptedMeetings: any;
  currentTab: string = 'step1';
  pkPaciente: any;
  postponedMeetings: any;
  connection: any;
  pkCentroMed: any = 1;
  monthLabel: string;
  currentYear: any;

  today = new Date();

  currentMonth: any;
  day: any;
  disableBackBS = false;
  disableBackB = false;
  dateLabel: string = '';
  lastDay: any;
  months = Info.months;
  medic: any;
  pacienteId: any;
  hours: any;
  hourCopy: any = [];
  lastDataShowed: any = {};
  accepted: any;
  news: any;
  postponed: any;
  posp: boolean = false;


  daysWeek = [
    { label: 'Dom.', selected: false, day: '' },
    { label: 'Lun.', selected: true, day: '' },
    { label: 'Mar.', selected: false, day: '' },
    { label: 'Mie.', selected: false, day: '' },
    { label: 'Jue.', selected: false, day: '' },
    { label: 'Vie.', selected: false, day: '' },
    { label: 'Sab.', selected: false, day: '' }];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public restProvider: RestProvider,
    public toast: ToastController,
    public alertCtrl: AlertController,
    public menu: MenuController) {

  }

  ngOnInit() {
    this.currentYear = this.today.getFullYear();
    this.monthLabel = Info.months[this.today.getMonth()];
    this.currentMonth = this.today.getMonth();
    this.day = this.today.getDate();
    const index = this.today.getDay();
    this.setWeek(this.day, index);

    //this.showCalendar(this.currentYear, this.currentMonth);

    //DATOS DE DAY


    this.menu.enable(true);
    console.log('ionViewDidLoad MeetingsPage 1');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user');
    this.pkPaciente = user ? user.pk : 1;
    console.log(this.pkPaciente, 'id del paciuente')
    this.getData()

  }
  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  changeDay(day) {
    this.setLabel(day, this.currentMonth, this.currentYear);
    this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.daysWeek = _.map(this.daysWeek, (v, i) => {
      v.selected = (day === v.day) ? true : false
      return v;
    });
    this.day = day;
    this.filterData(this.currentYear, this.currentMonth, day);
  }

  filterData(year, month, day) {
    const _month = month + 1;
    const m = (_month < 10) ? ('0' + _month) : _month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = year + '-' + m + '-' + d;
    this.accepted = _.filter(this.acceptedMeetings, (o: any) => { return o.fecha === date; });
    this.news = _.filter(this.newMeetings, (o: any) => { return o.fecha === date; });
    this.postponed = _.filter(this.postponedMeetings, (o: any) => { return o.fecha === date; });
    console.log(this.postponed, 'pospuesta');
  }
  
  previousWeek() {
    const currentFirstDay = this.lastDataShowed.firstDay.value;
    if (currentFirstDay === 1 && this.currentMonth === 0) {
      this.currentYear - 1
      this.currentMonth = 12;
    }
    this.currentMonth = (currentFirstDay === 1) ? this.currentMonth - 1 : this.currentMonth;
    const newDay = currentFirstDay === 1 ? this.getDaysInMonth(this.currentMonth, this.currentYear) : currentFirstDay - 1;
    const newIndex = this.lastDataShowed.firstDay.index === 0 ? 6 : this.lastDataShowed.firstDay.index - 1;
    this.setWeek(newDay, newIndex);

    this.changeDay(this.daysWeek[3].day || this.daysWeek[0].day || this.daysWeek[6].day);
  }

  nextWeek() {
    const currentLastDay = this.lastDataShowed.lastDay.value;
    if (currentLastDay === this.lastDay && this.currentMonth === 11) {
      this.currentYear + 1
    }
    this.currentMonth = (currentLastDay === this.lastDay) ? (this.currentMonth + 1) % 12 : this.currentMonth;
    const newDay = this.lastDay === currentLastDay ? 1 : currentLastDay + 1;
    const newIndex = this.lastDataShowed.lastDay.index === 6 ? 0 : this.lastDataShowed.lastDay.index + 1;
    this.setWeek(newDay, newIndex);

    this.changeDay(this.daysWeek[3].day || this.daysWeek[0].day || this.daysWeek[6].day);
  }

  setWeek(day, index) {
    console.log(day, 'dia', index, 'index', this.currentMonth, this.currentYear, 'data showed');
    let dayAux = day;
    let dayAux1 = day;
    let i = index;
    let j = index;
    this.getDaysInMonth(this.currentMonth, this.currentYear);

    this.daysWeek = _.map(this.daysWeek, (v, i) => {
      v.selected = (i === index) ? true : false
      return v;
    });
    for (; i < 7; i++) {

      console.log('this. last day', this.lastDay);
      if (dayAux <= this.lastDay) {
        this.daysWeek[i].day = dayAux;
        this.lastDataShowed.lastDay = {
          index: i,
          value: dayAux
        }
        dayAux += 1;
      } else {
        this.daysWeek[i].day = '';
      }
    }
    for (; j >= 0; j--) {
      if (day === 1) {
        this.daysWeek[j].day = '';
        this.daysWeek[index].day = day;
        this.lastDataShowed.firstDay = {
          index: index,
          value: day
        }
      }
      else if (dayAux1 >= 1) {
        this.daysWeek[j].day = dayAux1;
        this.lastDataShowed.firstDay = {
          index: j,
          value: dayAux1
        }
        dayAux1 -= 1;
      } else {
        this.daysWeek[j].day = '';
      }
    }
  }



  daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  openDay(index: any) {
    this.getDayInfo(this.currentYear, this.currentMonth, index)


  }

  next() {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.monthLabel = Info.months[this.currentMonth];
    this.setWeek(this.currentYear, this.currentMonth);
    //this.showLabelUndo(this.currentYear, this.currentMonth);
    this.disableBackS(this.currentYear, this.currentMonth);
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.monthLabel = Info.months[this.currentMonth];
    this.setWeek(this.currentYear, this.currentMonth);
    //this.showLabelUndo(this.currentYear, this.currentMonth);
    this.disableBackS(this.currentYear, this.currentMonth);
  }

  disableBackS(year, month) {
    const today = new Date();
    console.log(year, today.getFullYear(), month, today.getMonth(), 'los trues');
    if (year <= today.getFullYear() && month <= today.getMonth()) {
      this.disableBackBS = false;
    } else {
      this.disableBackBS = true;
    }
  }

  disableEvent(year, month, day) {
    const today = new Date();
    console.log(year, today.getFullYear(), month, today.getMonth(), day, today.getDate(), 'los trues');
    if (year <= today.getFullYear() && month <= today.getMonth() && day <= today.getDate()) {
      return false;
    } else {
      return true;
    }
  }
  //metodos de Day
  disableBack(year, month, day) {
    const today = new Date();
    if (year <= today.getFullYear() && month <= today.getMonth() && day <= today.getDate()) {
      this.disableBackB = false;
    } else {
      this.disableBackB = true;
    }
  }
  setLabel(day, month, year) {
    if (parseInt(day) === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
      this.dateLabel = 'Hoy'
    } else {
      this.dateLabel = day + ' - ' + this.months[month] + ' - ' + year;
    }
  }

  getDaysInMonth(month, year) {
    console.log('month yar', month, year);

    this.lastDay = new Date(year, month + 1, 0).getDate();
    return this.lastDay;
  };

  getDayInfo(year, month, day) {
    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    month = month + 1;
    const m = (month < 10) ? ('0' + month) : month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = year + '-' + m + '-' + d;
    const _info = {
      pkMedico: this.medic.pk,
      fecha: date,
      pkPaciente: this.pacienteId
    };
    this.connection = this.restProvider.getDataDay(_info).subscribe((result: any) => {
      console.log(result, 'agenda from api in day');
      if (result['result']) {
        this.setData(result['result']['data_agenda']);
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
      this.hours = this.hourCopy;
      console.log(err);
    });
    this.restProvider.sendNotify({ fecha: date, client: this.pacienteId, pkMedico: _info.pkMedico });
  }

  setData(data: any) {
    this.hours = [];
    if (_.isEmpty(data)) {
      this.hours = null;
    } else {
      _.forEach(data, (element) => {
        let newData: any = element;
        if (!element.pkPaciente) {
          newData.state = 'Disponible'
          this.hours.push(newData);
        }
      });
    }
  }

  goToDetails(medic, state, posponed) {
    console.log(medic, 'medic for details');
    this.navCtrl.push(DayPage, { medic: medic, state: state, posponed: posponed });
  }

  getMeeting(hour) {

    console.log(hour, ' hora de la hora ');
    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    const _month = this.currentMonth + 1;
    const m = (_month < 10) ? ('0' + _month) : _month;
    const d = (this.day < 10) ? ('0' + this.day) : this.day;
    const date = this.currentYear + '-' + m + '-' + d;
    const _info = {
      fecha: hour.fecha,
      hora: hour.hora,
      medic: this.medic,
      centroMedico: hour.centroMedico,
      pkCentroMed: hour.pkCentroMed
    }
    console.log(_info, 'fetch');
    /*  let modal = this.mdlCtrl.create(GetMeetingPage, { hour: _info });
     modal.present();
     loading.dismiss(); */
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
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
        this.filterData(this.currentYear, this.currentMonth, this.day);
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

  getDataAccepted() {
    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    const fields: any = { pkPaciente: this.pkPaciente };
    this.restProvider.getMeetingAccepted(fields)
      .then((data) => {
        this.acceptedMeetings = data['data_agenda'];
        console.log(this.acceptedMeetings, 'especialidades Aceptadas');
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

  getDataNews() {
    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    const fields: any = { pkPaciente: this.pkPaciente };
    this.restProvider.getMeetingNews(fields)
      .then((data) => {
        this.newMeetings = data['data_agenda'];
        console.log(this.newMeetings, 'nuevas');
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

  getDataPostponed() {
    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    const fields: any = { pkPaciente: this.pkPaciente };
    this.restProvider.getDataPostponed(fields)
      .then((data) => {
        this.postponedMeetings = data['data_agenda'];
        console.log(this.postponedMeetings, 'pospuestas');
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

  changeTab(tab: string) {
    this.currentTab = tab;
    if (tab === 'step1') {
    }
    if (tab === 'step2') {
    }
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
