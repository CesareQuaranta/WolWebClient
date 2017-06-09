requirejs.config({
    baseUrl: 'js',
    paths: {
    	jquery : 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min',
    	bootstrap : 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min',
    	handlebars : 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.min',
   
        app: 'app',
        parallasse :'parallasse'
    },
    shim : {
    	parallasse:{
    		deps:['jquery']
    	},
    	app:{
    		deps:['parallasse','jquery']
    	}
    }
});
//Start loading the main app file. Put all of
//your application logic in there.
requirejs(['app']);