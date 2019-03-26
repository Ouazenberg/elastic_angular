import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterUserComponent } from './filter-user.component';
import { FilterUserService } from './filter-user.service';

@Injectable({
  providedIn: 'root'
})
export class TestUserService {

  nbrResults: any;
  listVehicles: any;

  selectedMakes = [];
  selectedModels = [];
  selectedMonthlyPaiements = [];
  
  searchMake = "";
  searchModel = "";
  searchMonthlyPaiements = "";
  
  listMakes: any;
  listModels: any;
  listCategories: any;
  listMonthlyPaiements: any;

  constructor(private http: HttpClient,
              private filterUserService: FilterUserService) { }

              getAllVehicles(query){    
                
                return this.filterUserService.httpVehicles(query)
                         .forEach(data=>{
                          let resSTR = JSON.stringify(data);
                          let resJSON = JSON.parse(resSTR);
                          this.listVehicles = resJSON;
                          this.nbrResults = resJSON.totalHits;
                          this.listMakes = this.filterUserService.getAggs(resJSON.aggs.makes.buckets);
                          this.listMonthlyPaiements = this.filterUserService.getAggs(resJSON.aggs.monthly.buckets);
                          this.listCategories = this.filterUserService.getAggs(resJSON.aggs.categories.buckets)
            
                          this.listModels = [];
                          this.selectedModels = [];
                          this.searchModel = "";                          
                          
                        });
               }

  getResults(){
    let obj = {
      nbrResults: this.nbrResults,
      listVehicles: this.listVehicles,

      selectedMakes: this.selectedMakes,
      selectedModels: this.selectedModels,
      selectedMonthlyPaiements: this.selectedMonthlyPaiements,
      
      searchMake: this.searchMake,
      searchModel: this.searchModel,
      searchMonthlyPaiements: this.searchMonthlyPaiements,
      
      listMakes: this.listMakes,
      listModels: this.listModels,
      listCategories: this.listCategories,
      listMonthlyPaiements: this.listMonthlyPaiements
    }
    return obj;
  }

}
