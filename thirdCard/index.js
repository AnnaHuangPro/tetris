/**
 * 在该页面上再添加一个 div，给该 div 添加样式
 * .container { top: 0px; left: 0px; width: 200px; height: 360px; background: black; position: absolute; }，
 * 该 div 用来表示一个18行10列的容器。
 * 限制方块只能在该容器内部移动和旋转。
 */

let shape =[0,2,1,2,2,2,2,1];
let x = 0;
let y = 0;
let size = 20;
let activityModels = document.getElementsByClassName('activityModel');
let change = false;
let keyT=keyB=keyL=keyR=false;//设置指定键初始值
let row = 31;
let col = 20;

/**
 * AnnaHuang 2018/7/16
 */

function show(){
    for(let i = 0 ; i < activityModels.length; i++){
        activityModels[i].style.top = (shape[i*2] + y)*size + 5 +"px";
        activityModels[i].style.left =(shape[i*2+1] + x)*size + 483 +"px";
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
    // limit();//limit()函数限制div移动防止溢出
},100);



function changeShape(){
    /*寻找几个图形的变化规律*/
    let newShape = [3 - shape[1] , shape[0] , 3 - shape[3] , shape[2] , 3 - shape[5] , shape[4] ,  3 - shape[7] , shape[6]];
    if(!limit(x,y,newShape)) return;
    shape = newShape;
    show();
}

function move(a,b){
    if(!limit(a,b,shape)) return;//limit()函数限制div移动防止溢出
    x += a;//left
    y += b;//top
    show();
}

/*假设迈出下一步，结果会怎样*/
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
