# StatsVR
FPS and Custom Values HUD for WebVR &amp; THREE.js Projects

Shows current FPS, the FPS history as a graph, and custom variables in the HMD view as a HUD, always facing the camera, and always on top.

## Demo webpage example usage, 
https://sean-bradley.github.io/StatsVR-Demo/ (requires firefox, Oculus CV1, 2 Oculus Touch controllers and Rift Core 2.0 disabled in settings)


## Usage

Download statsvr.min.js, save it, and include reference to script in your html head. eg

``<script type="text/javascript" src="statsvr.min.js"></script>``
```

//create global variables
var camera, scene, renderer;  <-- these are commonly used THREE.js variables and may already exist in your project
var StatsVR; 	<-- create your global statsvr variable. I named mine StatsVR

function init(){
	//existing THREE.js and webvr setup goes here
	//then after you've instantiated the THREE.js renderer, scene and camera objects,
	StatsVR = new StatsVR(scene, camera);   <-- pass your scene and camera objects to the StatsVR constructor
}
init();
```

### Default FPS Counter and Graph
![Default FPS Counter and Graph](https://github.com/Sean-Bradley/StatsVR-Demo/blob/master/statsVR_FPS.jpg)

To show the default StatsVR FPS counter and graph, add the line 

``StatsVR.update();`` 

anywhere inside your THREE.js render or animation loop.

eg,
```
function render() {
	// your existing animation magic

	StatsVR.update();  <-- required

	renderer.render(scene, camera)
}
renderer.animate(render);
```

### Show the FPS and Optional MS Counters and Graphs
![FPS and Optional MS Counters and Graphs](https://github.com/Sean-Bradley/StatsVR-Demo/blob/master/statsVR_FPS_MS.jpg)

To show the StatsVR FPS and MS counters and graphs, also add the lines

```
StatsVR.msStart();
//code you want to monitor the MS of goes here
StatsVR.msEnd();
``` 

anywhere inside your THREE.js render or animation loop.

eg,
```
function render() {
	// your existing animation magic
	StatsVR.msStart(); //starts the MS monitor timespan
	//specific code you want to monitor the MS of goes here
	StatsVR.msEnd(); //ends the MS monitor timespan
	
	StatsVR.update(); //required anywhere within the loop

	renderer.render(scene, camera)
}
renderer.animate(render);
```
or, i you want to check the MS duration of your entire render or animation loop, 
```
function render() {
	StatsVR.msStart(); <!--starts the MS monitor timespan
	// your existing animation magic
	
	StatsVR.update();  <-- required anywhere within the loop

	renderer.render(scene, camera)
	
	StatsVR.msEnd(); <!--end the MS monitor timespan
}
renderer.animate(render);
```



## Customisation
The panel is shown at 
X = 0,
Y = 1.5,
Z = -5 
offset from the camera position and rotation in the THREE.js worldspace.
You can modify those defaults if you want, eg
```
statsVR.setX(1);
statsVR.setY(0);
statsVR.setZ(-10);
```

You can also show up to 3 extra custom values in the display, such as values you may want to track during execution of your program.
eg, in the render loop,
```
statsVR.setCustom1(myVar);
statsVR.setCustom2(anotherVar);
statsVR.setCustom3(optionalyAnythingElse);
```
The benefit of using StatsVR is that you don't need to remove the HMD to view the FPS or any other custom variable you want to monitor.



