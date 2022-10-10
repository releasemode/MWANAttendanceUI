import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  InteractionStatus,
  AuthenticationResult,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AttandanceModel, StatusModel } from '../AttandanceModel';
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
  attendanceStatus:any;
  empRegisteredEntry:boolean=false;
  empRegisteredExit:boolean=false;
  empRegisteredEarlyExit:boolean=false;
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
    let attendStatusRes = await this.http.get(environment.baseUrl + "/api/employeeattendance/AttendanceStatus?name="+this.empName+"&&createDate="+currentDate).toPromise()  
    console.log(attendStatusRes);
    if(attendStatusRes!=null){
      this.attendanceStatus = attendStatusRes?attendStatusRes:[];
      this.attendanceStatus.forEach((element: StatusModel) => {
        if(element.entryTime!=null) this.empRegisteredEntry = true;
        if(element.exitTime!=null) this.empRegisteredExit = true;
        if(element.earlyExitTime!=null) this.empRegisteredEarlyExit = true;
      })
    }
    
   
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
      console.log(this.msalService.instance.getActiveAccount());
      this.empName = this.msalService.instance
        .getActiveAccount()
        ?.name?.toString();
      this.empDepartment = this.empInfoService.getEmployeeInfoByName(
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
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.allowedDevice = true;
    } else {
      this.allowedDevice = true; //make it false before production
    }
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
      let res = await this.http
        .post(environment.baseUrl + '/api/employeeattendance', attendanceModel)
        .toPromise();

      // let users=await this.http.get("http://localhost:4000/api/v1/account/users").toPromise()
      // console.log(res)
      this.form.reset({});
      this.submitting = true;
      if (attendanceType == 'لدخول' || attendanceType=='الخروج') {
        alert('تم تسجيل الحضور بنجاح');
      }else{
        alert('تم تسجيل استئذان خروج مبكر')
      }
   
      this.submitting=false;
      this.setButtonDisplay();
    } catch (err) {
      console.log(err);
      alert('خطأ في النظام');
    }
  }
}
