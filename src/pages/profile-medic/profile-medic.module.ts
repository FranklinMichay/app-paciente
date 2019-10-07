import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileMedicPage } from './profile-medic';

@NgModule({
  declarations: [
    ProfileMedicPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileMedicPage),
  ],
})
export class ProfileMedicPageModule {}
