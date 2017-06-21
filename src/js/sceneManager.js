define(['three','stats','gui','TrackballControls'],function (THREE,Stats,dat) {
	'use strict';
	
	var propDefinition = function() {
		  this.message = 'WOL dat.gui';
		  this.spin = 0.001;
		  this.stats = true;
		  this.paralaxBackground = true;
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
		var bkgListner = wol.gui.add(prop, 'paralaxBackground');
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
	  return {
	        init: function (fov,near,far,background) {
	        		wol.clock = new THREE.Clock();
	        		wol.scene = new THREE.Scene();
	        		wol.camera = new THREE.PerspectiveCamera( fov, window.innerWidth/window.innerHeight, near, far );
	        		wol.camera.position.z = 5;
	        		wol.camera.position.y = 5;
	        		wol.camera.position.x = 5;
	        		
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
	  
	    			window.addEventListener( 'resize', this.onWindowResize, false );
	    			wol.renderLoop=this.renderLoop;
	    			wol.renderLoop();
	        },
	        renderLoop : function () {
				requestAnimationFrame( wol.renderLoop );
				var delta = wol.clock.getDelta();
				if(!!wol.controls) wol.controls.update( delta );
				if(!!wol.cameraHelper) wol.cameraHelper.update();
				//wol.cameraCube.rotation.copy( wol.camera.rotation );
				//wol.renderer.render( wol.sceneCube, wol.cameraCube );
				wol.renderer.render(wol.scene, wol.camera);
				wol.stats.update();
			},
			onWindowResize : function(ev){
				wol.camera.aspect = window.innerWidth / window.innerHeight;
				wol.camera.updateProjectionMatrix();
				wol.renderer.setSize( window.innerWidth, window.innerHeight );
				if(!!wol.controls) wol.controls.handleResize();
			},
			initControls : function(){
        		wol.controls = new THREE.TrackballControls( wol.camera, wol.renderer.domElement );
    			wol.controls.rotateSpeed = 1.0;
    			wol.controls.zoomSpeed = 1.2;
    			wol.controls.panSpeed = 0.8;
    			wol.controls.noZoom = false;
    			wol.controls.noPan = false;
    			wol.controls.staticMoving = false;
    			wol.controls.dynamicDampingFactor = 0.15;
    			wol.controls.keys = [ 65, 83, 68 ];
			},
			addBackground : function(background){
				var spriteMap = new THREE.TextureLoader().load( background[0] );
				var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
				var sprite = new THREE.Sprite( spriteMaterial );
				sprite.position.set(-50,0,-50);
			    sprite.scale.set(50,50,50);
			    wol.Background = new THREE.Group();
			    wol.Background.add(sprite);
				wol.scene.add( wol.Background );
			},
			addCameraHelper : function(){
				wol.cameraHelper = new THREE.CameraHelper( wol.camera );
				wol.scene.add( wol.cameraHelper );
			},
			addGridHelper : function(){
				wol.gridHelper = new THREE.GridHelper( 10, 10 );
				wol.scene.add( wol.gridHelper );
			},
			addAxisHelper : function(){
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