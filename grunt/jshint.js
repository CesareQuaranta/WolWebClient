module.exports = function(grunt, options) {
	return {
	    grunt : {
	        files : {
		        src : [ 'Gruntfile.js', 'grunt/**' ]
	        },
	        options : {
		        globals : {
		            module : true,
		            curly : true,
		            esversion : 5,
		            forin : true,
		            freeze : true,
		            futurehostile : true,
		            latedef : true,
		            maxcomplexity : 7,
		            nonew : true,
		            shadow : "outer",
		            singleGroups : true,
		            strict : true,
		            undef : true,
		            unused : true
		        }
	        }
	    },
	    sources : {
	        files : {
		        src : [ options.pathSources + 'js/*.js' ]
	        },
	        //TODO Ignore templates
	        options : {
		        globals : {
		            jQuery : true,
		            console : false,
		            module : true,
		            document : true,
		            curly : true,
		            esversion : 5,
		            forin : true,
		            freeze : true,
		            futurehostile : true,
		            latedef : true,
		            maxcomplexity : 7,
		            nonew : true,
		            shadow : "outer",
		            singleGroups : true,
		            strict : true,
		            undef : true,
		            unused : true
		        }
	        }
	    }
	};
};