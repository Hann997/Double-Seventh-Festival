//临时调整页面
// var swipe = Swipe($('#content'));
// swipe.scrollTo($('#content').width()*2,500000);

var container = $("#content");
// 页面可视区域
visualWidth = container.width();
visualHeight = container.height();

//动画结束事件
var animationEnd = (function() {
	var explorer = navigator.userAgent;
	if(~explorer.indexOf('Webkit')) {
		return 'webkitAnimationEnd';
	}
	return 'animationend'
})();

var container = $('#content');
var swipe = Swipe(container);
var visualWidth = container.width();
visualHeight = container.height();

//页面滚动到指定的位置
function scrollTo(time, proportionX) {
	var distX = container.width() * proportionX;
	swipe.scrollTo(distX, time);
}

//获取数据
var getValue = function(className) {
	var $elem = $('' + className + '')
	//走路的路线坐标
	return {
		height: $elem.height(),
		top: $elem.position().top
	};
};

/*******第二页动画********/

/////////////////
///////开关门/////
////////////////

//时间控制

function doorAction(left, right, time) {
	var $door = $('.door');
	var doorLeft = $('.door_left');
	var doorRight = $('.door_right');
	var defer = $.Deferred();
	var count = 2;
	//等待开门完成
	var complete = function() {
		if(count == 1) {
			defer.resolve();
			return;
		}
		count--;
	};
	doorLeft.transition({
		'left': left //从左边0-50
	}, time, complete);

	doorRight.transition({
		'left': right //从右边50-100
	}, time, complete);
	return defer;
}

//开门
function openDoor(openDoorTime) {
	return doorAction('-50%', '100%', openDoorTime);
}

//关门
function shutDoor(shutDoorTime) {
	return doorAction('0%', '50%', shutDoorTime);
}

////////////
////灯动画////
////////////

var lamp = {
	elem: $('.b_background'),
	bright: function() {
		this.elem.addClass('lamp-bright')
	},
	dark: function() {
		this.elem.removeClass('lamp-bright')
	}
};

/*右边飞鸟*/
var bird = {
	elem: $('.bird'),
	fly: function() {
		this.elem.addClass('birdFly')
		this.elem.transition({
			right: container.width()
		}, 15000, 'linear');
	}
};
/*
 * 第三页面动画
 */

//桥的Y轴
var bridgeY = function() {
	var data = getValue('.c_background_middle');
	return data.top;
}();

///小女孩///

//小女孩
var girl = {
	elem: $('.girl'),
	getHeight: function() {
		return this.elem.height();
	},
	//转身动作
	rotate: function() {
		this.elem.addClass('gril-rotate');
	},
	setOffset: function() {
		this.elem.css({
			left: visualWidth / 2,
			top: bridgeY - this.getHeight()
		});
	},
	getOffset: function() {
		return this.elem.offset()
	},
	getWidth: function() {
		return this.elem.width();
	}
};

////飘玫瑰花////

snowflakeURL = [
	'./images/snowflake/snowflake1.png',
	'./images/snowflake/snowflake2.png',
	'./images/snowflake/snowflake3.png',
	'./images/snowflake/snowflake4.png',
	'./images/snowflake/snowflake5.png',
	'./images/snowflake/snowflake6.png'
]

function snowflake() {
	//雪花容器
	var $flakeContainer = $('#snowflake');

	//随机六张图
	function getImagesName() {
		return snowflakeURL[[Math.floor(Math.random() * 6)]];
	}
	//创建一个雪花元素
	function createSnowBox() {
		var url = getImagesName();
		return $('<div class="snowbox" />').css({
			'width': 41,
			'height': 41,
			'position': 'absolute',
			'backgroundSize': 'cover',
			'z-Index': 100000,
			'top': '-41px',
			'backgroundImage': 'url(' + url + ')'
		}).addClass('snowRoll');
	}
	//开始飘花
	setInterval(function() {
		//运动的轨迹
		var startPositionLeft = Math.random() * visualWidth - 100,
			startOpacity = 1,
			endPositionTop = visualHeight - 40,
			endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
			duration = visualHeight * 10 + Math.random() * 5000;

		//随机透明度，不小于0.5
		var randomStart = Math.random();
		randomStart = randomStart < 0.5 ? startOpacity : randomStart;

		//创建一个雪花
		var $flake = createSnowBox();

		//设计起点位置
		$flake.css({
			left: startPositionLeft,
			opacity: randomStart
		});

		///加入到容器
		$flakeContainer.append($flake);

		//开始执行动画
		$flake.transition({
			top: endPositionTop,
			left: endPositionLeft,
			opacity: 0.7
		}, duration, 'ease-out', function() {
			$(this).remove()
		});
	}, 200);
}

//音乐配置
var audioConfig = {
	enable: true, //是否开启音乐
	playURL: './music/happy.wav', // 正常播放地址
	cycleURL: './music/circulation.wav' // 正常循环播放地址
};

///////////
///背景音乐///
function Html5Audio(url, isloop) {
	var audio = new Audio(url);
	audio.autoPlay = true;
	audio.loop = isloop || false;
	audio.play();
	return {
		end: function(callback) {
			audio.addEventListener('ended', function() {
				callback();
			}, false);
		}
	};
}