define(['require','js-cookie','detector'],function (require,Cookies,Detector) {
	'use strict';
	window.wol={webgl:true};
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
	wol.phenomesHandler=function(phenomens){
		phenomens.forEach(function processPhenomen(phenomen, i) {
		    if(phenomen.type === "A"){//Deprecated
		    	wol.sceneManager.insertAsteroid(phenomen.ID,phenomen.position,phenomen.materiaID,phenomen.geometry.vertices,phenomen.geometry.faces,{x:0,y:0,z:0},phenomen.rotation);
		    }else if(phenomen.type === "HB"){
		    	wol.sceneManager.insertHydrogenBubble(phenomen.ID,phenomen.position,phenomen.geometry.radius,phenomen.velocity,phenomen.rotation);
		    }
		},this);
	};
	wol.messageHandler=function(event){
		 console.log("messaggio ricevuto:"+event.data) ;
		 var jsonMsg = JSON.parse(event.data);
		 if(!jsonMsg){
			 console.log("Invalid Message:"+event.data);
		 }else{
			 if(!!jsonMsg.Prospective){//Init Scene
				 if(!!wol.scene){
					 console.log("Scene arledy initialized...");
				 }else{
					 require(['sceneManager'],function(sceneManager){
						 wol.sceneManager = sceneManager;
						 //sceneManager.init(75,1,1000);
						 //var Bk = ['/img/starfield-background.jpg', '/img/starfield-background.jpg', '/img/starfield-background.jpg', '/img/starfield-background.jpg', '/img/starfield-background.jpg', '/img/starfield-background.jpg' ];
						 var Bk = ['/img/Sky-px.jpg', '/img/Sky-nx.jpg', '/img/Sky-py.jpg', '/img/Sky-ny.jpg', '/img/Sky-pz.jpg', '/img/Sky-nz.jpg' ];

						 sceneManager.init(jsonMsg.Prospective.fov,jsonMsg.Prospective.near,jsonMsg.Prospective.far,jsonMsg.Prospective.position,Bk);
					 });
				 }
			 }else if(!!jsonMsg.Phenomens && Array.isArray(jsonMsg.Phenomens)){//Process phenomens
				 if(!!wol.sceneManager && wol.sceneManager.isReady()){
					 wol.phenomesHandler(jsonMsg.Phenomens);
				 }else{
					 setTimeout(wol.phenomesHandler.bind(this,jsonMsg.Phenomens),3000);
				 }
			 }else{//TODO Object & update
				 console.log("Unsupported Message:"+event.data);
			 }
		 }

	};
	
	if ( ! Detector.webgl ) {
		 Detector.addGetWebGLMessage();
		 wol.webgl=false;
	 }else{
		var cookie = Cookies.getJSON();
		if(Object.keys(cookie).length !== 0 && !!cookie.accessPoint && !!cookie.token){
			wol.init(cookie.accessPoint,cookie.token);
		}else{
			require(['login'],function(login){
				login.showModal();
			});
		}
		
	}
	
});