define([],function () {
	'use strict';
	  return {
		  	
	        init: function () {
	         	this.entityIndex = new Map();
	         	this.velocityIndex = new Map();
	         	this.rotationIndex = new Map();	
	        },
	        insertEntity : function (entity,velocity,rotation){
	        	this.entityIndex.set(entity.name , entity);
	        	this.velocityIndex.set(entity.name , velocity);
	        	this.rotationIndex.set(entity.name , rotation);
	        	entity.rotation.x=rotation.ax.x;
	        	entity.rotation.y=rotation.ax.y;
	        	entity.rotation.z=rotation.ax.z;
	        },
	        process : function (timestamp) {
	        	//TODO Considerare il timestamp come moltiplicatore/divisore di valori
	        	this.entityIndex.forEach(function(curEntity,key) {
	        		var curVelocity = this.velocityIndex.get(key);
	        		var curRotation = this.rotationIndex.get(key);
	        		if(!!curVelocity && (curVelocity.x!==0 || curVelocity.y!==0 || curVelocity.z!==0)){
	        			curEntity.position.x += (curVelocity.x * timestamp);
	        			curEntity.position.y += (curVelocity.y * timestamp);
	        			curEntity.position.z += (curVelocity.z * timestamp);
	        		}
	        		if(!!curRotation && !!curRotation.ax){
	        			var curQuaternion = curEntity.quaternion;
	        			var aQuaternion = new THREE.Quaternion();
	        			var ax = new THREE.Vector3(curRotation.ax.x,curRotation.ax.y,curRotation.ax.z);
	        			aQuaternion.setFromAxisAngle(ax, curRotation.radians*timestamp);//imposta inizialmente in base all'ora del giorno

	        			curQuaternion.multiplyQuaternions(aQuaternion, curQuaternion);
	        			curQuaternion.normalize();
	        			
	        			curEntity.setRotationFromQuaternion(curQuaternion);
	        		}
	        	},this);
			}
			
	  };

});