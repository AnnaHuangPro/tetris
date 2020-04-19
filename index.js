/**
 * AnnaHuang 2018/7/16
 */
/**
 * 二次修订 2020/4/19
 */

// [0, 2] [纵坐标，横坐标] 4个点的坐标 [0,2] [1,2] [2,2] [2,1]
const SHAPES = [
  [1, 2, 2, 2, 3, 2, 4, 2], // 横条
  [1, 1, 1, 2, 1, 3, 1, 4], // 竖条
  [0, 1, 1, 1, 1, 2, 2, 2], // 竖反 z
  [2, 0, 2, 1, 1, 1, 1, 2], // 反 z
  [0, 0, 0, 1, 1, 1, 1, 2], // z
  [0, 2, 1, 2, 1, 1, 2, 1], // 竖z
	[0, 2, 1, 2, 2, 2, 2, 1], // 反 l
	[1, 1, 2, 1, 2, 2, 2, 3], // 反躺l
  [2, 3, 2, 2, 2, 1, 1, 1], // 躺 L
	[1, 1, 1, 2, 2, 2, 2, 1], // 正方形
];
/*每次随机生成的初始图形*/
let ROW = 20; // 限制框的行数为20行
let COL = 20; // 限制列的行数为15行
const SIZE = 20; // 每次移动的单位为20px,一个格子的宽高
let RIGHT_INIT_INDEX = 1;
const DOWN_INIT_INDEX = 0;
let randomShape = []; /*存的单个图形的坐标*/
let currentShapeDiv = []; /*当前流动的 存1个图形的4个div*/
let container = {}; /*存已经在下方已经固定的图形的div 坐标*/
let rightMovedCount;
let downMovedCount = DOWN_INIT_INDEX;
let isPause = false; // 是否暂停
let downImmediatelyInterval = null;
let freeFallInterval = null;
let removeCount = 0;
let isMoveOtherLines = true;

document.getElementById("removeCount").textContent = removeCount;

let containerWrap = document.getElementById('container');

// let change = false;
// let keyT=keyB=keyL=keyR=false;//设置指定键初始值

document.onkeydown = function (e) {
  var e = window.event ? window.event : e;
  switch (e.keyCode) {
    case 37:
      move(-1, 0); /*向左*/
      break;
    case 38:
      changeShape();
      break;
    case 39:
      move(1, 0); /*向右*/
      break;
    case 40:
      move(0, 1); /*向下*/
      break;
    case 32:
      downImmediately();
      break;
    case 13:
      isPause = !isPause;
      freeFall();
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

function freeFall() {
  if (isPause) {
    clearInterval(freeFallInterval);
    freeFallInterval = null;
    return;
  }
  freeFallInterval = setInterval(function () {
    //设置定时器，600毫秒向下移动1个做表格，长度为SIZE
    move(0, 1);
  }, 600);
}

function downImmediately() {
  if (!isPause) {
    // interval = setInterval("move(0,1)",0);/*当第一个参数是字符串时，字符串的内容可以被解释为一段动态生成的函数代码，非常不推荐使用*/
    downImmediatelyInterval = setInterval(function () {
      move(0, 1);
    }, 0);
  }
}

// renderContainer();
// start();

function renderContainer () {
	containerWrap.style.width = COL * SIZE + 'px';
	containerWrap.style.height = ROW * SIZE + 'px';
}
function start() {
  rightMovedCount = RIGHT_INIT_INDEX;
  downMovedCount = DOWN_INIT_INDEX;
  if (freeFallInterval) {
    clearInterval(freeFallInterval);
    freeFallInterval = null;
  }
  if (downImmediatelyInterval) {
    clearInterval(downImmediatelyInterval);
    downImmediatelyInterval = null;
  }
  const isEnd = Object.keys(container).some((item) => {
    return item.indexOf("_0") !== -1;
  });
  if (isEnd) {
    alert(`游戏结束，总共消灭${removeCount}行`);
    return;
	}
	creat(); // 创建4个div
  show(); // 赋予灵魂，css top left
  freeFall();
}

function config() {
	if(containerWrap) {
		document.body.removeChild(containerWrap);
		container = {};
	}
	const radios = document.getElementsByName('mode');
	for(let i = 0; i < radios.length; i++) {
		if(radios[i].checked) {
			if(radios[i].value === 'easy') {
				isMoveOtherLines = true;
			} else {
				isMoveOtherLines = false;
			}
		}
	}
	containerWrap = document.createElement("div");
	containerWrap.id = "container";
	document.body.append(containerWrap);
	COL = Number(document.getElementById('col').value);
  ROW = Number(document.getElementById('row').value);
  RIGHT_INIT_INDEX = Math.floor(COL/2) - 1;
  rightMovedCount = RIGHT_INIT_INDEX;
  renderContainer();
	start();
}

function creat() {
  randomShape = selectRandomShape();
  currentShapeDiv = []; // 存放4个div
  for (let i = 0; i < 4; i++) {
    const div = document.createElement("div");
    div.className = "activityModel";
    currentShapeDiv[i] = div;
    containerWrap.append(div);
  }
}

/* 将随机选择的图形坐标和 x y 转换成元素的px */
function show() {
  let activityModels = document.getElementsByClassName("activityModel");
  for (let i = 0; i < activityModels.length; i++) {
    activityModels[i].style.top =
      (randomShape[i * 2] + downMovedCount) * SIZE + "px";
    activityModels[i].style.left =
      (randomShape[i * 2 + 1] + rightMovedCount) * SIZE + "px";
  }
}

function selectRandomShape() {
	// 在7个图形中随机选择其中一个图片 /*可对一个数进行下舍入，向下取整计算 random:[0,1)*/

  return SHAPES[Math.floor(Math.random() * 10)];
}

/*将方块固定，并将它变成灰色，固定在底部*/
function fix() {
  let xIndex = 0;
  let yIndex = 0;
  let activityModels = document.getElementsByClassName("activityModel");
  for (let i = activityModels.length - 1; i >= 0; i--) {
    activityModels[i].className = "stationaryModel";
    xIndex = randomShape[i * 2 + 1] + rightMovedCount;
    yIndex = randomShape[i * 2] + downMovedCount;

    container[xIndex + "_" + yIndex] = currentShapeDiv[i]; /*记录每一格div的x,y坐标*/
  }
  findFull(); /*寻找最后一行是否是满行*/
}

/*遍历整个容器，判断是否有满行，是否可以删除一行,从最后一行开始遍历，这样遍历的次数要少*/
function findFull() {
	for (let row = ROW - 1; row >= 0; row--) {
		const thisRowArray = Object.keys(container).filter(
			item => Number(item.split('_')[1]) === row
			);
		if (thisRowArray.length === COL) {
			removeLine(row);
			row++;
		}
	}
}

function removeLine(row) {
  for (let c = 0; c < COL; c++) {
		container[c + "_" + row] && containerWrap.removeChild(container[c + "_" + row]);
		delete container[c + "_" + row];
  }

	removeCount++;
	document.getElementById("removeCount").textContent = removeCount;
	if (isMoveOtherLines) {
		moveOtherLines(row);
	}
}

function moveOtherLines (row) {
	for (let r = row; r >= 0; r--) {
		let count = 0;
    for (let j = 0; j < COL; j++) {

      /*将上一行赋值给下一行，如果不存在则是undefined*/
			container[j + "_" + r] = container[j + "_" + (r - 1)];
			delete container[j + "_" + (r - 1)];
      if (container[j + "_" + r]) {
				count++;
				container[j + "_" + r].style.top = r * SIZE + "px";
      } else {
				delete container[j + "_" + r];
			}
		}
		if(count === 0) {
			break;
		}
  }
}

function changeShape() {
  if (!isPause) {
    /*寻找几个图形的变化规律*/
    let newShape = [
      3 - randomShape[1],
      randomShape[0],
      3 - randomShape[3],
      randomShape[2],
      3 - randomShape[5],
      randomShape[4],
      3 - randomShape[7],
      randomShape[6],
    ];
    // 转换图形的时候判断是否时触碰边界或是重叠
    if (isLimit(0, 0, newShape)) return;
    randomShape = newShape;
    show();
  }
}

function move(right, down) {
  if (!isPause) {
    if (isLimit(right, down, randomShape)) {
      if (down === 0) return;
      fix();
      start();
      /*使得方块变灰并固定*/
      return;
    }

    //limit()函数限制div移动防止溢出
    rightMovedCount += right;
    downMovedCount += down;
    show();
  }
}

/*假设迈出下一步，例如(0,1),向右0步，向下1步，结果会怎样,(处理越界)*/
function isLimit(right, down, shape) {
  let most_left = COL;
  let most_top = ROW;
  let most_right = 0;
  let most_bottom = 0;
  let overlap = false;
  let supposeXIndex = 0;
  let supposeYIndex = 0;

  for (let i = 0; i < 8; i += 2) {
    // 记录最左边水平坐标
    if (shape[i + 1] < most_left) most_left = shape[i + 1];
    // 记录最右边水平坐标
    if (shape[i + 1] > most_right) most_right = shape[i + 1];
    // 记录最上边垂直坐标
    if (shape[i] < most_top) most_top = shape[i];
    // 记录最下边垂直坐标
    if (shape[i] > most_bottom) most_bottom = shape[i];
    //判断方块之间是否重叠
    supposeXIndex = shape[i + 1] + rightMovedCount + right; // 假设向右移几步
    supposeYIndex = shape[i] + downMovedCount + down; // 假设向下移几步
    // 判断container中是否有对应的元素，有则有重复
    if (container[supposeXIndex + "_" + supposeYIndex]) overlap = true;
  }

  if (
    most_right + rightMovedCount + right + 1 > COL ||
    most_left + rightMovedCount + right < 0 ||
    most_bottom + downMovedCount + 1 + down > ROW ||
    most_top + downMovedCount + down < 0 ||
    overlap
  )
    return true;

  return false;
}
