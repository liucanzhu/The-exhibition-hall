import * as THREE from 'three'
import {XRControllerModelFactory} from 'three/examples/jsm/webxr/XRControllerModelFactory.js'
import {VRButton} from 'three/examples/jsm/webxr/VRButton.js'
import {User, CurrentScene, UserCamera, CurrentCamera, renderer, mainScene,keyStates, TranCamera, TranScene,MainCamera, MainScene} from "./index.js";
import {BASMesh} from "./BASMesh.js";


export class XR {
    constructor() {
        this.Linegeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)]);
        this.material = new THREE.MeshStandardMaterial({
            color: "#00ffff",
            transparent: true,
        })
        this.controllerModelFactory = new XRControllerModelFactory();
        this.shootGeometryByBox = new THREE.BoxGeometry(0.001, 0.001, 0.2);//长方体
        this.shootGeometryByLine = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -0.5)]);
        this.shootMaterial = new THREE.MeshBasicMaterial({color: "#00ffff"});
        this.shootByBox1 = new THREE.Mesh(this.shootGeometryByBox, this.shootMaterial);
        this.shootByBox2 = new THREE.Mesh(this.shootGeometryByBox, this.shootMaterial);

        this.shootByLine = new THREE.Line(this.shootGeometryByLine, this.shootMaterial);
        this.line1 = null;
        this.line2 = null;
        this.LineGroup1 = new THREE.Group();
        this.LineGroup2 = new THREE.Group();
        this.controllGroup1 = new THREE.Group();
        this.controllGroup2 = new THREE.Group();
        this.initSet();
        this.CScene ="Main";

    }
    ReInit() {
        this.initLineGroup()
        this.initControllerGrip();
    }

    Delete() {
        this.LineGroup1.remove(this.line1);
        CurrentScene[0].remove(this.LineGroup1);
        this.LineGroup2.remove(this.line2);
        CurrentScene[0].remove(this.LineGroup2);
        this.controllGroup1.remove(this.controllerGrip1);
        CurrentScene[0].remove(this.controllGroup1);
        this.controllGroup2.remove(this.controllerGrip2)
        CurrentScene[0].remove(this.controllGroup2);

    }

    initLineGroup() {
        const that =this;
        /**
         * @Line1
         */
        this.line1 = renderer.xr.getController(0);
        this.line1.addEventListener('selectstart', onStart);
        this.line1.addEventListener('selectend', onEnd);
        this.line1.add(new THREE.Line(this.Linegeometry));
        this.LineGroup1.add(this.line1);
        CurrentScene[0].add(this.LineGroup1);
        /**
         * @Line2
         */
        this.line2 = renderer.xr.getController(1);
        this.line2.add(new THREE.Line(this.Linegeometry));
        // this.line2.addEventListener('selectstart',onStart);
        // this.line2.addEventListener('selectend',onEnd);
        this.LineGroup2.add(this.line2);
        CurrentScene[0].add(this.LineGroup2);

        function onStart(event) {
            that.line1.add(that.shootByBox1);
            that.line1.add(that.shootByBox2);

            let v1 = new THREE.Vector3(that.shootByBox1.matrixWorld.elements[12], that.shootByBox1.matrixWorld.elements[13], that.shootByBox1.matrixWorld.elements[14]);
            let v2 = new THREE.Vector3(that.shootByBox2.matrixWorld.elements[12], that.shootByBox2.matrixWorld.elements[13], that.shootByBox2.matrixWorld.elements[14]);
            let d1 = v1.clone();
            let d2 = v2.clone();
            let TestGeometry = new THREE.BufferGeometry().setFromPoints([v1.clone(), v2.clone()]);
            let TestMaterial = new THREE.MeshBasicMaterial({color: "#c150b4"})
            const TestLine = new THREE.Line(TestGeometry, TestMaterial);
            CurrentScene[0].add(TestLine);
            setTimeout(() => {
                CurrentScene[0].remove(TestLine);
            },200)
            let raycaster = new THREE.Raycaster(d1, d2.sub(d1).normalize());
            raycaster.camera = CurrentCamera[0];
            // raycaster.setFromCamera(new THREE.Vector3(Sphere.matrixWorld.elements[12],Sphere.matrixWorld.elements[13]), UserCamera);
            let intersects = raycaster.intersectObjects([CurrentScene[0]], true).filter(arr => {
                return arr.object.name !== "Walk" && arr.object.name !== "Floor" && arr.object.type !== "Line" && arr.object.visible && arr.object.type !== "Line";
            });
            if(that.CScene==="Main"){
                while (intersects[0] && mainScene.GetParent(intersects[0].object, "WenWuGroup")[1] && intersects[0].object.parent.visible === false) {
                    intersects.shift();
                }
            }
            // console.log(that.line1, intersects);
            if(that.CScene==="Main"){
                console.log(intersects);
                that.rayCasterHandleByMain(intersects).then(r => console.log(intersects[0]?.object.name));
            }
            else if(that.CScene==="Map"){
                console.log(intersects);
                that.rayCasterHandleByMap(intersects).then(r => console.log(intersects[0]?.object.name));
            }
        }

        function onEnd(event) {
            that.line1.remove(that.shootByLine);

        }

    }
    initControllerGrip() {
        /**
         * @controllerGrip1
         */
        this.controllerGrip1 = renderer.xr.getControllerGrip(0);
        this.controllerGrip1.add(this.controllerModelFactory.createControllerModel(this.controllerGrip1));
        this.controllGroup1.add(this.controllerGrip1)
        CurrentScene[0].add(this.controllGroup1);
        /**
         * @controllerGrip2
         */
        this.controllerGrip2 = renderer.xr.getControllerGrip(1);
        this.controllerGrip2.add(this.controllerModelFactory.createControllerModel(this.controllerGrip2));
        this.controllGroup2.add(this.controllerGrip2)
        CurrentScene[0].add(this.controllGroup2);
    }

    initSet() {
        renderer.xr.enabled = true;
        this.shootByBox1.visible = false;
        this.shootByBox2.visible = false;
        this.shootByBox1.position.set(0, 0, -0.0);
        this.shootByBox2.position.set(0, 0, -3.5);
        document.body.appendChild(VRButton.createButton(renderer));
        this.initLineGroup();
        this.initControllerGrip();
    }

    async rayCasterHandleByMain(intersects) {
        const that =this;
        if (intersects.length !== 0) {
            if (intersects[0].object.name === 'InfomapSceneCard' && !mainScene.IsInfoMapScene) {
                if (intersects[0].distance < 5) {
                    CurrentCamera[0] = TranCamera;
                    CurrentScene[0] = TranScene;
                    that.CurrentScene ="Tra"
                    mainScene.IsInfoMapScene = true;//这里限制了只能进入一次MapScene场景
                    for (let key in keyStates) {
                        delete keyStates[key];
                    }
                }
            }
            if (mainScene.CurrentModel) {
                let WenWuJudge = mainScene.GetParent(intersects[0].object, mainScene.CurrentModel.name);
                if (WenWuJudge[1]) {
                    let object = WenWuJudge[0];
                    //ESLint规则问题，从原型上改
                    if (Object.prototype.hasOwnProperty.call(mainScene.WenWus, object.parent.name)) {
                        let obj = mainScene.WenWus[object.parent.name];
                        if (obj) {//如果存在该模型
                            mainScene.WenWuClickTween(object, obj.part[object.name][1]);//虚拟装配动画
                            if (!obj.part[object.name][2]) {//判断是否已被装配
                                obj.part[object.name][2] = true;
                                obj.CurrentCount++;//装配数加一
                                if (obj.CurrentCount === obj.ModelCount) {//如果所有部件全部装配
                                    if (mainScene.WenWus[mainScene.CurrentModel.name].IsFirstStart)
                                        mainScene.initCreateBasTweenMesh(obj, obj.textImg[obj.textIndex], obj.textImg[++obj.textIndex])
                                    mainScene.DescribeClickGroup.visible = true;
                                    mainScene.WenWus[mainScene.CurrentModel.name].IsFirstStart = false;
                                    mainScene.IsComplete = true;
                                }
                            }
                        }
                    }
                }
            }
            if (mainScene.GetParent(intersects[0].object, "WenWuGroup")[1]) {
                if (intersects[0].object.name === "LeftWenWu" && mainScene.IsComplete) {//向左转
                    mainScene.WenWuRotateTween(mainScene.CurrentModel, 0, Math.PI / 2, 0, false);
                }
                if (intersects[0].object.name === "RightWenWu" && mainScene.IsComplete) {//向右转
                    mainScene.WenWuRotateTween(mainScene.CurrentModel, 0, Math.PI / 2, 0, true);
                }
                if (intersects[0].object.name === "DisaWenWu" && mainScene.IsComplete) {
                    mainScene.WenWus[mainScene.CurrentModel.name].init();
                }
                if (intersects[0].object.name === "ReturnMain" && mainScene.IsComplete) {
                    mainScene.StartCardGroup.visible = true;
                    mainScene.DeleteCardGroup.visible = true;
                    mainScene.WenWuModelGroup.remove(mainScene.CurrentModel);
                    mainScene.initDescribe();
                    mainScene.IsComplete = false;
                }
                if (intersects[0].object.name === "DeleteCard" && mainScene.StartCard && !mainScene.IsComplete) {
                    mainScene.DeleteCard();
                }
                if (intersects[0].object.name === "StartCard" && !mainScene.StartCard && !mainScene.IsComplete) {
                    mainScene.initCard();
                }
                if (intersects[0].object.name === "NextText" && mainScene.IsComplete) {
                    let obj = mainScene.WenWus[mainScene.CurrentModel.name];
                    let CurrentImg = obj.textImg[obj.textIndex];
                    obj.textIndex = obj.textIndex >= obj.textUrls.length - 1 ? 0 : ++obj.textIndex;
                    let NextImg = obj.textImg[obj.textIndex];
                    mainScene.ChangePageTween(mainScene.WenWuText1, NextImg);
                    mainScene.ChangePageTween(mainScene.WenWuText2, CurrentImg);
                }
                if (intersects[0].object.name === "LastText" && mainScene.IsComplete) {
                    let obj = mainScene.WenWus[mainScene.CurrentModel.name];
                    let CurrentImg = obj.textImg[obj.textIndex];
                    obj.textIndex = obj.textIndex <= 0 ? obj.textUrls.length - 1 : --obj.textIndex;
                    let NextImg = obj.textImg[obj.textIndex];
                    mainScene.ChangePageTween(mainScene.WenWuText1, NextImg);
                    mainScene.ChangePageTween(mainScene.WenWuText2, CurrentImg);
                }
            }
            if (mainScene.GetParent(intersects[0].object, "LeiShenVideoGroup")[1]) {
                if (intersects[0].object.name === "VideoClick3" || intersects[0].object.name === "VideoClick1") {
                    // VideoClick1木兰山 VideoClick3黄鹤楼
                    let currentIndex = mainScene.VideoIndex;
                    let currentName;
                    // mainScene.VideoIndex = mainScene.VideoIndex >= mainScene.videos.length - 1 ? 0 : ++mainScene.VideoIndex;
                    if (intersects[0].object.name === "VideoClick3") {
                        mainScene.VideoIndex = 0;
                        currentName = "黄鹤楼"
                    }
                    if (intersects[0].object.name === "VideoClick1") {
                        mainScene.VideoIndex = 1;
                        currentName = "木兰景区"
                    }
                    if (currentIndex !== mainScene.VideoIndex) {
                        let CurrentMap = mainScene.videos[currentIndex];
                        mainScene.videoControls[currentIndex].pause();
                        let NextMap = mainScene.videos[mainScene.VideoIndex];
                        const VideoT = CurrentScene[0].getObjectByName("VideoT");
                        VideoT.material.map = mainScene.VideoTs[mainScene.VideoIndex];
                        mainScene.videoControls[mainScene.VideoIndex].play();
                        mainScene.videoControls[mainScene.VideoIndex].currentTime = 0;
                        mainScene.VideoPaused = false;
                        mainScene.ChangeVideoTween(CurrentScene[0].getObjectByName("VideoPlane"), CurrentMap, NextMap);
                        mainScene.DataCreatTween(mainScene.DataModel.children[0], currentName);
                        let VideoBackground = CurrentScene[0].getObjectByName("DataBackground");
                        VideoBackground.material.map = that.DataMap[that.VideoIndex];
                    } else {
                        mainScene.VideoPaused = !mainScene.VideoPaused;
                        if (mainScene.VideoPaused) {
                            mainScene.videoControls[currentIndex].pause();
                        } else {
                            mainScene.videoControls[currentIndex].play();
                        }
                    }
                }
            }

            if (mainScene.GetParent(intersects[0].object, "Card")[1]) {
                mainScene.StartCardGroup.visible = false;
                mainScene.DeleteCardGroup.visible = false;
                let obj = intersects[0].object;
                if (obj.name === "Card5") {
                    mainScene.piture3 = new BASMesh(obj, "Picture");
                    await mainScene.piture3.createMesh({
                        width: 1.75,
                        height: 2,
                        img: null,
                        PathImgMethod: "out",
                        extendX: 0.05,
                        extendY: 0.02,
                        extendZ: 0.6,
                        fragmentX: 50,
                        fragmentY: 50,
                    })
                    mainScene.piture3.Picture.material.uniforms.map.value = new THREE.TextureLoader().load("素材/Img/Cards/武汉-黄鹤楼.png", () => {
                        mainScene.piture3.Picture.parent.tween.kill();
                        mainScene.piture3.Picture.material.uniforms.map.value.needsUpdate = true;
                        mainScene.piture3.Picture.material.transparent = true;
                        mainScene.piture3.createTween(del);
                    });

                    var del = function del() {
                        mainScene.initHuangHeLou();
                        mainScene.DeleteCard();
                    }

                }
            }
            if (mainScene.GetParent(intersects[0].object, "DescribeClickGroup")[1]) {
                intersects[0].object.visible = false;
                let obj = CurrentScene[0].getObjectByName(`${intersects[0].object.name}Text`);
                obj.visible = true;
            }
            if (mainScene.GetParent(intersects[0].object, "HistoryClickGroup")[1]) {
                let clickType = intersects[0].object.name;
                let PlaneMaterial = new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load('素材/Img/History/' + clickType + '.png'),
                    transparent: true
                })
                let PlaneGeometry = new THREE.PlaneGeometry(0.1, 0.1, 1, 1);
                const HistoryPlane = new THREE.Mesh(PlaneGeometry, PlaneMaterial);
                HistoryPlane.position.copy(intersects[0].object.position)
                HistoryPlane.name = "HistoryCard"
                HistoryPlane.OPosition = intersects[0].object.position.clone();
                CurrentScene[0].add(HistoryPlane);
                mainScene.CreateHistoryCard(HistoryPlane, CurrentCamera[0].position);
            }
            if (intersects[0].object.name === "HistoryCard") {
                mainScene.DeleteHistory(intersects[0].object);
            }
        }
    }

    async rayCasterHandleByMap(intersects) {
        const that =this;
        if(intersects.length!==0){
            if (intersects[0].object.name === 'ReturnScene') {
                CurrentCamera[0] = MainCamera;
                that.CurrentScene="Main"
                CurrentScene[0] = MainScene;
            }
            if (intersects[0].object.name === "黄鹤楼Info") {
                // window.open("全景/html_test/全景.html");
            }
            if (intersects[0].object.parent.name === "地标") {
                const TipSpriteMaterial = new THREE.SpriteMaterial({
                    map: new THREE.TextureLoader().load("素材/Img/MapSceneImg/LandMarks/图-" + intersects[0].object.name + ".png"),
                    depthWrite: false
                })
                let TipSprite = new THREE.Sprite(TipSpriteMaterial);
                TipSprite.position.copy(intersects[0].object.position);
                TipSprite.position.y+=0.5;
                intersects[0].object.parent.remove(intersects[0].object);
                intersects[0].object.geometry.dispose();
                intersects[0].object.material.dispose();
                TipSprite.name = intersects[0].object.name+"Info"
                TipSprite.scale.set(1.5, 1, 1.5);
                TipSprite.renderOrder =666;
                CurrentScene[0].add(TipSprite);
            }
        }

    }

    update() {
        this.controllGroup1.position.copy(User.position)
        this.controllGroup2.position.copy(User.position)
        this.controllGroup1.rotation.copy(User.rotation)
        this.controllGroup2.rotation.copy(User.rotation)
        this.LineGroup1.position.copy(User.position)
        this.LineGroup1.rotation.copy(User.rotation)
        this.LineGroup2.position.copy(User.position)
        this.LineGroup2.rotation.copy(User.rotation)
        // console.log("@",this.controllerGrip1,this.controllerGrip2);
    }
}
