import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
    return this.http
      .post(`${environment.restUrl}${this.imageDetection.path}`, query, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError((err) => {
          throw err;
        }),
        tap((events: any) => {
          if (events.status === 200 && events.body) {
            // this.loading.next({ status: false });
            // const output: any = { id, result: events.body };
            // this.store.dispatch(new GetImageDetectionResult(output));
            return events.body;
          }
        })
      );
  }
}
