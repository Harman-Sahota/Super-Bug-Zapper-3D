const { vec2, vec3, mat3, mat4 } = glMatrix;

var vertexShaderText = [
'precision mediump float;',

'attribute vec3 position;',
'attribute vec3 color;',
'uniform mat4 world;',
'uniform mat4 view;',
'uniform mat4 proj;',
'varying vec3 fragColor;',

'void main()',
'{',
'   mat4 mvp = proj*view*world;',
'	fragColor = color;',
'	gl_Position = mvp*vec4(position,1.0);',
'	gl_PointSize = 10.0;',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',

'varying vec3 fragColor;',

'void main()',
'{',
	
'	gl_FragColor = vec4(fragColor,1.0);',
'}',
].join('\n')


var InitDemo = function() {

	var radius = 1;
	let arcCheck = (2*Math.PI*radius)*(15/360);
	let score = 0;
	let parts = [];
	let lifeCounter = document.getElementById("lives");
	let scoreCounter = document.getElementById("score");
	let remainCounter = document.getElementById("remainBact");
	let endMess = document.getElementById("endMessage");

	//////////////////////////////////
	//       initialize WebGL       //
	//////////////////////////////////;

	var canvas = document.getElementById('gameSurface');
	var gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
	var particlesCanvas = document.getElementById('particles');
	var partCanvas = particlesCanvas.getContext('2d')

	if (!gl){
		console.log('webgl not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl', {preserveDrawingBuffer: true});
	}
	if (!gl){
		alert('your browser does not support webgl');
	}

	canvas.width = window.innerWidth/1.3;
	canvas.height = window.innerHeight/1.3;
	particlesCanvas.width = canvas.width;
	particlesCanvas.height = canvas.height;

	gl.viewport(0,0,canvas.width,canvas.height);


	//////////////////////////////////
	// create/compile/link shaders  //
	//////////////////////////////////

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader,vertexShaderText);
	gl.shaderSource(fragmentShader,fragmentShaderText);

	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
		console.error('Error compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
		return;
	}
	gl.compileShader(fragmentShader);
		if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
		console.error('Error compiling vertex shader!', gl.getShaderInfoLog(fragmentShader))
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);

	gl.linkProgram(program);
	if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
		console.error('Error linking program!', gl.getProgramInfo(program));
		return;
	}

	//////////////////////////////////////
	//			Functions				//
	//////////////////////////////////////


	function drawSphere(x,y,z,r,color, surface) {

		var vertexPositionData = [];
		var colors = [];
		var indexData = [];

		latitudeBands = 100;
		longitudeBands = 100;

		for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
			var theta = latNumber * Math.PI / latitudeBands;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
				var phi = longNumber * 2 * Math.PI / longitudeBands;
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);

				var x1 = x + (r * cosPhi * sinTheta);
				var y1 = y + (r * cosTheta);
				var z1 = z + (r * sinPhi * sinTheta);

				colors.push(color[0]);
				colors.push(color[1]);
				colors.push(color[2]);

				vertexPositionData.push(x1);
				vertexPositionData.push(y1);
				vertexPositionData.push(z1);

				var first = (latNumber * (longitudeBands + 1)) + longNumber;
				var second = first + longitudeBands + 1;
				indexData.push(first);
				indexData.push(second);
				indexData.push(first + 1);

				indexData.push(second);
				indexData.push(second + 1);
				indexData.push(first + 1);
			}
		}

         // Create and store data into vertex buffer
         gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);

         // Create and store data into color buffer
         gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

         // Create and store data into index buffer
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);

		 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	     gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_SHORT, 0);

	};

	function drawPatch(x,y,z,r,color, surface){
        var vertexPositionData = [];
		var colors = [];
		var indexData = [];

		latitudeBands = 100;
		longitudeBands = 100;

		for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
			var theta = latNumber * (Math.PI) / (latitudeBands-1);
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
				var phi = longNumber * 2 * Math.PI / longitudeBands;
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);

				var x1 = x + (r * cosPhi * sinTheta);
				var y1 = y + (r * cosTheta);
				var z1 = z + (r * sinPhi * sinTheta);

				colors.push(color[0]);
				colors.push(color[1]);
				colors.push(color[2]);

				vertexPositionData.push(x1);
				vertexPositionData.push(y1);
				vertexPositionData.push(z1);

				var first = (latNumber * (longitudeBands + 1)) + longNumber;
				var second = first + longitudeBands + 1;
				indexData.push(first);
				indexData.push(second);
				indexData.push(first + 1);

				indexData.push(second);
				indexData.push(second + 1);
				indexData.push(first + 1);
			}
		}

         // Create and store data into vertex buffer
         gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);

         // Create and store data into color buffer
         gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

         // Create and store data into index buffer
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);

		 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	     gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_SHORT, 0);
    };

	class Bacteria {

		//constructor for when id is specified
		constructor(id){
			this.id = id;
			this.active = true;
			this.buffer = 0; 
		}

		//method to randomly decide if int is positive or negative
		randomizeInteger(num){
			if(Math.random() >= 0.5){
				num = num*-1;
			}
			return num;
		}

		//method for generating new random x and y values
		newPointValues(){
			this.genTheta = Math.floor(Math.random() * 100);
			this.genPhi = Math.floor(Math.random() * 100);
		}

		genCircleValue(){
			var theta =  this.genTheta * Math.PI / 100;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);
			var phi = this.genPhi * 2 * Math.PI / 100;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			this.x = ((radius-0.1) * cosPhi * sinTheta);
			this.y = ((radius-0.1) * cosTheta);
			this.z = ((radius-0.1) * sinPhi * sinTheta);
		}

		//method for generating new bacteria circles
		generate(){
			//new random data for x and y
			this.newPointValues();
			//new x and y values along the game circle
			this.genCircleValue();

			this.r = 0.2;

			let attempt = 0;
			//iterate through bacteria already generated
			for(let i = 0; i < generatedBacteria.length; i++){
				//check to avoid infinite loop
				if(attempt > 500){
					console.log("Not enough area for new bacteria");
					break;
				}

				//if there is a collision we need to generate new data again
				//ensure it will loop through all the bacteria again
				if(isColliding3D(this.x, this.y, this.z, this.r, generatedBacteria[i].x, generatedBacteria[i].y, generatedBacteria[i].z, generatedBacteria[i].r)){
					this.newPointValues();
					this.genCircleValue();
					attempt++;
					//ensure it will loop through all bacteria again
					i = -1;
				}
			}

			//generate new colours
			this.color = [(Math.random() * (0.6)).toFixed(2), (Math.random() * (0.6)).toFixed(2), (Math.random() * (0.6)).toFixed(2)];
			this.poisoned = false;
			genBact++;

		}

		show(){
			var smooth = this.buffer / 50;
			if (this.active) this.r = this.r + 0.0001 + (smooth);
			this.buffer -= smooth;
			
			for (i in generatedBacteria) {
				if (this.id == generatedBacteria[i].id);
				else{
					if (isColliding3D(this.x, this.y, this.z, this.r, generatedBacteria[i].x, generatedBacteria[i].y, generatedBacteria[i].z, generatedBacteria[i].r)) {
						this.buffer = generatedBacteria[i].r;
						generatedBacteria[i].delete();
					}
				}
				
			}

			if (this.r >= arcCheck) {
				console.log("Too Large!");
				lives -= 1;
				score -= 20;
				this.delete();
			}

			drawPatch(this.x, this.y, this.z, this.r, this.color, true);
		}

		delete(){
			this.r = 0;
			this.x = 0;
			this.y = 0;
			this.active = false;
			console.log("Destroyed!");
			destroyedBacteria++;
		}

	};

	function isColliding3D(x1, y1, z1, r1, x2, y2, z2, r2){
		/*
			In order to check if the two bacteria are colliding we must:
				1. Calculate the distance between (x1, y1, z1) and (x2, y2, z1)
					a) this is done through the equation
						sqrt(pow((x2-x1), 2) + pow((y2-y1), 2) + pow((z2-z1), 2))
				2. Consider the radius of the circles. In order to tell if the circles are touching we:
					a) add the two radius together
					b) subtract the added radius from the distance.
				If distance is < 0 the bacteria are colliding.
		*/
		if((Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2) + Math.pow((z2-z1), 2)) - (r1+r2)) + 0.1 < 0){
			return true;
		}
		else {
			return false;
		}
	};

	//////////////////////////////////
	//    create triangle buffer    //
	//////////////////////////////////

	//all arrays in JS is Float64 by default
	
	var vertex_buffer = gl.createBuffer ();
	var color_buffer = gl.createBuffer ();
	var index_buffer = gl.createBuffer ();

	var positionAttribLocation = gl.getAttribLocation(program,'position');
	var colorAttribLocation = gl.getAttribLocation(program,'color');
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	gl.vertexAttribPointer(
		positionAttribLocation, //attribute location
		3, //number of elements per attribute
		gl.FLOAT, 
		gl.FALSE,
		0,
		0
		);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
	gl.vertexAttribPointer(
		colorAttribLocation, //attribute location
		3, //number of elements per attribute
		gl.FLOAT, 
		gl.FALSE,
		0,
		0
		);
	gl.enableVertexAttribArray(colorAttribLocation);
	gl.useProgram(program);
	gl.enable(gl.DEPTH_TEST);

	//////////////////////////////////
	//            matrics           //
	//////////////////////////////////
	
	var world = new Float32Array(16);
	mat4.identity(world);

	var view = new Float32Array(16);
	mat4.lookAt(view, [0,0,5], [0,0,0],[0,1,0])

	var proj = new Float32Array(16);
	mat4.perspective(proj,glMatrix.glMatrix.toRadian(45),canvas.width/canvas.height,0.1,100);

	//////////////////////////////////
	//    send to vertex shader     //
	//////////////////////////////////
	
	//get the address of each matrix in the vertex shader
	var matWorldUniformLocation = gl.getUniformLocation(program, 'world');
	var matViewUniformLocation = gl.getUniformLocation(program, 'view');
	var matProjUniformLocation = gl.getUniformLocation(program, 'proj');

	//send each matrix to the correct location in vertex shader
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, world);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, view);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, proj);

	var angle = 0;
	var rotz = new Float32Array(16);
	var rotx = new Float32Array(16);
	
	mat4.identity(rotx);
	mat4.identity(rotx);
	

	//////////////////////////////////
	//       Create Bacteria        //
	//////////////////////////////////

	var generatedBacteria = [];
	let genBact = 0;
	let destroyedBacteria = 0;

	for (i = 0; i < 10; i++) {
		generatedBacteria.push(new Bacteria(genBact))
		generatedBacteria[i].generate();
	};

	//////////////////////////////////
	//            Draw              //
	//////////////////////////////////

	gl.clearColor(0.0,0.0,0.0,0.0);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

	// ABOVE LINES SET BACKGROUND COLOUR

	drawPatch(0,0,0,radius,[0.4, 0.4, 0.4], false);
	
	/*for (let i=0; i<generatedBacteria.length; i++){
		generatedBacteria[i].show();
	}*/

	var down = false;
	var startX = 0;
	var startY = 0;

	canvas.onmousedown = function(event) {
		if (event.button == 0) {
			down = true;
			startX = event.clientX;
			startY = event.clientY;
		} 

		var pixelValues = new Uint8Array(4);
		gl.readPixels(event.clientX, canvas.height - event.clientY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelValues);
		console.log(pixelValues); 

		for (i in generatedBacteria) {
			if (generatedBacteria[i].color[0] == (pixelValues[0]/255).toFixed(2) && generatedBacteria[i].color[1] == (pixelValues[1]/255).toFixed(2)){
				if ((pixelValues[0]/255).toFixed(2) == 128 && (pixelValues[1]/255).toFixed(2) == 204) break
				console.log("score before: " + score);
				console.log("radius: " + generatedBacteria[i].r)
				console.log("difference: " + (score + Math.round(1/generatedBacteria[i].r)));
				score += Math.round(1/generatedBacteria[i].r);
				console.log("score after: " + score);
				createExplosion(generatedBacteria[i], event.clientX, event.clientY);
				generatedBacteria[i].delete();
				
			}
		}

	}

	var worldX = 0;
	var worldY = 0;


	canvas.onmousemove = function(ev){

		this.onmouseup = function(ev) {
			down = false;
		}

		if (down) {

			worldX += (startX - ev.clientX)/400;
			worldY += (startY - ev.clientY)/400;

  
			if ( worldX > 360) worldX = 0
			if ( worldY > 360) worldY = 0

		  	mat4.fromRotation(rotx,worldY,[0,0,1]);
		  	mat4.fromRotation(rotz,worldX,[0,1,0]);
		  	mat4.multiply(world,rotz,rotx);
		  	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, world);  
		}
		
	};

};

