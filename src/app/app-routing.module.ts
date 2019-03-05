import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleComponent } from './vehicle/vehicle.component';
import { FilterComponent } from './filter/filter.component';

const routes: Routes = [
  {path:'vehicle', component:VehicleComponent},
  {path:'filter', component:FilterComponent},
  {path:'', redirectTo:'/vehicle', pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
