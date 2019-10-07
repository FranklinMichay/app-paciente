import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCancelPage } from './modal-cancel';

@NgModule({
  declarations: [
    ModalCancelPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCancelPage),
  ],
})
export class ModalCancelPageModule {}
