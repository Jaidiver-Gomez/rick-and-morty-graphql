import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {SpinnerService} from '@shared/services/spinner.service';
import {ToastrService} from 'ngx-toastr';


@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(
    private spinnerSvc: SpinnerService,
    private toastrSvc: ToastrService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerSvc.show();
    return next.handle(req).pipe(
      tap(
        () => {
        },
        err => {
          this.toastrSvc.error(`Error saving favorites from local storage ${err}`, 'RickAndMortyApp');
        },
        () => {
          this.spinnerSvc.hide();
        }
      )
    );
  }


}
