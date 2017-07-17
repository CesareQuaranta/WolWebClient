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
	        		if(!!curRotation && (curRotation.x!==0 || curRotation.y!==0 || curRotation.z!==0)){
	        			curEntity.rotation.x += (curRotation.x * timestamp);
	        			curEntity.rotation.y += (curRotation.y * timestamp);
	        			curEntity.rotation.z += (curRotation.z * timestamp);
	        		}
	        	},this);
			}
			
	  };

});