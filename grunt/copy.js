module.exports = function(grunt, options) {
	return {
	   
	    sources : {
	        options : {
		        mode : "0775"
	        },
	        files : [
			{
			    src : options.pathSources + "index.html",
			    dest : options.pathDist + "index.html"
			},
	        {
	            cwd : options.pathSources+"/js",
	            src : '**/*', // copy all files and subfolders
	            dest : options.pathDist+"js/", // destination folder
	            expand : true
	        }]
	    },
	    libs : {
	        options : {
		        mode : "0775"
	        },
	        files : [
	        {
	            cwd : options.pathLibs ,
	            src : '**/*',
	            dest : options.pathDist + "lib/",
	            expand : true
	        }
	        ]
	    },
	    grafica : {
	        options : {
		        mode : "0775"
	        },
	        files : [
	        //Immagini
	        {
	            cwd : options.pagthImmages,
	            src : [ '*.*' ],
	            dest : options.pathDist + "/img/",
	            expand : true,
	            flatten : true,
	            filter : 'isFile'
	        },
	        //Favicon
	        {
	            cwd : options.pathSources,
	            src : "*.ico",
	            dest : options.pathDist ,
	            expand : true,
	            flatten : true,
	            filter : 'isFile'
	        },
	        //Css
	        {
	            cwd : options.pathSources+"/css",
	            src :  '*.css' ,
	            dest : options.pathDist + "/css/",
	            expand : true,
	            flatten : true,
	            filter : 'isFile'
	        },
	      //Handlebars Template
	        {
	            cwd : options.pathSources+"/templates",
	            src :  '*.hbs' ,
	            dest : options.pathDist + "/templates/",
	            expand : true,
	            flatten : true,
	            filter : 'isFile'
	        }
	        ]
	    }
	};
};