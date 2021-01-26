import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ObjectDetectionService {
  imageDetection: any = {
    path: '/object-detection/',
  };

  constructor(private http: HttpClient) {}

  getImageDetectionOutput(query): Observable<any> {
    return this.http.post(`${environment.restUrl}${this.imageDetection.path}`, query).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }
}
