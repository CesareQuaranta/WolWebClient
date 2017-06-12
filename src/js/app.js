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
			 require(['detector','three','stats','gui'],function(Detector,THREE,Stats,dat){//TODO Usare dati ricevuti e spostare in funzione
				 if ( ! Detector.webgl ) {
					 Detector.addGetWebGLMessage();
				 }else{
					wol.clock = new THREE.Clock();
					wol.scene = new THREE.Scene();
					wol.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
					wol.camera.position.z = 5;
					
					wol.renderer = new THREE.WebGLRenderer({ alpha: true });
					wol.renderer.setClearColor( 0x000000, 0 );
					wol.renderer.setSize( window.innerWidth, window.innerHeight );
					wol.renderer.setPixelRatio( window.devicePixelRatio );
					document.body.appendChild( wol.renderer.domElement );
					
					//GUI
					var propDefinition = function() {
						  this.message = 'WOL dat.gui';
						  this.spin = 0.01;
						  this.displayBackground = true;
						  this.explode = function() { 
							  alert('BOOM');
						  };
						};
					wol.guiProp = new propDefinition();
					wol.gui = new dat.GUI();
					wol.gui.add(wol.guiProp, 'message');
					wol.gui.add(wol.guiProp, 'spin', 0, 1);
					wol.guiBkgController = wol.gui.add(wol.guiProp, 'displayBackground');
					wol.gui.add(wol.guiProp, 'explode');
					 
					wol.guiController.onChange(function(bkg) {
						if(!bkg){
							wol.scene.background = null;
						}
						
					});
	
					//Backbround
					var backgroundCube = new THREE.CubeTextureLoader().setPath( '/img/').load( [ 'starfield-background.jpg', 'starfield-background.jpg', 'starfield-background.jpg', 'starfield-background.jpg', 'starfield-background.jpg', 'starfield-background.jpg' ] );
					wol.scene.background = backgroundCube;
					/*var backgroundSphere = new THREE.SphereGeometry( 500, 60, 40 );
					backgroundSphere.scale( - 1, 1, 1 );
					var backgroundMaterial = new THREE.MeshBasicMaterial( {
						map: new THREE.TextureLoader().load( '/img/starfield-background-sp.jpg' )
					} );
					var backgroundMesh = new THREE.Mesh( backgroundSphere, backgroundMaterial );
					wol.scene.add(backgroundMesh);*/
					
					// CONTROLS
					window.THREE = THREE;//Export THREE 4 controls & modules
					require(['trackballControls'],function(){
						wol.controls = new THREE.TrackballControls( wol.camera );
						wol.controls.rotateSpeed = 1.0;
						wol.controls.zoomSpeed = 1.2;
						wol.controls.panSpeed = 0.8;
						wol.controls.noZoom = false;
						wol.controls.noPan = false;
						wol.controls.staticMoving = false;
						wol.controls.dynamicDampingFactor = 0.15;
						wol.controls.keys = [ 65, 83, 68 ];
					});
					
					
					//Tools
					var cameraHelper = new THREE.CameraHelper( wol.camera );
					wol.scene.add( cameraHelper );
					
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
					
					//Lights
					var light = new THREE.AmbientLight( 0x404040 ); // soft white light
					wol.scene.add( light );
					
					var starSphere = new THREE.SphereGeometry( 0.05, 4, 3 );
					var starLight = new THREE.PointLight( 0xff0000, 1, 0, 2 );
					starLight.position.set( 1, 1, 1 );
					starLight.add( new THREE.Mesh( starSphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
					wol.scene.add( starLight );
					var pointLightHelper = new THREE.PointLightHelper( starLight, 1 );
					wol.scene.add( pointLightHelper );
					
					//Fog
					wol.scene.fog = new THREE.FogExp2( 0x040306, 0.02 );
					
					//Objects
					var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
					//var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
					var cubeMaterial = new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0x111111, shininess: 50 , transparent: true, premultipliedAlpha: true, opacity:0.80 }  );
					//var material = new THREE.MeshStandardMaterial( { color: 0x555555,transparent: true,opacity:0.80 }  );
					var cube = new THREE.Mesh( boxGeometry, cubeMaterial );
					cube.position.set(1,2,0);
					wol.scene.add( cube );
					var box = new THREE.BoxHelper( cube, 0xffff00 );
					wol.scene.add( box );
	
					
					wol.count=0;
					wol.renderLoop = function () {
						requestAnimationFrame( wol.renderLoop );
						wol.count++;
							if(wol.count===10){
								cube.rotation.x += wol.guiProp.spin;
							}else if(wol.count===20){
								cube.rotation.x += wol.guiProp.spin;
								cube.rotation.y += wol.guiProp.spin;
								cube.rotation.z += wol.guiProp.spin;
								wol.count=0;
							}
						if(!!wol.controls) wol.controls.update( wol.clock.getDelta() );
						wol.renderer.render(wol.scene, wol.camera);
						wol.stats.update();
					};
					wol.onDocumentMouseMove = function(ev){
						
					};
					wol.onWindowResize = function(ev){
						wol.camera.aspect = window.innerWidth / window.innerHeight;
						wol.camera.updateProjectionMatrix();
						wol.renderer.setSize( window.innerWidth, window.innerHeight );
						if(!!wol.controls) wol.controls.handleResize();
					};
					document.addEventListener( 'mousemove', wol.onDocumentMouseMove, false );
					//
					window.addEventListener( 'resize', wol.onWindowResize, false );
					wol.renderLoop();
				 }
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