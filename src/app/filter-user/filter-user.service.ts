import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilterUserService {

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



  dynamicQuery(searchMake, searchModel, searchMonthly){
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

    // if(searchCategory != ""){
    //   if (match !=""){
    //     match += ",";
    //   }
    //   match +=  "        {\n" + 
    //             "          \"match\": {\n" + 
    //             "            \"vehicle_segment_code\": \""+searchCategory+"\"\n" + 
    //             "          }\n" + 
    //             "        }\n";
    // }

    if(searchMake == "" && searchModel == "" && searchMonthly == ""){
      match   = "        {\n" + 
                "          \"match_all\": {}\n" + 
                "        }\n";
    }

  let aggs =    "    \"colors\": {\n" + 
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
              "\"from\": 0,\n \"size\": 30\n }";
    return query;
  }
}