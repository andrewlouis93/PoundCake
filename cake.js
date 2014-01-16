		// Array Remove - By John Resig (MIT Licensed)
		Array.prototype.remove = function(from, to) {
		  var rest = this.slice((to || from) + 1 || this.length);
		  this.length = from < 0 ? this.length + from : from;
		  return this.push.apply(this, rest);
		};
		
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
		
		var current_ellipWidth = ellip.image.width;
		var current_ellipHeight = ellip.image.height;
		var desired_ellipWidth = 65;
		var desired_ellipHeight = 70;
		ellip.scaleX = desired_ellipWidth/current_ellipWidth;
		ellip.scaleY = desired_ellipHeight/current_ellipHeight;		
		/*
		var ellip = new createjs.Shape();
        ellip.graphics.beginFill("red").drawCircle(0, 0, 3);
		*/
        ellip.x = 120;
        ellip.y = 50;
		
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
		
			/*Registering sound*/
			createjs.Sound.addEventListener("fileload", handleLoad);
			createjs.Sound.registerSound("CakeLongLoop.ogg", "cake_loop", 1, true);
			function handleLoad(event) {
				 createjs.Sound.play("cake_loop");
				 // alternately, we can pass full source path and specify each argument individually
				 var myInstance = createjs.Sound.play("CakeLongLoop.ogg", createjs.Sound.INTERRUPT_ANY, 0, 0, -1, 1, 0);
			 }			
			

			/*Link Canvas*/
			var stage = new createjs.Stage('demoCanvas');			

			/*This function must exist after the Stage is initialized so I can keep popping cakes onto the canvas*/
			function make_cake()
			{
				var cake = new createjs.Bitmap('cake.png');
				var current_cakeWidth = cake.image.width;
				var current_cakeHeight = cake.image.height;
				var desired_cakeWidth = 20;
				var desired_cakeHeight = 20;
				cake.scaleX = desired_cakeWidth/current_cakeWidth;
				cake.scaleY = desired_cakeHeight/current_cakeHeight;

				/*Either x or y must be 0, using a binary coin toss to decide*/
				var coin = Math.floor(Math.random() * 1) + 1;
				if (coin == 1){
					cake.x = 0;
					cake.y = Math.floor((Math.random()*stage.canvas.height)+1); //Random number between 1 and 10
				}
				else if (coin == 0){
					cake.x = Math.floor((Math.random()*stage.canvas.width)+1); //Random number between 1 and 10					
					cake.y = 0;
				}
				
				//cake.rotation = Math.floor((Math.random()*100)+1); //Random angle between 1 and 180
				cake.rotation = 0;
				cake_tray.push(cake);
				stage.addChild(cake);
			}
			
			setInterval(function(){
				if (cake_tray.length < 5){
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
			console.log(ellip.x);
							
			   /*Scaling down the image*/
				//ellip.scaleX = 0.10;
				//ellip.scaleY = 0.10;

				if(left) {
					//If too far left
					if (ellip.x < 0){
						;
					}
					else{
						ellip.x -= 5;
					}
				} else if(right) {
					//If too far right
					if (ellip.x > (stage.canvas.width-35)){
						;
					}
					else{
						ellip.x += 5;
					}
				}

				if(up) {
					//If too far up
					if (ellip.y <=0){
						;
					}
					else{
						ellip.y -= 5;
					}
				} else if(down) {
					//If too far down
					if (ellip.y > (stage.canvas.height-35)){
						;
					}
					else{
						ellip.y += 5;
					}
				}

				if (ellip.x > stage.canvas.width) { 
					ellip.x = stage.canvas.width; 
				}   
				
				/*
				a.) Check cake collisions
				b.) Cake movements
				*/
				for (var i = 0; i < cake_tray.length; i++) {
				
					var collision = ndgmr.checkPixelCollision(ellip,cake_tray[i],0.5);
					
					if (collision){
						//Points tallying
						var score = parseFloat($("#score").text());
						score+=1;
						$("#score").text(score);
						
						//Removing cakes Jay Z has eaten.
						stage.removeChild(cake_tray[i]);
						cake_tray.remove(i);
					}
					
					//If the cake moves past the screen, remove from cake_tray and stage. 
					if (cake_tray[i].x > stage.canvas.width){
						//Dock lives over here.
					
						stage.removeChild(cake_tray[i]);
						cake_tray.remove(i);
					}
					cake_tray[i].x = cake_tray[i].x + Math.cos(toRadians(cake_tray[i].rotation))*3;
					//cake_tray[i].y = cake_tray[i].y + Math.sin(toRadians(cake_tray[i].rotation))*3
				}
								
				stage.update();
			}
		}