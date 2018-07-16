/**
 * 在该页面上再加入三个 div，组合成下图中的方块。
 * 使用键盘的「上下左右」键可操作方块移动，每次移动 20px。
 * 使用键盘的「空格」键可操作方块旋转。
 */

let shape =[0,2,1,2,2,2,2,1];
let x = 0;
let y = 0;
let size = 20;
let activityModels = document.getElementsByClassName('activityModel');
let change = false;
let keyT=keyB=keyL=keyR=false;//设置指定键初始值

function show(){
    for(let i = 0 ; i < activityModels.length; i++){
        activityModels[i].style.top = (shape[i*2] + y)*size+"px";
        activityModels[i].style.left =(shape[i*2+1] + x)*size+"px";
    }
}
show();

setInterval(function(){//设置定时器，键盘按下每隔20毫秒执行一次移动操作
    if(keyL){
        move(-1,0);
        // div.style.left = div.offsetLeft-20+"px";
    }
    else if(keyR){
        move(1,0);
        // div.style.left = div.offsetLeft+20+"px";
    }
    if(keyT){
        move(0,-1);
        // div.style.top = div.offsetTop-20+"px";
    }
    else if(keyB){
        move(0,1);
        // div.style.top = div.offsetTop+20+"px";
    }
    if(change){
        changeShape();
    }
    // limit()//limit()函数限制div移动防止溢出
},100);

function changeShape(){
    /*寻找几个图形的变化规律*/
    shape = [3 - shape[1] , shape[0] , 3 - shape[3] , shape[2] , 3 - shape[5] , shape[4] ,  3 - shape[7] , shape[6]];
    show();
}

function move(a,b){
    x += a;//left
    y += b;//top
    show();
}


document.onkeydown=function(event){
    switch(event.keyCode) {
        case 37:
            keyL = true;
            break;
        case 38:
            keyT = true;
            break;
        case 39:
            keyR = true;
            break;
        case 40:
            keyB = true;
            break;
        case 32:
            change = true;
            break;
    }

};

document.onkeyup=function(event){
    switch(event.keyCode) {
        case 37:
            keyL = false;
            break;
        case 38:
            keyT = false;
            break;
        case 39:
            keyR = false;
            break;
        case 40:
            keyB = false;
            break;
        case 32:
            change = false;
            break;
    }
};
