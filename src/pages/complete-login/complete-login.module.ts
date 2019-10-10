import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompleteLoginPage } from './complete-login';

@NgModule({
  declarations: [
    CompleteLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(CompleteLoginPage),
  ],
})
export class CompleteLoginPageModule {}
