import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  vehicles:any;
  
  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  filterVehicles(query:string){
    console.log(query);
    this.http.post("/api/car4u/vehicles/test", query)
             .subscribe(data=>{
              let resSTR = JSON.stringify(data);
              let resJSON = JSON.parse(resSTR);
              this.vehicles = resJSON;
              console.log(this.vehicles);
            })

  }

}
