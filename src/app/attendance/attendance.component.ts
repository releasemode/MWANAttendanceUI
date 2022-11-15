import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, JsonpInterceptor } from '@angular/common/http';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  InteractionStatus,
  AuthenticationResult,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AttandanceModel, CreateAttendanceResponse, StatusModel } from '../AttandanceModel';
import { apilogin } from './apilogin.model';
import { EmployeesInfoService } from '../Employees.Service';
import { UtilityService } from '../Shared/Utility.Service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  providers: [EmployeesInfoService, UtilityService],
})
export class AttendanceComponent implements OnInit {
  title = 'location-form';
  distance: any = null;
  form: any = null;
  submitting = false;
  locationAccess = true;
  loading = false;
  allowedRadius = environment.radius;
  allowedDevice = true;
  loginLinkText: string = 'Logout';
  empName: string | undefined = '';
  homeAccountId: string | undefined = '';
  empAttendanceLat: string = '';
  empAttendanceLong: string = '';
  empDepartment: string = '';
  isEntryAllowed: boolean = false;
  attendanceStatus:StatusModel[]=[];
  attendanceStatusDiv=false;
  empRegisteredEntry:boolean=false;
  empRegisteredExit:boolean=false;
  empRegisteredEarlyExit:boolean=false;
  PermissionClicked=false;
  authenticationUrl=environment.authenticationUrl;
 
  private readonly _destroying$ = new Subject<void>();



  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private empInfoService: EmployeesInfoService,
    private utilityService: UtilityService
  ) {
   


    this.getLocation();
    if(environment.checkBrowser == false)
      this.setAllowedDevice();

    if (!this.isUserLoggedIn()) {
      this.loginLinkText = 'Login';
    }
  
  }

  ngOnInit() {
    this.setButtonDisplay();
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });


      
  }

  async setButtonDisplay(){
    let currentDate= this.utilityService.formatDate(new Date());
    let loginInfo:any =await this.http.post(environment.baseUrl + this.authenticationUrl,environment.userInfo) .toPromise();
    var headers = new HttpHeaders({ 'Authorization': 'Bearer ' + loginInfo.result.token });
    this.http.get<StatusModel[]>(environment.baseUrl + "/api/employeeattendance/AttendanceStatus?name="+this.empName+"&&createDate="+currentDate,{ headers: headers })
            .subscribe(
              (response)=>{
                
                this.attendanceStatus=response;
                
              },
              (error)=>this.attendanceStatusDiv=false,
              ()=>{
              
                if(this.attendanceStatus!=null){
                  
                  this.attendanceStatusDiv=true;
                  this.attendanceStatus.forEach((element: StatusModel) => {
                    if(element.entryTime!=null) this.empRegisteredEntry = true;
                    if(element.exitTime!=null) this.empRegisteredExit = true;
                    if(element.earlyExitTime!=null) this.empRegisteredEarlyExit = true;
                })
              }
              }
            )
   
    
   
  }

  setLoginDisplay() {
    // console.log(this.msalService.instance.getAllAccounts().length);
    // console.log(this.msalService.instance.getAllAccounts());

    if (this.msalService.instance.getAllAccounts().length > 0) {
      this.msalService.instance.setActiveAccount(
        this.msalService.instance.getAllAccounts()[0]
      );
    }
  }

  login() {
    //this.msalService.instance.setActiveAccount(null);
    // this.msalService.instance.handleRedirectPromise().then((response)=>{
    //   console.log('handleredirectpromise');
    //   console.log(response);
    // });

    this.msalService.loginRedirect();

    // this.msalService.loginPopup().subscribe((response:AuthenticationResult)=>{
    //     this.msalService.instance.setActiveAccount(response.account);
    //     console.log(response);
    //     this.homeAccountId = response.account?.homeAccountId.toString();
    // })
  }
  logout() {
    // // you can select which account application should sign out
    this.homeAccountId =
      this.msalService.instance.getActiveAccount()?.homeAccountId;
    const logoutRequest = {
      account: this.homeAccountId,
    };

    this.msalService.logoutRedirect({
      account: this.msalService.instance.getActiveAccount(),
      postLogoutRedirectUri: environment.postLogoutRedirectUri,
    });

    //myMsal.logoutRedirect(logoutRequest);
  }
  isUserLoggedIn(): boolean {
    if (this.msalService.instance.getActiveAccount() != null) {
     // console.log(this.msalService.instance.getActiveAccount());
      this.empName = this.msalService.instance
        .getActiveAccount()
        ?.name?.toString();
      this.empDepartment= this.empInfoService.getEmployeeInfoByName(
        this.empName ? this.empName : ''
      );
    
      return true;
    }
    return false;
  }

  isAllowedEntry(): boolean {
    return this.utilityService.isAllowedEntry();
  }

  setAllowedDevice() {
    // if (
    //   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    //     navigator.userAgent
    //   )
    // ) {
      
    //   this.allowedDevice = true;
    // } else {
    //   this.allowedDevice = false; //make it false before production
    // }
    this.allowedDevice = true;
  }
  getLocation() {
    this.form = this.fb.group({
      name: [this.empName, [Validators.required]],
      emp_code: ['', [Validators.required]],
      contract_type: ['', [Validators.required]],
      department: ['', [Validators.required]],
      registration_type: ['', [Validators.required]],
      status: [true],
    });
    if (navigator.geolocation) {
      this.loading = true;
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          this.locationAccess = true;
          if (position) {
            this.empAttendanceLat = position.coords.latitude;
            this.empAttendanceLong = position.coords.longitude;
            console.log(
              'Latitude: ' +
                position.coords.latitude +
                'Longitude: ' +
                position.coords.longitude
            );
            this.distance = this.calcCrow(
              position.coords.latitude,
              position.coords.longitude,
              environment.centre.lat,
              environment.centre.lng
            ).toFixed(1);
            console.log(this.distance);
          }
          this.loading = false;
        },
        (error: any) => {
          this.locationAccess = false;
          this.loading = false;
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  calcCrow(lat1: any, lon1: any, lat2: any, lon2: any) {
    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    lat1 = this.toRad(lat1);
    lat2 = this.toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  toRad(Value: any) {
    return (Value * Math.PI) / 180;
  }

  async submitForm(attendanceType: string) {
    this.submitting = true;
    
    var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1);
  
    this.getLocation();
    if(this.distance>environment.radius){
      alert("يرجى التأكد من وجودك في الموقع أو تحديث الصفحة.");
      return;
    }
    try {
      let attendanceModel: AttandanceModel = {
        Name: this.empName,
        EmployeeCode: '',
        Department: this.empDepartment,
        RegistrationType: attendanceType,
        ContractType: '',
        Latitude: this.empAttendanceLat.toString(),
        longitude: this.empAttendanceLong.toString(),
        CreateDateTime: localISOTime,
      };

      let apiModel: apilogin = {
        username: 'aAQWEEEESSSTT@0987654321',
      };

      

      // let tokenResponse = await this.http.post(environment.baseUrl+"/api/login/userlogin",apiModel).toPromise();

      let loginInfo:any =await this.http.post(environment.baseUrl +this.authenticationUrl,environment.userInfo) .toPromise();
      var headers = new HttpHeaders({ 'Authorization': 'Bearer ' + loginInfo.result.token });
    
      this.http
        .post<CreateAttendanceResponse>(environment.baseUrl + '/api/employeeattendance', attendanceModel,{headers:headers})
        .subscribe(
          (response:CreateAttendanceResponse)=>{
            this.submitting=false;
             alert(response.str);
          },
          (error:HttpErrorResponse)=>{
            console.log(error);
            alert(error.error)
            this.submitting=false;
          },
          ()=>this.setButtonDisplay()
        );

      this.form.reset({});
      this.submitting = true;
     
    } catch (err) {
      console.log(err);
      alert('خطأ في النظام');
    }
  }
}
