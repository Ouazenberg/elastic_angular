import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  error:string = "";
  vehicles:any;
  query: any;

  currentPage:number = 1;
  size:number = 12;
  pages:Array<number>;
  totalPages:number;
  
  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  filterVehicles(query:string){
    console.log(query);
    this.query = query;
    var sQuery ="{\n"+query+",\n\"from\": "+(this.currentPage-1)*this.size+",\n \"size\": "+this.size+"\n }";
    this.http.post("http://localhost:8080/car4u/vehicles/test", sQuery)
             .subscribe(data=>{
              let resSTR = JSON.stringify(data);
              let resJSON = JSON.parse(resSTR);
              this.vehicles = resJSON;
              console.log(this.vehicles);
              this.totalPages = Math.ceil(this.vehicles.totalHits/this.size);
              console.log(this.totalPages);
              this.pages = new Array(this.totalPages);
            })

  }

  goToPage(i:number){
    this.currentPage = i+1;
    this.filterVehicles(this.query);
  }

}
