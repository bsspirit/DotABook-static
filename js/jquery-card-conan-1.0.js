$(document).ready(function(){
	render_namecard('#content');
})

var users= [];

function render_namecard(ele){
	ele = (ele == null)?'#content':ele;
	
	$(ele).find('a[namecard="true"]').each(function(){
		var uid = $(this).attr('uid');

		
		$(this).qtip({
			content: '',
			show:{solo:true},
			hide:{when:{event:'unfocus'},delay:100},
			position:{corner:{target:'topMiddle',tooltip:'bottomLeft'}},
			style: {name:'dark',border: {width: 2,radius: 5},width:285,tip:true},
		 	api:{
				onRender:function(){
					var isVisit = false;
					var res = {};
					for(var i=0;i<users.length;i++){
						if(users[i].uid==uid){
							isVisit = true;
							res = users[i].res;
						}
					}
				
					var self = this;
					if(!isVisit){
						$.getJSON('/rest/user/'+uid,function(res2){
							html = card_html(res2);
							self.updateContent(html)
						});	
					} else {
						html = card_html(res);
						self.updateContent(html)
					}
				}
			}
		});
	});	
}

function card_html(res){
		var user = res.user;
		var url = 'http://t.sina.com.cn/'+ user.uid;
		
		var obj = {'uid':user.uid, 'res':res}
		users[users.length] = obj;
		
		html  = '<div class="namecard">'
		html += '<div class="nc_l">' 
		html += '<a href="'+url+'" uid="1999250817" target="_blank"><img src="'+user.profile_image_url+'" width="50" uid="'+user.uid+'" title="'+user.screen+'"/></a>'
		html += '</div>'
		html += '<div class="nc_r">'
		html += '<a href="'+url+'" uid="1999250817" target="_blank">'+user.screen+'</a>'
		html += user.verified?'&nbsp;<img src="http://1.dotabook.sinaapp.com/static/image/layout/v.gif" width="8"/>':''
		html += '<br/>'
		html += user.gender=='m'?'男':'女';
		html += '&nbsp;&nbsp;'+user.location+'<br/>'
		html += '<a href="'+url+'/follow" target="_blank">关注</a>&nbsp;'+user.follow_count+'&nbsp;&nbsp;'
		html += '<a href="'+url+'/fans" target="_blank">粉丝</a>&nbsp;'+user.fans_count+'&nbsp;&nbsp;'
		html += '<a href="'+url+'" target="_blank">微博</a>&nbsp;'+user.tweet_count+'<br/>'
		html += '</div>'
		html += '<div class="clear"></div>'
		html += '<div class="nc_b">'
		html += '简介：'+ user.description.substring(0,60);
		html += '</div>'
		html += '<hr/>'
		html += '<div class="nc_b_btn">'
		html += '<a href="javascript:void(0);" class="btn3">关注</a>'
		html += '已关注|<a href="javascript:void(0);">取消关注</a>'
		html += '</div>'
		html += '</div>'
		return html
	}
	


	
