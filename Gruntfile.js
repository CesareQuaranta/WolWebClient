/*global require*/
module.exports = function(grunt) {
	var path = require('path');
	var pathDist = 'dist/';
	var timer = require('grunt-timer');
	timer.init(grunt);

	require('load-grunt-config')(grunt, {
	    // path to task.js files, defaults to grunt dir
	    configPath : path.join(process.cwd(), 'grunt'),

	    // auto grunt.initConfig
	    init : true,

	    // data passed into config.  Can use with <%= test %>
	    data : {
	        //Paths
	        pagthImmages : 'img/',
	        pathDist : pathDist,
	        pathDoc : pathDist + 'doc/',
	        pathLibs : 'lib/',
	        pathSources : 'src/',
	        pathTests : 'test/',
	        readme : 'README.md',
	        debug : true
	    },

	    // use different function to merge config files
	    mergeFunction : require('recursive-merge'),

	    // can optionally pass options to load-grunt-tasks.
	    // If you set to false, it will disable auto loading tasks.
	    loadGruntTasks : {
	        pattern : 'grunt-*',
	        config : require('./package.json'),
	        scope : 'devDependencies'
	    },

	    //can post process config object before it gets passed to grunt
	    postProcess : function(config) {
		    grunt.log.writeln("\nProcessConfig Completed".blue.bold.underline);
	    },

	    //allows to manipulate the config object before it gets merged with the data object
	    preMerge : function(config, data) {
		    if (!!data.debug) {
			    var tasks = "aliases";
			    grunt.log.writeln("PreMerge of Config\n".white.bold);
			    var commandsName = Object.keys(config[tasks]);
			    grunt.log.writeln("================".blue);
			    grunt.log.writeln(("Commands: " + commandsName.join(", ")).yellow.bold);
			    var filesName = Object.keys(config).filter(function(string) {
				    return string !== tasks;
			    });
			    grunt.log.writeln("================".blue);
			    grunt.log.writeln(("loaded modules: " + filesName.join(", ")).cyan.bold);
			    grunt.log.writeln("================".blue);

		    }
	    }
	});
};
