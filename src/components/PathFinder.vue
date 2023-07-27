<template>
  <div class="card">
    <div class="card-header">
      <h2>Path Finder </h2>
      <p>Find shortest path on graph. Source code of prolog programme
        <a href="/pathfinder.pl">pathfinder.pl</a> - works from remote server </p>
    </div>
<div class="card-body">
  <div style="display: flex; gap: 4px;">
    <div >
      <canvas ref="m8canvas" :width="canvasw" :height="canvash" @click="showCoordinates($event)"></canvas>
    </div>

    <div style=" flex-grow: 1; height: 100vh; ">
      <div class="card card-body"  v-if="showAddBtn" >
        <div class="alert alert-info">
          Setup graph topology as list of connections like: start point, end point, distance :<br/> a, b, 10<br/>
          After each stage the plot re-adjusted automatically.
          When all connection will be added you able to re-settle points to provide better presentation.<br/>
          Pay attention: Each peak can be connected more than one, but at least one connection should be .
        </div>
        <div class="d-flex gap-2">
          <div class="input-group">
            <label class="input-group-text" style="width: 6em;">Start Point</label>
            <input type="text" class="form-control" v-model="mformpoint.from">
          </div>
          <div class="input-group">
            <label class="input-group-text" style="width: 6em;">End Point</label>
            <input type="text" class="form-control" v-model="mformpoint.target">
          </div>
          <div class="input-group">
            <label class="input-group-text" style="width: 6em;">Distance</label>
            <input type="text" class="form-control" v-model="mformpoint.dist">
          </div>
        </div>

        <div class="input-group mt-2">
          <button style="flex-grow: 1;" class="btn btn-outline-primary" @click="addPoint" data-test="add" >ADD </button>
          <button class="btn btn-outline-success" @click="showAddBtn=false"  >finish and adjust </button>
        </div>

      </div>
      <div v-else class="alert alert-info" >
        Select point that you want to move, after this select new position for it
      </div>
      <div class="alert alert-warning" v-show="movingpoint">
        set new position for point <span class="badge bg-danger">{{movingpoint}} </span>
      </div>
      <div class="card card-body">
        <div style="display: flex; flex-wrap: wrap; gap: 4px; ">
          <div v-for="p in paths"  v-bind:key="p[0]+p[1]" class="badge bg-info">
            {{ p[0] }} <i class="bi bi-arrow-right"></i> {{ p[1] }} : {{ p[2] }}
          </div>
        </div>
      </div>

      <div class="card card-body" v-show="paths.length>0">
        <div class="input-group mb-1">
          <label class="input-group-text">find path from:</label>
          <select class="form-select" v-model="mgoal.start">
            <option v-for="(value, key) in points" v-bind:key="key">{{ key }}</option>
          </select>
          <label class="input-group-text">to:</label>
          <select class="form-select" v-model="mgoal.finish">
            <option v-for="(value, key) in points" v-bind:key="key" >{{key}}</option>
          </select>
        </div>
        <button class="btn btn-outline-success" @click="sendRequest">GO!</button>
      </div>

      <div class="card card body mt-2">
        <span class="badge bg-info " v-show="mstsmsg"><h4>{{ mstsmsg }}</h4></span>
        <ol class="list-group list-group-numbered" v-show="isfound">
          <template v-for="(path,index) in this.mfound.found" :key="index">
            <li class="list-group-item"  v-if="index<mfound.isow">
              <span class="me-2" v-for="peak in path.path" :key="peak">{{peak}}</span>
              <span class="me-2">({{path.dist}})</span>
              <button class="btn btn-outline-info"  @click="drawpath(path.path,index )"
                      :disabled="mfound.animating" >show</button>
            </li>
          </template>

          <li class="list-group-item" v-show="showfinal">
            <span class="me-2">Final:</span>
            <span class="me-2" v-for="peak in mfound.final" :key="peak">{{peak}}</span>
            <button class="btn btn-outline-info"  @click="drawpath(mfound.final,99 )"
                    :disabled="mfound.animating" >show</button>
          </li>
        </ol>
      </div>
      <hr/>
      <div class="d-grid">
        <button class="btn btn-outline-warning" @click="clearAll" data-test="reset" >reset </button>
      </div>
    </div>

  </div>
</div>
</div>
</template>
<script>
import axios from 'axios'

export default {
  name: "PathFinder",
  props:['ehost'],
  data: function (){
    return {
      canvasw:780,
      canvash:600,
      canvas2d:null,
      radius:10,
      points: {},
      paths:[
        ['A','B',4],
        ['B','C',2],
        ['C','E',4],
        ['E','U',3],
        ['C','O',2],
        ['O','U',4],
        ['B','E',3],
      ],
      mformpoint:{from:'',target:'',dist:10},
      showAddBtn: false,
      movingpoint: '',
      mgoal:{start:'A',finish:'U'},
      mstsmsg:'',
      isfound:false,
      mfound: { 'final':[] , 'isow':0, animating:false,'found':[] },
    }
  },
  methods: {
    clearAll(){
      this.points = {};
      this.paths = [];
      this.canvas2d.clearRect(0, 0, this.canvasw, this.canvash );
      this.showAddBtn = true;
      this.mfound =   { 'final':[] , 'isow':0, animating:false,'found':[] };
      this.isfound = false;
    },
    addPoint(){
      if( this.mformpoint.from.length == 1 && this.mformpoint.target.length == 1
          && this.mformpoint.dist >0 && this.mformpoint.from != this.mformpoint.target ){
        this.paths.push([
          this.mformpoint.from.toUpperCase(),
          this.mformpoint.target.toUpperCase(),
          this.mformpoint.dist
        ]);
      }

      if( this.paths.length >0 ){
        this.calculatePoints();
        this.displaygraph();
      }
      this.mformpoint = {from:'',target:'',dist:10};
    },
    calculatePoints(){
      const pts=[];
      this.paths.forEach(elem=>{
        if( ! pts.includes(elem[0])   )
          pts.push(elem[0])

        if( ! pts.includes(elem[1]) )
          pts.push(elem[1])
      });
      let mcols = 1 +  Math.floor(  pts.length / 3 );
      if(mcols < 3) mcols = 3;
      let gridscale= Math.floor( 600 / mcols ), row=0,col=1,     x=1,y=1;
      for(let i=0;i<pts.length;i++){

        x = col*gridscale ;
        y = row*gridscale+gridscale / 2;
        this.points[pts[i]] = {"x":x,"y":y} ;
        col++;
        if(col > mcols ){
          row++; col=1;
        }
      }
    },
    getPath4point(point,position){
      //let destinationPoint;
      this.paths.forEach(pa=>{
        if(pa[0] == point ){
          this.drawLine(position.x,position.y,this.points[pa[1]].x,this.points[pa[1]].y,pa[2] ) ;
        }
      })
    },
    displaygraph(){
      this.canvas2d.clearRect(0, 0, this.canvasw, this.canvash );
      for (const [key, value] of Object.entries(this.points)) {
        this.drawCircle(value.x,value.y,key);
        this.getPath4point(key,value);
      }

    },
    drawCircle(centerX,centerY,caption){
      this.canvas2d.fillStyle = 'green' ;
      if(this.movingpoint == caption)
        this.canvas2d.fillStyle = 'blue' ;
      this.canvas2d.lineWidth = 1;
      this.canvas2d.strokeStyle = 'red';
      this.canvas2d.beginPath();
      this.canvas2d.arc(centerX, centerY, this.radius, 0, this.mcurve ) ;
      this.canvas2d.fill();
      this.canvas2d.strokeText(caption, centerX - this.radius / 3 ,  centerY -10 );
    },
    drawLine(xfrom,yfrom,xto,yto, caption){
      this.canvas2d.beginPath();
      this.canvas2d.moveTo(xfrom, yfrom);
      this.canvas2d.strokeStyle = '#0f0';
      this.canvas2d.lineWidth = 1 ;
      this.canvas2d.lineTo(xto, yto);
      this.canvas2d.stroke();
      this.canvas2d.beginPath();
      this.canvas2d.strokeStyle = '#00f';
      this.canvas2d.strokeText(caption, xto +  (xfrom-xto)  / 2 ,  ( yfrom - yto ) /2 + yto -4 );
      this.canvas2d.stroke();
    },
    showCoordinates(event){
      const rect = this.$refs.m8canvas.getBoundingClientRect()
      const x = Math.round( event.clientX - rect.left);
      const y = Math.round( event.clientY - rect.top );
      if(this.movingpoint){

        this.points[this.movingpoint].x = x;
        this.points[this.movingpoint].y = y;
        this.movingpoint = '';
        this.displaygraph();
        return;
      }
      // find point
      let selectedPoint='';
      const mp = this.points, mrad = this.radius  ;
      Object.keys( mp ).forEach(function (key){
        let a = mp[ key ].x - x , b = mp[ key ].y - y;
        let dist= Math.sqrt( a*a + b*b );
        if(dist< mrad){
          selectedPoint = key;
        }
      });
      this.movingpoint = selectedPoint;
      if(this.movingpoint){
        this.displaygraph();
      }
    },
    sendRequest(){
      if(this.mgoal.start &&  this.mgoal.finish && this.mgoal.start != this.mgoal.finish ){
        this.mfound =  { 'final':[] , 'isow':0, animating:false,'found':[] };
        let mparams = this.mgoal;
        mparams.db = this.paths;

        axios.post( this.ehost,mparams,{withCredentials: true})
            .then(response => {
              if(response.data.status>0){
                this.mstsmsg = 'no path to destination'
              } else {
                this.mstsmsg = 'solution(s) found';
                this.mfound = response.data.mfound;
                this.mfound.isow = 1;
              }
              this.isfound = this.mfound.final.length>0;
            })
            .catch(error => {
              console.log('error', error.toString() );
            })
            .then(()=>{
              this.displaygraph();
            })
      }
    },
    drawpath(path, index ) {
      this.displaygraph();
      this.mfound.animating = true;
      const ctx = this.canvas2d;
      function animate(x1,y1,x2,y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      this.canvas2d.strokeStyle = '#0A0';
      this.canvas2d.lineWidth = 5;
      const  range = path.length;
      for(let j=1;j<range;j++){
        setTimeout(() => {
          animate(this.points[path[j - 1]].x, this.points[path[j - 1]].y,this.points[path[j]].x, this.points[path[j]].y);
          if( j==(range-1)) {
            this.mfound.animating = false;
            this.mfound.isow = index+2.0;
          }

        }, 1000*j);
      }

    },
  },
  computed :{
    showfinal(){
      return this.mfound.isow > this.mfound.found.length ;
    },
  },
  mounted() {
    this.canvas2d = this.$refs.m8canvas.getContext("2d");
    this.mcurve = Math.PI*2;
    this.calculatePoints();
    this.displaygraph();
  }
}
</script>
<style scoped>
canvas {
  box-shadow: 0 0 5px var(--bs-info, blue);
}
</style>
