import {Component} from '@angular/core';
import {SpinnerService} from '@shared/services/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
    <div class="overlay" *ngIf="isLoading$ | async">
      <div class="loadingio-spinner-ripple-1b0d4ard1l1"><div class="ldio-fi19irwkr6">
        <div></div><div></div>
      </div></div>
    </div>
  `,
  styleUrls: ['./spinner.component.scss'],
  providers: []
})
export class SpinnerComponent {
  isLoading$ = this.spinnerSvc.isLoading;

  constructor(private spinnerSvc: SpinnerService) {
  }

}
