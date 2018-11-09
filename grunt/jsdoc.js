module.exports = function(grunt, options) {
	return {
		all : {
		    src : [ options.pathDist + "app/js/pluslib.js", options.sourcesenseRoot + "src/jsdoc.md", options.sourcesenseLib + "workspace/js/libs/**/*.jsdoc", 'README.md' ],
		    options : {
		        destination : options.pathDoc,
		        template : 'node_modules/minami',
		        configure : 'jsdoc-conf.json'
		    }
		}
	};
};