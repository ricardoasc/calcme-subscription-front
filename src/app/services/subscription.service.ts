import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private _apiUrl: string = 'http://localhost:8080/api/subscription';

  constructor(private _httpClient: HttpClient) { }

  public createSubscription(data: any): Observable<Object> {
    return this._httpClient.post(this._apiUrl, data);
  }

}
