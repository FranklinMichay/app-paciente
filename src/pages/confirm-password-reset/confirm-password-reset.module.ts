import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmPasswordResetPage } from './confirm-password-reset';

@NgModule({
  declarations: [
    ConfirmPasswordResetPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmPasswordResetPage),
  ],
})
export class ConfirmPasswordResetPageModule {}
