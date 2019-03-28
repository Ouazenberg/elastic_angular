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
  selectedEnergies = [];
  selectedTransmissions = [];
  selectedMonthlyPaiements = [];
  
  searchMake = "";
  searchModel = "";
  searchCategory = "";
  searchEnergy = "";
  searchTransimission = "";
  searchMonthlyPaiements = "";
  
  listMakes: any;
  listModels = [];
  listCategories: any;
  listEnergies: any;
  listTransmissions: any;
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

  dynamicQuery(searchMake, searchModel, searchMonthly, searchCategory, searchEnergy, searchTransimission){
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
    if(searchEnergy != ""){
      if (match !=""){
        match += ",";
      }
      match +=  "        {\n" + 
                "          \"match\": {\n" + 
                "            \"vehicle_energy_type_code\": \""+searchEnergy+"\"\n" + 
                "          }\n" + 
                "        }\n";
    }
    if(searchTransimission != ""){
      if (match !=""){
        match += ",";
      }
      match +=  "        {\n" + 
                "          \"match\": {\n" + 
                "            \"vehicle_transmission_type_code\": \""+searchTransimission+"\"\n" + 
                "          }\n" + 
                "        }\n";
    }
    let aggs =  "    \"makes\": {\n" + 
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
                "    \"energies\": {\n" + 
                "      \"terms\": {\n" + 
                "        \"field\": \"vehicle_energy_type_code.keyword\",\"size\": 50,\"order\": {\"_term\": \"asc\"}\n" + 
                "      }\n" + 
                "    },\n" +
                "    \"transmissions\": {\n" + 
                "      \"terms\": {\n" + 
                "        \"field\": \"vehicle_transmission_type_code.keyword\",\"size\": 50,\"order\": {\"_term\": \"asc\"}\n" + 
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


  getVehicles(query){    
    return this.httpVehicles(query)
              .forEach(data=>{
              let resJSON = JSON.parse(JSON.stringify(data));
              this.listVehicles = resJSON;
              this.nbrResults = resJSON.totalHits;
              this.updateFilterResults();
              this.totalPages = Math.ceil(resJSON.totalHits/this.size);
              this.pages = new Array(this.totalPages);
            });
    }

  updateFilterResults(){
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
    if(this.selectedEnergies.length == 0){
      this.listEnergies = this.getAggs(this.listVehicles.aggs.energies.buckets) 
    }
    if(this.selectedTransmissions.length == 0){
      this.listTransmissions = this.getAggs(this.listVehicles.aggs.transmissions.buckets);
    }
    if(this.selectedMonthlyPaiements.length == 0){
      this.listMonthlyPaiements = this.getAggs(this.listVehicles.aggs.monthly.buckets);
    }
  }

  getResults(){
    let obj = {
      nbrResults: this.nbrResults,
      listVehicles: this.listVehicles,

      selectedMakes: this.selectedMakes,
      selectedModels: this.selectedModels,
      selectedCategories: this.selectedCategories,
      selectedEnergies: this.selectedEnergies,
      selectedTransmissions: this.selectedTransmissions,
      selectedMonthlyPaiements: this.selectedMonthlyPaiements,
      
      searchMake: this.searchMake,
      searchModel: this.searchModel,
      searchCategory: this.searchCategory,
      searchEnergy: this.searchEnergy,
      searchTransimission: this.searchTransimission,
      searchMonthlyPaiements: this.searchMonthlyPaiements,
      
      listMakes: this.listMakes,
      listModels: this.listModels,
      listCategories: this.listCategories,
      listEnergies: this.listEnergies,
      listTransmissions: this.listTransmissions,
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
    this.selectedEnergies = obj.selectedEnergies,
    this.selectedTransmissions = obj.selectedTransmissions,
    this.selectedMonthlyPaiements = obj.selectedMonthlyPaiements,
    
    this.searchMake = obj.searchMake,
    this.searchModel = obj.searchModel,
    this.searchCategory = obj.searchCategory,
    this.searchEnergy = obj.searchEnergy,
    this.searchTransimission = obj.searchTransimission,
    this.searchMonthlyPaiements = obj.searchMonthlyPaiements,
    
    this.listMakes = obj.listMakes,
    this.listModels = obj.listModels,
    this.listCategories = obj.listCategories,
    this.listEnergies = obj.listEnergies,
    this.listTransmissions = obj.listTransmissions,
    this.listMonthlyPaiements = obj.listMonthlyPaiements,

    this.currentPage = obj.currentPage,
    this.size = obj.size,
    this.pages = obj.pages,
    this.totalPages = obj.totalPages
  }

}