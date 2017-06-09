define(['require','js-cookie'],function (require,Cookies) {
	window.wol={};
	wol.Cookies=Cookies;
	wol.init=function(accesspoint,token){
		  wol.wsConnection = new WebSocket(accesspoint);//'ws://power4.wol.net' 
		  wol.wsConnection.onmessage = wol.messageHandler;
		  wol.wsConnection.onopen = function(event){
			  console.log("connessione effettuata") 
			  var openMessage="xToken:"+token;
		      wol.wsConnection.send(openMessage);
		    } 
		  wol.wsConnection.onclose = function(event){
			  console.log("connessione chiusa "+event.code +" "+event.reason);
		    } 
		  wol.wsConnection.onerror = function(event){
			  console.log("errore nella connessione "+event);
		    }
	};
	wol.messageHandler=function(event){
		 console.log("messaggio ricevuto:"+event.data) ;
		 if(!wol.scene){
			 require(['three'],function(THREE){//TODO Usare dari ricevuti e spostare in funzione
				wol.scene = new THREE.Scene();
				wol.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

				wol.renderer = new THREE.WebGLRenderer();
				wol.renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( wol.renderer.domElement );

				var geometry = new THREE.BoxGeometry( 1, 1, 1 );
				var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
				var cube = new THREE.Mesh( geometry, material );
				wol.scene.add( cube );

				wol.camera.position.z = 5;
				wol.renderLoop = function () {
					requestAnimationFrame( wol.renderLoop );

					cube.rotation.x += 0.1;
					cube.rotation.y += 0.1;

					wol.renderer.render(wol.scene, wol.camera);
				};
				wol.renderLoop();
			 });
		 }
	};
	
	var cookie = Cookies.getJSON();
	if(Object.keys(cookie).length != 0 && !!cookie.accessPoint && !!cookie.token){
		wol.init(cookie.accessPoint,cookie.token);
	}else{
		require(['login'],function(login){
			login.showModal();
		});
		
	}
	
});