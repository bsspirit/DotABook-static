$(document).ready(function(){
	
	var tab1 = 0;
	$('#tabs').tabs({
		select:function(e,ui){
			if(ui.index==1){
				if(tab1==0){
					tab1 = 1;
					ajax_msg(1);
				}
			}
		}
	});	

	var content='';	

	$('#msg-submit').click(function(){
		cur_content = $('#msg-content').val();
		
		if(cur_content == ''){
			alert('留言不能为空，请填写留言！')
		} else if (cur_content.length>100){
			alert('留言不能超过100字，请重新输入。')
		} else if(content == cur_content){
			//alert('不能重复提交');
		} else {
			content = cur_content;
			var box_sina = $('#msg-box-sina').attr('checked');
			var obj = {'content':content,'send_sina':box_sina}

			$.post('/heroes/msg/'+hid,obj,function(res){
				$('#tabs-2 .msgs').html(msg_html(res));
				$('#msg-content').val('');
				render_btn();
				render_page();
				render_dialog();
				$('.b-page-btn').find('.btn2').click(function(){
					var idx = $(this).attr('idx');
					ajax_msg(idx);
				});
			});		
		}
	});
		
	function render_btn(){
		$('#tabs-2 .msgs').find('.b-msg-btn').each(function(){
			$(this).find('.btn1').each(function(){
				$(this).click(function(){
					var btn = $(this);
					var mid = $(this).attr('mid')
					var action = $(this).attr('action')
				
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
	
	function ajax_msg(page){
		$.getJSON('/heroes/msg/'+hid+'?p='+page,function(res){
			$('#tabs-2 .msgs').html(msg_html(res));
			render_btn();
			render_page();
			render_dialog();
			render_namecard('#tabs-2 .msgs')
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
			html += '<div class="r-msg"><a href="javascript:void(0);" uid="'+msgs[i].uid+'" namecard="true">' + msgs[i].screen+'</a>: '+msgs[i].content+'</div>'
			html += '<div class="clear"></div>'
			html += '<div class="b-msg">'
			html += '<span style="color:#FF9000">第'+msgs[i].floor+'楼</span>&nbsp;&nbsp;'+msgs[i].date
			html += '<span class="b-msg-btn">'
			html += '<a mid="'+msgs[i].mid+'" action="up" class="btn1" href="javascript:void(0);">支持('+msgs[i].count.up+')</a>'
			html += '<a mid="'+msgs[i].mid+'" action="down" class="btn1" href="javascript:void(0);">反对('+msgs[i].count.down+')</a>'
			html += '<a mid="'+msgs[i].mid+'" action="repost" class="btn1" href="javascript:void(0);" screen="'+msgs[i].screen+'" content="'+msgs[i].content+'">转发('+msgs[i].count.repost+')</a>'
			html += '</span>'
			html += '</li>'
		}
		html += '</ul>'
		
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
