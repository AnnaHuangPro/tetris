/**
 *从七个基本方块中，随机取一个，以600毫秒的速度，匀速从容器顶部开始下落，每次下落 20px。
 * 若方块的底部，触碰到容器的底部，或触碰到其他方块，便停下来并变成灰色。
 * 若下落的方块正好铺满一行，便自动消除该行。
 * 然后再从七个基本方块中，随机取一个继续下落，周而复始。
 * */

/**
 * AnnaHuang 2018/7/16
 */

const SHAPES =[[0,2,1,2,2,2,2,1],
             [1,1,1,2,1,3,1,4],
             [1,1,1,2,2,2,2,1],
             [2,3,2,2,2,1,1,1],
             [1,2,2,2,3,2,4,2],
             [0,1,0,2,1,2,2,2],
             [0,2,1,2,1,1,2,1],
             [0,1,1,1,1,2,2,2]];
const row = 31;
const col = 20;
const size = 20;
let shape = [];/*存的单个图形的坐标*/
let shapeDiv = [];/*存单个图形的4个div*/
let container = {};
let x = 8;
let y = 0;
let interval;
// let change = false;
// let keyT=keyB=keyL=keyR=false;//设置指定键初始值

document.onkeydown=function(e){
    var e = window.event ? window.event : e;
    switch(e.keyCode) {
        case 37:
            move(-1,0);/*向左*/
            break;
        case 38:
            changeShape();
            break;
        case 39:
            move(1,0);/*向右*/
            break;
        case 40:
            move(0,1);/*向下*/
            break;
        case 32:
            quickDown();
            break;
    }
};


/*
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

//用定时器非常容易出问题,且增加了很多的闭包作用域
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
        changeShape();/!*按键盘上键时，变换形状*!/
        // move(0,-1);
        // div.style.top = div.offsetTop-20+"px";
    }
    else if(keyB){/!*按下键时下降的速度更快*!/
        move(0,1);
        // div.style.top = div.offsetTop+20+"px";
    }
    if(change){
        quickDown();/!*按空格键时迅速下滑*!/
    }
    // limit();//limit()函数限制div移动防止溢出
},200);*/

setInterval(function(){//设置定时器，600毫秒向下移动20px
    move(0,1);
    // div.style.top = div.offsetTop+20+"px";
},600);

function quickDown(){
    // interval = setInterval("move(0,1)",0);/*当第一个参数是字符串时，字符串的内容可以被解释为一段动态生成的函数代码，非常不推荐使用*/
    interval = setInterval(function(){
        move(0,1);
    },0)
}

creat();
show();

function creat(){
    shapeDiv = [];
    randomShape();
    for(let i = 0 ; i < 4 ; i++){
        let div = document.createElement("div");
        div.className = "activityModel";
        shapeDiv[i] = div;
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

function randomShape(){
    shape = SHAPES[Math.floor(Math.random() * 7)];/*可对一个数进行下舍入，向下取整计算 random:[0,1)*/
}

/*将方块固定，并将它变成灰色，固定在底部*/
function fix(){
    let px = 0;
    let py = 0;
    let activityModels = document.getElementsByClassName('activityModel');
    for(let i = activityModels.length-1 ; i >= 0; i--){
        activityModels[i].className = "stationaryModel";
        px = shape[i * 2 + 1] + x;
        py = shape[i * 2] + y;
        container[px + "_" + py] = shapeDiv[i];/*记录每一格div的x,y坐标*/
    }
    x = 8;
    y = 0;
    findFull();/*寻找是否有满行*/
}

/*遍历整个容器，判断是否有满行，是否可以删除一行,从最后一行开始遍历，这样遍历的次数要少*/
function findFull() {/*r代表行数，即是y方向，c代表列数，即代表x方向*/
    for(let r = row-1; r >= 0; r--){
        let count = 0;
        for(let c = 0; c < col; c++){
            if(container[c+"_"+r])
                count++;
        }
        if(count === col){
            removeLine(r);
        }
    }
}

function removeLine(row){
    for(let c = 0; c < col; c++){
        document.body.removeChild(container[c + "_" + row]);
    }
    //将所消除行的上方所有行下移一行
    for(let r = row; r > 0; r--){
        for(let j = 0; j < col; j++){
            container[j + "_" + r] = container[j + "_" + (r-1)];
            if(container[j + "_" + r]){
                container[j + "_" + r].style.top = r * size + 5 + "px";
            }
        }
    }

}

function changeShape(){
    /*寻找几个图形的变化规律*/
    let newShape = [3 - shape[1] , shape[0] , 3 - shape[3] , shape[2] , 3 - shape[5] , shape[4] ,  3 - shape[7] , shape[6]];
    if(!limit(0,0,newShape)) return;
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
        fix();/*使得方块变灰并固定*/
        creat();/*创建新的方块*/
        show();/*显示出来*/
        clearInterval(interval);
    }
}

/*假设迈出下一步，例如(0,1),向右0步，向下1步，结果会怎样,(处理越界)*/
function limit(a,b,shape){
    let most_left = col;
    let most_top = row;
    let most_right = 0;
    let most_bottom = 0;
    let overlap = false;
    let px = 0;
    let py = 0;

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
        //判断方块之间是否重叠
        px = shape[i + 1] + x + a;
        py = shape[i] + y + b;
        if (container[px + "_" + py])
            overlap = true;
    }

    if ((most_right + x + a + 1) > col || (most_left + x + a) < 0 ||
        (most_bottom + y + 1 + b ) > row || (most_top + y + b) < 0 || overlap)
        return false;

    return true;
}

