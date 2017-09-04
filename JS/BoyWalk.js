/**
 * 小孩走路
 * @param {[type]} container [description]
 */

function BoyWalk() {
	var container = $('#content');
	//页面可视化区域
	var visualWidth = container.width();
	var visualHeight = container.height();

	//获取数据
	var getValue = function(className) {
		var $elem = $('' + className + '');
		// 走路的路线坐标
		return {
			height: $elem.height(),
			top: $elem.position().top
		};
	}

	//路的中间到顶部的距离
	var pathY = function() {
		var data = getValue('.a_background_middle');
		return data.top + data.height / 2;
	}();

	var $boy = $("#boy");

	// 设置一下缩放比例与基点位置
	var proportion = $(document).width() / 1440;
	// 设置元素缩放
	$boy.css({
		transform: 'scale(' + proportion + ')'
	});
	// 获取人物元素布局尺寸
	var boyHeight = $boy.height();
	var boyWidth = $boy.width();
	// 计算下缩放后的元素与实际尺寸的一个距离
	var boyInsideLeft = (boyWidth - (boyWidth * proportion)) / 2;
	var boyInsideTop = (boyHeight - (boyHeight * proportion)) / 2;

	// 修正小男孩的正确位置
	// 中间路的垂直距离 - 人物原始的垂直距离 - 人物缩放后的垂直距离
	$boy.css({
		top: pathY - (boyHeight * proportion) - boyInsideTop
	});
	

	//暂停走路
	function pauseWalk() {
		$boy.addClass('pauseWalk');
	}
	//恢复走路
	function restoreWalk() {
		$boy.removeClass('pauseWalk');
	}

	//css3的动作变化
	function slowWalk() {
		$boy.addClass('slowWalk');
	}

	//用transition做运动
	function startRun(options, runTime) {
		var dfdPlay = $.Deferred();
		//恢复走路
		restoreWalk();
		//运动的属性
		$boy.transition(options, runTime, 'linear', function() {
			dfdPlay.resolve(); // 动画完成
		});
		return dfdPlay;
	}

	//开始走路
	function walkRun(time, distX, disY) {
		time = time || 3000;
		//脚动作
		slowWalk();
		//开始走路
		var d1 = startRun({
			'left': distX + 'px',
			'top': disY ? disY : undefined
		}, time);
		return d1;
	}

	//走进商店
	function walkToShop(runTime) {
		var defer = $.Deferred();
		var doorObj = $('.door');
		//门的坐标
		var offsetDoor = doorObj.offset();
		var doorOffsetLeft = offsetDoor.left;
		//小男孩当前的坐标
		var offsetBoy = $boy.offset();
		var boyOffsetLeft = offsetBoy.left;

		//中间位置
		var boyMiddle = $boy.width() / 2;
		var doorMiddle = doorObj.width() / 2;
		var doorTopMiddle = doorObj.height() / 2;

		//当前需要移动的坐标
		instanceX = (doorOffsetLeft + doorMiddle) - (boyOffsetLeft + boyMiddle);

		//开始走路
		var walkPlay = startRun({
			transform: 'translateX(' + instanceX + 'px), scale(0.3,0.3)',
			opacity: 0.1
		}, 2000);

		//走路完毕
		walkPlay.done(function() {
			$boy.css({
				opacity: 0
			})
			defer.resolve();
		})
		return defer;
	}

	//走出店
	function walkOutShop(runTime) {
		var defer = $.Deferred();
		restoreWalk();
		//开始走路
		var walkPlay = startRun({
			transform: 'translateX(' + instanceX + 'px),scale(1,1)',
			opacity: 1
		}, runTime);
		//走路完毕
		walkPlay.done(function() {
			defer.resolve();
		});
		return defer;
	}

	//取花
	function talkFlower(waitFlower) {
		//增加延时等待效果
		var defer = $.Deferred();
		setTimeout(function() {
			//取花
			$boy.addClass('slowFlowerWalk');
			defer.resolve();
		}, waitFlower);
		return defer;
	}

	//计算移动距离
	function calculateDist(direction, proportion) {
		return(direction == "x" ?
			visualWidth : visualHeight) * proportion;
	}

	return {
		//开始走路
		walkTo: function(time, proportionX, proportionY) {
			var distX = calculateDist('x', proportionX)
			var distY = calculateDist('y', proportionY)
			return walkRun(time, distX, distY);
		},
		//走进商店
		toShop: function() {
			return walkToShop.apply(null, arguments);
		},
		//走出商店
		outShop: function() {
			return walkOutShop.apply(null, arguments);
		},
		//停止走路
		stopWalk: function() {
			pauseWalk();
		},
		//获取男孩的宽度
		getWidth: function() {
			return $boy.width();
		},
		//复位初始状态
		resetOriginal: function() {
			this.stopWalk();
			//恢复图片
			$boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
		},
		//转身动作
		rotate: function(callback) {
			restoreWalk();
			$boy.addClass('boy-rotate');
			//监听转身完毕
			if(callback) {
				$boy.on(animationEnd, function() {
					callback();
					$(this).off();
				})
			}
		},
		//取花
		talkFlower: function() {
			return talkFlower();
		}
	}

}