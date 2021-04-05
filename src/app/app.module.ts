import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GraphQLModule} from './graphql.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HeaderComponent} from '@shared/components/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import {SpinnerModule} from '@shared/components/spinner/spinner.module';
import {SpinnerInterceptor} from '@shared/interceptors/spinner.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
