import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../util/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class AllStreamEventService {

  constructor(private _httpClient: HttpClient) { }



  getAllOldStreams(
    page: number,
    limit: number,
    streamTitle: string
  ): Observable<any> {
    let params = new HttpParams()

      .set('page', page)
      .set('limit', limit);

    if (streamTitle) {
      params = params.set('streamTitle', streamTitle);
    }
    return this._httpClient.get(`${apiUrl}/stream-events`, { params })
  }


}
