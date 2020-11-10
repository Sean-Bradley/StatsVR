import * as THREE from '/build/three.module.js'
import StatsVR from './statsvr.js'
import { VRButton } from '/jsm/webxr/VRButton'

const scene: THREE.Scene = new THREE.Scene()

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.xr.enabled = true
document.body.appendChild(renderer.domElement)

document.body.appendChild(VRButton.createButton(renderer))

var floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(100, 100, 10, 10),
    new THREE.MeshBasicMaterial({
        color: 0x008800,
        wireframe: true
    })
)
floor.rotation.x = Math.PI / -2
floor.position.y = -0.001
scene.add(floor)

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

const statsVR = new StatsVR(camera)
//change default statsvr position
statsVR.setX(-.5)
statsVR.setY(.5)
statsVR.setZ(-5)

const hudX = new THREE.Object3D()
let geometry = new THREE.Geometry()
geometry.vertices.push(new THREE.Vector3(-.5, 0, 0))
geometry.vertices.push(new THREE.Vector3(.5, 0, 0))
let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x888888 }));
line.position.z = -5
statsVR.add(line)
geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(0, -.5, 0))
geometry.vertices.push(new THREE.Vector3(0, .5, 0))
line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x888888 }));
line.position.z = -5;
statsVR.add(line);

for (var i = 0; i < 360; i = i + 5) {
    geometry = new THREE.Geometry()
    if (i % 10 === 0) {
        geometry.vertices.push(new THREE.Vector3(0, -.1, 0))
        geometry.vertices.push(new THREE.Vector3(0, .1, 0))
    } else {
        geometry.vertices.push(new THREE.Vector3(0, -.05, 0))
        geometry.vertices.push(new THREE.Vector3(0, .05, 0))
    }
    line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x888888 }))
    line.position.x = 5 * Math.cos(i * Math.PI / 180)
    line.position.z = 5 * Math.sin(i * Math.PI / 180)
    hudX.add(line)
}

const hudY = new THREE.Object3D()
for (var i = 0; i < 360; i = i + 5) {
    geometry = new THREE.Geometry();
    if (i % 10 === 0) {
        geometry.vertices.push(new THREE.Vector3(-.1, 0, 0))
        geometry.vertices.push(new THREE.Vector3(.1, 0, 0))
    } else {
        geometry.vertices.push(new THREE.Vector3(-.05, 0, 0))
        geometry.vertices.push(new THREE.Vector3(.05, 0, 0))
    }
    line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x888888 }))
    line.position.z = 5 * Math.cos(i * Math.PI / 180)
    line.position.y = 5 * Math.sin(i * Math.PI / 180)
    hudY.add(line)
}

statsVR.add(hudX)
statsVR.add(hudY)

const HalfPI = Math.PI / 2
const cameraWorldQuaternion = new THREE.Quaternion()

function render() {

    statsVR.startTimer();

    statsVR.update();

    if (renderer.xr.isPresenting) {
        const lookAtVector = new THREE.Vector3(0, 0, -1)
        let xrCamera = renderer.xr.getCamera(camera);
        xrCamera.getWorldQuaternion(cameraWorldQuaternion);
        lookAtVector.applyQuaternion(cameraWorldQuaternion)

        const mx = new THREE.Matrix4().lookAt(lookAtVector, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
        const qt = new THREE.Quaternion().setFromRotationMatrix(mx);

        let rotation = new THREE.Euler().setFromQuaternion(qt, 'XYZ');
        if (rotation.x >= -HalfPI && rotation.x < HalfPI) {
            hudX.rotation.y = rotation.y * -1
        } else {
            hudX.rotation.y = rotation.y
        }

        statsVR.setCustom1("x:" + xrCamera.position.x.toFixed(2))
        statsVR.setCustom2("y:" + xrCamera.position.y.toFixed(2))
        statsVR.setCustom3("z:" + xrCamera.position.z.toFixed(2))

        rotation = new THREE.Euler().setFromQuaternion(qt, 'YZX')
        if (rotation.y >= -HalfPI && rotation.y < HalfPI) {
            hudY.rotation.x = rotation.x * -1
        } else {
            hudY.rotation.x = rotation.x
        }
    }
    
    renderer.render(scene, camera)

    statsVR.endTimer()
}

renderer.setAnimationLoop(render)