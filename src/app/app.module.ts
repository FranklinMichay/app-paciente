import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SearchMedicPage } from '../pages/search-medic/search-medic';
import { RestProvider } from '../providers';
import { HttpClientModule } from '@angular/common/http';
import { ProfileMedicPage } from '../pages/profile-medic/profile-medic';
import { SpecialtiesPage } from '../pages/specialties/specialties';
import { SchedulePage } from '../pages/schedule/schedule';
import { DayPage } from '../pages/day/day';
import { GetMeetingPage } from '../pages/get-meeting/get-meeting';
import { MeetingsPage } from '../pages/meetings/meetings';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { RegisterPage } from '../pages/register/register';
import { ChatPage } from '../pages/chat/chat';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ChatService } from '../providers/rest/chat.service';
import { ModalCancelPage } from '../pages/modal-cancel/modal-cancel';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password'
import { Facebook } from '@ionic-native/facebook/';
import { GooglePlus } from '@ionic-native/google-plus/';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchMedicPage,
    ProfileMedicPage,
    SpecialtiesPage,
    SchedulePage,
    DayPage,
    GetMeetingPage,
    MeetingsPage,
    LoginPage,
    ProfilePage,
    EditProfilePage,
    RegisterPage,
    ChatPage,
    ModalCancelPage,
    ForgotPasswordPage,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchMedicPage,
    ProfileMedicPage,
    SpecialtiesPage,
    SchedulePage,
    GetMeetingPage,
    MeetingsPage,
    LoginPage,
    DayPage,
    ProfilePage,
    EditProfilePage,
    RegisterPage,
    ChatPage,
    ModalCancelPage,
    ForgotPasswordPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundMode,
    LocalNotifications,
    Facebook,
    GooglePlus,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RestProvider,
    ChatService,
    
    


    //FileUploadOptions
  ]
})
export class AppModule { }
