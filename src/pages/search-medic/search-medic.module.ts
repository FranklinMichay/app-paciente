import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchMedicPage } from './search-medic';

@NgModule({
  declarations: [
    SearchMedicPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchMedicPage),
  ],
})
export class SearchMedicPageModule {}
