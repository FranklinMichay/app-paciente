import { HttpClient } from '@angular/common/http';
import * as socketIo from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Config } from '../../app/config/config';
import { Observable } from 'rxjs/internal/Observable';
import { Calendar } from './model/calendar';
import { Response } from './model/responses';

@Injectable()
export class RestProvider {
  private url = Config.socketUrl;
  config;
  socket;
  dataUser: any;

  constructor(public http: HttpClient,
  ) {
    this.initSocketIo();
  }

  initSocketIo() {
    const user = JSON.parse(localStorage.getItem('user')) ?
      JSON.parse(localStorage.getItem('user')) : {};
    this.socket = socketIo(this.url);
    this.socket.emit('init', { receiver: { _id: user.pk } });
  }

  sendNotify(data: Calendar) {
    console.log(data, 'in send notifi');
    this.socket.emit('calendar', data);
  }


  getDataDay(_data: any) {
    console.log(_data, 'data for get');
    const observable = new Observable(observer => {
      this.socket.on('calendar', async (data) => {
        console.log(data, _data, 'data del antes del if');
        if (data.client == _data.pkPaciente && _data.fecha) {
          _data.fecha = data.fecha;
        }
        if (data.pkMedico === _data.pkMedico) {
          console.log(data.pkMedico, _data.pkMedico, 'entro en el if');
          await this.getDayData(_data).then(
            d => {
              data.result = d;
            });
          observer.next(data);
        }
      });
    });
    return observable;
  }

  sendResponse(data: Response) {
    console.log(data, 'in send response client');
    this.socket.emit('response', data);
  }

  getMeetingData(_data) {
    console.log(_data, 'data for get');
    const observable = new Observable(observer => {
      this.socket.on('response', async (data) => {
        console.log(_data, data, ' on redis response fuera del if');
        if (data.client === _data.pkPaciente) {
          await this.getMeetingNews(_data).then(
            d => {
              data.dataNews = d;
            });
          await this.getDataPostponed(_data).then(
            d => {
              data.dataPostponed = d;
            });

          await this.getMeetingAccepted(_data).then(
            d => {
              data.dataAccepted = d;
            });
          observer.next(data);
        }
      });
    });
    return observable;
  }

  getUsers(entidad) {
    return new Promise(resolve => {
      this.http.get(Config.apiUrl + entidad).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getMedics() {
    return new Promise((resolve, reject) => {
      this.http.get(Config.apiUrl + 'movil/getAllMedicos/').subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  getSpecialties() {
    return new Promise((resolve, reject) => {
      this.http.get(Config.apiUrl + 'movil/getEspecialidades/').subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }
  getCentroMedico() {


    return new Promise((resolve, reject) => {
      this.http.get(Config.apiUrl + 'movil/getCentroMedico/').subscribe(data => {
        resolve(data);
        console.log(data, 'centros');
      }, err => {
        reject(err);
      });
    });
  }

  getMedicSpecialties(pk) {
    const params = { pkEspecialidad: pk }
    return new Promise((resolve, reject) => {
      this.http.get(Config.apiUrl + 'movil/getMedEspecialidad/', { params: params }).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  getDayData(data: any) {
    console.log(data, ' for send');
    data.fecha = !data.fecha ? '2019-08-14' : data.fecha;
    return new Promise((resolve, reject) => {
      this.http.get(Config.apiUrl + 'movil/getDateAgendaLibre/', { params: data })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  sendRequest(data: any) {
    console.log(data, ' for send');
    return new Promise((resolve, reject) => {
      this.http.post(Config.apiUrl + 'movil/createCitaMedico/', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getMeetingNews(data: any) {
    console.log(data, ' for send');
    return new Promise((resolve, reject) => {
      this.http.get(Config.apiUrl + 'movil/getCitasAgendaNew/', { params: data })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getDataPostponed(data) {
    console.log(data, ' for send');
    return new Promise((resolve, reject) => {
      this.http.get(Config.apiUrl + 'movil/getCitasAgendaPost/', { params: data })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getMeetingAccepted(data) {
    console.log(data, ' for send');
    return new Promise((resolve, reject) => {
      this.http.get(Config.apiUrl + 'movil/getCitasAgendaAccepted/', { params: data })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  cancelMeeting(data) {
    console.log(data, ' for send');
    return new Promise((resolve, reject) => {
      this.http.post(Config.apiUrl + 'movil/cancelarCitaAge/', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  login(data: any) {
    console.log(data, 'DATOS DE LOGIN');
    return new Promise((resolve, reject) => {
      this.http.post(Config.apiUrl + 'movil/userLoginPaciente/', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
          console.log(err, 'error en los datos');
        });
    });
  }

  acceptMeeting(response) {
    return new Promise((resolve, reject) => {
      this.http.post(Config.apiUrl + 'movil/updateCitaMedico/', response)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updatePaciente(data) {
    console.log(data, 'DATOS UPDATE');
    return new Promise((resolve, reject) => {
      this.http.post(Config.apiUrl + 'movil/updatePacienteProfile/', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  registroUser(data) {
    console.log(data, 'DATOS REGISTRO PACIENTE');
    return new Promise((resolve, reject) => {
      this.http.post(Config.apiUrl + 'movil/registroPaciente/', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  loginWithFacebook(data: any): Observable<any> {
    return this.http.post<any>(Config.apiUrlSolcial + 'paciente/verificaEmail/', data);
  }

  recoveryPassword(data: any): Observable<any> {
    return this.http.post<any>(Config.apiUrlSolcial + 'paciente/emailResetMovil/', data);
  }

  validateLoginFacebook(data: any): Observable<any> {
    return this.http.post<any>(Config.apiUrlSolcial + 'paciente/emailResetMovil/', data);
  }
}
