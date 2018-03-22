# StatsVR
FPS and Custom Values HUD for WebVR &amp; THREE.js Projects

Shows current FPS, the FPS history as a graph, and custom variables in the HMD view as a HUD, always facing the camera, and always on top.

## Default StatsVR usage, with game demo in background
![Default StatsVR usage, with game demo in background](https://github.com/Sean-Bradley/StatsVR-Demo/blob/master/statsvrdefault.jpg)

## StatsVR displaying custom variables, with game demo in background
![StatsVR displaying custom variables, with game demo in background](https://github.com/Sean-Bradley/StatsVR-Demo/blob/master/statsvrWithCustomVars.jpg)


## Usage

```
//create global variables
var camera, scene, renderer;  <-- commonly used THREE.js variables
var statsVR; 	<-- your global statsvr variable		

function init(){
	//existing THREE.js and webvr setup goes here
	//then after you've instantiated the THREE.js renderer, scene and camera objects,
	statsVR = new StatsVR(scene, camera);   <-- pass your scene and camera objects to the StatsVR constructor
}
init();

//then in your render loop 
function render() {
	
	// your existing animation magic

	statsVR.update();  <-- call the statsvr update

	renderer.render(scene, camera)
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
statsVR = new StatsVR(scene, camera);
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
statsVR.update();
```
The benefit of using StatsVR is that you don't need to remove the HMD to view the FPS or any other custom variable you want to monitor.



