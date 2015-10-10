// 탭에서 넘어갈때 깜빡임 없애줌
$.mobile.defaultPageTransition = 'none'
$.mobile.defaultDialogTransition = 'none'
$.mobile.buttonMarkup.hoverDelay = 0
$(document).ready( function() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+month+"-"+day ;
    //$('#m_date_start').val(today);
       $('#memo_date_start').val(today);
     console.log(today);
    console.log($("#memo_date_start").val()); 
    $('#user_subinfo_in_work').empty();
    $('#user_subinfo_in_work').listview().listview('refresh');
    $('#user_subinfo_in_work').append(userinfo).listview('refresh');
    $('#user_subinfo_in_schedule').empty();
    $('#user_subinfo_in_schedule').listview().listview('refresh');
    $('#user_subinfo_in_schedule').append(userinfo).listview('refresh');
    $('#user_subinfo_in_addfunc').empty();
    $('#user_subinfo_in_addfunc').listview().listview('refresh');
    $('#user_subinfo_in_addfunc').append(userinfo).listview('refresh');
    $('#user_subinfo_in_chat').empty();
    $('#user_subinfo_in_chat').listview().listview('refresh');
    $('#user_subinfo_in_chat').append(userinfo).listview('refresh');
  //  document.getElementById("#memo_date_start").value = today;
    
});

// 업무에서 드래그 앤 드롭 관련
$(document).bind('pageinit', function() {
	$( "#pre_memolist" ).sortable({ // id가 pre_memolist인것을 sortable하겠다.
		handle:".ui-icon-bars",	//아이콘(bars) touch시만 drag & drop
		items: 'li[id!=headermenu]' // 맨 윗줄 list-dvider는 drag & drop 금지
	});
	$( "#pre_memolist" ).disableSelection();
	$( "#pre_memolist" ).bind( "sortstop", function(event, ui) {
		$('#pre_memolist').listview('refresh');
	});
});
$(document).bind("mobileinit",function() {$.mobile.page.prototype.options.addBackBtn = true; });

console.log('설정에 정보 띄웁니다.');
var userinfo = "User Name : "+localStorage.getItem('User_Name')+"<br>User Email : "+localStorage.getItem('User_Email');
console.log(userinfo);

/*$(document).on("click", "#tab_memo", function() {
	
});
$(document).on("click", "#tab_schedule", function() {
	var userinfo = "User Name : "+localStorage.getItem('User_Name')+"<br>User Email : "+localStorage.getItem('User_Email');
	console.log(userinfo);
	
});
$(document).on("click", "#tab_addfunc", function() {
	var userinfo = "User Name : "+localStorage.getItem('User_Name')+"<br>User Email : "+localStorage.getItem('User_Email');
	console.log(userinfo);
	
});
$(document).on("click", "#tab_chat", function() {
	var userinfo = "User Name : "+localStorage.getItem('User_Name')+"<br>User Email : "+localStorage.getItem('User_Email');
	console.log(userinfo);
	
});*/



//업무 클릭시 memo_show.html로 넘어감
$(document).on("click", ".memolist", function() {
	var tempid = $(this).parent().attr('id');
	console.log('memo 선택했을때 나오는 id입니다. :' + tempid);
	console.log('Project_Work_Id에 추가합니다.');
	localStorage.setItem("Project_Work_Id", tempid);	
	location.replace('memo_show.html');
});

//업무리스트에서 X표시 클릭시 팝업 표시
$(document).on("click", ".deletememo", function() {
	var tempid = $(this).parent().attr('id');
	localStorage.setItem('Select_Project_Id',  $(this).parent().attr('id'));
	console.log($(this).parent().attr('id'));
	$('#deletememo').popup("open");
});


//업무리스트를 디비와 연동해서 보여지게 하는 부분
$.ajax({
		url : 'http://54.65.71.36:8080/appviewmemo',
		dataType : 'json',
		type : 'POST',
		data : {
			'Project_Id' : localStorage.getItem('Project_Id'),
			'User_Name' : localStorage.getItem('User_Name')
		},
		success : function(result) {
			var Work_Name = new Array();
			var Work_DueDate = new Array();
			var Work_Id = new Array();
			var memodataform = JSON.stringify(result);
			var memotemp = JSON.parse(memodataform);
			console.log(memotemp);
			console.log(memodataform);
			console.log('momo count : ' + memotemp.Work_Length);
			var memocount = memotemp.Work_Length;
			for (var i = 0; i < memocount; i++) {
				Work_Id[i] = memotemp.Work_Id[i];
				Work_Name[i] = memotemp.Work_Name[i];
				if(memotemp.Work_DueDate[i]==null){
					Work_DueDate[i] = 0;
				} else {
					Work_DueDate[i] = memotemp.Work_DueDate[i];
				}
				console.log(Work_Id[i]);
				console.log(Work_Name[i]);
				console.log(Work_DueDate[i]);
			}
			var memolist = [];
			for (var i = 0; i < memocount; i++) {
				memolist.push({
					'Work_Name' : Work_Name[i],
					'Work_Id' :Work_Id[i],
					'Work_DueDate' :  Work_DueDate[i]
				});
			}
			var text = "";
			
			$.each(memolist, function(index,item) {
				text += "<li id ='"+item.Work_Id+"' class='ui-state-default'>"+"<a class='memolist' href='' rel='external'>"+"<span class='ui-icon ui-icon-bars ui-btn-icon-left'></span>"+"<span class='ui-li-count'>D-Day:"+item.Work_DueDate+"</span>"+ item.Work_Name+ "<a href='' class ='deletememo' data-rel='popup' data-position-to='window' data-transition='pop'>삭제</a></li>"			
			});

			$('#pre_memolist').append(text).listview('refresh');
			console.log('출력 완료');
		}

	});


//업무리스트에서 X 표시 클릭시 뜨는 팝업에서 삭제 클릭시 동작함수
function deletememo(){
		var deleteid = localStorage.getItem('Select_Project_Id');
		$.ajax({
			url : 'http://54.65.71.36:8080/appdeletememo',
			dataType : 'json',
			type : 'POST',
			data : {'Delete_MemoId' : deleteid},
			success : function(data) {	
				location.replace('tab_memo.html');											
			}
		});	
	}

//업무 추가에서 멤버 선택 함수

	console.log('selectmember 시작');
		console.log(localStorage.getItem('Project_Id'));
		$.ajax({
			url : 'http://54.65.71.36:8080/appgetprojectmember',
			dataType : 'json',
			type : 'POST',
			data : {
				'Project_Id' : localStorage.getItem('Project_Id')
			},
			success : function(result) {
				var Project_Member_Name = [];
				var Member_Id = [];
				var dataform = JSON.stringify(result);
				var temp = JSON.parse(dataform);
				console.log(temp[0]);
				var count = temp[0].In_Member.length;
				var list = [];	
				console.log('selectmember count: '+count);
				for (var i = 0; i < count; i++) {
					list.push({'user': temp[0].In_Member[i], 'id':temp[0].Member_Id[i]});		
					console.log(temp[0].Member_Id[i]);
				}
				var text = "";
				$.each(list, function(index, item) {
					text += "<option value="+item.id+">" + item.user
					+ "</option>";
					console.log(item.id);
				});			
				$('#select-participant').empty();
				$('#select-participant').listview().listview('refresh');
				$('#select-participant').append(text).listview('refresh');
				text = "";
				list = [];
			}
		});

//설정패널에서 다른 곳으로 넘어갈 때
function mypagefunc(){
		location.replace('mypage.html');
	}
	function project_selectfunc(){
		location.replace('project_select.html');
	}
	function App_communityfunc(){
		location.replace('App_community.html');
	}
	function logout(){
		location.replace('index.html');
	}
	function gotovote(){
		location.replace('vote_list.html');
	}

//업무 추가 버튼 클릭시 
function memoaddfunc() {
	if($('#m_sbj').val()==''){
		console.log('null');
		alert('메모명을 입력해주세요');
	}
	else if( $('#memo_date_start').val()==''){
		console.log('null');
		alert('시작일을 입력해주세요');
	}
	else if($('#memo_date_finish').val()==''){
		console.log('null');
		alert('마감일을 입력해주세요')
	}
	else
		{
		var Work_Person = new Array();
		var sel = document.getElementsByTagName('select').item(0);
		$('#select-participant > option:selected').each(function() {
			var User_Info = new Object();
			console.log($(this).text());
			User_Info.User_Name = $(this).text();
			User_Info.User_Id = $(this).val();
			console.log($(this).val());
			Work_Person.push(User_Info);
			console.log(Work_Person);
		});
		var dataform = JSON.stringify(Work_Person);
		$.ajax({
			url : 'http://54.65.71.36:8080/appaddmemo',
			dataType : 'json',
			type : 'POST',
			data : {
				'Project_Id' : localStorage.getItem('Project_Id'),
				'Project_Name' : localStorage.getItem('Project_Name'),
				'Work_Name' : $('#m_sbj').val(),
				'Work_Memo' : $('#m_textarea').val(),
				'Work_Sday' : $('#memo_date_start').val(),
				'Work_Dday' : $('#memo_date_finish').val(),
				'Work_Finish' : 'ing',
				'Work_Person' : dataform,
				'AppId' : localStorage.getItem('App_Id'),
			},
			success : function(result) {
				console.log('success');
			}
		});
		location.replace('tab_memo.html');
		}
	}

//프로젝트에 멤버 추가시 사용되는 함수

function addprojectmember() {
   $.ajax({
      url : 'http://54.65.71.36:8080/addprojectmember',
      dataType : 'json',
      type : 'POST',
      data : {
         'Project_Id' : localStorage.getItem('Project_Id'),
         'Member_Email' : $("#member_name").val(),
         //프로젝트 내용
      },
      success : function(result) {
         console.log('여기까진됨');
         if(result.suc == 1){
            console.log('멤버 추가 실패');
            alert('해당하는 멤버가 없습니다.');
           // location.replace('tab_memo.html');
         }
         else if(result.suc == 2){
            console.log('success');    
            location.replace('tab_memo.html');
           //$('#add_member').popup("close");
           // location.replace('tab_memo.html');
         }
         else
            {      
               console.log('멤버 추가 실패');
               alert('이미 해당 프로젝트에 멤버가 있습니다.');
               //location.replace('tab_memo.html');
            }
      }
   });
}