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
			 require(['detector','three','stats'],function(Detector,THREE,Stats){//TODO Usare dari ricevuti e spostare in funzione
				 if ( ! Detector.webgl ) {
					 Detector.addGetWebGLMessage();
				 }else{
					 wol.scene = new THREE.Scene();
						wol.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
						var cameraHelper = new THREE.CameraHelper( wol.camera );
						wol.scene.add( cameraHelper );

						wol.renderer = new THREE.WebGLRenderer({ alpha: true });
						wol.renderer.setClearColor( 0x000000, 0 );
						wol.renderer.setSize( window.innerWidth, window.innerHeight );
						document.body.appendChild( wol.renderer.domElement );

						//Tools
						var axes = new THREE.AxisHelper(20);
						wol.scene.add(axes);
						
						var dir = new THREE.Vector3( 1, 2, 0 );
						//normalize the direction vector (convert to vector of length 1)
						dir.normalize();
						var arrowHelper = new THREE.ArrowHelper( dir, new THREE.Vector3( 0, 0, 0 ), 1, 0xffff00 );
						wol.scene.add( arrowHelper );
						
						wol.stats = new Stats();
						wol.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
						document.body.appendChild( wol.stats.dom );
						
						var light = new THREE.AmbientLight( 0x404040 ); // soft white light
						wol.scene.add( light );
						
						var starLight = new THREE.PointLight( 0xff0000, 1, 0, 2 );
						starLight.position.set( 1, 1, 1 );
						wol.scene.add( starLight );
						var pointLightHelper = new THREE.PointLightHelper( starLight, 1 );
						wol.scene.add( pointLightHelper );
						
						var geometry = new THREE.BoxGeometry( 1, 1, 1 );
						var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
						var cube = new THREE.Mesh( geometry, material );
						wol.scene.add( cube );
						var box = new THREE.BoxHelper( cube, 0xffff00 );
						wol.scene.add( box );

						wol.camera.position.z = 5;
						wol.clock=0;
						wol.renderLoop = function () {
							wol.stats.update()
							requestAnimationFrame( wol.renderLoop );
							wol.clock++;
								if(wol.clock===10){
									cube.rotation.x += 0.01;
								}else if(wol.clock===20){
									cube.rotation.x += 0.01;
									cube.rotation.y += 0.01;
									cube.rotation.z += 0.01;
									wol.clock=0;
								}

							wol.renderer.render(wol.scene, wol.camera);
						};
						wol.renderLoop();
				 }
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