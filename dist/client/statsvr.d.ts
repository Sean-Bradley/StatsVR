/**
 * @license
 * StatsVR library and demos
 * Copyright 2018-2021 Sean Bradley
 * https://github.com/Sean-Bradley/StatsVR/blob/master/LICENSE
 */
import * as THREE from "three";
export default class StatsVR {
    private camera;
    private canvas;
    private ctx;
    private texture;
    private statsPlane;
    private custom1?;
    private custom2?;
    private custom3?;
    private timer;
    private msActive;
    private msStart;
    private msEnd;
    private msGraphData;
    private ms;
    private statsDisplayRefreshDelay;
    private fpsLastTime;
    private fpsFrames;
    private fpsGraphData;
    constructor(scene: THREE.Scene, camera: THREE.Camera);
    setEnabled(enabled: boolean): void;
    setX(val: number): void;
    setY(val: number): void;
    setZ(val: number): void;
    setCustom1(val: string): void;
    setCustom2(val: string): void;
    setCustom3(val: string): void;
    startTimer(): void;
    endTimer(): void;
    add(object3d: THREE.Object3D): void;
    update(): void;
}
