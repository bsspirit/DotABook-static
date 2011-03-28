$(document).ready(function(){ 

	$('#msg-submit').click(function(){
		var content = $('#msg-content').val();
		var box_sina = $('#msg-box-sina').attr('checked');
		var obj = {'content':content,'send_sina':box_sina}
		
		if(content == ''){
			alert('留言不能为空，请填写留言！')
		} else if (content.length>100){
			alert('留言不能超过100字，请重新输入。')
		} else {
			$.post('/heroes/msg/'+hid,obj,function(res){
				$('#tabs-2 .msgs').html(msg_html(res));
				$('#msg-content').val('');
				$('.b-page-btn').find('.btn2').click(function(){
					var idx = $(this).attr('idx');
					ajax_msg(idx);
				});
			});		
		}
		
	});
	
	$('#tabs').tabs({
		select:function(e,ui){
			if(ui.index==1){
				ajax_msg(1);
			}
		}
	});
	
	function ajax_msg(page){
		$.getJSON('/heroes/msg/'+hid+'?p='+page,function(res){
			$('#tabs-2 .msgs').html(msg_html(res));
			$('.b-page-btn').find('.btn2').click(function(){
				var idx = $(this).attr('idx');
				ajax_msg(idx);
			});
		});
	}

	
	function msg_html(res){
		var msgs = res.msgs;
		var html = '<ul>'
		for (var i=0;i<msgs.length;i++){
			html += '<li>'
			html += '<div class="l-msg"><img src="'+msgs[i].profile_image+'"/></div>'
			html += '<div class="r-msg">' + msgs[i].screen+': '+msgs[i].content+'</div>'
			html += '<div class="clear"></div>'
			html += '<div class="b-msg">'
			html += '<span style="color:#FF9000">第'+msgs[i].floor+'楼</span>&nbsp;&nbsp;'+msgs[i].date
			html += '<span class="b-msg-btn">'
			html += '<a class="btn1" href="#">支持</a>'
			html += '<a class="btn1" href="#">反对</a>'
			html += '<a class="btn1" href="#">转发</a>'
			html +=	'<a class="btn1" href="#">评论</a>'
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
					html += '<a class="btn2" href="#" idx="'+page+'">'+page+'</a>'
				}
			}
			html += '</span>'
			html += '</div>'
		}

		return html;
	}
})
