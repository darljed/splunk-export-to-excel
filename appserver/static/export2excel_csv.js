require([
  'underscore',
  'jquery',
  'splunkjs/mvc',
  'splunkjs/mvc/tableview',
  '/static/app/export_excel_csv/src/jszip.js',
  '/static/app/export_excel_csv/src/FileSaver.js',
  '/static/app/export_excel_csv/src/Blob.js',
  '/static/app/export_excel_csv/src/xlsx.core.min.js',
  'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {
 console.log("Extractor is ready and onboard.");
 
 
 
 
 
 $("#export2Excel").click(function(){
   console.log("Exporting to excel");
   //Just change ID here
   exporter("datasource");
 
 })

 $("#export2CSV").click(function(){
   console.log("Exporting to CSV");
   //Just change ID here
   exporter_csv("datasource");
 
 })
 
 function currentDate(){
   Date.prototype.today = function () { 
       return ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ this.getFullYear();
   }
   
   // For the time now
   Date.prototype.timeNow = function () {
        return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
   }
   var newDate = new Date();
   var datetime =  newDate.today() +" "+ newDate.timeNow();
   return datetime
 }
 
 
 function toExcel(arrayTable,filename){
   filename=filename+".xlsx";
   
   var ws = {};
   var range=range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
   var n=4,m=4;
   for(var R = 0; R != arrayTable.length; ++R) {
       for(var C = 0; C != arrayTable[R].length; ++C) {
           if(range.s.r > R) range.s.r = R;
           if(range.s.c > C) range.s.c = C;
           if(range.e.r < R) range.e.r = R;
           if(range.e.c < C) range.e.c = C;
           var cell = {v: arrayTable[R][C] };
           if(cell.v == null) continue;
           var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
           
           if(R == 0){ 
           // Row 1
             cell.s={
                 font:{ bold:true},
                 fill:{ fgColor:{ rgb: "c2d1e0" } }
             }
           }
           ws[cell_ref] = cell;
       }
   }
   m+=1

   ws['!ref'] = XLSX.utils.encode_range(range);
   var ws_name = "Sheet 1";
    
   var wb = new Workbook();//ws = sheet_from_array_of_arrays();
    
   /* add worksheet to workbook */
   wb.SheetNames.push(ws_name);
   wb.Sheets[ws_name] = ws;
   var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

   saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), filename);
 }
 
 function exporter(searchid){
   var mainArr2;
   var runCount=0;
   var search2=mvc.Components.getInstance(searchid);
   var search2Result=search2.data("results", {count:0});
   
   var search2ArrTitle,search2ArrBody;
   search2Result.on("data",function(){
     search2ArrTitle=search2Result.data().fields;
     search2ArrBody=search2Result.data().rows;
     
     search2ArrBody.splice(0,0,search2ArrTitle); // combine the header and body
     
     var search3ArrTitle,search3ArrBody;
 
      //  mainArr=search2ArrBody;
       console.log(search2ArrBody);
      //  console.log(mainArr);
       
       //set filename here
       if(runCount==0){
          var filename="Extract-"+currentDate(); 
          toExcel(search2ArrBody,filename);
          runCount++;
       }
      
       
       

   })

 
 }
 
 function Workbook() {
     if(!(this instanceof Workbook)) return new Workbook();
     this.SheetNames = [];
     this.Sheets = {};
 }
  

 function s2ab(s) {
     var buf = new ArrayBuffer(s.length);
     var view = new Uint8Array(buf);
     for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
     return buf;
 }





//  for extract to CSV 

 function exporter_csv(searchid){
  var mainArr2;
  var runCount=0;
  var search2=mvc.Components.getInstance(searchid);
  var search2Result=search2.data("results", {count:0});
  
  var search2ArrTitle,search2ArrBody;
  search2Result.on("data",function(){
    search2ArrTitle=search2Result.data().fields;
    search2ArrBody=search2Result.data().rows;

    // add newline for each row
    for(var x=0;x<search2ArrBody.length;x++){
      search2ArrBody[x][0]="\n"+search2ArrBody[x][0]
    }
    
    search2ArrBody.splice(0,0,search2ArrTitle); // combine the header and body
    
    var search3ArrTitle,search3ArrBody;

      console.log(search2ArrBody);
      // console.log(mainArr);
      
      //set filename here
      if(runCount==0){
        var filename="Extract-"+currentDate()+".csv"; 
        download(filename,search2ArrBody.toString());
        runCount++;
      }
      

  })

}

 function download(filename, text) {
     var element = document.createElement('a');
     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
     element.setAttribute('download', filename);

     element.style.display = 'none';
     document.body.appendChild(element);

     element.click();

     document.body.removeChild(element);
 }
});