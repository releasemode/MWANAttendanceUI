import { Component, Input, OnInit, ɵɵsetComponentScope } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx'; 
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { UtilityService } from '../Shared/Utility.Service';
import { EmployeesInfoService } from '../Employees.Service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers:[UtilityService,EmployeesInfoService]
})
export class AdminComponent implements OnInit {
  attendances:any;
  fileName= 'attandance.xlsx';  
  @Input('principle') empName: string='';
  reportDate:string='';
  reportToDate:string='';
  isExportAllowed=false;
  ExportButtonDisabled=true;
  monthNumber=0;
  year=2022;
  reportFetching:boolean=false;
  authenticationUrl=environment.authenticationUrl;
  constructor(public http: HttpClient,
              private route: ActivatedRoute, 
              private msalService: MsalService,
              private router: Router,
              private empInfoService:EmployeesInfoService,
              private utilityService:UtilityService,
             ) { }
 
  ngOnInit(): void {
      this.route.params.subscribe(
        params=>this.empName =params['empName']
      );

      // if(this.empName!=null)
      //   this.loadAttendanceData();
  }

  async loadAttendanceData(){
    this.attendances=[];
    let reportParams = new HttpParams().set('createDate',this.reportDate).set('createToDate',this.reportToDate);
  
    if(this.msalService.instance.getActiveAccount() != null){
 
        if(this.msalService.instance.getActiveAccount()?.name === this.empName){
    if(this.empName=='Ahmed A. Anzari' || this.empName=='Ahmed M. AlFaryan' || this.empName=='Nada F. Almutairi' || this.empName =='Luluh K. Alsaawi'){
            
            this.isExportAllowed=true;
            if(this.reportDate!=''){
              this.reportFetching=true;
           
              let loginInfo:any =await this.http.post(environment.baseUrl + this.authenticationUrl,environment.userInfo) .toPromise();
             
              var headers = new HttpHeaders({ 'Authorization': 'Bearer ' + loginInfo.result.token });
              //this.attendances=await this.http.get(environment.baseUrl + "/api/employeeattendance?createDate="+this.reportDate,{ headers: headers }).toPromise();
              this.http.get(environment.baseUrl +"/api/employeeattendance",{params:reportParams,headers: headers},)
              .subscribe(
                (response)=>{
                  this.attendances=response;
                  this.ExportButtonDisabled=false;
                  this.reportFetching=false;
                  if(this.attendances.length==0){
                    alert('No data found');
                    this.ExportButtonDisabled=true;
                    this.reportFetching=false;
                  }

                },
                (error)=>{
                  alert('No data found');
                  this.reportFetching=false;
                  this.ExportButtonDisabled=true;
                }
              )
            }
           
          }else{
            this.router.navigate(["attendance"]);
            //alert("لا يسمح برؤية التقرير")
          }
    }else{
      this.router.navigate(["attendance"]);
    }
  }
    else{
      // let loginInfo:any =await this.http.post(environment.baseUrl + "/api/login/login-user",environment.userInfo) .toPromise();
    
      // var headers = new HttpHeaders({ 'Authorization': 'Bearer ' + loginInfo.result.token });
      // this.attendances = await this.http.get(environment.baseUrl + "/api/employeeattendance/Employee?name="+this.empName+"&createDate="+this.reportDate,{ headers: headers }).toPromise()
    }
      
  }

  getEmployeeManagerName(name:string){
    let empManager = this.empInfoService.getEmployeeManagerByName(name);
    return empManager;
  }

  async loadAttendanceDataByMonth(){
    this.attendances=[];
    if(this.monthNumber==1 || this.monthNumber==3 || this.monthNumber==5 || this.monthNumber==7 || this.monthNumber==8 || this.monthNumber==10 || this.monthNumber==12){
      this.reportDate=`${this.year}-${this.monthNumber}-01`
      this.reportToDate = `${this.year}-${this.monthNumber}-31`
    } else if(this.monthNumber == 2){
      this.reportDate=`${this.year}-${this.monthNumber}-01`
      this.reportToDate = `${this.year}-${this.monthNumber}-28`
    }else{
      this.reportDate=`${this.year}-${this.monthNumber}-01`
      this.reportToDate = `${this.year}-${this.monthNumber}-30`
    }
      
    let reportParams = new HttpParams().set('createDate',this.reportDate).set('createToDate',this.reportToDate);
    if(this.msalService.instance.getActiveAccount() != null){
 
        if(this.msalService.instance.getActiveAccount()?.name === this.empName){
    if(this.empName=='Ahmed A. Anzari' || this.empName=='Ahmed M. AlFaryan' || this.empName=='Nada F. Almutairi' || this.empName =='Luluh K. Alsaawi'){
            
            this.isExportAllowed=true;
            if(this.reportDate!=''){
              this.reportFetching=true;
              let loginInfo:any =await this.http.post(environment.baseUrl + this.authenticationUrl,environment.userInfo) .toPromise();
              var headers = new HttpHeaders({ 'Authorization': 'Bearer ' + loginInfo.result.token });
              //this.attendances=await this.http.get(environment.baseUrl + "/api/employeeattendance?createDate="+this.reportDate,{ headers: headers }).toPromise();
              this.http.get(environment.baseUrl +"/api/employeeattendance",{params:reportParams,headers: headers},)
              .subscribe(
                (response)=>{
                  this.attendances=response;
                  this.ExportButtonDisabled=false;
                  this.reportFetching=false;
                  if(this.attendances.length==0){
                    alert('No data found');
                    this.ExportButtonDisabled=true;
                    this.reportFetching=false;
                  }

                },
                (error)=>{
                  alert('No data found');
                  this.ExportButtonDisabled=true;
                  this.reportFetching=false;
                }
              )
            }
           
          }else{
            this.router.navigate(["attendance"]);
            //alert("لا يسمح برؤية التقرير")
          }
    }else{
      this.router.navigate(["attendance"]);
    }
  }
    else{
      // let loginInfo:any =await this.http.post(environment.baseUrl + "/api/login/login-user",environment.userInfo) .toPromise();
    
      // var headers = new HttpHeaders({ 'Authorization': 'Bearer ' + loginInfo.result.token });
      // this.attendances = await this.http.get(environment.baseUrl + "/api/employeeattendance/Employee?name="+this.empName+"&createDate="+this.reportDate,{ headers: headers }).toPromise()
    }
      
  }
  // async loginAPI(){
   
   
  //   return loginInfo.result.token;
  // }
  exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
    }
    onDateSelected(eventData:string){
       this.reportDate =eventData;
      
    }

    onToDateSelected(eventData:string){
       this.reportToDate =eventData;
    }
    calculateTotalHours(entryTime:Date,exitTime:Date){
      return this.utilityService.calculateTime(new Date(entryTime),new Date(exitTime));
    }
    

}
