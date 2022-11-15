import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-popup',
  templateUrl: './datepicker-popup.component.html',
  styleUrls: ['./datepicker-popup.component.scss']
})
export class DatepickerPopupComponent implements OnInit {
  model!: NgbDateStruct;
  @Output() dateSelected = new EventEmitter<string>();
  reportDate:string='';
  constructor(public cd: ChangeDetectorRef) { 
   
  }
  onChange(value:string){
    this.reportDate=value;
    this.dateSelected.emit(this.reportDate);
  }

  ngOnInit(): void {
  }

}
