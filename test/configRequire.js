require.config({
    paths : {
        "jasmine" : "../js/jasmine",
        "jasmine-html" : "../js/jasmine-html",
        "jasmine-jquery" : "../js/jasmine-jquery",
        "pluslib":"distr/js/pluslib"
    },

    map: {
        "*": {
            PlusLib: "pluslib"
        }
    },

    shim : {

        // Unit Test
        "jasmine" : {
	        // Exports the global 'window.jasmine' object
	        "exports" : "jasmine"
        },

        "jasmine-html" : {
            "deps" : [ "jasmine" ],
            "exports" : "jasmine"
        },
        "jasmine-jquery" : {
            "deps" : [ "jasmine", "jquery" ],
            "exports" : "jasmine"
        }
    }
});
