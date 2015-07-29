// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Visit http://abeautifulsite.net/notebook/87 for more information
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
// 
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//
(function($) {
	
	$.Alerts = {
		
		// These properties can be read/written by accessing
		// $.Alerts.propertyName from your scripts at any time
		
		verticalOffset: -75,                // vertical offset of the dialog
											// from center screen, in pixels
		horizontalOffset: 0,                // horizontal offset of the dialog
											// from center screen, in pixels/
		repositionOnResize: true,           // re-centers the dialog on window
											// resize
		overlayOpacity: 0,                // transparency level of overlay
		overlayColor: '#ffffff',               // base color of overlay
		draggable: true,                    // make the dialogs draggable
											// (requires UI Draggables plugin)
		
		okButton : '&nbsp;确定&nbsp;', // text for the OK button
		cancelButton : '&nbsp;取消&nbsp;', // text for the Cancel button
		closeButton : '&nbsp;关闭&nbsp;', // text for the Close button
		backButton : '&nbsp;返回&nbsp;', // text for the Back button
		dialogClass: 'popup_container', // if specified,
															// this class will
															// be applied to all
															// dialogs
		
		// Public methods
		
		alert: function(message, title, callback, big, vmname, vmtype) {
			if( title == null ) title = WebOS.getString('notice');
			if(big)
				$.Alerts._show(title, message, null, 'confirm', function(result) {
				if( callback ) {if(result) callback(vmname, vmtype); else return;}
			}, null, big);
			else
			$.Alerts._show(title, message, null, 'alert', function(result) {
				if( callback ) callback(result);
				jHide('loadPage');
			}, null, big);
		},
		
		confirm: function(message, title, callback) {
			if( title == null ) title = WebOS.getString('notice');
			$.Alerts._show(title, message, null, 'confirm', function(result) {
				if( callback ) callback(result);
			});
		},
			
		prompt: function(message, value, title, callback) {
			if( title == null ) title = WebOS.getString('notice');
			$.Alerts._show(title, message, value, 'prompt', function(result) {
				if( callback ) callback(result);
			});
		},

		// Private methods
		
		_show: function(title, msg, value, type, callback, containerId, big) {
			
			$.Alerts._hide();
			$.Alerts._overlay('show');
			
			if(null == containerId || "" == containerId)
			{
				$("BODY").append(
				  '<div id="popup_container">' +
				    '<h1 id="popup_title"></h1>' +
				    '<div id="popup_content">' +
				      '<div id="popup_message"></div>' +
					'</div>' +
				  '</div>'
				);
			} else {
				$("#" + containerId).append('<div id="popup_container">' +
					    '<h1 id="popup_title"></h1>' +
					    '<div id="popup_content">' +
					      '<div id="popup_message"></div>' +
						'</div>' +
					  '</div>'
				);
			}
			
			
			if( $.Alerts.dialogClass ) $("#popup_container").addClass($.Alerts.dialogClass);
			
			// IE6 Fix
			var pos = ($.browser.msie && parseInt($.browser.version) <= 6 ) ? 'absolute' : 'fixed'; 
			
			$("#popup_container").css({
				position: pos,
				zIndex: 99999,
				padding: 0,
				margin: 0
			});
			
			$("#popup_title").text(title);
			$("#popup_content").addClass(type);
			$("#popup_message").text(msg);
			$("#popup_message").html( $("#popup_message").text().replace(/\n/g, '<br />') );
			
			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});
			
			if(null == containerId || "" == containerId)
			{
				$.Alerts._reposition();
			} else {
				$.Alerts._repositionWithinContainer(containerId);
			}
			
			$.Alerts._maintainPosition(true);
			
			switch( type ) {
			
				case 'alert':
					//$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.Alerts.okButton + '" id="alert_popup_ok" /></div>');
					$("#popup_message").after('<div id="popup_panel"><span id="alert_popup_ok">'+ '&nbsp;' + WebOS.getString('confirm') + '&nbsp;' + '</span></div>');
					$("#alert_popup_ok").die().live("click", function(event) {
						 event.stopPropagation();
						 event.preventDefault();
						$.Alerts._hide();
						callback(true);
					});
					$("#alert_popup_ok").focus().keypress( function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 ) $("#alert_popup_ok").trigger('click');
					});
					
					//低分辨率下改变样式设置
					$.Alerts.resize_alert(big);
					
				break;
				case 'confirm':
					$("#popup_message").after('<div id="popup_panel"><span id="popup_ok">'+ '&nbsp;' + WebOS.getString('confirm') + '&nbsp;' + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="popup_cancel">' + '&nbsp;' + WebOS.getString('cancel') + '&nbsp;' + '</span></div>');
					$("#popup_ok").die().live("click", function(event) {
						 event.stopPropagation();
						 event.preventDefault();
						$.Alerts._hide();
						if( callback ) callback(true);
					});
					$("#popup_cancel").die().live("click", function(event) {
						 event.stopPropagation();
						 event.preventDefault();
						$.Alerts._hide();
						if( callback ) callback(false);
					});
					$("#popup_ok").focus();
					$("#popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
					
					//低分辨率下改变样式设置
					$.Alerts.resize_alert(big);
					
				break;
				
				case 'prompt':
				//var buttonBelowed = '<span style="float:left" id="prompt_cancel" >'+$.Alerts.cancelButton+'</span> <span  style="float:right" id="prompt_ok" >' + $.Alerts.okButton + '</span>';
				var buttonBelowed =  '<div id="popup_panel"><span id="prompt_ok" >' + '&nbsp;' + WebOS.getString('confirm') + '&nbsp;' + '</span>' + '<span id="prompt_cancel" >'+'&nbsp;' + WebOS.getString('cancel') + '&nbsp;'+'</span></div>';
				$("#popup_container").append(buttonBelowed);
				//var promptInfo = '<div id="promptMsg" >'+$("#popup_message").text().replace(/\n/g, "<br />")+'</div><div class="promptMsg_input"><input type="text" id="popup_prompt" /></div>';
				var promptInfo = $("#popup_message").text().replace(/\n/g, "<br />")+'<input type="text" id="popup_prompt" />';
					$("#popup_message").html(promptInfo);
					$('input').textinput();		
					$("#prompt_ok").die().live("click", function(event) {
						event.stopPropagation();
						 event.preventDefault();
						var val = $("#popup_prompt").val();
						$.Alerts._hide();
						if( callback ) callback( val );
					});
					$("#prompt_cancel").die().live("click", function(event) {
						
						$.Alerts._hide();
						if( callback ) callback( null );
					});
					$("#popup_prompt, #popup_ok, #prompt_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#prompt_cancel").trigger('click');
					});
					if( value ) $("#popup_prompt").val(value);
					$("#popup_prompt").focus().select();
					
					//低分辨率下改变样式设置
					$.Alerts.resize_alert();
					
				break;
					
			}
			
			// Make draggable
			if( $.Alerts.draggable ) {
				try {
					$("#popup_container").draggable({ handle: $("#popup_title") });
					$("#popup_title").css({ cursor: 'move' });
				} catch(e) { /* requires jQuery UI draggables */ }
			}
		},
		
		_hide: function() {
			$("#popup_container").remove();
			$.Alerts._overlay('hide');
			$.Alerts._maintainPosition(false);
		},
		
		_overlay: function(status) {
			switch( status ) {
				case 'show':
					$.Alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position: 'absolute',
						zIndex: 99998,
						top: '0px',
						left: '0px',
						width: '100%',
						height: $(document).height(),
						background: $.Alerts.overlayColor,
						opacity: $.Alerts.overlayOpacity
					});
				break;
				case 'hide':
					$("#popup_overlay").remove();
				break;
			}
		},
		
		_reposition: function() {
			var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.Alerts.verticalOffset;
			var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.Alerts.horizontalOffset;
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;
			
			// IE6 fix
			if( $.browser.msie && parseInt($.browser.version) <= 6 ) top = top + $(window).scrollTop();
			
			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px'
			});
			$("#popup_overlay").height( $(document).height() );
		},
		
		_repositionWithinContainer: function(containerId) {
			var top = (($("#" + containerId).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.Alerts.verticalOffset;
			var left = (($("#" + containerId).width() / 2) - ($("#popup_container").outerWidth() / 4)) + $.Alerts.horizontalOffset;
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;
			
			// IE6 fix
			if( $.browser.msie && parseInt($.browser.version) <= 6 ) top = top + $("#" + containerId).scrollTop();
			
			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px'
			});
			$("#popup_overlay").height( $(document).height() );
		},
		
		_maintainPosition: function(status) {
			if( $.Alerts.repositionOnResize ) {
				switch(status) {
					case true:
						$(window).bind('resize', $.Alerts._reposition);
					break;
					case false:
						$(window).unbind('resize', $.Alerts._reposition);
					break;
				}
			}
		},
		
		//<!--低分辨率下改变大小
		resize_alert: function(big){
			/*
			//替换css文件的方式
			var bodyClientWidth = document.body.clientWidth;
			if(bodyClientWidth < 1024)
			{
				//替换css文件
				var href = $("link[href$='ui_alerts.css']").attr('href');
				if(null != href && '' != href)
				{
					href = href.replace('ui_alerts.css', 'ui_alerts_small.css');
					$("link[href$='ui_alerts.css']").attr('href', href);
				}
			} else {
				//复原
				var href = $("link[href$='ui_alerts_small.css']").attr('href');
				if(null != href && '' != href)
				{
					href = href.replace('ui_alerts_small.css', 'ui_alerts.css');
					$("link[href$='ui_alerts_small.css']").attr('href', href);
				}
			}
			*/			
			var bodyClientWidth = document.body.clientWidth;
			var bodyClientHeight = document.body.clientHeight;
			var biggerLength = null;
			if(bodyClientWidth > bodyClientHeight)
			{
				biggerLength = bodyClientWidth;
			}
			else 
			{
				biggerLength = bodyClientHeight;
			}
			
			if(biggerLength < 600)
			{
				$('#popup_container').css('min-width', '0');
				$('#popup_container').css('height', 175/2+'px');
				$('#popup_container').css('font-size', 8/2+'px');
				$('#popup_container').css('width', 272/2+'px');
				$('#popup_container').css('border', 2/2+'px solid #ECEDED');
				$('#popup_container').css('-moz-border-radius', 15/2+'px');
				$('#popup_container').css('-webkit-border-radius', 15/2+'px');
				$('#popup_container').css('border-radius', 15/2+'px');
				$('#popup_container').css('box-shadow', '0px 0px '+ 4/2 +'px black');
				$('#popup_container').css('-moz-box-shadow', '0px 0px '+ 4/2 +'px black');
				$('#popup_container').css('-webkit-border-shadow', '0px 0px '+ 4/2 +'px black');

				$('#popup_title').css('font-size', 18/2+'px');
				$('#popup_title').css('height', 36/2+'px');
				$('#popup_title').css('line-height', 49/2+'px');
				
				$('#popup_content').css('height', 124/2+'px');
				
				$('#popup_message').css('font-size', 16/2+'px');
				$('#popup_message').css('height', 60/2+'px');
				$('#popup_message').css('margin', 15/2+'px auto');
				
				$('#popup_panel').css('height', 49/2+'px');
				
				$('#popup_prompt').css('margin-top', 8/2+'px');
				$('#popup_prompt').css('margin-bottom', 8/2+'px');
				$('#popup_prompt').css('height', 18/2+'px');
				$('#popup_prompt').css('line-height', 18/2+'px');
				$('#popup_prompt').css('font-size', 16/2+'px');
				$('#popup_prompt').css('padding', 6.4/2+'px');
				$('#popup_prompt').css('-moz-border-radius', 6/2+'px');
				$('#popup_prompt').css('-webkit-border-radius', 6/2+'px');
				$('#popup_prompt').css('border-radius', 6/2+'px');
				
				$('#popup_ok').css('width', 127/2+'px');
				$('#popup_ok').css('height', 42/2+'px');
				$('#popup_ok').css('line-height', 42/2+'px');
				$('#popup_ok').css('font-size', 18/2+'px');
				$('#popup_ok').css('margin-left', 7/2+'px');
				
				$('#popup_cancel').css('width', 127/2+'px');
				$('#popup_cancel').css('height', 42/2+'px');
				$('#popup_cancel').css('line-height', 42/2+'px');
				$('#popup_cancel').css('font-size', 18/2+'px');
				$('#popup_cancel').css('margin-right', 7/2+'px');
				$('#popup_cancel').css('margin-top', -7 +'px');
				
				$('#alert_popup_ok').css('width', 127/2+'px');
				$('#alert_popup_ok').css('height', 42/2+'px');
				$('#alert_popup_ok').css('line-height', 42/2+'px');
				$('#alert_popup_ok').css('font-size', 18/2+'px');
				
				
				
				$('#prompt_ok').css('width', 127/2+'px');
				$('#prompt_ok').css('height', 42/2+'px');
				$('#prompt_ok').css('line-height', 42/2+'px');
				$('#prompt_ok').css('font-size', 18/2+'px');
				$('#prompt_ok').css('margin-left', 7/2+'px');
				$('#prompt_ok').css('margin-top', -47/2+'px');
				
				$('#prompt_cancel').css('width', 127/2+'px');
				$('#prompt_cancel').css('height', 42/2+'px');
				$('#prompt_cancel').css('line-height', 42/2+'px');
				$('#prompt_cancel').css('font-size', 18/2+'px');
				$('#prompt_cancel').css('margin-right', 7/2+'px');
				$('#prompt_cancel').css('margin-top', -47/2+'px');
			} 
			else 
			{
				$('#popup_container').css('height', 175+'px');
				if(big)
				{
					$('#popup_container').css('height', 232+'px');
					//$('#popup_container').css('width', 272*2+'px');
				}
				$('#popup_container').css('font-size', 8+'px');
				$('#popup_container').css('width', 272+'px');
				if(big)
				{
					$('#popup_container').css('width', 272*2+'px');
					$('#popup_container').css('max-width', 440+'px');
				}

				$('#popup_container').css('border', 2+'px solid #ECEDED');
				$('#popup_container').css('-moz-border-radius', 15+'px');
				$('#popup_container').css('-webkit-border-radius', 15+'px');
				$('#popup_container').css('border-radius', 15+'px');
				$('#popup_container').css('box-shadow', '0px 0px '+ 4 +'px black');
				$('#popup_container').css('-moz-box-shadow', '0px 0px '+ 4 +'px black');
				$('#popup_container').css('-webkit-border-shadow', '0px 0px '+ 4 +'px black');

				$('#popup_title').css('font-size', 18+'px');
				$('#popup_title').css('height', 36+'px');
				$('#popup_title').css('line-height', 49+'px');
				
				$('#popup_content').css('height', 124+'px');
				
				$('#popup_message').css('font-size', 16+'px');
				$('#popup_message').css('height', 60+'px');
				if(big)
				{
					$('#popup_message').css('height', 80+'px');
					$('#popup_message').css('text-align', 'left');
					$('#popup_message').css('padding-left', 10+'px');
					$('#popup_message').css('color', 'white');
				}
				$('#popup_message').css('margin', 15+'px auto');
				
				$('#popup_panel').css('height', 49+'px');
				if(big)
				{
					$('#popup_panel').css('padding-top', 20+'px');
				}
				
				$('#popup_prompt').css('margin-top', 8+'px');
				$('#popup_prompt').css('margin-bottom', 8+'px');
				$('#popup_prompt').css('height', 18+'px');
				$('#popup_prompt').css('line-height', 18+'px');
				$('#popup_prompt').css('font-size', 16+'px');
				$('#popup_prompt').css('padding', 6.4+'px');
				$('#popup_prompt').css('-moz-border-radius', 6+'px');
				$('#popup_prompt').css('-webkit-border-radius', 6+'px');
				$('#popup_prompt').css('border-radius', 6+'px');
				
				$('#popup_ok').css('width', 127+'px');
				$('#popup_ok').css('height', 42+'px');
				$('#popup_ok').css('line-height', 42+'px');
				$('#popup_ok').css('font-size', 18+'px');
				$('#popup_ok').css('margin-left', 7+'px');
				if(big)
				{
					$('#popup_ok').css('margin-left', '20%');
					$('#popup_ok').css('margin-top', -12+'px');
				}
				
				$('#popup_cancel').css('width', 127+'px');
				$('#popup_cancel').css('height', 42+'px');
				$('#popup_cancel').css('line-height', 42+'px');
				$('#popup_cancel').css('font-size', 18+'px');
				$('#popup_cancel').css('margin-right', 7+'px');
				$('#popup_cancel').css('margin-top', -12+'px');
				if(big)
				{
					$('#popup_cancel').css('margin-right', '20%');
					//$('#popup_cancel').css('margin-top', -11+'px');
				}
				
				if(big)
				{
					$('#alert_popup_ok').css('margin-left', '35%');
				}
				
				$('#alert_popup_ok').css('width', 127+'px');
				$('#alert_popup_ok').css('height', 42+'px');
				$('#alert_popup_ok').css('line-height', 42+'px');
				$('#alert_popup_ok').css('font-size', 18+'px');
				
				$('#prompt_ok').css('width', 127+'px');
				$('#prompt_ok').css('height', 42+'px');
				$('#prompt_ok').css('line-height', 42+'px');
				$('#prompt_ok').css('font-size', 18+'px');
				$('#prompt_ok').css('margin-left', 7+'px');
				$('#prompt_ok').css('margin-top', -47+'px');
				
				$('#prompt_cancel').css('width', 127+'px');
				$('#prompt_cancel').css('height', 42+'px');
				$('#prompt_cancel').css('line-height', 42+'px');
				$('#prompt_cancel').css('font-size', 18+'px');
				$('#prompt_cancel').css('margin-right', 7+'px');
				$('#prompt_cancel').css('margin-top', -47+'px');
			}

	        if ($.browser.msie && parseInt($.browser.version) == 8) {
	            $('#popup_container').css('border', 'none');
	        }
			/*
			$('#popup_container').css({
				font-size: 8/2 + 'px', 
				width: 272/2 + 'px',
				height: 175/2 + 'px',
				border: 2/2 + 'px solid #ECEDED'
				-moz-border-radius: 15/2 + 'px',
				-webkit-border-radius: 15/2 + 'px',
				border-radius: 15/2 + 'px',
				box-shadow: '0px 0px ' + 4/2 + 'px black',
				-moz-box-shadow: '0px 0px ' + 4/2 + 'px black',
				-webkit-border-shadow: '0px 0px ' + 4/2 + 'px black'
			});
			*/
			
	
			
			
		}
		//低分辨率下改变大小-->
		
	}

	
	//系统里将jAlert改为Alert
	Alert = function(message, title, callback, big, vmname, vmtype) {
		$.Alerts.alert(message, title, callback, big, vmname, vmtype);
	};
	
	Confirm = function(message, title, callback) {
		$.Alerts.confirm(message, title, callback);
	};
	
	Prompt = function(message, value, title, callback) {
		$.Alerts.prompt(message, value, title, callback);
	};
	
	/**
     * 该方法适用于ipad 当界面中有弹出窗口时从任务管理器切换另一个主界面后再切换回来，
     * 让原弹出窗口消失
     * 
     * 进入fileManager 时会自动刷新文件列表所以只能让弹出窗口消失
     * 
     */
    RemoveUI = function(){
       
        if($("#popup_container")){
            $.Alerts._hide();
        }
        
    };
    //在phoneGap上横竖屏切换时修改webui部分的遮罩层宽高
    RepositionContain = function(){
    	$("#popup_overlay").height( $(window).height() );
    	
    }
	
	
})(jQuery);