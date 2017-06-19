requirejs.config({
    baseUrl: 'js',
    paths: {
    	jquery : 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min',
    	bootstrap : 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min',
    	handlebars : 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.min',
    	'js-cookie' : '/lib/js.cookie',
    	three : '/lib/three',
    	stats : '/lib/stats',
    	gui : '/lib/dat.gui',
        app: 'app',
        login :'login',
        detector : 'WebGL-Detector',
    },
    shim : {
    	firstPersonControls:{
    		deps:['three']
    	},
    	trackballControls:{
    		deps:['three']
    	},
    	parallasse:{
    		deps:['jquery']
    	},
    	login:{
    		deps:['bootstrap','handlebars']
    	},
    	app:{
    		deps:['jquery','js-cookie']
    	}
    }
});
//Start loading the main app file. Put all of
//your application logic in there.
requirejs(['app']);