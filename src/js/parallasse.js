//16 immagini da spostare di volta in volta 4 X 4
//WebContent/img/starfieldlong.jpg
//    <img id="bkImage-21" src="/WebContent/img/starfieldlong.jpg" height="960px" width="1920px" style="position: absolute;visibility: hidden;" />
(function () {
	var pSfondo={
			imgObj : [],
			focalPoint:{
				x : 0,
				y : 0,
				offsetX : 0,
				offsetY : 0
			},
			inertiaTimer : null,
			mouse :{
				listner : null,
				lastx : null,
				lasty : null
			}	
	};
	
	function checkVisibility(){
		pSfondo.imgObj.forEach(function(curImg) {
			var left = parseInt(curImg.style.left);
			var top = parseInt(curImg.style.top);
			var visible = (left>-window.innerWidth) && (left<window.innerWidth) && (top>-window.innerHeight) && (top < window.innerHeight);
			if(visible){
				curImg.style.visibility='';
			}else{
				curImg.style.visibility='hidden';
			}
		});
	}
	function updatePositions(){
		pSfondo.imgObj[0].style.left = (pSfondo.focalPoint.x -window.innerWidth) + 'px'; 
		pSfondo.imgObj[0].style.top = (pSfondo.focalPoint.y -window.innerHeight) + 'px';
		pSfondo.imgObj[1].style.left = (pSfondo.focalPoint.x) + 'px'; 
		pSfondo.imgObj[1].style.top = (pSfondo.focalPoint.y -window.innerHeight) + 'px';
		pSfondo.imgObj[2].style.left = (pSfondo.focalPoint.x -window.innerWidth) + 'px';
		pSfondo.imgObj[2].style.top = (pSfondo.focalPoint.y) + 'px';
		pSfondo.imgObj[3].style.left = (pSfondo.focalPoint.x) + 'px'; 
		pSfondo.imgObj[3].style.top = (pSfondo.focalPoint.y) + 'px'; 
	}
	
	function updateOffset(offset,dir){
		if(dir>0){
			if(offset<3){
				return offset+ 1;
			}else{
				return 0;
			}
		}else{
			if(offset > 0){
				return offset- 1;
			}else{
				return 3;
			}
		}
	}
	function move(dx,dy){
		var updateSources = false;
		if((pSfondo.focalPoint.x + dx) > window.innerWidth){
			pSfondo.focalPoint.x += (dx - window.innerWidth);
			pSfondo.focalPoint.offsetX = updateOffset(pSfondo.focalPoint.offsetX,+1);
			updateSources = true;
		}else if((pSfondo.focalPoint.x + dx) < 0){
			pSfondo.focalPoint.x += (dx + window.innerWidth);
			pSfondo.focalPoint.offsetX = updateOffset(pSfondo.focalPoint.offsetX,-1);
			updateSources = true;
		}else{
			pSfondo.focalPoint.x += dx;
		}
		
		if((pSfondo.focalPoint.y + dy) > window.innerHeight){
			pSfondo.focalPoint.y += (dy - window.innerHeight);
			pSfondo.focalPoint.offsetY = updateOffset(pSfondo.focalPoint.offsetY,+1);
			updateSources = true;
		}else if((pSfondo.focalPoint.y + dy) < 0){
			pSfondo.focalPoint.y += (dy + window.innerHeight);
			pSfondo.focalPoint.offsetY = updateOffset(pSfondo.focalPoint.offsetY,-1);
			updateSources = true;
		}else{
			pSfondo.focalPoint.y += dy;
		}
		if(updateSources){
			var src00 = ((4 - pSfondo.focalPoint.offsetX) % 4) + (((4 - pSfondo.focalPoint.offsetY) % 4)*4);
			var src01 = ((5 - pSfondo.focalPoint.offsetX) % 4) + (((4 - pSfondo.focalPoint.offsetY) % 4)*4);
			var src10 =((4 - pSfondo.focalPoint.offsetX) % 4) + (((5 - pSfondo.focalPoint.offsetY) % 4)*4);
			var src11 = ((5 -pSfondo.focalPoint.offsetX) % 4) + (((5 - pSfondo.focalPoint.offsetY) % 4)*4);
			pSfondo.imgObj[0].src = pSfondo.images[src00];
			pSfondo.imgObj[1].src = pSfondo.images[src01];
			pSfondo.imgObj[2].src = pSfondo.images[src10];
			pSfondo.imgObj[3].src = pSfondo.images[src11];
		}
		updatePositions();
		checkVisibility();
	}
	function mouseMove(e)
	{
		if(!!e){
			var posX = e.clientX;
	        var posY = e.clientY;
			
	        var dx = pSfondo.mouse.lastx!=null?pSfondo.mouse.lastx-posX:0;
	        var dy = pSfondo.mouse.lasty!=null?pSfondo.mouse.lasty-posY:0;
	        
	        pSfondo.mouse.lastx = posX;
	        pSfondo.mouse.lasty = posY;
	
	        if(dx!=0 || dy!=0){
	        	move(dx*-1,dy*-1);
	        	if(pSfondo.inertiaTimer!=null){
	        		clearInterval(pSfondo.inertiaTimer);
	        	}
	        	/*pSfondo.inertiaTimer = setInterval(function(){
	        		move((dx*-1)/5,(dy*-1)/5);
	        	},120);*/
	        }
		}
	    
	}
	
	function activateMlistner(e){
		e.preventDefault();
		pSfondo.mouse.lastx = null;
	    pSfondo.mouse.lasty = null;
		document.addEventListener('mousemove',mouseMove);
	}
	function clearMlistner(e){
	    document.removeEventListener('mousemove',mouseMove);
	    pSfondo.mouse.lastx = null;
	    pSfondo.mouse.lasty = null;
	}
	function init(){
	   pSfondo.imgObj.push(document.getElementById('bkImage1'));
	   pSfondo.imgObj.push(document.getElementById('bkImage2'));
	   pSfondo.imgObj.push(document.getElementById('bkImage3'));
	   pSfondo.imgObj.push(document.getElementById('bkImage4'));
	   pSfondo.images=["/img/starfieldlong.jpg","/img/starfieldlong.jpg","/img/starfieldlong.jpg",
	                   "/img/starfieldlong.jpg","/img/starfieldlong.jpg","/img/starfieldlong.jpg",
	                   "/img/starfieldlong.jpg","/img/starfieldlong.jpg","/img/starfieldlong.jpg",
	                   "/img/starfieldlong.jpg","/img/starfieldlong.jpg","/img/starfieldlong.jpg",
	                   "/img/starfieldlong.jpg","/img/starfieldlong.jpg","/img/starfieldlong.jpg",
	                   "/img/starfieldlong.jpg"];
	   /*pSfondo.images=["https://placeholdit.imgix.net/~text?txtsize=100&bg=00ff00&txt=0-0&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=006600&txt=0-1&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=003300f&txt=0-2&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=ff3300&txt=0-3&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=ff6600&txt=1-0&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=0033ff&txt=1-1&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=0066ff&txt=1-2&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=0000ff&txt=1-3&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=000066&txt=2-0&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=000033&txt=2-1&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=ffffff&txt=2-2&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=ffffff&txt=2-3&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=ffffff&txt=3-0&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=ffffff&txt=3-1&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=ffffff&txt=3-2&w="+window.innerWidth+"&h="+window.innerHeight,
	                   "https://placeholdit.imgix.net/~text?txtsize=100&bg=ffffff&txt=3-3&w="+window.innerWidth+"&h="+window.innerHeight]; */
	   
	   pSfondo.imgObj[0].src = pSfondo.images[0];
	   pSfondo.imgObj[1].src = pSfondo.images[1];
	   pSfondo.imgObj[2].src = pSfondo.images[4];
	   pSfondo.imgObj[3].src = pSfondo.images[5];
	   pSfondo.imgObj[3].style.visibility='';
	   updatePositions();
	}
	function initListeners(){
		 document.addEventListener('mousedown',activateMlistner);
		 document.addEventListener('mouseup',clearMlistner);
	}
	window.Wol = {Parallasse:{initListeners: initListeners}};
	
	document.addEventListener('DOMContentLoaded', init);
}());	