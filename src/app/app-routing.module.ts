import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleComponent } from './vehicle/vehicle.component';
import { FilterComponent } from './filter/filter.component';
import { FilterUserComponent } from './filter-user/filter-user.component';

const routes: Routes = [
  {path:'vehicle', component:VehicleComponent},
  {path:'query', component:FilterComponent},
  {path:'filter', component:FilterUserComponent},
  {path:'', redirectTo:'/filter', pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
