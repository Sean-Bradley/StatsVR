(function (global, factory) {

    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.StatsVR = factory());

}(this, (function () {
    'use strict';

    /**
     * @author Sean Bradley /
     * https://www.youtube.com/user/seanwasere
     * https://github.com/Sean-Bradley
     * https://seanwasere.com/
     */

    var StatsVR = (function (scene, camera) {
        var canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        var ctx = canvas.getContext('2d');

        var texture = new THREE.Texture(canvas);
        var material = new THREE.MeshBasicMaterial({ map: texture, depthTest: false, transparent: true });
        var geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        var statsPlane = new THREE.Mesh(geometry, material);

        statsPlane.position.x = 0;
        statsPlane.position.y = 1.5;
        statsPlane.position.z = -5;

        var pivot = new THREE.Object3D();
        pivot.add(statsPlane);
        scene.add(pivot);

        var timer = (performance || Date);
        var statsDisplayRefreshDelay  = 100;

        var fpsLastTime = timer.now();
        var fpsFrames = 0;
        var fpsGraphData = new Array(32).fill(0);

        var msActive = false;
        var msStart = timer.now();
        var msEnd = timer.now();
        var msGraphData = new Array(32).fill(0);
        var ms = 0;

        var custom1 = null;
        var custom2 = null;
        var custom3 = null;

        return {
            setX: function (val) {
                statsPlane.position.x = val;
            },
            setY: function (val) {
                statsPlane.position.y = val;
            },
            setZ: function (val) {
                statsPlane.position.z = val;
            },
            setCustom1: function (val) {
                custom1 = val;
            },
            setCustom2: function (val) {
                custom2 = val;
            },
            setCustom3: function (val) {
                custom3 = val;
            },

            msStart: function (val) {
                msActive = true;
                msStart = timer.now();
            },
            msEnd: function (val) {
                msEnd = timer.now();
                //console.log(msStart + " " + msEnd);
                ms = (((msEnd - msStart) * 100) / 100).toFixed(2);
            },

            update: function () {
                pivot.rotation.copy(camera.rotation);
                pivot.position.setFromMatrixPosition(camera.matrixWorld);

                texture.needsUpdate = true;

                var now = timer.now();
                var dt = now - fpsLastTime;
                fpsFrames++;
                if (now > fpsLastTime + statsDisplayRefreshDelay) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    //FPS
                    fpsLastTime = now;
                    var FPS = ((((fpsFrames * 1000) / dt) * 100) / 100).toFixed(2);
                    fpsFrames = 0;

                    fpsGraphData.push(FPS);
                    if (fpsGraphData.length >= 32) {
                        fpsGraphData.shift();
                    }
                    var ratio = Math.max.apply(null, fpsGraphData);

                    ctx.strokeStyle = '#035363';
                    for (var i = 0; i < 32; i++) {
                        ctx.beginPath();
                        ctx.moveTo(i, 16);
                        ctx.lineTo(i, (16 - (fpsGraphData[i] / ratio) * 16));
                        ctx.stroke();
                    }

                    ctx.font = "13px Calibri";
                    ctx.fillStyle = "#00cc00";
                    ctx.fillText(FPS, 1, 13);

                    //MS
                    if (msActive) {
                        msGraphData.push(ms);
                        if (msGraphData.length >= 32) {
                            msGraphData.shift();
                        }
                        ratio = Math.max.apply(null, msGraphData);
                        ctx.strokeStyle = '#f35363';
                        for (var i = 0; i < 32; i++) {
                            ctx.beginPath();
                            ctx.moveTo(i + 32, 16);
                            ctx.lineTo(i + 32, (16 - (msGraphData[i] / ratio) * 16));
                            ctx.stroke();
                        }
                        ctx.font = "13px Calibri";
                        ctx.fillStyle = "#00ccff";
                        ctx.fillText(ms, 33, 13);
                    }

                    //Custom
                    if (custom1) {
                        ctx.font = "11px";
                        ctx.fillStyle = "#ffffff";
                        ctx.fillText(custom1, 0, 29);
                    }
                    if (custom2) {
                        ctx.font = "11px";
                        ctx.fillStyle = "#ffffff";
                        ctx.fillText(custom2, 0, 45);
                    }
                    if (custom3) {
                        ctx.font = "11px";
                        ctx.fillStyle = "#ffffff";
                        ctx.fillText(custom3, 0, 61);
                    }
                }
            }
        };
    });

    return StatsVR;
})));