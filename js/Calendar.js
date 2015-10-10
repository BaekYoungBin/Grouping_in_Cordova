
      $(document).one('pageshow','#tab_schedule',function(e,data){    
         var date = new Date();
         var d = date.getDate();
         var m = date.getMonth();
         var y = date.getFullYear();   
         $('#calendar').fullCalendar({
            editable: true,
            startEditable: true,
            durationEditable: true,
            resizable: true,
            //disableDragging: true,      
            events: function(start, end, callback) {
               $.ajax({
                  url: 'http://54.65.71.36:8080/Calendar_Getdata',
                  dataType: 'json',
                  type : 'POST',
                  data: {
                     'Project_Id' : localStorage.getItem('Project_Id')
                  },
                  success: function(data, text, request) {
                     var dataform = JSON.stringify(data);                
                     var temp = JSON.parse(dataform);
                     count = temp.length;                 
                     console.log(count);
                     console.log(data[0].Work_Name);
                     console.log(data[0].Work_Sday);
                     var events=[];
                     var jsontext = new Array();                                        
                     for(var i = 0; i< count; i++){                            
                        var Dday = (data[i].Work_Dday).split('-');
                        var Sday = (data[i].Work_Sday).split('-');
                        events.push({
                           workid : data[i]._id,
                           title : data[i].Work_Name,
                           start : new Date(Sday[0], Sday[1]-1, Sday[2]),
                           end : new Date(Dday[0], Dday[1]-1, Dday[2])                        
                        });                     
                     }       
                     console.log(events);                                   
                     callback(events);
                  }
               });
},
eventDrop: function(event){
   var start = event.start;
    var end = event.end || start;
   /*console.log(event.title); 
   console.log(event.workid);  
   console.log(event.start);
   console.log(event.end);*/
   var sy = start.getUTCFullYear();
   var sm = start.getUTCMonth() + 1;
   var sd = start.getUTCDate()+1;
   var dy = end.getUTCFullYear();
   var dm = end.getUTCMonth() + 1;
   var dd = end.getUTCDate()+1;               
   var Sday = sy+'-'+sm+'-'+sd;
   var Dday = dy+'-'+dm+'-'+dd;

   $.ajax({
      url: 'http://54.65.71.36:8080/Calendar_Modify',
      dataType: 'json',
      type : 'POST',
      data: {          
         'Work_Id' : event.workid,
         'Work_Sday':Sday,
         'Work_Dday':Dday 
      },
      success: function(result) {
         console.log('업데이트 완료')
      }
   }); 

},
eventResize:function(event){
   console.log(event.title); 
   console.log(event.workid);  
   var sy = event.start.getUTCFullYear();
   var sm = event.start.getUTCMonth() + 1;
   var sd = event.start.getUTCDate()+1;
   var dy = event.end.getUTCFullYear();
   var dm = event.end.getUTCMonth() + 1;
   var dd = event.end.getUTCDate()+1;               
   var Sday = sy+'-'+sm+'-'+sd;
   var Dday = dy+'-'+dm+'-'+dd;

   $.ajax({
      url: 'http://54.65.71.36:8080/Calendar_Modify',
      dataType: 'json',
      type : 'POST',
      data: {          
         'Work_Id' : event.workid,
         'Work_Sday':Sday,
         'Work_Dday':Dday 
      },
      success: function(result) {
         console.log('업데이트 완료')
      }
   }); 

}



});
});