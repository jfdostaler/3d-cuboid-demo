var camera, scene, controls, renderer;
var geometry, material, mesh, pointLight;

init();

function init() {
	
	// set up renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// set up camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = 15;
	camera.position.y = 12;
	camera.position.z = 15;

	// orbit controls
    controls = new THREE.OrbitControls( camera );
    controls.damping = 0.2;
    controls.addEventListener( 'change', render );
    
	// scene
    scene = new THREE.Scene();

	// "half-cube"
	var size = 10;
	cornerGeom = new THREE.Geometry();
	cornerGeom.vertices.push(
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(size, 0, 0),
		new THREE.Vector3(size, size, 0),
		new THREE.Vector3(0, size, 0),
		new THREE.Vector3(0, size, size),
		new THREE.Vector3(0, 0, size),
		new THREE.Vector3(size, 0, size)
	);
	cornerGeom.faces.push(
		new THREE.Face3(0, 1, 2),
		new THREE.Face3(0, 2, 3),
		new THREE.Face3(0, 3, 4),
		new THREE.Face3(0, 4, 5),
		new THREE.Face3(0, 5, 6),
		new THREE.Face3(0, 6, 1)
	);
	
	cornerGeom.computeFaceNormals();
	cornerGeom.computeVertexNormals();
	
	// load a texture, set wrap mode to repeat
	var texture = THREE.ImageUtils.loadTexture( "textures/water.jpg" );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( size, size );
	
	// material
	cornerMaterial = new THREE.MeshLambertMaterial();
	cornerMaterial.side = THREE.DoubleSide;
	cornerMaterial.opacity = 0.4;
	
	// add to scene
	corner = new THREE.Mesh(cornerGeom, cornerMaterial);
	scene.add(corner);

	// add our shape
	function r() { return 4 + (Math.random() * 2); }
	var shapeGeom = new THREE.Geometry();
	shapeGeom.vertices.push(
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(r(), 0, 0),
		new THREE.Vector3(r(), r(), 0),
		new THREE.Vector3(0, r(), 0),
		new THREE.Vector3(0, r(), r()),
		new THREE.Vector3(0, 0, r()),
		new THREE.Vector3(r(), 0, r()),
		new THREE.Vector3(r(), r(), r()) // interpolate the last one... tough to do with random though
	);
	shapeGeom.faces.push(
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
	shapeGeom.computeFaceNormals();
	shapeGeom.computeVertexNormals();	
	
	var shapeMaterial = new THREE.MeshLambertMaterial({color: 0x1111aa});
	shape = new THREE.Mesh(shapeGeom, shapeMaterial); 
	scene.add(shape);
	
	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x606060);
	scene.add(ambientLight);

	// lighting
	pointLight = new THREE.PointLight(0xffffff,1,size*2);
	pointLight.position.x = size * 1.2;
	pointLight.position.y = 0.5;
	pointLight.position.z = 0.5;
	scene.add(pointLight);

	pointLight = new THREE.PointLight(0xffffff,1,size*2);
	pointLight.position.x = 0.5;
	pointLight.position.y = size * 1.2;
	pointLight.position.z = 0.5;
	scene.add(pointLight);

	pointLight = new THREE.PointLight(0xffffff,1,size*2);
	pointLight.position.x = 0.5;
	pointLight.position.y = 0.5;
	pointLight.position.z = size * 1.2;
	scene.add(pointLight);
	
	//pointLight.position.x = size*1.2;
	//pointLight.position.y = size*1.4;
	//pointLight.position.z = size*1.6;

	
	scene.add(pointLight);
	
	render();
}

function render() {
	renderer.render(scene, camera);
}

function animate() {
	controls.update();
	requestAnimationFrame(animate);
	render();
}