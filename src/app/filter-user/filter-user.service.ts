import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilterUserService {

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

  currentPage:number;
  size:number;
  pages:Array<number>;
  totalPages:number;

  constructor(private http: HttpClient) {  }

  httpVehicles(query){
    return this.http.post("http://localhost:8080/car4u/vehicles/test", query);
  }

  getAggs(aggs){
    let allAggs = [];
    for(let agg of aggs){
      allAggs.push(agg.key);
    }
    return allAggs;
  }

  getVehicles(query){    
    return this.httpVehicles(query)
              .forEach(data=>{
              let resJSON = JSON.parse(JSON.stringify(data));
              this.listVehicles = resJSON;
              this.nbrResults = resJSON.totalHits;
              this.updateTest();
              this.totalPages = Math.ceil(resJSON.totalHits/this.size);
              this.pages = new Array(this.totalPages);
            });
    }

  dynamicQuery(searchMake, searchModel, searchMonthly, searchCategory){
    let match: string = "";

    if(searchMake != ""){
      match =  "        {\n" + 
                "          \"match\": {\n" + 
                "            \"make_unique_label\": \""+searchMake+"\"\n" + 
                "          }\n" + 
                "        }\n";
    }
    if(searchModel != ""){
      if (match !=""){
        match += ",";
      }
      match +=  "        {\n" + 
                "          \"match\": {\n" + 
                "            \"model_unique_label\": \""+searchModel+"\"\n" + 
                "          }\n" + 
                "        }\n";
    }

    if(searchMonthly != ""){
      if (match !=""){
        match += ",";
      }
      match +=  "        {\n" + 
                "          \"match\": {\n" + 
                "            \"monthly_budget_range_code\": \""+searchMonthly+"\"\n" + 
                "          }\n" + 
                "        }\n";
    }

    if(searchCategory != ""){
      if (match !=""){
        match += ",";
      }
      match +=  "        {\n" + 
                "          \"match\": {\n" + 
                "            \"vehicle_segment_code\": \""+searchCategory+"\"\n" + 
                "          }\n" + 
                "        }\n";
    }

    let aggs =  "    \"colors\": {\n" + 
                "      \"terms\": {\n" + 
                "        \"field\": \"vehicle_color.keyword\",\"size\": 50,\"order\": {\"_term\": \"asc\"}\n" + 
                "      }\n" + 
                "     },\n" +  
                "    \"makes\": {\n" + 
                "      \"terms\": {\n" + 
                "        \"field\": \"make_unique_label.keyword\",\"size\": 50,\"order\": {\"_term\": \"asc\"}\n" + 
                "      }\n" +   
                "    },\n" +
                "    \"models\": {\n" + 
                "      \"terms\": {\n" + 
                "        \"field\": \"model_unique_label.keyword\",\"size\": 50,\"order\": {\"_term\": \"asc\"}\n" + 
                "      }\n" + 
                "    },\n" +
                "    \"categories\": {\n" + 
                "      \"terms\": {\n" + 
                "        \"field\": \"vehicle_segment_code.keyword\",\"size\": 50,\"order\": {\"_term\": \"asc\"}\n" + 
                "      }\n" + 
                "    },\n" +
                "    \"monthly\": {\n" + 
                "      \"terms\": {\n" + 
                "        \"field\": \"monthly_budget_range_code.keyword\",\"size\": 50,\"order\": {\"_term\": \"asc\"}\n " + 
                "      }\n" + 
                "    }\n";
    
  let query = "{\n"+
              "\"query\" : {\n" + 
              "    \"bool\": {\n" + 
              "      \"must\": [\n" + 
              match +
              "      ]\n" + 
              "    }\n" + 
              "  }, \n" + 
              "  \"aggs\" : {\n" + 
              aggs +
              "  },\n" +
              "\"from\": "+(this.currentPage-1)*this.size+",\n \"size\": "+this.size+"\n }";
    return query;
  }

  updateTest(){
    
    if(this.selectedMakes.length == 0){
      this.listMakes = this.getAggs(this.listVehicles.aggs.makes.buckets);
    }else{
      if( this.selectedModels.length == 0){
        this.listModels = this.getAggs(this.listVehicles.aggs.models.buckets);
      }
    }
    if(this.selectedCategories.length == 0){
      this.listCategories = this.getAggs(this.listVehicles.aggs.categories.buckets) 
    }
    if(this.selectedMonthlyPaiements.length == 0){
      this.listMonthlyPaiements = this.getAggs(this.listVehicles.aggs.monthly.buckets);
    }
  }

  // updateFilterResults(){
  //   if(this.selectedCategories.length == 0){
  //       if(this.selectedMakes.length == 0 && 
  //           this.selectedMonthlyPaiements.length == 0){
  //         //getAllVehicles
  //               this.listMakes = this.getAggs(this.listVehicles.aggs.makes.buckets);
  //               this.listMonthlyPaiements = this.getAggs(this.listVehicles.aggs.monthly.buckets);
  //               this.listCategories = this.getAggs(this.listVehicles.aggs.categories.buckets) 
  //       } else 
  //       if( this.selectedMakes.length > 0 && 
  //             this.selectedModels.length == 0 && 
  //               this.selectedMonthlyPaiements.length == 0)  {
  //         //getVehiclesByMake
  //               this.listModels = this.getAggs(this.listVehicles.aggs.models.buckets);
  //               this.listCategories = this.getAggs(this.listVehicles.aggs.categories.buckets)
  //               this.listMonthlyPaiements = this.getAggs(this.listVehicles.aggs.monthly.buckets);
  //       } else 
  //       if( this.selectedModels.length > 0 && 
  //             this.selectedMonthlyPaiements.length == 0  )  {
  //         //getVehiclesByMake_Model
  //               this.listMonthlyPaiements = this.getAggs(this.listVehicles.aggs.monthly.buckets);
  //               this.listCategories = this.getAggs(this.listVehicles.aggs.categories.buckets);
  //       } else 
  //       if(this.selectedMonthlyPaiements.length >0 && 
  //           this.selectedMakes.length == 0)  {
  //         //getVehiclesByMonthlyPaiements
  //               this.listMakes = this.getAggs(this.listVehicles.aggs.makes.buckets);
  //               this.listCategories = this.getAggs(this.listVehicles.aggs.categories.buckets);
  //       } else 
  //       if(this.selectedMakes.length > 0 && 
  //           this.selectedMonthlyPaiements.length > 0 && 
  //             this.selectedModels.length == 0)  {
  //         //getVehiclesByMake_MonthlyPaiements 
  //               this.listModels = this.getAggs(this.listVehicles.aggs.models.buckets); 
  //               this.listCategories = this.getAggs(this.listVehicles.aggs.categories.buckets);          
  //       } else 
  //       if(this.selectedMakes.length > 0 && 
  //           this.selectedMonthlyPaiements.length > 0 && 
  //             this.selectedModels.length > 0)  {
  //         //getVehiclesByMake_Model_MonthlyPaiements 
  //               this.listCategories = this.getAggs(this.listVehicles.aggs.categories.buckets);          
  //       }
  //   } else {
  //       if(this.selectedMakes.length == 0 && 
  //         this.selectedMonthlyPaiements.length == 0){
  //       //getVehiclesByCategory
  //             this.listMakes = this.getAggs(this.listVehicles.aggs.makes.buckets);
  //             this.listMonthlyPaiements = this.getAggs(this.listVehicles.aggs.monthly.buckets);
  //       } else 
  //       if( this.selectedMakes.length > 0 && 
  //             this.selectedModels.length == 0 && 
  //               this.selectedMonthlyPaiements.length == 0)  {
  //         //getVehiclesByMake_Category
  //               this.listModels = this.getAggs(this.listVehicles.aggs.models.buckets);
  //               this.listMonthlyPaiements = this.getAggs(this.listVehicles.aggs.monthly.buckets);
  //       } else 
  //       if( this.selectedModels.length > 0 && 
  //             this.selectedMonthlyPaiements.length == 0  )  {
  //         //getVehiclesByMake_Model_Category
  //               this.listMonthlyPaiements = this.getAggs(this.listVehicles.aggs.monthly.buckets);
  //       } else 
  //       if(this.selectedMonthlyPaiements.length >0 && 
  //           this.selectedMakes.length == 0)  {
  //         //getVehiclesByMonthlyPaiements_Category
  //               this.listMakes = this.getAggs(this.listVehicles.aggs.makes.buckets);
  //       } else 
  //       if(this.selectedMakes.length > 0 && 
  //           this.selectedMonthlyPaiements.length > 0 && 
  //             this.selectedModels.length == 0)  {
  //         //getVehiclesByMake_MonthlyPaiements_Category
  //               this.listModels = this.getAggs(this.listVehicles.aggs.models.buckets); 
  //               //this.listCategories = this.getAggs(this.listVehicles.aggs.categories.buckets);          
  //       }
  //   }
  // }

  getResults(){
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

  setArgs(obj){
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

}