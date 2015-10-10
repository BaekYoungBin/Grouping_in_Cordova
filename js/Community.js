var list = new Array();
console.log('굿모닝');
	$.getJSON('http://54.65.71.36:8080/CommunityList',function(data){
		var dataform = JSON.stringify(data.suc);
		var temp = JSON.parse(dataform);	
		var Title = new Array();
		var Name = new Array();
		var Dday = new Array();
		var Point = new Array();
		var Text = new Array();
		for(var i =0; i<temp.length;i++){
			console.log(temp[i].User_Name);
			console.log(temp[i].Title);
			console.log(temp[i].Day);
			console.log(temp[i].User_Point);
			console.log(temp[i].Text);
			
			list.push({
				id : temp[i]._id,
				Name : temp[i].User_Name,
				Email : temp[i].User_Email,
				Title :temp[i].Title,
				Dday :temp[i].Day,
				Point:temp[i].User_Point,
				Text : temp[i].Text
			});
		}
	prepare();
	});
	var text = '';
	function prepare(){
		var num = 1;	
		$.each(list, function(index, item){
			text += "<li data-role='list-divider'>"+item.Title+"</li>"
			text += "<li><h2>"+item.Name+"</h2><p><p>"+item.Point+"</p><strong>"+item.Email+"</strong></p>"
			text += "<p style='white-space:normal;'>"+item.Text+"</p><p class='ui-li-aside'>"+item.Dday+"</p></a></li>"		
			num++;
		});
		
		 $('#board').append(text).listview('refresh');

	}
	
	function writefnc(){
		console.log($('#Community_Content').val());
		$.ajax({
			url : 'http://54.65.71.36:8080/AppCommunityNewWrite',
			dataType : 'json',
			type : 'POST',
			data : {
				'User_Name' : localStorage.getItem('User_Name'),
				'User_Email' : localStorage.getItem('User_Email'),
				'title' : $('#Community_title').val(),
				'Text' :  $('#Community_Content').val(),
				'User_Point' : '1'
				
			},
			success : function(result) {
				console.log('success');
				location.replace('App_community.html');
			}
		});
		
	}
	
