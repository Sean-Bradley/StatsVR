# StatsVR
Performance statistics HUD specifically for WebVR &amp; THREE.js Projects that use a HMD, such as Oculus Rift

The StatsVR HUD displays the frames per second (FPS), milliseconds (MS) and up to 3 custom variables in the HMD view, always facing the camera, and always on top of other meshes in the scene.

You can download the project and view the examples.

```bash
git clone https://github.com/Sean-Bradley/StatsVR.git
cd StatsVR
npm install
npm run dev
```

Visit http://127.0.0.1:3000/

This is a typescript project consisting of two sub projects with there own *tsconfigs*.

To edit this example, then modify the files in ./src/client/ or ./src/server/. 

The projects will auto recompile if you started it by using *npm run dev*

or

You can simply just import the generated *./dist/client/statsvr.js* directly into your own project as a module.

```javascript
<script type="module" src="./statsvr.js"></script>
```

or as ES6 import

```javascript
import StatsVR from './statsvr.js'
```

## Simplest Example

* Import StatsVR
	```javascript
	import StatsVR from './statsvr.js';
	```
* Add your Threejs Camera to the Scene. (Otherwise StatsVR won't be visible in the HMD)
	```javascript
	scene.add(camera);
	```
* Instantiate and position StatsVR
	```javascript
	const statsVR = new StatsVR(camera);
	//change default statsvr position
	statsVR.setX(0);
	statsVR.setY(0);
	statsVR.setZ(-2);
	```
* Update StatsVR in the render loop
	```javascript
	statsVR.update();
	```

```javascript{2,6,26,27,28,29,30,32}
import * as THREE from '/build/three.module.js';
import StatsVR from './statsvr.js';
import { VRButton } from '/jsm/webxr/VRButton';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));
var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100, 10, 10), new THREE.MeshBasicMaterial({
    color: 0x008800,
    wireframe: true
}));
floor.rotation.x = Math.PI / -2;
floor.position.y = -0.001;
scene.add(floor);
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
const statsVR = new StatsVR(camera);
//change default statsvr position
statsVR.setX(0);
statsVR.setY(0);
statsVR.setZ(-2);
function render() {
    statsVR.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(render);
```

## Example 1
![Demo 1](./dist/client/img/demo1.gif)

## Example 2
![Demo 2](./dist/client/img/demo2.gif)

## Example 3
![Demo 3](./dist/client/img/demo3.gif)

## Example 4
![Demo 4](./dist/client/img/demo4.gif)

<!-- ## Video Tutorial of using StatsVR
[![StatsVR Tutorial for WebVR and ThreeJS projects](https://img.youtube.com/vi/TZNZoaiTUwg/0.jpg)](https://www.youtube.com/watch?v=TZNZoaiTUwg) -->

<!-- ## StatsVR GitHub Repository
https://github.com/Sean-Bradley/StatsVR -->

<!-- ## StatsVR Examples,
https://sean-bradley.github.io/StatsVR/  -->
<!-- 
## Initial Setup
Download statsvr.js, save it, and include reference to script in your html head. eg

``<script type="text/javascript" src="statsvr.min.js"></script>`` -->

<!-- Create global variables
```javascript
var camera, scene, renderer;  // these are commonly used THREE.js variables and may already exist in your project
var statsVR; // create your global statsvr variable. I named mine statsVR

function init(){
	// existing THREE.js and webvr setup goes here
	// then after you've instantiated the THREE.js renderer, scene and camera objects,
	statsVR = new StatsVR(scene, camera);  // pass your scene and camera objects to the StatsVR constructor
}
init();
```

## Showing the Default FPS Counter and Graph
![Default FPS Counter and Graph](docs/img/statsVR_FPS.jpg)

To show the default StatsVR FPS counter and graph, add the line 
``statsVR.update();`` 
anywhere inside your THREE.js render or animation loop.

eg,
```javascript
function render() {
	// your existing animation magic

	statsVR.update();  // required anywhere within the loop

	renderer.render(scene, camera)
}
renderer.animate(render);
```

## Showing the FPS and also the optional MS Counters and Graphs
![FPS and Optional MS Counters and Graphs](docs/img/statsVR_FPS_MS.jpg)

To show the StatsVR FPS along with the optional MS counter and graph, also add the lines

```javascript
statsVR.msStart();
//code you want to monitor the MS duration of goes here
statsVR.msEnd();
``` 

anywhere inside your THREE.js render or animation loop.

eg,
```javascript
function render() {
	// your existing animation magic
	statsVR.msStart(); // starts the MS monitor timespan
	// specific code you want to monitor the MS duration of goes here
	statsVR.msEnd(); // ends the MS monitor timespan
	
	statsVR.update(); //required anywhere within the loop

	renderer.render(scene, camera)
}
renderer.animate(render);
```
or, if you want to check the MS duration of your entire render or animation loop, put the ``msStart()`` and ``msEnd()`` procedure calls at the beginning and end of your entire render loop.
eg,
```javascript
function render() {
	statsVR.msStart(); // starts the MS monitor timespan

	// your existing animation magic
	
	statsVR.update();  // required anywhere within the loop

	renderer.render(scene, camera)
	
	statsVR.msEnd(); // end the MS monitor timespan
}
renderer.animate(render);
```


### Also Show the optional custom fields along with the usual FPS and optional MS Counters and Graphs.
![FPS, MS and Custom fields](docs/img/statsVR_FPS_MS_3Customs.jpg)

You can also show up to 3 extra custom values in the display, such as values you may want to track during execution of your program.
eg, anywhere witihn your render loop,
```javascript
statsVR.setCustom1(myVar);
statsVR.setCustom2(anotherVar);
statsVR.setCustom3(optionalyAnyOtherVarYouWantToMonitor);
```


### Customising the StatsVR position inside the HMD view
The default panel is shown at offset
```javascript
X = 0,
Y = 1.5,
Z = -5 
```
from the camera position and rotation in the THREE.js worldspace.
You can modify those defaults if you want, eg, after you initialise the StatsVR object, you can change it's display coordinates.
```
statsVR.setX(1);
statsVR.setY(0);
statsVR.setZ(-10);
```


The benefit of using StatsVR is that you don't need to remove the HMD to view the FPS or any other custom variable you want to monitor.


### Set Visibility
```javascript
statsVR.setEnabled(true);  //visible, default
statsVR.setEnabled(false); //hidden
```
Note that the StatsVR is still in memory and may still be updated by your code. 
StatsVR was originally written as as a debug tool, so you will get slightly better performance by removing StatsVR once you are satisified with your performance of your code or when compiling your production build.


 -->
