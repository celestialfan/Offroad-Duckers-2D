let ctx=document.getElementById("maincanvas").getContext("2d");
let canvasxrad=document.getElementById("maincanvas").clientWidth;
let canvasyrad=document.getElementById("maincanvas").clientHeight;
let nodex=[];
let nodey=[];
class road{
    constructor(node, lanes, type, name){
        this.name=name;
        this.node=node;
        this.lane=lanes;
        this.type=type;
    }
    display(){
        for(let i=0; i<this.node.length; i++){
            
        }
    }
}