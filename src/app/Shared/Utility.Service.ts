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
                                      
   } 
}