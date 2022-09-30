import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx'; 
import { finalDate } from '../AttandanceModel';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  attendances:any;
  fileName= 'attandance.xlsx';  
  @Input('principle') empName: string='';
  reportDate:string='';
 
  constructor(public http: HttpClient) { }
 
  ngOnInit(): void {
      this.loadAttendanceData();
  }

 

  async loadAttendanceData(){
    let queryParams = new HttpParams().append("createDate",this.reportDate);
   this.attendances= await this.http.get(environment.baseUrl + "/api/employeeattendance?createDate="+this.reportDate).toPromise()
      
    console.log(this.attendances)
  }

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
      // console.log(eventData.selectedDate);
      this.reportDate =eventData;
      this.loadAttendanceData();
    }

}
