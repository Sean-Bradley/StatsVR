import * as THREE from '/build/three.module.js'
import StatsVR from './statsvr.js'
import { VRButton } from '/jsm/webxr/VRButton'
import Explosion from './explosion.js'
import { Vector3 } from '/build/three.module.js'

let Score = 0

const scene: THREE.Scene = new THREE.Scene()

const explosions: Explosion[] = []
explosions.push(new Explosion(new THREE.Color(0xff0000), scene))

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.xr.enabled = true
document.body.appendChild(renderer.domElement)

document.body.appendChild(VRButton.createButton(renderer))

const controller0 = renderer.xr.getController(0)
scene.add(controller0)
const controllerGrip0 = renderer.xr.getControllerGrip(0)
controllerGrip0.addEventListener("connected", (e: any) => { controller0.userData.gamepad = e.data.gamepad })

const controller1 = renderer.xr.getController(1);
scene.add(controller1);
const controllerGrip1 = renderer.xr.getControllerGrip(1)
controllerGrip1.addEventListener("connected", (e: any) => { controller1.userData.gamepad = e.data.gamepad })

const swordMaterial = new THREE.MeshBasicMaterial({ color: 0xDB3236 })

const collidableMeshList: THREE.Mesh[] = [];

const swordLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 4.0, 0.03),
    swordMaterial
);
swordLeft.geometry.translate(0, -1.9, 0);
swordLeft.geometry.rotateX(-Math.PI / 8)
controller0.add(swordLeft);
collidableMeshList.push(swordLeft);
const swordLeftHandGuard = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.05, 0.2, 6),
    swordMaterial
);
swordLeftHandGuard.geometry.rotateX(-Math.PI / 8)
controller0.add(swordLeftHandGuard);

const swordRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 4.0, 0.03),
    swordMaterial
);
swordRight.geometry.translate(0, -1.9, 0);
swordRight.geometry.rotateX(-Math.PI / 8)
controller1.add(swordRight)
collidableMeshList.push(swordRight)
const swordRightHandGuard = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.05, 0.2, 6),
    swordMaterial
);
swordRightHandGuard.geometry.rotateX(-Math.PI / 8)
controller1.add(swordRightHandGuard);


const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

const cubes: THREE.Mesh[] = []
for (let i = 0; i < 5; i++) {
    cubes.push(new THREE.Mesh(boxGeometry, boxMaterial))
    cubes[i].position.x = (Math.random() * 10) - 5
    cubes[i].position.y = (Math.random() * 2)
    cubes[i].position.z = -100
    cubes[i].visible = false
    cubes[i].userData = { type: "cube", active: false }
    collidableMeshList.push(cubes[i])
    scene.add(cubes[i])
}

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

const clock: THREE.Clock = new THREE.Clock()

function render() {

    statsVR.startTimer()

    let delta = clock.getDelta()

    cubes.forEach(c => {
        if (c.userData.active) {
            c.position.z += 100 * delta
            if (c.position.z > 10) {
                c.visible = false
                c.userData.active = false;
                c.position.z = -100
                c.position.x = (Math.random() * 10) - 5
                c.position.y = (Math.random() * 2)
            }
        }
    })

    let swordLeftCollided = false
    for (let v = 0; v < swordLeft.geometry.vertices.length; v++) {
        if (!swordLeftCollided) {
            const localVertex = swordLeft.geometry.vertices[v].clone()
            const globalVertex = localVertex.applyMatrix4(swordLeft.matrixWorld)
            const swordLeftWorldPosition = new Vector3()
            swordLeft.getWorldPosition(swordLeftWorldPosition)
            const directionVector = globalVertex.sub(swordLeftWorldPosition)

            const ray = new THREE.Raycaster(swordLeftWorldPosition, directionVector.clone().normalize())
            const collisionResults = ray.intersectObjects(collidableMeshList)
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                swordLeftCollided = true
                //haptics disabled until supported
                // if (controller0.userData.gamepad && controller0.userData.gamepad.hapticActuators && controller1.userData.gamepad.hapticActuators.length > 0) {
                //     controller0.userData.gamepad.hapticActuators[0].pulse(0.25, 10);
                // }
                swordLeft.material.color.setHex(0xFF8800)
                explosions[0].explode(collisionResults[0].point)
                if (collisionResults[0].object.userData.type === "cube") {
                    Score++;
                }
            }
        }
    }
    if (!swordLeftCollided) {
        swordLeft.material.color.setHex(0xDB3236);
    }

    let swordRightCollided = false
    for (let v = 0; v < swordRight.geometry.vertices.length; v++) {
        if (!swordRightCollided) {
            const localVertex = swordRight.geometry.vertices[v].clone()
            const globalVertex = localVertex.applyMatrix4(swordRight.matrixWorld)
            const swordRightWorldPosition = new Vector3()
            swordRight.getWorldPosition(swordRightWorldPosition)
            const directionVector = globalVertex.sub(swordRightWorldPosition)

            const ray = new THREE.Raycaster(swordRightWorldPosition, directionVector.clone().normalize())
            const collisionResults = ray.intersectObjects(collidableMeshList)
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                swordRightCollided = true
                //haptics disabled until supported
                // if (controller1.userData.gamepad && controller1.userData.gamepad.hapticActuators && controller1.userData.gamepad.hapticActuators.length > 1) {
                //     controller1.userData.gamepad.hapticActuators[1].pulse(0.25, 10);
                // }
                swordRight.material.color.setHex(0xFF8800)
                explosions[0].explode(collisionResults[0].point)
                if (collisionResults[0].object.userData.type === "cube") {
                    Score++;
                }
            }
        }
    }
    if (!swordRightCollided) {
        swordRight.material.color.setHex(0xDB3236);
    }

    explosions.forEach(e => {
        e.update()
    })

    statsVR.setCustom1("Score:" + Score);
    statsVR.setCustom2(delta.toFixed(5));
    statsVR.setCustom3("seanwasere");

    statsVR.update()

    renderer.render(scene, camera)

    statsVR.endTimer()

}

renderer.setAnimationLoop(render)

setInterval(() => {
    for (let i = 0; i < 5; i++) {
        if (cubes[i].userData.active === false) {
            cubes[i].userData.active = true;
            cubes[i].visible = true
            break;
        }
    }
}, 250)
