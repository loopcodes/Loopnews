import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class NewsService {
  api_key="ef684a00237e40cab90dfee17f341ff2";
  constructor(private https : HttpClient) { }


  initSources(){
    return this.https.get('https://newsapi.org/v2/sources?language=en&apiKey=' + this.api_key)
  }
  getArticlesByid(source : string){
    return this.https.get('https://newsapi.org/v2/top-headlines?sources=' + source + '&apiKey=' + this.api_key)
  }
  initArticles(){
    return this.https.get('https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=' + this.api_key)
  }
}
