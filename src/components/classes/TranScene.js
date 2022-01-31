import {CurrentCamera, CurrentScene, MapScene, MapCamera, renderer, state, Listens} from "./index.js";
import * as THREE from 'three'
import {initTranScene} from "./init.js";
import {IsVR, User, UserCamera,VR} from "./index.js";

export class TranSceneClass {
    constructor(IsTexture) {
        this.count = 0;
        this.IsTexture = IsTexture;
        this.initScene();
        initTranScene();
    }

    initScene() {
        const pointer = document.getElementById("pointer_center");
        pointer.style.visibility = "hidden";
        const that = this;
        const SourcePoints = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-500, 200, 900),
            new THREE.Vector3(-100, 400, 400),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(600, -600, 0),
            new THREE.Vector3(900, -400, 600),
            new THREE.Vector3(1200, -200, 300),
        ]);
        that.spacedPoint = SourcePoints.getPoints(500);
        const geometry = new THREE.TubeBufferGeometry(SourcePoints, 200, 30, 30);
        if (this.IsTexture) {
            that.Material = new THREE.MeshBasicMaterial({
                // vertexColors:THREE.VertexColors,
                map: new THREE.TextureLoader().load('素材/Img/MapSceneImg/Sky1.jpg'),
                side: THREE.DoubleSide
            })
        } else {
            const ColorArray = []
            for (let i = 0; i < geometry.attributes.position.array.length; i = i + 3) {
                let color = new THREE.Color();
                color.setRGB(Math.random(), 1, i / geometry.attributes.position.array.length);
                ColorArray.push(color.r, color.g, color.b);
            }
            geometry.attributes.color = new THREE.Float32BufferAttribute(ColorArray, 3);
            that.Material = new THREE.PointsMaterial({
                vertexColors: THREE.VertexColors,
                size: 1.5
            })
        }
        const points = new THREE.Mesh(geometry, that.Material);
        CurrentScene[0].add(points);
    }

    animate() {
        const that = this;
        if (this.count < that.spacedPoint.length - 200) {
            CurrentCamera[0].position.set(that.spacedPoint[that.count].x, that.spacedPoint[that.count].y, that.spacedPoint[that.count].z)
            CurrentCamera[0].lookAt(new THREE.Vector3(that.spacedPoint[that.count + 1].x, that.spacedPoint[that.count + 1].y, that.spacedPoint[that.count + 1].z))
            that.count++;
        } else {
            CurrentCamera[0] = MapCamera;
            CurrentScene[0] = MapScene;
            if(IsVR){
                VR.Delete();
                VR.CScene ="Map"
            }

            return;
        }
        if (IsVR) {
            User.position.copy(CurrentCamera[0].position);
            User.rotation.copy(CurrentCamera[0].rotation);
            VR.update();
            renderer.render(CurrentScene[0], UserCamera);
        } else {
            renderer.render(CurrentScene[0], CurrentCamera[0]);
        }
    }
}
