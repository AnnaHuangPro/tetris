/*
* 操作方块以600毫秒的速度，匀速从容器顶部开始下落，每次下落 20px。
* 保持「左右下」键的操作不变，修改「上」键的操作为方块旋转，修改「空格」键的操作为方块急速下落。
* 若方块的底部，触碰到容器的底部，便停下来并变成灰色。
* 然后再创建一个新的方块继续下落，周而复始。
* */

let shape =[0,2,1,2,2,2,2,1];
let x = 8;
let y = 0;
let size = 20;
let change = false;
let keyT=keyB=keyL=keyR=false;//设置指定键初始值
let row = 31;
let col = 20;

/**
 * AnnaHuang 2018/7/16
 */
function creat(){
    for(let i = 0 ; i < 4 ; i++){
        let div = document.createElement("div");
        div.className = "activityModel";
        document.body.append(div);
    }
}

/*将正在下落的方块显示出来*/
function show(){
    let activityModels = document.getElementsByClassName('activityModel');
    for(let i = 0 ; i < activityModels.length; i++){
        activityModels[i].style.top = (shape[i*2] + y)*size + 5 +"px";
        activityModels[i].style.left =(shape[i*2+1] + x)*size + 483 +"px";
    }
}
creat();
show();

function fix(){
    let activityModels = document.getElementsByClassName('activityModel');
    for(let i = activityModels.length-1 ; i >= 0; i--){
        activityModels[i].className = "stationaryModel";
    }
    x = 8;
    y = 0;
}

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
        changeShape();/*按键盘上键时，变换形状*/
        // move(0,-1);
        // div.style.top = div.offsetTop-20+"px";
    }
    else if(keyB){
        move(0,1);
        // div.style.top = div.offsetTop+20+"px";
    }
    if(change){
        move(0,2);/*按空格键时迅速下滑*/
    }
    // limit();//limit()函数限制div移动防止溢出
},100);

setInterval(function(){//设置定时器，600毫秒向下移动20px
        move(0,1);
        // div.style.top = div.offsetTop+20+"px";
},600);

function changeShape(){
    /*寻找几个图形的变化规律*/
    let newShape = [3 - shape[1] , shape[0] , 3 - shape[3] , shape[2] , 3 - shape[5] , shape[4] ,  3 - shape[7] , shape[6]];
    if(!limit(x,y,newShape)) return;
    shape = newShape;
    show();
}

function move(a,b){
    if(limit(a,b,shape)){//limit()函数限制div移动防止溢出
        x += a;//left
        y += b;//top
        show();
    }else{
        if(b == 0) return;/*如果是横向移动，则return*/
        fix();
        creat();
        show();
        // clearInterval(interval);
    }

}

/*假设迈出下一步，结果会怎样,(处理越界)*/
function limit(a,b,shape){
    let most_left = col;
    let most_top = row;
    let most_right = 0;
    let most_bottom = 0;
    for (let i = 0; i < 8; i += 2) {
        // 记录最左边水平坐标
        if (shape[i + 1] < most_left)
            most_left = shape[i + 1];
        // 记录最右边水平坐标
        if (shape[i + 1] > most_right)
            most_right = shape[i + 1];
        // 记录最上边垂直坐标
        if (shape[i] < most_top)
            most_top = shape[i];
        // 记录最下边垂直坐标
        if (shape[i] > most_bottom)
            most_bottom = shape[i];
    }

    if ((most_right + x + a + 1) > col || (most_left + x + a) < 0 ||
        (most_bottom + y + 1 + b ) > row || (most_top + y + b) < 0)
        return false;

    return true;
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
