(function($){
	var ImgUpload = function(element){
		this.element = element;
		this.init();

	};

	ImgUpload.prototype = {
		init : function(){
			var me=this;
			me.element.change(function(){
				if(me.element.val()==""){return false}
				var img = $(this).get(0).files[0];
				if(img.size>2097152){alert("文件超过大小限制，请上传2M以内的图片");return}
				me.imgUrl = window.URL.createObjectURL(img);
				var image = new Image();
				image.src = me.imgUrl;
				image.onload = function(){
					me.realWidth = image.width;
					me.realHeight = image.height;
					if(me.realHeight <= me.realWidth){		//横向
						me.imgBoxWidth = 450;
						me.imgBoxHeight = me.imgBoxWidth*me.realHeight/me.realWidth;
						me.imgBoxOffset = "top: "+(225-me.imgBoxHeight/2)+"px;left:0";
						me.imgSize = me.imgBoxHeight-2;
						me.imgTop = 0;
						me.imgLeft = (me.imgBoxWidth-me.imgSize)/2;
					}else{			//竖向
						me.imgBoxHeight = 450;
						me.imgBoxWidth = me.imgBoxHeight*me.realWidth/me.realHeight;
						me.imgBoxOffset = "left: "+(225-me.imgBoxWidth/2)+"px;top:0";
						me.imgSize = me.imgBoxWidth-2;
						me.imgTop = (me.imgBoxHeight-me.imgSize)/2;
						me.imgLeft = 0;
					}
					me.layout();
				};
			});
		},


		layout : function(){
			var me = this,
				winHeight = $(window).height(),
				winWidth = $(window).width(),
				offsetTop = (winHeight-550)/2,
				offsetLeft = (winWidth-450)/2;
			me.boxHtml = "<div id='bg' style='display: none;position: fixed;top: 0;left: 0;width: "+winWidth+"px;height: "+winHeight+"px;background-color: rgba(0,0,0,0.3);z-index:9999'></div>"
							+"<div id='imgbg' style='display: none;position: fixed;height: 450px;width: 450px;top:"+offsetTop+"px;left:"+offsetLeft+"px;border: 1px solid #ddd;background-color: #fff;z-index:99999'>"
								+"<div id='imgbox' style='position: absolute;width: "+me.imgBoxWidth+"px;height: "+me.imgBoxHeight+"px;"+me.imgBoxOffset+"'>"
									+"<img src='"+me.imgUrl+"' style='position: absolute;opacity: 0.5;width: 100%;height: 100%'>"
									+"<img id='img' src='"+me.imgUrl+"' style='position: absolute;clip: rect("+me.imgTop+"px,"+(me.imgLeft+me.imgSize)+"px,"+(me.imgTop+me.imgSize)+"px,"+me.imgLeft+"px);width: 100%;height: 100%'>"
									+"<div id='moveBox' style='position: absolute;top: "+me.imgTop+"px;left: "+me.imgLeft+"px;height: "+me.imgSize+"px;width: "+me.imgSize+"px;border: 1px solid #fff;cursor: move'>"
										+"<div id='resizeBtn' style='position: absolute;bottom: -1px;right: -1px;height: 6px;width: 6px;background: #333;border: 1px solid #fff;cursor: nw-resize'></div>"
									+"</div>"
								+"</div>"
								+"<div id='confirm' style='position: absolute;height: 13px;width: 36px;bottom: -35px;right: 60px;border: 1px solid #ccc;background-color: #eee;color: #333;padding: 5px 5px;text-align: center;font-size: 12px;cursor:pointer'>确认</div>"
								+"<div id='cancel' style='position: absolute;height: 13px;width: 36px;bottom: -35px;right: 0;border: 1px solid #ccc;background-color: #eee;color: #333;padding: 5px 5px;text-align: center;font-size: 12px;cursor:pointer'>取消</div>"
							+"</div>";
			$("body").append(me.boxHtml);
			$("#bg").fadeIn("normal");
			$("#imgbg").fadeIn("normal");
			me.event();
		},

		event : function(){
			var me = this;
			var doc = $(document),
				bg = $("#bg"),
				imgbox = $("#imgbox"),
				img = $("#img"),
				moveBox = $("#moveBox"),
				resizeBtn = $("#resizeBtn"),
				confirm = $("#confirm"),
				cancel = $("#cancel");

			moveBox.on("mousedown", function(e){
				e.preventDefault();
				e.stopPropagation();
				var X = e.pageX,
					Y = e.pageY,
					boxTop = parseInt(moveBox.css("top")),
					boxLeft = parseInt(moveBox.css("left")),
					boxSize = moveBox.width()+2,
					imgBoxHeight = imgbox.height(),
					imgBoxWidth = imgbox.width();
				doc.on("mousemove", function(e){
					e.preventDefault();
					e.stopPropagation();
					var moveX = e.pageX - X,
						moveY = e.pageY - Y,
						finalTop = boxTop + moveY,
						finalLeft = boxLeft + moveX;

					if(finalTop>=imgBoxHeight-boxSize){finalTop=imgBoxHeight-boxSize}
						else if(finalTop < 0){finalTop=0}

					if(finalLeft>=imgBoxWidth-boxSize){finalLeft=imgBoxWidth-boxSize}
						else if(finalLeft < 0){finalLeft=0}

				moveBox.css({
					'left' : finalLeft,
					'top' : finalTop
					});

				img.css({
					'clip' : 'rect('+finalTop+'px,'+(finalLeft+boxSize)+'px,'+(finalTop+boxSize)+'px,'+finalLeft+'px)'
					});

				}).on("mouseup", function(e){
						doc.off("mousemove mouseup");
					});
			});

			resizeBtn.on("mousedown", function(e){
				e.preventDefault();
				e.stopPropagation();
				var X = e.pageX,
					Y = e.pageY,
					boxTop = parseInt(moveBox.css("top")),
					boxLeft = parseInt(moveBox.css("left")),
					boxSize = moveBox.width()+2,
					imgBoxHeight = imgbox.height(),
					imgBoxWidth = imgbox.width();
				doc.on("mousemove", function(e){
					e.preventDefault();
					e.stopPropagation();
					var resizeX = e.pageX - X,
						resizeY = e.pageY - Y,
						finalHeight = boxSize + resizeY,
						finalWidth = boxSize + resizeX;

						if(finalHeight>=imgBoxHeight-boxTop){finalHeight=imgBoxHeight-boxTop}
							else if(finalHeight<28){finalHeight=28}

						if(finalWidth>=imgBoxWidth-boxLeft){finalWidth=imgBoxWidth-boxLeft}
							else if(finalWidth<28){finalWidth=28}

						var finalSize = Math.min(finalHeight,finalWidth);

						moveBox.css({
							'height' : finalSize,
							'width' : finalSize
						});

						img.css({
							'clip' : 'rect('+boxTop+'px,'+(boxLeft+finalSize)+'px,'+(boxTop+finalSize)+'px,'+boxLeft+'px)'
						});

				}).on("mouseup", function(e){
						doc.off("mousemove mouseup");
					});
			});

			bg.click(function(){
				me.imgHide();
			});

			cancel.click(function(){
				me.imgHide();
			});

			confirm.on("mousedown", function(){
				me.postData = new FormData();
				me.postData.append('top', parseInt($("#moveBox").css('top')));
				me.postData.append('left', parseInt($("#moveBox").css('left')));
				me.postData.append('size', Math.floor($("#moveBox").width()));
				me.postData.append('imgWidth', me.imgBoxWidth);
				me.postData.append('imgHeight', me.imgBoxHeight);
				me.postData.append('imgFile', me.element.get(0).files[0]);
				me.upload();
			}).on("mouseup", function(){
				confirm.off("mousedown mouseup");
			});

		},

		upload : function(){
			var me = this;
			$.ajax({
				type : 'post',
				url : './imgupload.php',
				data : me.postData,
				/***必须false才会自动加上正确的Content-Type*/
				contentType : false,
				/**必须false才会避开jQuery对 formdata 的默认处理,XMLHttpRequest会对 formdata 进行正确的处理*/
				processData : false,

			}).done(function(result){
				if(result['sucess']){
					me.imgHide();
					$("#imgresult").html("<img src='./image/"+result['sucess']+"'>");
				}else{
					alert(result['error']);
				}
				
			}).fail(function(err){
				alert("upload fail!");
			});
		},

		imgHide : function(){
			var me = this;
			$("#imgbg").fadeOut("normal", function(){
				$(this).remove();
			});
			$("#bg").fadeOut("normal", function(){
				$(this).remove();
			});
			me.element.val("");
		}
	};



	window['ImgUpload']=ImgUpload;

	$(function(){
		if($("[data-ImgUpload]")){
			return new ImgUpload($("[data-ImgUpload]"));
		}
	});


})(jQuery);