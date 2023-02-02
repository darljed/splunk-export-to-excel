require([
  'jquery',
  'splunkjs/mvc/simplexml/ready!'
], function($) {
    $(document).ready(function(){
        $(document).on('click',"#openmodal",function(){
            $("#scriptinfo").modal('show');
        })
        $(document).on('click',"#modalclose",function(){
            $("#scriptinfo").modal('hide');
        })
        
    })
});