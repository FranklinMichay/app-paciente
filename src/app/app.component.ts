import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SearchMedicPage } from '../pages/search-medic/search-medic';
import { SpecialtiesPage } from '../pages/specialties/specialties';
import { MeetingsPage } from '../pages/meetings/meetings';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { BackgroundMode } from '@ionic-native/background-mode';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  info_user;
  constructor(platform: Platform, statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menuControler: MenuController,
    public toast: ToastController,
    private backgroundMode: BackgroundMode) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      const user = localStorage.getItem('user');
      this.info_user = JSON.parse(localStorage.getItem('user'));
      this.menuControler.close();
      //this.menuControler.enable(true);
      if (user)
      this.rootPage = HomePage;
      else this.rootPage = LoginPage;
      statusBar.styleDefault();
      splashScreen.hide();
      this.backgroundMode.enable();
      platform.registerBackButtonAction(() => {
        if(this.nav.canGoBack()) {
           this.nav.pop();
        }
       else if(this.backgroundMode.isEnabled()) {
          this.backgroundMode.moveToBackground();
        }
      });
    });
  }
  goToHome() {
    this.menuControler.close();
    this.nav.setRoot(HomePage);
  }

  goToMedics() {
    this.menuControler.close();
    this.nav.setRoot(SearchMedicPage);
  }

  goToSpecialties() {
    this.menuControler.close();
    this.nav.setRoot(SpecialtiesPage);
  }

  goToMeetings() {
    this.menuControler.close();
    this.nav.setRoot(MeetingsPage);
  }

  goToSchedule() {
    this.menuControler.close();
    let alert = this.toast.create({
      message: 'Componente en Construcción',
      duration: 3000,
      position: 'top'
  });
  alert.present();
  }

  goToProfile() {
    this.menuControler.close();
    this.nav.setRoot(ProfilePage);
  }

  logout () {
    this.menuControler.close();
    localStorage.removeItem('user');
    this.nav.setRoot(LoginPage);
    this.menuControler.enable(false)
  }
}

