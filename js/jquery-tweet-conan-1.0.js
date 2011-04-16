$(document).ready(function(){
	$.getJSON('/rest/user/newer/10',function(res){
		var users = res.users;
		html  = '<ul>'
		for(var i=0;i<users.length;i++){
			html += '<li>'
			html += '<div class="user_head">'
			html += '<div class="t_pic">'
			html += '<a href="http://t.sina.com.cn/'+users[i].uid+'" title="'+users[i].screen+'" target="_blank"><img class="img50" src="'+users[i].profile_image_url+'"></a>' 
			html += '</div>'
			html += '<div class="m_name">'
			html += '<a href="http://t.sina.com.cn/'+users[i].uid+'" title="'+users[i].screen+'">'+users[i].screen+'</a>'
			html += '</div>'
			html += '</div>'
			html += '</li>'
		}
		html += '</ul>'
		html += '<div class="clear"></div>'
		$('.user_head_list').html(html);
	})
	
	$.getJSON('/rest/upgrade/0',function(res){
		var ups = res.upgrades;
		html  = '<ul>'
		for(var i=0;i<ups.length;i++){
			html += '<li>'
			html += ups[i].datetag+'&nbsp;&nbsp;'+ups[i].title
			html += '</li>'
		}
		html += '</ul>'
		$('.upgrade').html(html);
	})


	function tweet_img_click(){
		$('img[size=small]').toggle(
			function(){$(this).attr('src',$(this).attr('middle'))},
			function(){$(this).attr('src',$(this).attr('small'))}
		);
	}
	
	function page_btn_html(){
		var total = $('#tweets-page').attr('total')
		var p = $('#tweets-page').attr('p')
		var count = $('#tweets-page').attr('count')

		var num = 0;
		if (total%count == 0){num = total/count;		
		} else {num = Math.floor(total/count )+1;
		}
		html = '共'+total+'条，共'+num+'页，每页'+count+'条，第'+p+'页'
		html += '<span class="b-page-btn">'
		
		//上一页
		var prev = p-1
		if(prev>0){html += '<a class="btn2" href="#top1" idx="'+prev+'">上一页</a>'}
		
		//数字页码
		var pnum = 6;
		var poffset=3;
		if(num<=pnum){
			for(var i=0;i<num;i++){
				var page = i + 1
				if(page == p){html += '<span class="btn2_current">'+p+'</span>'
				}else{html += '<a class="btn2" href="#top1" idx="'+page+'">'+page+'</a>'
				}
			}
		} else {
			for(var i=0;i<pnum;i++){
				var page = i+1;
				
				if(p<=poffset){
				}else if(num-p<=poffset){page = num-pnum+i+1
				}else{page = p-(poffset-1)+i
				}
			
				if(page == p){html += '<span class="btn2_current">'+p+'</span>'
				}else{html += '<a class="btn2" href="#top1" idx="'+page+'">'+page+'</a>'
				}
			}
		}
		
		//下一页
		var next = parseInt(p)+1
		if(p < num){html += '<a class="btn2" href="#top1" idx="'+(next)+'">下一页</a>'}
		html += '</span>'
		$('#tweets-page').html(html)
	}
	
	function page_btn_click(){
		$('#tweets-page a[idx]').click(function(){
			get_tweet_json($(this).attr('idx'))
		});
	}
	
	function action_btn_click(){
		$('a[action=repost]').click(function(){
			if($('#tweets').attr('login')!='True'){
				alert("请先通过新浪微博登录！！");	
			}
		});
	}
	
	function get_tweet_json(idx){
		$.getJSON('/tweet/tweets?p='+idx,function(res){
			html = '<ul>'
			for(var i=0;i<res.page.count;i++){
				var uid = res.tweets[i].uid
				
				html +='<li>'
				html +='<div class="l-msg">'
				html +='<a href="http://t.sina.com.cn/'+uid+'" target="_blank" uid="'+uid+'" namecard="true">'
				html +='<img src="'+res.users[uid].profile_image_url+'"></img>'
				html +='</a>'
				html +='</div>'
				
				html += '<div class="r-msg">'
				html += '<a href="http://t.sina.com.cn/'+uid+'" target="_blank">'
				html += '<span class="info2">'+res.users[uid].screen+'</span>'
				html += '</a>'
				html +=	':&nbsp;&nbsp;'+res.tweets[i].content+'<br>'
				
				if(res.tweets[i].thumbnail!=''){
					html += '<p><a class="r-msg-pic" href="javascript:void(0);">'
					html += '<img src="'+res.tweets[i].thumbnail+'" size="small" small="'+res.tweets[i].thumbnail+'" middle="'+res.tweets[i].bmiddle+'"></img>'
					html +=	'</a></p>'
				}
				
				if( res.tweets[i].retid != null){
					try{
						var reuid = res.retweets[res.tweets[i].retid].uid
						html += '<div class="r-msg-repost">'
						html += '<a href="http://t.sina.com.cn/'+reuid+'" target="_blank">'
						html += '<span class="info2">'+res.users[reuid].screen+'</span>'
						html += '</a>'
						html += ':&nbsp;'+res.retweets[res.tweets[i].retid].content

						var rethumb = res.retweets[res.tweets[i].retid].thumbnail
						var remiddle = res.retweets[res.tweets[i].retid].bmiddle
						if(rethumb!=''){
							html +='<p><a class="r-msg-pic" href="javascript:void(0);">'
							html +='<img src="'+rethumb+'" size="small" small="'+rethumb+'" middle="'+remiddle+'"></img>'
							html +='</a></p>'
						}
					}catch(err){
					}
					html += '</div>'					
				}
				html += '</div>'
				
				html += '<div class="clear"></div>'
				html += '<div class="b-msg">'
				html += '<div class="b-msg-info">'+res.tweets[i].create_at+'&nbsp;&nbsp;来自<span class="info2">'+res.tweets[i].source+'</span></div>'
				html += '<div class="b-msg-btn">'
				html += '<a action="repost" class="btn4" href="javascript:void(0);" screen="'+res.users[res.tweets[i].uid].screen+'" content="'+res.tweets[i].content+'">转发</a>'
				html += '</div></div>'
				html += '<div class="clear"></div>'
				html +='</li>'
			}
			html += '</ul>'
			html += '<div id="tweets-page" class="b-page" total="'+res.page.total+'" count="'+res.page.count+'" p="'+res.page.p+'"></div>'
			$('#tweets').html(html)
			
			action_btn_click();
			page_btn_html();
			page_btn_click();
			tweet_img_click();
		});
	}
	

	
	$('#tweets-page').each(function(){
		tweet_img_click();
		page_btn_html();
		action_btn_click();
		page_btn_click();
	});
})
