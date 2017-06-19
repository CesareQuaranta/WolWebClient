define(['require','js-cookie'],function (require,Cookies) {
	'use strict';
	window.wol={};
	wol.Cookies=Cookies;
	wol.init=function(accesspoint,token){
		  wol.wsConnection = new WebSocket(accesspoint);//'ws://power4.wol.net' 
		  wol.wsConnection.onmessage = wol.messageHandler;
		  wol.wsConnection.onopen = function(event){
			  console.log("connessione effettuata");
			  var openMessage="xToken:"+token;
		      wol.wsConnection.send(openMessage);
		    };
		  wol.wsConnection.onclose = function(event){
			  console.log("connessione chiusa "+event.code +" "+event.reason);
		    }; 
		  wol.wsConnection.onerror = function(event){
			  console.log("errore nella connessione "+event);
		    };
	};
	wol.messageHandler=function(event){
		 console.log("messaggio ricevuto:"+event.data) ;
		 if(!wol.scene){
			 require(['sceneManager'],function(sceneManager){
				 wol.sceneManager = sceneManager;
				 sceneManager.init();
			 });
		 }
	};
	
	var cookie = Cookies.getJSON();
	if(Object.keys(cookie).length !== 0 && !!cookie.accessPoint && !!cookie.token){
		wol.init(cookie.accessPoint,cookie.token);
	}else{
		require(['login'],function(login){
			login.showModal();
		});
		
	}
	
});