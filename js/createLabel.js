/**
 * Created by iceleaf on 2016/11/10.
 */


var scene, camera, WIDTH, HEIGHT, fov, aspect, near, far,
    renderer, container, control;
var ctx;

var count = 0;
var vector = new THREE.Vector3();
var raycaster = new THREE.Raycaster();
var objects=[];
var intersects;

// find intersections

var mouse = new THREE.Vector2();

window.addEventListener('load', init, false);

function init() {
    createScene();
    createModel();
	
	
	scene.selectable = [];


    createLabel("Wilderness", 40, "views/wilderness.html",-30, 15, -30);
	createLabel("Terrain", 50, "views/terrain.html", 35 ,15, -20);
	createLabel("Lakeside", 50, "views/lakeside.html", 20, 15, 15);
	createLabel("Moutain", 50, "views/mountain.html",-23, 35, 15);
	
	//   words of the label: three.js,   size of the font: 50
    render();
    createOrbit();
    loop();
    window.addEventListener('resize', windowResize, false);
	
	container.appendChild( renderer.domElement );
	document.addEventListener("click", onDocumentMouseClick, false );
	
    // mouse listener
	

}

function onDocumentMouseClick( event ) {

	event.preventDefault();
	// For the following method to work correctly, set the canvas position *static*; margin > 0 and padding > 0 are OK
    mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
    mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.height ) * 2 + 1;
	
	console.log("mouse.x", mouse.x);
	console.log("mouse.y ", mouse.y );
 
	
    //raycaster.intersectObjects( objects, true );
	raycaster.setFromCamera( mouse, camera );

    //intersects = raycaster.intersectObjects( objects );
	intersects = raycaster.intersectObjects( objects, true );
	
	console.log("intersects", intersects.length);

    if ( intersects.length > 0 ) {
		
		
        
        //info.innerHTML = 'INTERSECT Count: ' + ++count;
        window.open(intersects[0].object.userData.URL);
    }
	
	
	
}

function windowResize() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH/HEIGHT;
    camera.updateProjectionMatrix();
}

function createScene() {
    scene = new THREE.Scene();
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    fov = 50;
    aspect = WIDTH/HEIGHT;
    near = 1;
    far = 10000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(50, 120, 50);
}

function createModel() {
    //var geom = new THREE.ConeGeometry( 7, 10, 4 );
    //var mtl  = new THREE.MeshNormalMaterial();
    //var mesh = new THREE.Mesh(geom, mtl);
    //scene.add(mesh);
	//objects.push( mesh );

	
	
	
	// model

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) { };

				THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

				var mtlLoader = new THREE.MTLLoader();
				mtlLoader.setPath( './obj/' );
				mtlLoader.load( 'mountains2.mtl', function( materials ) {

					materials.preload();

					var objLoader = new THREE.OBJLoader();
					objLoader.setMaterials( materials );
					objLoader.setPath( './obj/' );
					objLoader.load( 'mountains2.obj', function ( object ) {

						object.position.x = 0;
						object.position.y = 0;
						object.position.z = 0;
						scene.add( object );
						//objects.push(object );

					}, onProgress, onError );

				});
	
	
		// lights

				light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 1, 10, 1 );
				scene.add( light );

				light = new THREE.DirectionalLight( 0x002288 );
				light.position.set( -1, -1, -1 );
				scene.add( light );

				light = new THREE.AmbientLight( 0x404040 );
				scene.add( light );

				//
				
	
	
}




function createLabel(message, fontSize,url, x, y, z) {
    var canvas = document.createElement('canvas');    //////////////////////////////
                                                      // Create a canvas element. //
                                                      //////////////////////////////
    // 【Remove the two lines of code.】
    // canvas.id = "box";
    // document.body.appendChild(canvas);
    canvas.width = 300;
    canvas.height = 300;
    var canvasSize = 300;
    ctx=canvas.getContext("2d");                      // get 2D drawing context.

    ctx.font = "Bold "+fontSize+"px Bookman";   ////////////////////////////////////
    ctx.textAlign = "center";                   // write some words on the canvas.//
    ctx.fillStyle = "#ffff00";                  ////////////////////////////////////
    ctx.fillText(message, canvasSize/2, canvasSize/2);


    // draw a frame for the text. //
    // Method 1 : ctx.strokeRect();
    // var messageW = ctx.measureText(message).width;
    // var blank = fontSize/3;
    // ctx.strokeStyle = "#62bcfa";
    // ctx.lineWidth=2;
    // ctx.strokeRect(
    //     canvasSize/2-messageW/2-blank,
    //     canvasSize/2-fontSize,
    //     messageW+blank*2,
    //     fontSize+blank
    // );

    // Method 2 : ctx.stroke();
    var messageW = ctx.measureText(message).width;
    var blank = fontSize/3;
    ctx.strokeStyle = "#62bcfa";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(canvasSize/2-messageW/2-blank, canvasSize/2-fontSize);
    ctx.lineTo(canvasSize/2+messageW/2+blank, canvasSize/2-fontSize);
    ctx.lineTo(canvasSize/2+messageW/2+blank, canvasSize/2+blank);
    ctx.lineTo(canvasSize/2-messageW/2-blank, canvasSize/2+blank);
    ctx.closePath();
    ctx.stroke();





    ///// put this label into the 3D scene. /////
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMtl = new THREE.SpriteMaterial({
        map: texture
    });
    var sprite = new THREE.Sprite(spriteMtl);
	//sprite.name="mark";
    sprite.scale.set(25, 25, 20);
    sprite.position.set( x, y, z);
	
	 sprite.userData = { URL: url};
	
    scene.add(sprite);
	objects.push(sprite);
	
	

}



function render() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x5b628a, 1);
    renderer.render(scene, camera);
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
}

function createOrbit() {
    control = new THREE.OrbitControls(camera, renderer.domElement);
}

function loop() {
    scene.traverse(function (child) {
        if(child instanceof THREE.Mesh){
           // child.rotation.y += 0.01;
        }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}
