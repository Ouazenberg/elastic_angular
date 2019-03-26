import { Component, OnInit } from '@angular/core';
import { FilterUserService } from './filter-user.service';
import { TestUserService } from './test-user.service';

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
  listModels: any;
  listCategories: any;
  listMonthlyPaiements: any;
  

  constructor(private filterUserService: FilterUserService,
              private testUserService: TestUserService
              ) { }

  ngOnInit() {
    this.getAllVehicles();
  }

  filterByMake(make){
   
    let query = this.filterUserService.dynamicQuery(make,"","");
    this.filterUserService.httpVehicles(query)
         .subscribe(data=>{
          let resSTR = JSON.stringify(data);
          let resJSON = JSON.parse(resSTR);
          let listModels = this.filterUserService.getAggs(resJSON.aggs.models.buckets);
          let listMonthlyPaiements = this.filterUserService.getAggs(resJSON.aggs.monthly.buckets);
          
          if(this.selectedMakes.includes(make)){
              this.selectedMakes.splice(this.selectedMakes.indexOf(make),1);
              this.cleanModels(listModels);
              this.cleanMonthlyPaiements(listMonthlyPaiements);
          } 
          else {
              this.selectedMakes.push(make);
              this.updateModels(listModels);
          }          
          this.stringSearchMakes();
        }); 
}



filterByModel(model){
  if(this.selectedModels.includes(model)){
    this.selectedModels.splice(this.selectedModels.indexOf(model),1);
  } else {
    this.selectedModels.push(model);
  }
  this.stringSearchModels();
}

filterByMonthlyPaiment(monthlyPaiement){
if(this.selectedMonthlyPaiements.includes(monthlyPaiement)){
  this.selectedMonthlyPaiements.splice(this.selectedMonthlyPaiements.indexOf(monthlyPaiement),1);
} else {
  this.selectedMonthlyPaiements.push(monthlyPaiement);
}

this.stringSearchMonthlyPaiement();

}

  getAllVehicles(){    
    this.query =  this.filterUserService.dynamicQuery(this.searchMake, this.searchModel, this.searchMonthlyPaiements); 
    
    this.testUserService.getAllVehicles(this.query).then(
                                                    data=>{
                                                      this.setResults(this.testUserService.getResults());
                                                    });
    
    // this.filterUserService.httpVehicles(this.query)
    //          .subscribe(data=>{
    //           let resSTR = JSON.stringify(data);
    //           let resJSON = JSON.parse(resSTR);
    //           this.listVehicles = resJSON;
    //           this.nbrResults = resJSON.totalHits;
    //           this.listMakes = this.filterUserService.getAggs(resJSON.aggs.makes.buckets);
    //           this.listMonthlyPaiements = this.filterUserService.getAggs(resJSON.aggs.monthly.buckets);
    //           this.listCategories = this.filterUserService.getAggs(resJSON.aggs.categories.buckets)

    //           this.listModels = [];
    //           this.selectedModels = [];
    //           this.searchModel = "";
    //           console.log(this.listVehicles);

    //           console.log("Makes: "+this.searchMake);
    //           console.log("Models: "+this.searchModel);
    //           console.log("Months: "+this.searchMonthlyPaiements);

              
    //         });
   }

  getVehiclesByMake(){
    this.query =  this.filterUserService.dynamicQuery(this.searchMake, this.searchModel, this.searchMonthlyPaiements); 
    this.filterUserService.httpVehicles(this.query)
             .subscribe(data=>{
              let resSTR = JSON.stringify(data);
              let resJSON = JSON.parse(resSTR);
              this.listVehicles = resJSON;
              this.nbrResults = resJSON.totalHits;
              this.listModels = this.filterUserService.getAggs(resJSON.aggs.models.buckets);
              this.listCategories = this.filterUserService.getAggs(resJSON.aggs.categories.buckets)
              this.listMonthlyPaiements = this.filterUserService.getAggs(resJSON.aggs.monthly.buckets);
              console.log(this.listVehicles); 

              console.log("Makes: "+this.searchMake);
              console.log("Models: "+this.searchModel);
              console.log("Months: "+this.searchMonthlyPaiements);
            });
  }
  
  getVehiclesByModel(){
    this.query =  this.filterUserService.dynamicQuery(this.searchMake, this.searchModel, this.searchMonthlyPaiements);
    this.filterUserService.httpVehicles(this.query)
             .subscribe(data=>{
              let resSTR = JSON.stringify(data);
              let resJSON = JSON.parse(resSTR);
              this.listVehicles = resJSON;
              this.nbrResults = resJSON.totalHits;
              this.listMonthlyPaiements = this.filterUserService.getAggs(resJSON.aggs.monthly.buckets);
              this.listCategories = this.filterUserService.getAggs(resJSON.aggs.categories.buckets)
              console.log(this.listVehicles);

              console.log("Makes: "+this.searchMake);
              console.log("Models: "+this.searchModel);
              console.log("Months: "+this.searchMonthlyPaiements);
            });
  }

  getVehiclesByMonthlyPaiements(){
    this.query =  this.filterUserService.dynamicQuery(this.searchMake, this.searchModel, this.searchMonthlyPaiements);  
    this.filterUserService.httpVehicles(this.query)
             .subscribe(data=>{
              let resSTR = JSON.stringify(data);
              let resJSON = JSON.parse(resSTR);
              this.listVehicles = resJSON;
              this.listMakes = this.filterUserService.getAggs(resJSON.aggs.makes.buckets);
              this.nbrResults = resJSON.totalHits;
              console.log(this.listVehicles);

              console.log("Makes: "+this.searchMake);
              console.log("Models: "+this.searchModel);
              console.log("Months: "+this.searchMonthlyPaiements);
            });
  }

  getVehiclesByMonthly_Make(){
    this.query =  this.filterUserService.dynamicQuery(this.searchMake, this.searchModel, this.searchMonthlyPaiements);
    this.filterUserService.httpVehicles(this.query)
             .subscribe(data=>{
              let resSTR = JSON.stringify(data);
              let resJSON = JSON.parse(resSTR);
              this.listVehicles = resJSON;
              this.listModels = this.filterUserService.getAggs(resJSON.aggs.models.buckets);
              this.nbrResults = resJSON.totalHits;
              console.log(this.listVehicles);

              console.log("Makes: "+this.searchMake);
              console.log("Models: "+this.searchModel);
              console.log("Months: "+this.searchMonthlyPaiements);
            });
  }

  getVehiclesByMonthly_Make_Model(){
    this.query =  this.filterUserService.dynamicQuery(this.searchMake, this.searchModel, this.searchMonthlyPaiements);
    this.filterUserService.httpVehicles(this.query)
             .subscribe(data=>{
              let resSTR = JSON.stringify(data);
              let resJSON = JSON.parse(resSTR);
              this.listVehicles = resJSON;
              this.nbrResults = resJSON.totalHits;
              console.log(this.listVehicles);

              console.log("Makes: "+this.searchMake);
              console.log("Models: "+this.searchModel);
              console.log("Months: "+this.searchMonthlyPaiements);
            });
  }

  stringSearchMakes (){
    this.searchMake = "";
    if(this.selectedMakes.length == 0){
      if(this.selectedMonthlyPaiements.length == 0){
        this.searchMonthlyPaiements = "";
        this.getAllVehicles();
      }else{
        this.getVehiclesByMonthlyPaiements();
      }
    }else { 
      for(let m of this.selectedMakes){
        this.searchMake += " " + m; 
      }
      if(this.selectedModels.length > 0){
        if(this.selectedMonthlyPaiements.length == 0){
          this.searchMonthlyPaiements = "";
          this.getVehiclesByModel();
        }else{
          this.getVehiclesByMonthly_Make_Model();
        }
      } else {
        this.searchModel = "";
        if(this.selectedMonthlyPaiements.length == 0){
          this.searchMonthlyPaiements = "";
           this.getVehiclesByMake();
        }else{
          this.getVehiclesByMonthly_Make();
        }

      }
    }
  }

  stringSearchModels(){
    this.searchModel = "";
      if(this.selectedModels.length == 0){
        if(this.selectedMonthlyPaiements.length == 0){
          this.searchMonthlyPaiements = "";
          this.getVehiclesByMake();
        }else{
          this.getVehiclesByMonthly_Make();
        }
      }else{
        for(let m of this.selectedModels){
          this.searchModel += " " + m; 
        }
        if(this.selectedMonthlyPaiements.length == 0){
          this.searchMonthlyPaiements = "";
          this.getVehiclesByModel();
        }else{
          this.getVehiclesByMonthly_Make_Model();
        }
      }
  }

  stringSearchMonthlyPaiement(){
    this.searchMonthlyPaiements = "";
    if(this.selectedMonthlyPaiements.length == 0){
      if(this.selectedMakes.length == 0){
        this.searchMake = "";
        this.getAllVehicles();
      }else{
        if(this.selectedModels.length == 0){
          this.searchModel = "";
          this.getVehiclesByMake();
        }else{
          this.getVehiclesByModel();
        }
      }
    } else {
      for(let m of this.selectedMonthlyPaiements){
        this.searchMonthlyPaiements += " " + m; 
      }
      if(this.selectedMakes.length == 0){
        this.searchMake = "";
        this.getVehiclesByMonthlyPaiements();
      }else{
        if(this.selectedModels.length == 0){
          this.searchModel = "";
          this.getVehiclesByMonthly_Make();
        }else{
          this.getVehiclesByMonthly_Make_Model();
        }
      }
    }
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
      if(listMonthlyPaiements.includes(m)){
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
    this.selectedMonthlyPaiements = obj.selectedMonthlyPaiements,
    
    this.searchMake = obj.searchMake,
    this.searchModel = obj.searchModel,
    this.searchMonthlyPaiements = obj.searchMonthlyPaiements,
    
    this.listMakes = obj.listMakes,
    this.listModels = obj.listModels,
    this.listCategories = obj.listCategories,
    this.listMonthlyPaiements = obj.listMonthlyPaiements
  }

}
