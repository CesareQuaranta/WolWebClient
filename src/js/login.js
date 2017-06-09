define(['handlebars'],function (Handlebars) {
	function internalSubmit(e){
		 e.preventDefault();
		 $.ajax({
			  type: 'POST',
			  url: '//power4.wol.net:3001/login',
			  data: $("form").serialize(), 
			  //or your custom data either as object {foo: "bar", ...} or foo=bar&...
			  success: function(response) {
				  console.log('Response:'+JSON.stringify(response));
				  wol.Cookies.set('token', response.Token, { expires: 30 });
				  wol.Cookies.set('accessPoint', response.accessPoint, { expires: 30 });
				  wol.init(response.accessPoint,response.Token);
				  $('#mainModal').modal('hide');
			  }
			});
		return false;
	}
    return {
        showModal: function () {
    	   $.get('/templates/login.hbs', function (data) {
    		    var template=Handlebars.compile(data);
    		    $('#mainModal').html(template());
    		    $('#mainModal').addClass( "modal fade" );
    		    $('#mainModal').find('form').submit(internalSubmit);
    		    $('#mainModal').modal({
    		          keyboard: false,
    		          backdrop: 'static',
    		          show: true
    		      });
    		    
    		}, 'html');
        }
    };
});