import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class PinataHttpInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.url.indexOf(environment.pinata_api_url) > -1 || req.url.indexOf(environment.pinata_gateway_url)){
        const headers = req.headers
            .set('Authorization', `Bearer ${environment.pinata_jwt}`);
        req = req.clone({ headers });
        }
        return next.handle(req);
    }
}