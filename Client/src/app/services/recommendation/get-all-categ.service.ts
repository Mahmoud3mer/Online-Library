import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';  

@Injectable({
  providedIn: 'root'
})
export class GetAllCategService {
  private  apiUrl = `${apiUrl}/category`;  

  constructor(private httpClient: HttpClient) {}

  getCategories(): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl);
  }
}
