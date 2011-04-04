$(document).ready(function(){

	$('#msgs').each(function(){
		ajax_msg(1)
	});
	
		
	function ajax_msg(page){
		$.getJSON('/heroes/msgs/?p='+page,function(res){
			$('#msgs').html(msg_html(res));
			render_btn();
			render_dialog();
			render_namecard('#msgs')
			render_page();
		});
	}

	function render_btn(){
		$('#msgs').find('.b-msg-btn').each(function(){
			$(this).find('.btn1').each(function(){
				$(this).click(function(){
					var btn = $(this);
					var mid = $(this).attr('mid')
					var action = $(this).attr('action')
					if($('#msgs').attr('login')=='True'){
						if(action=='up'){
							var url = '/heroes/msg/up/'+mid
							$.post(url,function(res){
								if(res.submit){
									alert('您已经支持过了！')
								} else {
									btn.text("支持("+res.size+")")
								}
							});
						} else if(action=='down'){
							var url = '/heroes/msg/down/'+mid
							$.post(url,function(res){
								if(res.submit){
									alert('您已经反对过了！')
								} else {
									btn.text("反对("+res.size+")")
								}
							});
						} else if (action == 'repost'){
							var content = $(this).attr('content');
							var screen =$(this).attr('screen');
						
							html  = '<textarea mid="'+mid+'" title="请在100字之内" rows="3" class="area2" id="repost-content">'
							html += '//@'+screen+':'+content
							html += '</textarea>'
					
							$('#dialog-repost').html(html);
							$('#dialog-repost').dialog('open');
						}
					}else{
						alert("请先通过新浪微博登录！！");
					}
				});
			});
		});
	}
	
	function render_page(){
		$('.b-page-btn').find('.btn2').click(function(){
			var idx = $(this).attr('idx');
			ajax_msg(idx);
		});
	}
	
	function render_dialog(){
		$('#dialog-repost').dialog({
			autoOpen: false,
			width: 430,
			draggable:true,
			modal:true,
			buttons: {
				"转发": function() {
					var rep_obj = $('#repost-content');
					rep_content = rep_obj.val()
					rep_mid = rep_obj.attr('mid')
					
					var obj = {'content':rep_content,'hid':hid}
					var url = '/heroes/msg/repost/'+rep_mid
					if(rep_content == ''){
						alert('留言不能为空，请填写留言！')
					} else if (rep_content.length>100){
						alert('留言不能超过100字，请重新输入。')
					} else {
						$.post(url,obj,function(res){
							ajax_msg(1);
						});
						$(this).dialog("close"); 
					}
				}, 
				"取消": function() { 
					$(this).dialog("close"); 
				} 
			}
		});
	}

	
	
	function msg_html(res){
		var msgs = res.msgs;
		var html = '<ul>'
		for (var i=0;i<msgs.length;i++){
			html += '<li>'
			html += '<div class="l-msg">'
			html += '<a href="javascript:void(0);" uid="'+msgs[i].uid+'" namecard="true"><img src="'+msgs[i].profile_image+'"/></a>'
			html += '</div>'
			html += '<div class="r-msg">' + msgs[i].screen+': '+msgs[i].content+'</div>'
			html += '<div class="clear"></div>'
			html += '<div class="b-msg">'
			html += '<div class="b-msg-info">'
			html += msgs[i].date+'&nbsp;&nbsp;<a href="http://dotabook.info" target="_blank">来自<span class="info2">DotABook</info></a>'
			html += '</div>'
			html += '<div class="b-msg-btn">'
			html += '<a mid="'+msgs[i].mid+'" action="up" class="btn1" href="javascript:void(0);">支持('+msgs[i].count.up+')</a>'
			html += '<a mid="'+msgs[i].mid+'" action="down" class="btn1" href="javascript:void(0);">反对('+msgs[i].count.down+')</a>'
			html += '<a mid="'+msgs[i].mid+'" action="repost" class="btn1" href="javascript:void(0);" screen="'+msgs[i].screen+'" content="'+msgs[i].content+'">转发('+msgs[i].count.repost+')</a>'
			html += '</div>'
			html += '<div class="clear"></div>'
			html += '</li>'
		}
		html += '</ul>'
		html += '<div class="clear"></div>'
		
		if(res.total>0){
			html += '<div class="b-page">'
			html += '共'+res.total+'条，每页'+res.count+'条'
		
			var num = 0;
			if (res.total%res.count == 0){
				num = res.total/res.count;		
			} else {
				num = Math.floor(res.total/res.count )+1;
			}
		
			html += '<span class="b-page-btn">'
			for(var i=0;i<num;i++){
				var page = i + 1
				if(page == res.page){
					html += '<span class="btn2_current">'+page+'</span>'
				}else{
					html += '<a class="btn2" href="javascript:void(0);" idx="'+page+'">'+page+'</a>'
				}
			}
			html += '</span>'
			html += '</div>'
		}
		html += '<div id="dialog-repost" title="转发到新浪微博"></div>'
		return html;
	}
})
