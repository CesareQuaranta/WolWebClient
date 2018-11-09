module.exports = function(grunt, options) {
	return {
		sourcesense : {
		    src : [options.pathTests + 'TestInit.js'],
		    options : {
		        keepRunner : true,
		        host : 'http://127.0.0.1:8886/',
		        specs : [ options.pathTests + 'spec.js' ],
		        template : require('grunt-template-jasmine-requirejs'),
		        templateOptions : {
			        requireConfigFile : [
                        options.pathSources + "/js/configRequire.js"
                    ],
                    requireConfig: {
                        baseUrl:"../../"
                    }
		        },
		        outfile : options.pathTmp + 'jasmine/SpecRunner.html',
		        junit : {
			        path : options.pathTmp + 'junit/'
		        }
		    }
		}
	};
};