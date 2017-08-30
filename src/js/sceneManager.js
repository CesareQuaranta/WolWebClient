define(['three','stats','gui','TrackballControls'],function (THREE,Stats,dat) {
	'use strict';
	
	var propDefinition = function() {
		  this.message = 'WOL dat.gui';
		  this.spin = 0.001;
		  this.stats = true;
		  this.background = true;
		  this.cameraHelper = true;
		  this.gridHelper = true;
		  this.axisHelper = true;
		  this.explode = function() { 
			  alert('BOOM');
		  };
		};
	  var initGUI = function(prop){
		wol.gui = new dat.GUI();
		wol.gui.add(prop, 'message');
		//wol.gui.add(prop, 'spin', 0, 1);
		var statsListner = wol.gui.add(prop, 'stats');
		var bkgListner = wol.gui.add(prop, 'background');
		var cameraHelperListner = wol.gui.add(prop, 'cameraHelper');
		var gridHelperListner = wol.gui.add(prop, 'gridHelper');
		var axisHelperListner = wol.gui.add(prop, 'axisHelper');
		wol.gui.add(prop, 'explode');
		
		statsListner.onChange(function(statsOn) {
			wol.stats.dom.hidden=!statsOn;
		});
		
		bkgListner.onChange(function(bkg) {
			if(!bkg){
				wol.scene.remove(wol.Background);
			}else{
				wol.scene.add(wol.Background);
			}
		});
		cameraHelperListner.onChange(function(helper) {
			if(helper){
				wol.sceneManager.addCameraHelper();
			}else{
				wol.scene.remove(wol.cameraHelper);
			}
		});
		gridHelperListner.onChange(function(helper) {
			if(helper){
				wol.sceneManager.addGridHelper();
			}else{
				wol.scene.remove(wol.gridHelper);
			}
		});
		axisHelperListner.onChange(function(helper) {
			if(helper){
				wol.sceneManager.addAxisHelper();
			}else{
				wol.scene.remove(wol.axisHelper);
				wol.scene.remove(wol.arrowHelper);
			}
		});
		
	  };
	  
  var initMaterialLibrary = function(){
		wol.MaterialLib={};
		wol.MaterialLib.def = new THREE.MeshNormalMaterial();
		
    	var hgBump = new THREE.TextureLoader().load( "/img/bMetallic2.jpg" );
    	var hgMap = new THREE.TextureLoader().load("/img/bMetallic.jpg");
    	hgMap.wrapS=THREE.MirroredRepeatWrapping;
    	hgMap.wrapT=THREE.MirroredRepeatWrapping;

    	wol.MaterialLib.hgMaterial = new THREE.MeshPhongMaterial( {
			color: 0xffffff,
			specular: 0xffaa00,
			shininess: 100,
			bumpMap: hgBump,
			bumpScale: 0.5,
			map : hgMap
		} );
    	
    	wol.MaterialLib.chromeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: wol.cubeCamera.renderTarget.texture } );
	};
	  return {
	        init: function (fov,near,far,cameraPos,background) {
	        		wol.lastServerPos=cameraPos;
	        		wol.clock = new THREE.Clock();
	        		wol.scene = new THREE.Scene();
	        		wol.camera = new THREE.PerspectiveCamera( fov, window.innerWidth/window.innerHeight, near, 10000 );
	        		wol.camera.position.z = 5;//cameraPos.z;
	        		wol.camera.position.y = cameraPos.y;
	        		wol.camera.position.x = cameraPos.x;
	        		wol.camera.add(new THREE.PointLight( 0xffffff ));
	        		wol.scene.add(wol.camera);
	        		
	        		//Create cube camera
					wol.cubeCamera = new THREE.CubeCamera( near, 100000, 128 );
					wol.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter; // mipmap filter
					wol.scene.add( wol.cubeCamera );
					
	        		wol.renderer = new THREE.WebGLRenderer({ alpha: true });
	        		wol.renderer.setClearColor( 0x000000, 0 );
	        		wol.renderer.setSize( window.innerWidth, window.innerHeight );
	        		wol.renderer.setPixelRatio( window.devicePixelRatio );
	        		wol.renderer.autoClear = false;
	        		wol.renderer.setFaceCulling( THREE.CullFaceNone );
	        		document.body.appendChild( wol.renderer.domElement );
	        		
	        		//Lights
					var light = new THREE.AmbientLight( 0x404040 ); // soft white light
					wol.scene.add( light );
	        		
	        		wol.guiProp = new propDefinition();
	        		initGUI(wol.guiProp);
	        		initMaterialLibrary();
	        		
	        		var distorsionGeometry = new THREE.SphereGeometry( 0.3, 10, 10 );
					wol.distorsion = new THREE.Mesh( distorsionGeometry, wol.MaterialLib.chromeMaterial );
					wol.distorsion.visible=false;
					wol.scene.add(wol.distorsion);
					
	        		// CONTROLS
	        		this.initControls();
	    			//Stats
	    			wol.stats = new Stats();
	    			wol.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	    			document.body.appendChild( wol.stats.dom );
	    			
	    			//Background
	    			if(!!background){
	    				this.addBackground(background);
	    			}
	    			//Tools
	    			this.addCameraHelper();
	    			this.addGridHelper();
	    			this.addAxisHelper();		
	  
	    			// initialize object to perform world/screen calculations
	    			wol.raycaster = new THREE.Raycaster();
	    			
	    			window.addEventListener( 'resize', this.onWindowResize, false );
	    			wol.renderer.domElement.addEventListener( 'mousedown', this.onMouseDown, false );
	    			wol.renderer.domElement.addEventListener( 'mousemove', this.onMouseMove, false );
	    			wol.renderer.domElement.addEventListener( 'mouseup', this.onMouseUp, false );
	    			/*var backgroundHandle = window.requestIdleCallback(function(){},{timeout:30000});
	    			window.cancelIdleCallback(backgroundHandle);*/
	    			//PhysicsProcessor
	    			require(['simplePhysicsProcessor'],function(physicsProcessor){
	    				wol.sceneManager.physicsProcessor=physicsProcessor;
	    				wol.sceneManager.physicsProcessor.init();
	    			});
	    			wol.renderLoop=this.renderLoop;
	    			wol.renderLoop();
	        },
	        insertAsteroid: function (id,position,material,vertices,faces,velocity,rotation) {
	        	/* PolyhedronGeometry test failed
	        	var verticesOfAsteroid = [];
	        	var indicesOfFaces = [];
	        	//Convert Vertices
	        	for (var i = 0; i < vertices.length; i++) { 
	        		verticesOfAsteroid.push(vertices[i].x);
	        		verticesOfAsteroid.push(vertices[i].y);
	        		verticesOfAsteroid.push(vertices[i].z);
	        	}
	        	//Convert Faces Index
	        	for (var j = 0; j < faces.length; j++) { 
	        		indicesOfFaces.push( faces[j].v1);
	        		indicesOfFaces.push( faces[j].v2);
	        		indicesOfFaces.push( faces[j].v3);
	        		//indicesOfFaces.
	        	}
	        	var asteroidGeometry = new THREE.PolyhedronGeometry( verticesOfAsteroid, indicesOfFaces, 6, 4 );*/
	        	
	        	var asteroidGeometry = new THREE.Geometry();
	        	for (var i = 0; i < vertices.length; i++) { 
	        		asteroidGeometry.vertices.push(new THREE.Vector3(vertices[i].x,vertices[i].y,vertices[i].z));
	        	}
	        	for (var j = 0; j < faces.length; j++) { 
	        		asteroidGeometry.faces.push( new THREE.Face3( faces[j].v1, faces[j].v2, faces[j].v3 ) );
	        		asteroidGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(0, 1),new THREE.Vector2(1, 1)]);
	        	}
	        	
	        	asteroidGeometry.computeFaceNormals();
	        	var newAsteroid = new THREE.Mesh( asteroidGeometry,  wol.MaterialLib.hgMaterial);
	        	newAsteroid.name="Asteroid-"+id;
	        	newAsteroid.scale.set(0.1, 0.1, 0.1);
	        	newAsteroid.position.set(position.x,position.y,position.z);
	        	wol.scene.add(newAsteroid);
	        	if(!!wol.sceneManager.physicsProcessor){
	        		wol.sceneManager.physicsProcessor.insertEntity(newAsteroid,velocity,rotation);
	        	}else{
	        		console.log("TODO Implementare cache temporanea");
	        		}
	        	
	        },
	        renderLoop : function () {//TODO Private?
	        	var fps=35;
	        	 setTimeout(function() {
					requestAnimationFrame( wol.renderLoop );
					var delta = wol.clock.getDelta();
					if(!!wol.controls) wol.controls.update( delta );
					if(!!wol.cameraHelper) wol.cameraHelper.update();
					if(!!wol.sceneManager.physicsProcessor){
						wol.sceneManager.physicsProcessor.process(delta);
					}
					//wol.Background.children[0].position.set(0,0,wol.camera.position.z-999);
					//wol.renderer.render( wol.sceneCube, wol.cameraCube );
					if(!!wol.distorsion.visible){//TODO generalize 4 all mesh with cubeCamera reflection
						wol.cubeCamera.rotation.copy( wol.camera.rotation );
						wol.cubeCamera.position.copy( wol.camera.position );
						wol.distorsion.visible=false;
						wol.cubeCamera.updateCubeMap( wol.renderer, wol.scene );
						wol.distorsion.visible=true;
					}
					wol.renderer.render(wol.scene, wol.camera);
					wol.stats.update();
	        	 },1000 / fps);
			},
			onWindowResize : function(ev){//TODO Private?
				wol.camera.aspect = window.innerWidth / window.innerHeight;
				wol.camera.updateProjectionMatrix();
				wol.renderer.setSize( window.innerWidth, window.innerHeight );
				if(!!wol.controls) wol.controls.handleResize();
			},
			onMouseMove : function(ev){//TODO WolControls
				//Annulla time x send message
				if(!!wol.WCTimer){
					clearInterval(wol.WCTimer);
					wol.WCTimer=null;
				}
				//Send poition
				//TODO check last send time
				if(((wol.lastServerPos.t - Date.now()) > 30000) && (wol.lastServerPos.x != wol.camera.position.x) || (wol.lastServerPos.y != wol.camera.position.y) || (wol.lastServerPos.z != wol.camera.position.z)){
					var command={type:"Position",pos:wol.camera.position};
					var commandMessage="xC:"+JSON.stringify(command);
					wol.wsConnection.send(commandMessage);
					wol.lastServerPos.x = wol.camera.position.x;
					wol.lastServerPos.y = wol.camera.position.y;
					wol.lastServerPos.z = wol.camera.position.z;
					wol.lastServerPos.t = Date.now();
				}
			},
			onMouseUp : function(ev){//TODO WolControls
				if(!!wol.WCTimer){//Annulla time x send message
					clearInterval(wol.WCTimer);
					wol.WCTimer=null;
				}
				wol.distorsion.visible=false;
			},
			onMouseDown : function(ev){//TODO spostare in controller appropriato WolControls?
				ev.preventDefault();
				if(event.button === THREE.MOUSE.LEFT){
					var mouse={};
					mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
					mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
					if(!wol.WCTimer){
						var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
						wol.raycaster.setFromCamera( mouse, wol.camera );
						var p=wol.raycaster.ray.origin.clone();
						var d = wol.raycaster.ray.direction.clone();
						d.multiplyScalar(3);
						p.add(d);
						
						wol.cubeCamera.position.copy( wol.camera );
						
						wol.MaterialLib.chromeMaterial.envMap= wol.cubeCamera.renderTarget.texture;
						wol.MaterialLib.chromeMaterial.needsUpdate = true;
						wol.distorsion.position.copy(p);
						wol.distorsion.visible=true;
						
						/*
						var 
						var materialPhongCube = new THREE.MeshPhongMaterial( { shininess: 50, color: 0xffffff, specular: 0x999999, envMap: cubeCamera.renderTarget.texture } );

						var sphereGeometry = new THREE.SphereGeometry( 100, 64, 32 );
						var car = new Mesh( carGeometry, chromeMaterial );
						scene.add( car );

						//Update the render target cube
						car.setVisible( false );
						cubeCamera.position.copy( car.position );
						

						//Render the scene
						car.setVisible( true );
						
						// render cube map
						mesh.visible = false;
						cubeCamera.updateCubeMap( renderer, scene );
						mesh.visible = true;
						 */
						
						wol.WCMagnitudo=1;
						wol.WCTimer=setInterval(function() {
							var command={type:"Gravity",mag:wol.WCMagnitudo++,pos:p};
							var commandMessage="xC:"+JSON.stringify(command);
						    wol.wsConnection.send(commandMessage);
						},2000);
					}
					
					
				}
				
			},
			initControls : function(){//TODO Private
        		wol.controls = new THREE.TrackballControls( wol.camera, wol.renderer.domElement );
    			wol.controls.rotateSpeed = 1.0;
    			wol.controls.zoomSpeed = 0;//1.2;
    			wol.controls.panSpeed = 0.8;
    			wol.controls.noZoom = true;
    			wol.controls.noPan = false;
    			wol.controls.staticMoving = false;
    			wol.controls.dynamicDampingFactor = 0.15;
    			wol.controls.keys = [ 65, 83, 68 ];
			},
			addBackground : function(background){//TODO Private
				var skyGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
				var loader = new THREE.CubeTextureLoader();
				var textureCube = loader.load( background );
				textureCube.format = THREE.RGBFormat;
				var shader = THREE.ShaderLib.cube;
				shader.uniforms.tCube.value = textureCube;
				var skyMaterial = new THREE.ShaderMaterial( {
				    fragmentShader: shader.fragmentShader,
				    vertexShader: shader.vertexShader,
				    uniforms: shader.uniforms,
				    depthWrite: false,
				    side: THREE.BackSide
				} );
				wol.Background = new THREE.Mesh( skyGeometry, skyMaterial );
				wol.Background.position.x = -1;
				wol.scene.add( wol.Background );
			},
			addCameraHelper : function(){//TODO Private
				wol.cameraHelper = new THREE.CameraHelper( wol.camera );
				wol.scene.add( wol.cameraHelper );
			},
			addGridHelper : function(){//TODO Private
				wol.gridHelper = new THREE.GridHelper( 10, 10 );
				wol.scene.add( wol.gridHelper );
			},
			addAxisHelper : function(){//TODO Private
				wol.axisHelper = new THREE.AxisHelper(20);
				wol.scene.add(wol.axisHelper);
				var dir = new THREE.Vector3( 1, 2, 0 );
				//normalize the direction vector (convert to vector of length 1)
				dir.normalize();
				wol.arrowHelper = new THREE.ArrowHelper( dir, new THREE.Vector3( 0, 0, 0 ), 1, 0xffff00 );
				wol.scene.add( wol.arrowHelper );
			}
			
	  };

});