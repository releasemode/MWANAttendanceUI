export class UtilityService {
   isAllowedEntry(){
    var dt = new Date();//current Date that gives us current Time also
    console.log('dt',dt);
    var startTime = '14:00:00';
    var endTime = '15:27:00';
    
    var s =  startTime.split(':');
    var dt1 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(),
                       parseInt(s[0]), parseInt(s[1]), parseInt(s[2]));
    
    var e =  endTime.split(':');
    var dt2 = new Date(dt.getFullYear(), dt.getMonth(),
                       dt.getDate(),parseInt(e[0]), parseInt(e[1]), parseInt(e[2]));
    console.log("isAllowedEntry",dt >= dt1 && dt <= dt2);
    return (dt >= dt1 && dt <= dt2) ? true : false;
                                      
   };
   getLocalDate(){
    var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1);
      return localISOTime;
   };

   formatDate(date:any) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-');
  };
  padTo2Digits(num:number) {
    return num.toString().padStart(2, '0');
  }
  calculateTime(entryTime:any,exitTime:any) {
    if(new Date(exitTime).getFullYear()>2021 && new Date(entryTime).getFullYear()>2021){
      var seconds = Math.floor((exitTime - (entryTime))/1000);
      var minutes = Math.floor(seconds/60);
      var hours = Math.floor(minutes/60);
      var days = Math.floor(hours/24);
      hours = hours-(days*24);
      minutes = minutes-(days*24*60)-(hours*60);
      seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
      
      return hours+':'+minutes+':'+seconds;
     } else{
      return 0;
     }
    
  }
}