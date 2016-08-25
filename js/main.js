
	window.onload = function(){
		var self=this;
		var imageArr=[
			'./img/first.png',
			'./img/second.gif',
			'./img/second.gif',
			'./img/second.gif',
			'./img/second.gif',
			'./img/second.gif',
			'./img/second.gif'
		];
		var $loadingBar = $('.loading_bar div');
	
		//load image
		var len=imageArr.length;
		//var len=7;
		var totalNum=len+1;
		
		$.each(imageArr,function(i,item) {
			var image = new Image();
			image.src = item;
			image.onload = function() {
				setTimeout(function() {
					len--;
					$loadingBar.text(Math.floor((1-len/totalNum)*100)+'%');
					if( len <=0 ) {
						self.loadHtml();
					}
				}, 1000*Math.random());
			}	
		});
	}
	loadHtml = function() {
		$('.content_wrap').show();
		window.Slide && (new window.Slide());
	}

	//阻止上下滚动
	window.ontouchmove = function(e) {
		e.preventDefault();
	}

	var Slide = function() {
	// 获得称号配置
	this.chanlist=[
		'天生绝脉',
		'低能儿',
		'低能儿',
		'虚竹和尚',
		'虚竹和尚',
		'段誉',
		'段誉',
		'乔峰',
		'扫地僧'
	];
	// 分享文案
	this.chList = [
		'你是天生绝脉，注定与搞机无缘，请安分一点进入平安世界ZEALER|FIX逍遥一生',
		'骚年，搞机不适合你，快进入平安世界ZEALER|FIX逍遥一生吧',
		'骚年，搞机不适合你，快进入平安世界ZEALER|FIX逍遥一生吧',
		'骚年，你还不错，已经化身笨笨的虚竹和尚不过进入ZEALER|FIX才能让你得到梦姑哦',
		'骚年，你还不错，已经化身笨笨的虚竹和尚不过进入ZEALER|FIX才能让你得到梦姑哦',
		'呦呵，挺厉害的嘛！恭喜你化身段誉，成就六脉神剑，快进入ZEALER|FIX与王语嫣汇合吧',
		'呦呵，挺厉害的嘛！恭喜你化身段誉，成就六脉神剑，快进入ZEALER|FIX与王语嫣汇合吧',
		'牛！恭喜你化身大侠乔峰，降龙十八掌所向披靡，快进入ZEALER|FIX解救阿朱去吧',
		'通关！扫地僧，你厉害！ZEALER|FIX需要你帮忙完善天龙搞机世界的秩序，还不快来？'
	];	
	this.$wrap = $("#slide_wrap");
	this.$itemWrap = this.$wrap.find(".item_wrap");
	this.$slides = this.$wrap.find('.slide_item');
	this.$a_answer = $('.answer a');
	this.$sharePage = $('.share_page');
	this.$askArea = $('.ask_area');

	this.winHeight = $(window).height();
	this.winWidth = $(window).width();
	this.minDis = 0.2 * this.winHeight;
	this._slideLen = this.$slides.length;
	this._prevIndex = -1;
	this._curIndex = 0;
	this.$slides.css('height', this.winHeight);
	this.$sharePage.css('height', this.winHeight);
	this.$sharePage.css('margin-top',-this.winHeight);
	this.$askArea.css('font-size',(this.winHeight/677)*1.7+'em');
	this.$askArea.css('bottom',(this.winHeight/677)*6+'%');
	this.t = null;

	this.currentPage = 0;
	this.right_ans = 0;

	this.init();
}

Slide.prototype =  {
	init: function() {
		var self = this;

		//获取每一页的相对位置
		var imgWidth = 640;
		var imgHeight = [495, 733, 0, 0, 0, 0, 0, 0, 0, 0, 495];
		//var itemTitle = [88, 0 , 0, 80, 0, 66, 68];

		$.each(self.$slides, function(i, item) {
			var $this = $(this);
			var $itemText = $this.find('.container');

		    //var itemContent = $itemText.find('.item_content').height();
			
			//var itemText_H = parseInt(itemTitle[i]+itemContent);
			var itemHeight = parseInt(imgHeight[i]/imgWidth*self.winWidth)/2;
			$itemText.css('margin-top', -itemHeight);

			var $itemNextPic=$this.find('.item_next');
			if(i>1) {
				$itemNextPic.css('visibility','hidden');
			}
			
		});

		this.bindEvent();
		//this.answerClick();
		//this.showMusic();
	},
	bindEvent: function() {
		var self = this;
		var _curY = 0;

		var ham = new Hammer(this.$wrap[0]);

		var onStart = function(e) {
			// matrix(1, 0, 0, 1, 0, -703)
			var ret = self.$itemWrap.css('transform');
			_curY = parseInt(ret.split(',').pop());
		}


		var onMove = function(e) {
			var deltaY = e.deltaY;
			var curIndex = self._curIndex;

			//第一页
			if(deltaY > 0 &&  curIndex == 0) {
				return ;
			}
			
			//最后一页
			if(deltaY < 0 && curIndex == self._slideLen - 1) {
				return ;
			}

			if(self.preventMove(deltaY, curIndex)) {return;}

            //滑动动作
		    var _distanY = Math.abs(_curY+deltaY);	
			self.toPosition(_distanY);

		}

		var onEnd = function(e) {
			var deltaY = e.deltaY;
			
			//滑动Y轴偏移量少于一定最少距离 ，保留在当前页
			if(Math.abs(deltaY) < self.minDis) {

			}else {
				if(deltaY < 0) {
					if (!self.preventMove(deltaY, self._curIndex)) {
						self.toNext(e);
					}	
				}else {
					self.toPrev();
				}
			}

            //停止动作
		    var _distanY = self.winHeight * (self._curIndex);	
			self.toPosition(_distanY);
		}
		

		//调用pan拖动,只允许垂直拖动
		ham.get('pan').set({
			direction: Hammer.DIRECTION_VERTICAL,
			threshold: 0,
		 });

		ham.on('panstart', function(e) {
			onStart(e);
		}); 

		ham.on('panmove', function(e) {
			//debugger;
			//onMove(e);
		});

		ham.on('panend', function(e) {
			onEnd(e);
		});

		this.$wrap.find('.item_next').on('click', function() {
			//deltaY，－1后绝对值变大，进入onEnd后的toNext
			onEnd({deltaY: -1*self.minDis-1});
		});
		this.$itemWrap.find('.share_btn').on('click', function() {
			//debugger;	
			//self.$itemWrap.find('.share_page').css('display','block');
			self.$itemWrap.find('.shareNum').text(self.right_ans);
			self.$itemWrap.find('.shareNick').text(self.chanlist[self.right_ans]);
			//reset title for wechate share
			document.title = self.$itemWrap.find('.share_txt').text();
			self.$sharePage.show();	
		});
		this.$a_answer.on('click', function() {
			var $this = $(this);
			var $parent = $this.parent().parent();
			//can't answer the same question
			if($parent.hasClass('answered')) {
				return;
			}else{
				self.currentPage += 1;
				$parent.addClass('answered');
				 // 答对
				 if($this.hasClass('ans_right')) {
					$this.addClass('a_right');
					self.right_ans += 1;
				 // 答错
				 }else{
					$this.addClass('a_wrong');
				 }
				setTimeout(function() {	
					onEnd({deltaY: -1*self.minDis-1});
				}, 500);
			}
			if(self.currentPage == 8) {
				self.setResult();
			}
        }); 
	},

	//before answer question, not allow to move
	preventMove: function (deltaY, curIndex) {
		var self = this;
		var $curPage = self.$slides.eq(curIndex);
		if(deltaY < 0 && (curIndex > 1 && curIndex < 11) && !$curPage.find('.answer').hasClass('answered')) {
			return  true;
		}
		return false;
	},

	setResult: function() {
		this.$slides.find('.suc_num').html(this.right_ans);
		this.$slides.find('.result_explain').html(this.chList[this.right_ans]);
	},
	toNext: function(e) {
		var self = this;
		var deltaY = e.deltaY;
		this._prevIndex = this._curIndex;
		var $curPage = this.$slides.eq(this._curIndex);
		//before answer question, not allow to move
		if(deltaY < 0 && (this._curIndex > 1 && this._curIndex < 11) && !$curPage.find('.answer').hasClass('answered')) {
			return ;
		}
		this._curIndex++;

		if(this._curIndex > this._slideLen-1) {
			this._curIndex = this._slideLen-1;
			return ;
		}
	},
	toPrev: function() {
		this._prevIndex = this._curIndex;
		this._curIndex--;

		if(this._curIndex < 0) {
			this._curIndex = 0;
			return ;
		}

	},
	toPosition: function(_distanY) {
		var self = this;
		//进行动画,1,2,3,4进行动画
		var _v = 'translate3d(0, -'+ _distanY +'px, 0)';
		this.$itemWrap.css({
			'transform': _v,
			'-webkit-transform': _v,
			'-ms-transform': _v,
			'-moz-transform': _v,
		});
	}
}

