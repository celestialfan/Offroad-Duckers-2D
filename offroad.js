const canvas=document.getElementById("groundcanvas");
const ctx1=document.getElementById("groundcanvas").getContext("2d");
const ctx2=document.getElementById("groundcanvas").getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let zoom=1;
let camx=0;
let camy=0;
let nodex=[40, 500, 60];
let nodey=[40, 600, 50];
let noderoads=[null, null, null];
class vehicle{
    constructor(x, y, color){
        this.x=x;
        this.y=y;
        this.steer=0.5;
        this.dir=1;
        this.v=0;
        this.color=color;
        this.horsepower=100;
        setInterval(()=>{
            if(this.v!=0){
                this.x+=-1*this.v*Math.sin(this.dir);
                this.y+=this.v*Math.cos(this.dir);
                this.dir+=this.v*Math.tan(this.steer)/-100;
                this.display();
            }
        }, 10);
    }
    display(){
        ctx2.fillStyle="#000000";
        ctx2.translate((this.x-camx)*zoom, (this.y+45-camy)*zoom);
        ctx2.rotate(this.dir);
        ctx2.save();
        ctx2.translate(40*zoom, -90*zoom);
        ctx2.rotate(this.steer);
        ctx2.fillRect(-5*zoom, -15*zoom, 10*zoom, 30*zoom);
        ctx2.restore();
        ctx1.save();
        ctx2.translate(-40*zoom, -90*zoom);
        ctx2.rotate(this.steer);
        ctx2.fillRect(-5*zoom, -15*zoom, 10*zoom, 30*zoom);
        ctx2.restore();
        ctx2.fillRect(35*zoom, -15*zoom, 10*zoom, 30*zoom);
        ctx2.fillRect(-45*zoom, -15*zoom, 10*zoom, 30*zoom);
        ctx2.fillStyle=this.color;
        ctx2.fillRect(-40*zoom, -120*zoom, 80*zoom, 150*zoom);
        ctx2.rotate(-1*this.dir);
        ctx2.translate(-1*(this.x-camx)*zoom, -1*(this.y+45-camy)*zoom);
    }
    accelerate(froddle){
        if(froddle<=1&&froddle>=-1){
            this.v+=this.horsepower*froddle/-100;
        }
    }
}
class road{
    constructor(nodeA, nodeB, lanes, type, name){
        this.nodeA=nodeA;
        this.nodeB=nodeB;
        this.lane=lanes;
        this.type=type;
        noderoads[nodeA]=this;
        noderoads[nodeB]=this;
    }
    display(){
        ctx1.beginPath();
        ctx1.strokeStyle="#444444";
        ctx1.moveTo(zoom*(nodex[this.nodeA]-camx), zoom*(nodey[this.nodeA]-camy));
        ctx1.lineWidth=this.lane[0]*zoom*100;
        ctx1.lineTo(zoom*(nodex[this.nodeB]-camx), zoom*(nodey[this.nodeB]-camy));
        ctx1.stroke();
        ctx1.closePath();
        ctx1.beginPath();
        ctx1.strokeStyle="#aaaaaa";
        ctx1.lineWidth=50*zoom;
        let dirx=(nodex[this.nodeB]-nodex[this.nodeA])/Math.sqrt((nodex[this.nodeB]-nodex[this.nodeA])**2+(nodey[this.nodeB]-nodey[this.nodeA])**2);
        let diry=(nodey[this.nodeB]-nodey[this.nodeA])/Math.sqrt((nodex[this.nodeB]-nodex[this.nodeA])**2+(nodey[this.nodeB]-nodey[this.nodeA])**2);
        ctx1.moveTo(zoom*(nodex[this.nodeA]-diry*(this.lane[0]*50+25)-camx), zoom*(nodey[this.nodeA]+dirx*(this.lane[0]*50+25)-camy));
        ctx1.lineTo(zoom*(nodex[this.nodeB]-diry*(this.lane[0]*50+25)-camx), zoom*(nodey[this.nodeB]+dirx*(this.lane[0]*50+25)-camy));
        ctx1.stroke();
        ctx1.beginPath();
        ctx1.moveTo(zoom*(nodex[this.nodeA]+diry*(this.lane[0]*50+25)-camx), zoom*(nodey[this.nodeA]-dirx*(this.lane[0]*50+25)-camy));
        ctx1.lineTo(zoom*(nodex[this.nodeB]+diry*(this.lane[0]*50+25)-camx), zoom*(nodey[this.nodeB]-dirx*(this.lane[0]*50+25)-camy));
        ctx1.stroke();
    }
}
let OCSEFroad=new road(0, 1, [2, 3], "road 2way", "OCSEF rd.");
let car1=new vehicle(80, 600, "#ff0000");
car1.display();
OCSEFroad.display();
function redraw(){
    ctx1.clearRect(0, 0, canvas.width, canvas.height);
    OCSEFroad.display();
    car1.display();
}
let holdTimer;
let clickerdown=false;
let held=false;
let cursorx;
let cursory;
let hoveredstar;
document.addEventListener("mousemove", function(e){
    cursorx=e.clientX;
    cursory=e.clientY;
});
let shortclick=false;
document.addEventListener('mousedown', function(e) {
    console.log('Clicked');
    clickerdown=true;
    initialcursorxposition=cursorx+camx*zoom;
    initialcursoryposition=cursory+camy*zoom;
    timeout=setTimeout(()=>{
        if(clickerdown){
            held=true;
        }
        intervalId = setInterval(() => {
            if (clickerdown) {
                camx=(initialcursorxposition-cursorx)/zoom;
                camy=(initialcursoryposition-cursory)/zoom;
                //console.log(camx);
                redraw();
            } else {
                clearInterval(intervalId); // Stop the interval if mouse is no longer down
            }
        }, 50); // Execute every 100 milliseconds
        //console.log(held);
    }, 500);
});
document.addEventListener('mouseup', function() {
    if(held==false){
        //console.log("short click");
        shortclick=true;
    }
    //console.log('let go');
    clickerdown=false;
    held=false;
    //console.log(held);
    setTimeout(() => {
        shortclick=false;
    }, 10);
});
document.addEventListener("wheel", function(f){
    if(f.deltaY<0){
        camx-=cursorx/zoom/2;
        camy-=cursory/zoom/2;
        zoom/=1.5;
        redraw();
    }else if(f.deltaY>0){
        camx+=cursorx/zoom/3;
        camy+=cursory/zoom/3;
        zoom*=1.5;
        redraw();
    }
});
let letters={};
document.addEventListener('keydown', function(a){letters[a.code]=true});
document.addEventListener('keyup', function(a){letters[a.code]=false});
setInterval(()=>{
    if(letters["KeyW"]){
        car1.accelerate(0.4);
    }else if(letters["KeyS"]){
        car1.accelerate(-0.4);
    }
}, 10);