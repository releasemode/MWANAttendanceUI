export interface AttandanceModel{
        Name:any;
        EmployeeCode:String;
        Department:String;
        RegistrationType:String;
        ContractType:String;
        Latitude:String;
        longitude:String;
        CreateDateTime:String;

};

export interface StatusModel{
        name:string;
        department:string;
        entryTime:string;
        exitTime:string;
        earlyEntryTime:string;
        earlyExitTime:string;
};

export interface CreateAttendanceResponse {
        str: string;
};

export interface finalDate{
        year:Number,
        month:Number,
        day:Number
      };