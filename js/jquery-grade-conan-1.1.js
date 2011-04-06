$(document).ready(function(){
		
	$.getJSON('/heroes/grades/1',function(res){
		$('#grades').html(grade_html(res));
	});

	function grade_html(res){
		var grades = res.grades;
		var html = '<ul>'
		for (var i=0;i<grades.length;i++){
			html += '<li>'
			html += '<div class="l-msg">'
			html += '<a href="javascript:void(0);" uid="'+grades[i].uid+'" namecard="true"><img src="'+grades[i].profile_image+'"/></a>'
			html += '</div>'
			html += '<div class="r-msg">'
			html += '英雄：<a href="/heroes/'+grades[i].hid+'"><span class="info3">'+grades[i].hnamecn+'</span></a>&nbsp;&nbsp;&nbsp;&nbsp;'
			html += 'Gank:'+grades[i]['gank']+'&nbsp;Push:'+grades[i]['push']+'&nbsp;DPS:'+grades[i]['dps']+'&nbsp;辅助:'+grades[i]['assist']+'&nbsp;肉盾:'+grades[i]['defend']
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
		return html;
	}
})
