import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MsalModule, MsalService, MSAL_INSTANCE,MsalRedirectComponent } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { environment } from "src/environments/environment";
import { AdminComponent } from './admin/admin.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { DatepickerPopupComponent } from './Shared/datepicker-popup/datepicker-popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoRightClickDirective } from './Shared/no-right-click.directive';
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId:  environment.uiClienId,
      authority: environment.authority, 
      redirectUri: environment.redirectUrl,
      postLogoutRedirectUri: environment.postLogoutRedirectUri, 
      navigateToLoginRequestUrl:true

    }
  });
}
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AttendanceComponent,
    DatepickerPopupComponent,
    NoRightClickDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MsalModule,
    NgbModule 
  ],
  providers: [{
    provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
  },
  MsalService
 ],
  bootstrap: [AppComponent,MsalRedirectComponent]
})
export class AppModule { }
