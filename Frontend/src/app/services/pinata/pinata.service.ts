import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PinataResponse } from 'src/app/models/pinataResponse.model';
import { Observable } from 'rxjs';
import { Card } from 'src/app/models/card.model';

@Injectable({providedIn: 'root'})
export class PinataService {
    private api_url = environment.pinata_api_url;
    private gateway_url = environment.pinata_gateway_url;

    constructor(private httpClient: HttpClient) {

     }


     addFile(file:File): Observable<PinataResponse>{
        let formData = new FormData();
        formData.append('file', file);
        return this.httpClient.post<PinataResponse>(`${this.api_url}/pinning/pinFileToIPFS`,formData)
    }

     addJson(json): Observable<PinataResponse>{
        return this.httpClient.post<PinataResponse>(`${this.api_url}/pinning/pinJSONToIPFS`,json)
     }


     getCard(url:string):Observable<Card>{
      return this.httpClient.get<Card>(url);
   }



}
