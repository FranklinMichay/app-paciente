import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs/internal/Observable';

import { Message } from './model/message';
import { Config } from '../../app/config/config';

@Injectable()
export class ChatService {
  private url = Config.socketUrl;
  private socket;
  constructor() {
    const user = JSON.parse(localStorage.getItem('user')) ?
      JSON.parse(localStorage.getItem('user')) : {};
    this.socket = socketIo(this.url);

    this.socket.emit('init', { receiver: { _id: user._id } });
  }

  sendMessage(data: Message) {
    this.socket.emit('message', data);
  }

  getMessages() {
    const observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        console.log(data, 'in then chat service');
        observer.next(data);
      });
    });
    return observable;
  }

  getChatDetailList(reqData) {
    const observable = new Observable(observer => {
      this.socket.emit('joined', reqData);
      this.socket.emit('chat-list', reqData);
      this.socket.on('chat-list', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
}
