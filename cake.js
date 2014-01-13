		/*Since the JS Trig functions take only rads*/
		function toRadians (angle) {
			return angle * (Math.PI / 180);
		}
		
		/*Keyboard input identifiers*/
		var KEYCODE_LEFT = 37, 
			KEYCODE_RIGHT = 39,
			KEYCODE_UP = 38, 
			KEYCODE_DOWN = 40;
		
		/*Jay-Z initialization*/
		var ellip = new createjs.Bitmap('jayz.png');
		
		/*
		var ellip = new createjs.Shape();
        ellip.graphics.beginFill("red").drawCircle(0, 0, 3);
		*/
		ellip.scaleX = 0.1;
		ellip.scaleY = 0.1;
        ellip.x = 100;
        ellip.y = 100;
		
		var cake_tray = [];
		/*the cake*/
		
		/*Keyboard input handlers - keydown and keyup*/
		var left,
			right,
			up,
			down;

		function keyPressed(event){
			if(!event){ var event = window.event; }
			switch(event.keyCode){
				case KEYCODE_LEFT: 
					console.log("left held");
					left = true;
					break;
				case KEYCODE_RIGHT: 
					console.log("right held");
					right = true; 
					break;
				case KEYCODE_UP: 
					console.log("up held");
					up = true;
					break;
				case KEYCODE_DOWN: 
					console.log("down held");
					down = true;
					break;          
			}
		}

		function keyUp(event){
			if(!event){ var event = window.event; }
			switch(event.keyCode){
				case KEYCODE_LEFT: 
					console.log("left released");
					left = false;
					break;
				case KEYCODE_RIGHT: 
					console.log("right released");
					right = false; 
					break;
				case KEYCODE_UP: 
					console.log("up released");
					up = false;
					break;
				case KEYCODE_DOWN: 
					console.log("down released");
					down = false;
					break;          
			}
		}
		
		function Main(){
			/*Link Canvas*/
			var stage = new createjs.Stage('demoCanvas');			

			/*This function must exist after the Stage is initialized so I can keep popping cakes onto the canvas*/
			function make_cake()
			{
				var cake = new createjs.Bitmap('cake.png');
				cake.scaleX = 0.4;
				cake.scaleY = 0.4;
				/*
				var cake = new createjs.Shape();
				cake.graphics.beginFill("blue").drawCircle(0, 0, 2);
				*/
				
				/*Either x or y must be 0, using a binary coin toss to decide*/
				var coin = Math.floor(Math.random() * 1) + 1;
				coin = 1;
				if (coin == 1){
					cake.x = 0;
					cake.y = Math.floor((Math.random()*stage.canvas.height)+1); //Random number between 1 and 10
				}
				else if (coin == 0){
					cake.x = Math.floor((Math.random()*stage.canvas.width)+1); //Random number between 1 and 10					
					cake.y = 0;
				}
				
				cake.rotation = Math.floor((Math.random()*90)+1); //Random angle between 1 and 180
				cake_tray.push(cake);
				stage.addChild(cake);
			}
			
			setInterval(function(){
				if (cake_tray.length == 0){
					make_cake();
				}
			},500);
			
			/*Jay-Z initialization*/
			stage.addChild(ellip);
			
			/*Connecting keydown input to keyPressed handler*/
			this.document.onkeydown = keyPressed;
			/*Connecting key up event to keyUp handler*/
			this.document.onkeyup = keyUp;
			
			/*Continually updating the stage*/
			createjs.Ticker.addEventListener('tick',handleTick);
			
			function handleTick(event){

							
			   /*Scaling down the image*/
				//ellip.scaleX = 0.10;
				//ellip.scaleY = 0.10;

				if(left) {
					ellip.x -= 5;
				} else if(right) {
					ellip.x += 5;
				}

				if(up) {
					ellip.y -= 5;
				} else if(down) {
					ellip.y += 5;
				}

				if (ellip.x > stage.canvas.width) { 
					ellip.x = stage.canvas.width; 
				}   
				
				/*a.) Check cake collisions, b.) Cake movements*/
				for (var i = 0; i < cake_tray.length; i++) {
				
					var collision = ndgmr.checkPixelCollision(ellip,cake_tray[i],0.5);
					
					if (collision){
						stage.removeChild(cake_tray[i]);
					}
					
					cake_tray[i].x = cake_tray[i].x + Math.cos(toRadians(cake_tray[i].rotation))*1;
					cake_tray[i].y = cake_tray[i].y + Math.sin(toRadians(cake_tray[i].rotation))*1
				}
								
				stage.update();
			}
		}