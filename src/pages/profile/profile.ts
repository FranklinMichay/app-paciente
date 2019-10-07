import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { LoginPage } from '../login/login';

/* import {  FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx'; */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {
 
  image: any;
  user_profile: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
   
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
    this.user_profile = JSON.parse(localStorage.getItem('user'));
    console.log(this.user_profile, 'data user');
  }


  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  retur() {
    this.navCtrl.setRoot(HomePage);
  }

  goEditProfile() {
    this.navCtrl.setRoot(EditProfilePage, { infoProfile: this.user_profile });
  }

  async presentModal() {

    const modal = await this.modalCtrl.create({
      component: EditProfilePage

    });
    return await modal.present();
  }

}
