<template>
  <div id="viewer">
    <div id="three"></div>
    <div class="main">
      <h1 id="title">武汉旅游宣传展览馆</h1>
      <button id="Internet" class="Internet">网页端</button>
      <button id="VR" class="VR">VR</button>
    </div>
    <div class="loading" id="loading">
      <div class="load">
      </div>
      <div class="loadText">Loading...</div>
      <div id="progress" class="progress">
        <div class="shadow position-center font"></div>
        <div class="bar position-center font"></div>
      </div>
    </div>
    <div id="pointer_center">
    </div>
    <video id="video1" autoplay muted controls class="video" loop="loop">
        <source src="素材/Videos/Video1.mp4">
    </video>
    <video id="video2" autoplay muted controls class="video" loop="loop" >
        <source src="素材/Videos/Video2.mp4">
    </video>
  </div>
</template>

<script>
import {DisplayLoad,renderer} from './classes/index'
import $ from 'jquery'

export default {
  name: 'Viewer',
  components: {
  },
  data() {
    return{
      timer:'',
      imgSrc:require('../../public/background.jpg')
    }
  },
  mounted() {
    //背景色
    document.body.style.backgroundColor = "#153b6c"
    document.querySelector("#VR").addEventListener("click", DisplayLoad.bind(document.querySelector("#Internet"),[document.querySelector("#Internet"),document.querySelector("#VR"),document.querySelector(".main"),document.querySelector("#loading"),document.querySelector(".loadText"),document.querySelector(".shadow"),document.querySelector(".bar"),document.querySelector("#pointer_center"),document.querySelector("#video1"),document.querySelector("#video2")]))
    document.querySelector("#Internet").addEventListener("click", DisplayLoad.bind(document.querySelector("#Internet"),[document.querySelector("#Internet"),document.querySelector("#VR"),document.querySelector(".main"),document.querySelector("#loading"),document.querySelector(".loadText"),document.querySelector(".shadow"),document.querySelector(".bar"),document.querySelector("#pointer_center"),document.querySelector("#video1"),document.querySelector("#video2")]))
    //three存放three.js渲染结果
    document.getElementById("three").appendChild(renderer.domElement);
  },
  methods: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #three{
    display: none;
  }
  #viewer{
    background-size: 100% 100%;
    position:fixed;
    width: 100%;
    height: 100%;
    top: 0px;
  }
  * {
    margin: 0;
    padding: 0;
  }
  #pointer_center{
    margin: auto;
    padding: 0;
    border: aquamarine solid 1px;
    border-radius:50% ;
    position: absolute;
    width: 2px;
    height: 2px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: none;
  }
  #canvas{
    /*width: 50%;*/
    /*height: 50%;*/
    /*display: none;*/
  }
  .video{
    height: 1px;
    width: 1px;
    position:absolute;
  }
  .main{
    width: 100%;
    height:100%;
    position: relative;
  }
  #title {
    text-align: center;
    color: #fff;
    font-family: consolas;
    letter-spacing: 8px;
    background-color: #013954;
    position: absolute;
    right:calc(100% - 61%);
    top:100px;
  }
  .main button {
    height: 200px;
    width: 200px;
    border: none;
    color: white;
    padding: 15px 30px;
    font-size: 16px;
    font-family: Arial;
    border-radius: 3px;
    position: absolute;
    top: 250px;
    border-radius: 10%;
    cursor: pointer;
  }
  .Internet{
    background: #447aa8;
    right: calc(100% - 40%);
  }
  .Internet:hover{
    background: #328bd8;
    right: calc(100% - 40%);
  }
  .VR{
    background: rgb(224, 153, 46);
    right: calc(100% - 70%);
  }
  .VR:hover{
    background: #f90;
    right: calc(100% - 70%);
  }
  .loading {
    width: 100%;
    height:100%;
    position: absolute;
    display: none;/*事先让他隐藏*/

  }
  .load{
    width: 200px;
    height:200px;
    background-color: rgb(187, 67, 67);
    box-sizing: border-box;
    border-radius: 50%;
    border-top: 10px solid #36cc4a;
    position: absolute;
    left: calc(50% - 100px);
    top: 150px;
  }
  .load::before,
  .load::after {
    content: " ";
    width: 200px;
    height: 200px;
    position: absolute;
    left: 0;
    top: -10px;
    box-sizing: border-box;
    border-radius: 50%;
  }

  .load::before {
    border-top: 10px solid #e6e322;
    transform: rotate(120deg);
  }

  .load::after {
    border-top: 10px solid #3498db;
    transform: rotate(240deg);
  }

  .loadText{
    position: absolute;
    color: #fff;
    line-height: 200px;
    top: 150px;
    left: calc(50% - 30px);
  }
  .progress {
    width: 400px;
    height: 60px;
    border: 4px solid #3498db;
    border-radius: 10px;
    margin: 100px auto;
    position: absolute;
    left: calc(50% - 200px);
    top: 300px;
  }

  .position-center {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bar {
    color: #555;
    background: #3498db linear-gradient(135deg, transparent 25%, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 50%, transparent 0, transparent 75%, rgba(0, 0, 0, 0.1) 0);
    background-size: 60px;
    animation: move 1s linear infinite;
  }
  @keyframes move {
    100% {
      background-position-y: 60px;
    }
  }

  .font {
    font-size: 1.5rem;
    font-weight: 700;
    text-shadow: 0 0 2px #666;
  }

  .shadow {
    color: #fff;
    z-index: 100;
  }
</style>
