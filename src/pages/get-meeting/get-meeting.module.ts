import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetMeetingPage } from './get-meeting';

@NgModule({
  declarations: [
    GetMeetingPage,
  ],
  imports: [
    IonicPageModule.forChild(GetMeetingPage),
  ],
})
export class GetMeetingPageModule {}
