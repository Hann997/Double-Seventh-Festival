//开始走路
function startWalk() {
	var container = $('#content');
	var swipe = Swipe(container);
	var visualWidth = container.width();
	var visualHeight = container.height();

	//时间控制
	var setTime = {
		walkToThird: 6000,
		walkToMiddle: 6500,
		walkToEnd: 6500,
		walkTobridge: 2000,
		bridgeWalk: 2000,
		walkToShop: 1500,
		walkOutShop: 1500,
		openDorTime: 800,
		shutDoorTime: 500,
		waitRotate: 850,
		waitFlower: 800
	}

	// 小孩走路 
	var boy = BoyWalk();
	//第一界面
	//太阳公转
	$("#sun").addClass("ratotion");
	//飘云
	$(".cloud:first").addClass('cloud1Anim');
	$(".cloud:last-child").addClass('cloud2Anim');
	//开始第一次走路
	boy.walkTo(setTime.walkToThird, 0.6).then(function() {
		//第一次走路完成
		//开始页面滚动
		scrollTo(setTime.walkToMiddle, 1);
		//第二次走路
		return boy.walkTo(setTime.walkToMiddle, 0.5);
	}).then(function() {
		//飞鸟
		bird.fly()
	}).then(function() {
		//第二界面
		boy.stopWalk();
		//开门
		return openDoor(setTime.openDoorTime);
	}).then(function() {
		//开灯
		lamp.bright();
		//进商店
		return boy.toShop(setTime.walkToShop)
	}).then(function() {
		//取花
		return boy.talkFlower(setTime.waitFlower);
	}).then(function() {
		//出商店
		return boy.outShop(setTime.walkOutShop);
	}).then(function() {
		//关门
		shutDoor(setTime.shutDoorTime);
		//灯暗
		lamp.dark()
	}).then(function() {
		//第三界面
		//修正小女孩位置
		girl.setOffset();
		scrollTo(setTime.walkToEnd, 2);
	}).then(function() {
		return boy.walkTo(setTime.walkToEnd, 0.15);
	}).then(function() {
		var distence = (bridgeY-girl.getHeight()) / visualHeight;
		return boy.walkTo(setTime.walkTobridge, 0.25, distence);
	}).then(function() {
		//实际走路的比例
		var proportionX = (girl.getOffset().left - boy.getWidth() - instanceX + girl.getWidth() / 5) / visualWidth;
		//第三次桥上直走到小女孩面前
		return boy.walkTo(setTime.bridgeWalk, proportionX);
	}).then(function() {
		//图片还原原地停止状态
		boy.resetOriginal();
	}).then(function() {
		//增加转身动作
		setTimeout(function() {
			girl.rotate();
			boy.rotate();
		}, setTime.waitRotate)
	}).then(function() {
		//飘花
		snowflake()
	});
}

function init() {
	$(function() {
		///动画处理//////
		startWalk();
		//背景音乐
		var audio1 = Html5Audio(audioConfig.playURL);
		audio1.end(function() {
			Html5Audio(audioConfig.cycleURL, true);
		})

	})
};
window.addEventListener('load', init, false);