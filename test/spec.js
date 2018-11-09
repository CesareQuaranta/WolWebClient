(function() {
	var compositeConfig={
        "config":{},
        "prodotto":{},
        "user": "guest"
    };
	
// Jasmine Unit Testing Suite
define([],
    function() {
        // Test suite that includes all of the Jasmine unit tests
        describe("Generic Test Suite", function() {
        	describe("App domain", function() {
                it("should have valid Version", function() {
                    console.log(JSON.stringify(PlusLib.VERSION));
                    expect(PlusLib.VERSION).not.toBeNull();
                });
            }); 
        });
	});
})();
