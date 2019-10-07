import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ViewController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { ChatService, RestProvider } from '../../providers';
import { Message } from '../../providers/rest/model/message';
import * as _ from 'lodash';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  chatList: Array<any> = [];
  chatListData: Array<any> = [];
  connection: any;
  user: any = {};
  data: Message = {
    /*receiverid: '',
    title: 'title',
    receiveridimg: ''*/
  };


  sender: any = {};
  conversationList: Array<any> = [];
  isChatting = false;
  speciality: any = [];
  medicalCenter: any = [];
  medicsOriginal: any;
  medics: any = [];
  medicFiltered: any;
  specialities: any = '';
  medicCenter: any = '';
  filtered: any = { especialidad: "", ciudad: "" };
  medicalC: any;
  filteredMedCByCity: any;
  filterSpeciality: any;

  constructor(private navCtrl: NavController,
    public viewCtrl: ViewController,
    public restProv: RestProvider,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public mdlCtrl: ModalController,
    public toast: ToastController,
    private chatService: ChatService) {


  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')) ?
      JSON.parse(localStorage.getItem('user')) : {};
    this.user = user;
    this.sender = user;
    this.getChatList();
    this.getDataList();
    this.getSpecialities();
    this.getMedicalCenter();


  }
  updateData() {
    console.log(this.filtered.ciudad, 'Ciudad para filtrar');
    console.log(this.medicalC, 'Centro Medico para filtrar');
    this.filterMCByParamSelect();
  }

  filterMCByParamSelect() {
    if (this.filtered.ciudad != '') {
      this.filteredMedCByCity = _.filter(this.medicalCenter, ['direccion', this.filtered.ciudad]);
      console.log(this.filteredMedCByCity, 'Centros por ciudad');
      this.medicalCenter = this.filteredMedCByCity;
    } else {
      if (this.filtered.ciudad === '') {
        this.getMedicalCenter();
        console.log(this.getMedicalCenter(), 'todos');
      }
    }
  }

  filterSpecialityByParamSelect() {

  }

  reduceItems() {

  }

  objectKeys(objeto: any) {
    const keys = Object.keys(objeto);
    console.log(keys); // echa un vistazo por consola para que veas lo que hace "Object.keys"
    return keys;
  }

  getDataList() {
    const loading = this.loadingCtrl.create({ spinner: 'crescent' });
    loading.present();
    this.restProv.getMedics()
      .then((data) => {
        this.medics = data['data_medicos'];
        this.medicsOriginal = data['data_medicos'];
        this.medicFiltered = data['data_medicos'];
        console.log(data, 'data from api');

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

  getSpecialities() {
    this.restProv.getSpecialties()
      .then((data) => {
        this.speciality = data['data_especi'];
        console.log(this.speciality, 'especialidades');

      }, (err) => {
        console.log(err);
      });
  }

  getMedicalCenter() {
    this.restProv.getCentroMedico()
      .then((data) => {
        this.medicalCenter = data['data_centro_med'];
        console.log(this.medicalCenter, 'Centros Medicos');
      }, (err) => {
        console.log(err);
      });
  }



  filter() {
    let dat: any = {};
    if (this.medicalC != '')
      dat.medicalCenter = this.medicalC
    dat.params = _.reduce(this.filtered, function (result, value, key) {
      console.log(value, ' value');

      if (value != '')
        result[key] = value;
      return result;
    }, {});
    this.viewCtrl.dismiss(dat);
    console.log(dat, 'DATOS DEL SELECT');
  }



  goBack() {
    this.viewCtrl.dismiss();
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  openPageChatDetail(item) {
    /*     console.log(item);
        this.data = {
          receiverid: item._id,
          title: item.name,
          receiveridimg: item.img
        };
        this.navCtrl.push('chat-detail'); */
  }

  getChatList() {
    // this.loading.onLoading();
    this.connection = this.chatService.getMessages().subscribe(data => {
      //this.chatList = [];
      const chatList: any = data;
      const newChatList: Array<any> = [];
      /*chatList.forEach((chatEl, i) => {
        if (chatEl._id !== this.user._id && chatEl.name !== this.user.username) {
          newChatList.push(chatEl);
        }
      });*/

      this.chatList.push({
        content: chatList.content,
        dateTime: 'chatEl.dateTime',
        img: 'https://api.adorable.io/avatars/285/250605.png',
        lastChat: 'chatEl.lastChat',
        name: chatList.from.usename,
        _id: 'chatEl.ref._id        '
      });


      /*chatList.forEach((chatEl, i) => {
        if (chatEl.ref) {
          const countEl = newChatList.filter(el => {
            return chatEl.ref._id === el._id;
          });
          if (countEl.length <= 0) {
            newChatList.push({
              dateTime: chatEl.dateTime,
              img: chatEl.ref.img,
              lastChat: chatEl.lastChat,
              name: chatEl.ref.username,
              _id: chatEl.ref._id
            });
          }
        }
      });*/
      //this.chatList = newChatList;
      console.log(this.chatList);
      // this.loading.dismiss();
    });
  }

  findShop() {
    this.navCtrl.push('shop');
  }

  async sendMessage() {
    /*const data = {
      name: this.data.title,
      sender: this.sender,
      receiver: {
        _id: this.data.receiverid,
        username: this.data.title,
        img: this.data.receiveridimg
      },
      message: e
    };*/
    this.data.from = this.sender;
    this.chatService.sendMessage(this.data);
  }

  logout() {
    localStorage.removeItem('user');
    this.navCtrl.push('login');
  }

}
