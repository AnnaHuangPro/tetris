/**
 * 新建一个 html 页面，在该页面上添加一个 div。
 * 给该 div 添加样式 .activityModel { margin: 1px; width: 19px; height: 19px; background: red; position: absolute; }。
 * 使用键盘的「上下左右」键可操作 div 移动，每次移动 20px。
 */

window.onload = function(){
    let div = document.getElementsByClassName('activityModel');
    let keyT=keyB=keyL=keyR=false;//设置指定键初始值

    setInterval(function(){//设置定时器，键盘按下每隔20毫秒执行一次移动操作
        if(keyL){
            div[0].style.left = div[0].offsetLeft-20+"px";
        }
        else if(keyR){
            div[0].style.left = div[0].offsetLeft+20+"px";
        }
        if(keyT){
            div[0].style.top = div[0].offsetTop-20+"px";
        }
        else if(keyB){
            div[0].style.top = div[0].offsetTop+20+"px";
        };
        limit()//limit()函数限制div移动防止溢出
    },30);

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
        }

    }

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
        }
    }

    function limit(){
        (div[0].offsetLeft<=0) && (div[0].style.left=0);
        //防止左溢出
        (div[0].offsetTop<=0) && (div[0].style.top=0);
        //防止上溢出
        (div[0].offsetLeft+div[0].offsetWidth>=document.documentElement.clientWidth)
        && (div[0].style.left=document.documentElement.clientWidth-div[0].offsetWidth-2+"px");
        //防止右溢出
        (div[0].offsetTop+div[0].offsetHeight>=document.documentElement.clientHeight)
        && (div[0].style.top=document.documentElement.clientHeight-div[0].offsetHeight-2+"px");
        //防止下溢出
    }
}
