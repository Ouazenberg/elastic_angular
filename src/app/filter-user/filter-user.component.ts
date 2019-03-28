import { Component, OnInit } from '@angular/core';
import { FilterUserService } from './filter-user.service';

@Component({
  selector: 'app-filter-user',
  templateUrl: './filter-user.component.html',
  styleUrls: ['./filter-user.component.scss']
})
export class FilterUserComponent implements OnInit {
  
  query: string;
  nbrResults: any;
  listVehicles: any;

  selectedMakes = [];
  selectedModels = [];
  selectedCategories = [];
  selectedMonthlyPaiements = [];
  
  searchMake = "";
  searchModel = "";
  searchCategory = "";
  searchMonthlyPaiements = "";
  
  listMakes: any;
  listModels = [];
  listCategories: any;
  listMonthlyPaiements: any;

  currentPage:number = 1;
  size:number = 24;
  pages:Array<number>;
  totalPages:number;
 
  constructor(private filterUserService: FilterUserService) { }

  ngOnInit() {
    this.getVehicles();
  }

  filterByMake(make){
    
    let query = this.filterUserService.dynamicQuery(make,"","","");
    this.filterUserService.httpVehicles(query)
         .subscribe(data=>{
          let resJSON = JSON.parse(JSON.stringify(data));
          let listModels = this.filterUserService.getAggs(resJSON.aggs.models.buckets);
           
          if(this.selectedMakes.includes(make)){
              this.selectedMakes.splice(this.selectedMakes.indexOf(make),1);
              this.cleanModels(listModels);
          } 
          else {
              this.selectedMakes.push(make);
              this.updateModels(listModels);
          }          
          this.search();
        }); 
  }

  filterByModel(model){
    
      if(this.selectedModels.includes(model)){
        this.selectedModels.splice(this.selectedModels.indexOf(model),1);
      } else {
        this.selectedModels.push(model);
      }
      this.search();
  }

  filterByMonthlyPaiment(monthlyPaiement){
      if(this.selectedMonthlyPaiements.includes(monthlyPaiement)){
        this.selectedMonthlyPaiements.splice(this.selectedMonthlyPaiements.indexOf(monthlyPaiement),1);
      } else {
        this.selectedMonthlyPaiements.push(monthlyPaiement);
      }
      this.search();
  }

  filterByCategory(category){
    if(this.selectedCategories.includes(category)){
      this.selectedCategories.splice(this.selectedCategories.indexOf(category),1);
    } else {
      this.selectedCategories.push(category);
    }
    this.search();
}

  search(){
    this.currentPage = 1;
    this.searchMake = "";
    this.searchModel = "";
    this.searchCategory = "";
    this.searchMonthlyPaiements = "";

      for(let m of this.selectedMakes){
        this.searchMake += " " + m; 
      }
      for(let m of this.selectedModels){
        this.searchModel += " " + m; 
      }
      for(let m of this.selectedCategories){
        this.searchCategory += " " + m; 
      }
      for(let m of this.selectedMonthlyPaiements){
        this.searchMonthlyPaiements += " " + m; 
      }
    this.getVehicles();
  }

  getVehicles(){    
    this.setQuery();
    this.filterUserService.getVehicles(this.query)
                        .then(
                          data=>{
                            this.setResults(this.filterUserService.getResults());
                            this.cleanMonthlyPaiements(this.listMonthlyPaiements);
                            console.log(this.listVehicles);

                            console.log("searchMake: "+this.searchMake);
                            console.log("searchModel: "+this.searchModel);
                            console.log("searchCategory: "+this.searchCategory);
                            console.log("searchMonthlyPaiements: "+this.searchMonthlyPaiements);
                          });
  }

  setQuery(){
    this.filterUserService.setArgs(this.getArgs());
    this.query =  this.filterUserService.dynamicQuery(this.searchMake, this.searchModel, this.searchMonthlyPaiements, this.searchCategory);     
  }

  cleanModels(listModels){
    for(let m of listModels){
      if(this.listModels.includes(m)){
        this.listModels.splice(this.listModels.indexOf(m),1);
      }
      if(this.selectedModels.includes(m)){
        this.selectedModels.splice(this.selectedModels.indexOf(m),1);
      }
    }
  }

  updateModels(listModels){
    for(let m of listModels){
      if(!this.listModels.includes(m)){
        this.listModels.push(m);
      }
    }
  }

  cleanMonthlyPaiements(listMonthlyPaiements){
    for(let m of this.selectedMonthlyPaiements){
      if(!listMonthlyPaiements.includes(m)){
        this.selectedMonthlyPaiements.splice(this.selectedMonthlyPaiements.indexOf(m),1);
      }
    }
    this.searchMonthlyPaiements = "";
    for(let m of this.selectedMonthlyPaiements){
      this.searchMonthlyPaiements += " " + m; 
    }
    
  }

  setResults(obj){
    this.nbrResults = obj.nbrResults,
    this.listVehicles = obj.listVehicles,

    this.selectedMakes = obj.selectedMakes,
    this.selectedModels = obj.selectedModels,
    this.selectedCategories = obj.selectedCategories,
    this.selectedMonthlyPaiements = obj.selectedMonthlyPaiements,
    
    this.searchMake = obj.searchMake,
    this.searchModel = obj.searchModel,
    this.searchCategory = obj.searchCategory,
    this.searchMonthlyPaiements = obj.searchMonthlyPaiements,
    
    this.listMakes = obj.listMakes,
    this.listModels = obj.listModels,
    this.listCategories = obj.listCategories,
    this.listMonthlyPaiements = obj.listMonthlyPaiements,

    this.currentPage = obj.currentPage,
    this.size = obj.size,
    this.pages = obj.pages,
    this.totalPages = obj.totalPages
  }

  getArgs(){
    let obj = {
      nbrResults: this.nbrResults,
      listVehicles: this.listVehicles,

      selectedMakes: this.selectedMakes,
      selectedModels: this.selectedModels,
      selectedCategories: this.selectedCategories,
      selectedMonthlyPaiements: this.selectedMonthlyPaiements,
      
      searchMake: this.searchMake,
      searchModel: this.searchModel,
      searchCategory: this.searchCategory,
      searchMonthlyPaiements: this.searchMonthlyPaiements,
      
      listMakes: this.listMakes,
      listModels: this.listModels,
      listCategories: this.listCategories,
      listMonthlyPaiements: this.listMonthlyPaiements,

      currentPage : this.currentPage,
      size : this.size,
      pages : this.pages,
      totalPages : this.totalPages
    }
    return obj;
  }

  goToPage(i:number){
    this.currentPage = i+1;
    this.getVehicles();
  }

}
