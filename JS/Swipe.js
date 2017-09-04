/*----------页面滑动功能----------*/

function Swipe(container) {
	//	var container = $('#content');
	// 获取第一个子节点
	var element = container.find(":first");
	// 滑动对象
	var swipe = {};

	// 获取li
	var slides = element.find(">");
	// 获取容器尺寸
	var width = container.width();
	var height = container.height();

	//设置li页面总宽度
	element.css({
		width: (slides.length * width) + 'px',
		height: height + 'px'
	});
	// 设置每一个页面的li的宽度
	// 使用each方法遍历循环每个li
	$.each(slides, function(index) {
		var slide = slides.eq(index); //获取到每一个li元素
		slide.css({ // 设置每一个li的尺寸
			width: width + 'px',
			height: height + 'px'
		});
	});
	
	var isComplete = false;
	var timer;
	var callbacks = {};
	container[0].addEventListener("transitionend",function(){
		isComplete = true;
	},false);
	function monitorOffset(element){
		timer = setInterval(function(){
			if(isComplete){
				clearInterval(timer);
				return
			}
			callbacks.move(element.offset().left);
			monitorOffset(element)
		},500)
	}
	swipe.watch = function(eventName,callback){
		callbacks[eventName] = callback
	}
	//监控完成与移动
	swipe.scrollTo = function(x, speed) {
		//执行动画移动
		// 在speed毫秒的时间内，移动X的位置，为2个页面单位
		element.css({
			'transition-timing-function' : 'linear',
            'transition-duration'        : speed + 'ms',
            'transform'                  : 'translate3d(-' + x + 'px,0px,0px)'
		});
		return this;
	};
	return swipe;
}