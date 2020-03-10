$(document).ready(function() {
    //make the actual join request to the server        
    try{
		var width = $("#system").width();
		var height = $("#system").height();			
		$("#banner").css({top :Math.round(height / 2 - 150), left : Math.round(width / 2 - 200) });				
		//$("#keterangan").css({top :Math.round(height / 2 + 110), left : Math.round(width / 2 - ($("#keterangan").width() / 2)) });				
		$("#load").css({top :Math.round(height / 2 + 60), left : Math.round(width / 2 - ($("#load").width() / 2)) - 30 });				
		$("#loading_img").css({top: Math.round(height / 2 - 30), left:Math.round(width / 2 - 30)});
		$("#loading_txt").css({top: Math.round(height / 2 + 40), left:Math.round(width / 2 - 200)});
		$("#loading").hide();
		$("#hint").hide();
		if (getCookie("app")){
			window.initApp = getCookie("app");
		}
		startSystem();						
	}catch(e){
		alert(e)
	}
	
});
//if we can, notify the server that we're going away.
$(window).unload(function () {
  system.logout();
});
