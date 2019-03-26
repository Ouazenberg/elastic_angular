import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterComponent } from './filter/filter.component';
import { FilterUserComponent } from './filter-user/filter-user.component';

@NgModule({
  declarations: [
    AppComponent,
    VehicleComponent,
    FilterComponent,
    FilterUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [VehicleComponent, FilterComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
