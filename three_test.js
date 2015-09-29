var camera, scene, controls, renderer;

var corner, blob;

window.corner = corner;
window.blob = blob;


function makeTextSprite( message, _color )
{
	var color = _color || "#FFFFFF";
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold 18px Arial";
	context.fillStyle=color;
	context.fillText( message, 0, 18 );
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: false } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;	
}

function Axes(pSize) {
	var x, y, z, material, mesh;
	var size = pSize || 10;
	
	material = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});
	
	this.setVertices = function() {
			
	}
	
}

function Corner(pSize) {

	var geom, material, mesh, texture;
	var axesGeom, axesMaterial, axesLine, labels;

	var size = pSize || 10;
	
	this.setVertices = function() {
		geom.vertices = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(size, 0, 0),
			new THREE.Vector3(size, size, 0),
			new THREE.Vector3(0, size, 0),
			new THREE.Vector3(0, size, size),
			new THREE.Vector3(0, 0, size),
			new THREE.Vector3(size, 0, size)
		];
		geom.verticesNeedUpdate = true;
		
		var b = 0.02; // buffer
		axesGeom.vertices = [
			new THREE.Vector3(b, b, b),
			new THREE.Vector3(size+2, b, b),
			new THREE.Vector3(b, b, b),
			new THREE.Vector3(b, size+2 ,b),
			new THREE.Vector3(b, b, b),
			new THREE.Vector3(b, b, size+2)
		];
		axesGeom.verticesNeedUpdate = true;
	}
	
	var init = function() {
		// load a texture, set wrap mode to repeat
		texture = THREE.ImageUtils.loadTexture( "images/grid.png" );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = THREE.LinearFilter;

		// set up geometry objects
		geom = new THREE.Geometry();
		axesGeom = new THREE.Geometry();
		this.setVertices();
		
		// create corner faces
		geom.faces.push(
			new THREE.Face3(0, 1, 2),
			new THREE.Face3(0, 2, 3),
			new THREE.Face3(0, 3, 4),
			new THREE.Face3(0, 4, 5),
			new THREE.Face3(0, 5, 6),
			new THREE.Face3(0, 6, 1)
		);		
		geom.computeFaceNormals();
		geom.computeVertexNormals();

		// set UV texture mapping coordinates
		for (var i = 0; i < 6; i++) {
			if (i%2 == 0) geom.faceVertexUvs[0][i] = [ new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(1,1) ];
			else geom.faceVertexUvs[0][i] = [ new THREE.Vector2(0,0), new THREE.Vector2(1,1), new THREE.Vector2(1,0) ];
		}
		geom.uvsNeedUpdate = true;
		
		texture.repeat.set( size, size );
		texture.needsUpdate=true;
		
		// set up material
		material = new THREE.MeshLambertMaterial( {map: texture} );
		//material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('images/water.jpg') } );
		material.side = THREE.DoubleSide;
		material.opacity = 0.4;		

		// create mesh
		mesh = new THREE.Mesh(geom, material);
		
		// create axes
		axesMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
		axesLine = new THREE.Line(axesGeom, axesMaterial);
	}
	
	this.getMesh = function() {
		return mesh;
	}
	
	this.getAxes = function() {
		return axesLine;
	}
	
	this.setSize = function(pNewSize) {
		size = pNewSize;
		this.setVertices();
		texture.repeat.set( size, size );
		texture.needsUpdate=true;
	}
	
	
	
	init.call(this);
}

function randomPoints() {
	var r = function() {
		var size = 10;
		return (0.5*size) + (Math.random() * 3);
	}
	var x = r();
	var xy = [r(), r()];
	var y = r();
	var yz = [r(), r()];
	var z = r();
	var xz = [r(), r()];
	var avg = [
		(x + xy[0] + xz[0]) / 3,
		(y + xy[1] + yz[0]) / 3,
		(z + xz[1] + yz[1]) / 3
	];
	return [[0,0,0], [x,0,0], [xy[0], xy[1], 0], [0, y, 0], [0, yz[0], yz[1]], [0, 0, z], [xz[0], 0, xz[1]], avg];
}

function Blob(aPoints) {
	var geom, material, mesh, edges;
	var points = aPoints || randomPoints();
	
	this.setVertices = function() {
		var vertices = [];
		for (var i in points) {
			var pt = points[i];
			vertices.push(new THREE.Vector3(pt[0],pt[1],pt[2]));
		}		
		geom.vertices = vertices;
		geom.verticesNeedUpdate = true;
	
		
		if (edges != null) scene.remove(edges);
		if (mesh != null) {
			edges = new THREE.EdgesHelper( mesh, 0x666666, 30 );
			scene.add(edges);
		}
	}

	
	
	var init = function() {
		geom = new THREE.Geometry();
		this.setVertices();
		geom.faces.push(
			new THREE.Face3(0, 1, 2),
			new THREE.Face3(0, 2, 3),
			new THREE.Face3(0, 3, 4),
			new THREE.Face3(0, 4, 5),
			new THREE.Face3(0, 5, 6),
			new THREE.Face3(0, 6, 1),
			new THREE.Face3(7, 1, 2),
			new THREE.Face3(7, 2, 3),
			new THREE.Face3(7, 3, 4),
			new THREE.Face3(7, 4, 5),
			new THREE.Face3(7, 5, 6),
			new THREE.Face3(7, 6, 1)
		);
		geom.computeFaceNormals();
		geom.computeVertexNormals();	

		// create material
		material = new THREE.MeshLambertMaterial({color: 0xC2A385});		

		// create mesh
		mesh = new THREE.Mesh(geom, material);
		this.mesh = mesh;

		edges = new THREE.EdgesHelper( mesh, 0x666666, 30 );
	}
	
	this.getMesh = function() {
		return mesh;
	}
	
	this.getEdges = function() {
		return edges;
	}
	
	this.getPoints = function() {
		return points;
	}
	
	this.setPoints = function(newPoints) {
		if (newPoints) points = newPoints;
		this.setVertices();
		
		var max = 0;
		for (var p in points) {
			for (var c in points[p]) {
				max = Math.max(max, points[p][c]);
			}
		}
		var newSize = 5*Math.ceil((max*1.2)/5);
		corner.setSize(newSize);
	}
	
	this.setColor = function(color) {
		material.color = color;
	}
	
	var self = this;
	this.animate = function(_newPoints, _newColor) {
		var newPoints = _newPoints || randomPoints();
		var startingPoints = JSON.parse(JSON.stringify(points));
		
		var startingColor = new THREE.Color();
		startingColor.copy(material.color);
		var newColor = _newColor || startingColor;
		
		d3.transition()
			//.ease('linear')
			.duration(1500)
			.tween("blob", function() {
				var interpolators = [];
				var colorInterpolator = d3.interpolateRgb(
					d3.rgb("#"+startingColor.getHexString()),
					d3.rgb("#"+newColor.getHexString())
				);
				for (var i in startingPoints) {
					interpolators[i] = [];
					for (var j in startingPoints[i]) {
						interpolators[i][j] = d3.interpolateNumber(startingPoints[i][j], newPoints[i][j]);
					}
				}

				return function(t) {
					for (var i in interpolators) {
						for (var j in interpolators[i]) {
							points[i][j] = interpolators[i][j](t);
						}
					}
					self.setPoints();
					
					var color = colorInterpolator(t);
					self.setColor( new THREE.Color(color.toString()) );
				}
			});
	}
	
	
	init.call(self);		
}

function init(el) {
	var resizeRenderer = function() {
		var bbox = this.getBoundingClientRect();
		
		camera.aspect = bbox.width / bbox.height;
		camera.updateProjectionMatrix();
		
		renderer.setSize(bbox.width, bbox.height);
		
	}.bind(el);
	
	// set up renderer
	renderer = new THREE.WebGLRenderer({antialiasing: true});
	renderer.shadowMapEnabled = true;

	el.appendChild(renderer.domElement);
	
	// set up camera
	camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
	camera.position.x = 20;
	camera.position.y = 12;
	camera.position.z = 15;
	resizeRenderer();

	// set up resize event
	window.onresize = resizeRenderer;
	
	// orbit controls
    controls = new THREE.OrbitControls( camera, el );
    controls.damping = 0.2;
    controls.addEventListener( 'change', render );
    
	// scene
    scene = new THREE.Scene();

	// "half-cube"
	corner = new Corner(10);
	scene.add(corner.getMesh());
	scene.add(corner.getAxes());
	
	// randomize the data (DEBUG)
	if (window.location.search.indexOf('debug') > 0) {
		writeToForm( {surgeon: randomPoints(), pathologist: randomPoints()} );
	}
	// add our shape
	blob = new Blob(readPoints('surgeon'));
	scene.add(blob.getMesh());
	scene.add(blob.getEdges());
	
	
	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);

	// directional lighting
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set(0.2, 0.8, 0.5);
	scene.add(directionalLight);
	
	initUI();
	
	animate();
}

function initUI() {
	d3.select('#rdoSurgeon').property('checked', true);
	d3.selectAll('input')
		.on('change', function(){
			var type = d3.select('input[type=radio]:checked').attr('value');
			var color = type=='surgeon' ? new THREE.Color(0xC2A385) : new THREE.Color(0xB87070)
			blob.animate(readPoints(type), color);
		});
}

function render() {
	renderer.render(scene, camera);
}

function animate() {
	controls.update();
	requestAnimationFrame(animate);
	render();
}

function readPoints(type) {
	//d3.selectAll('.surgeon').selectAll('.coord');

	var points = [];
	var coordinates = d3.selectAll('.' + type).selectAll('.coord');
	coordinates.each(function(d,i,iOuter){
		if (typeof points[iOuter] === "undefined") points[iOuter] = [];
		var val = 0;
		var input = d3.select(this).select('input');
		if (input.size() == 1) {
			try {
				val = parseFloat(input.property('value'));
				if (isNaN(val)) val = 0;
			} catch(err) {
				console.error('failed to read a number from input field',input);
			}
		}		
		points[iOuter][i] = val;
	});
	return points;
}

function readForm() {
	return {'surgeon': readPoints('surgeon'), 'pathologist': readPoints('pathologist')};
}

function writePoints(type, points) {
	var coordinates = d3.selectAll('.' + type).selectAll('.coord');
	coordinates.each(function(d,i,iOuter){
		if (typeof points[iOuter] === "undefined") points[iOuter] = [];
		var val = 0;
		var input = d3.select(this).select('input');
		if (input.size() == 1) {
			input.property('value', points[iOuter][i].toFixed(2));
		}		
	});
}

function writeToForm(obj) {
	if (typeof obj.surgeon != "undefined") writePoints('surgeon', obj.surgeon);
	if (typeof obj.pathologist != "undefined") writePoints('pathologist', obj.pathologist);
}

init(document.getElementById('renderer'));



