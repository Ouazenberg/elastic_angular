import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

  error:boolean=true;
  vehicleID:any;
  vehicle=null;

  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  getVehicle(){
    this.vehicle = null;
    this.http.get("/api/car4u/vehicles/"+this.vehicleID)
            .subscribe(data=>{
              this.error=true;
              let resSTR = JSON.stringify(data);
              let resJSON = JSON.parse(resSTR);
              this.vehicle = resJSON.source;
              console.log(this.vehicle); 
            },
            error => {
              this.error = error.ok;
              console.log(this.error);
            })
  

  } 
}
