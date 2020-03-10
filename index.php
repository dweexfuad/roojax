<?php
include_once("setting.php");
?>

<html>
<head>
	<title>rooJax Example</title>
	<link rel="stylesheet" href="css/style.css" type="text/css"/>
	<link rel="stylesheet" href="css/tinyeditor.css" type="text/css"/>
	<link rel="stylesheet" href="css/jquery.shadow.css" type="text/css"/>
	<link rel="stylesheet" href="css/font-awesome.min.css" type="text/css"/>
	<script type="text/javascript" src="js/lib/jquery.js"></script>	
	<script type="text/javascript" src="js/lib/jquery_contextMenu.js"></script>	
	<script type="text/javascript" src="js/lib/jquery_fixBoxModel.js"></script>	
	<script type="text/javascript" src="js/lib/highcharts.js"></script>	
	<script type="text/javascript" src="js/lib/highcharts-3d.js"></script>	
	<script type="text/javascript" src="js/lib/highcharts-more.js"></script>	
	<script src="js/lib/modules/solid-gauge.js"></script>
	<script type="text/javascript" src="js/lib/jquery_Base64.js"></script>	
	<script type="text/javascript" src="js/lib/jsend.min.js"></script>	
	<script type="text/javascript" src="js/lib/jquery.corner.js"></script>	
	<script type="text/javascript" src="js/lib/jquery.shadow.js"></script>
	<script type="text/javascript" src="js/lib/jquery.autosize-min.js"></script>
	<script type="text/javascript" src="js/lib/jquery.textshadow.js"></script>
	<script type="text/javascript" src="js/lib/tiny.editor.packed.js"></script>
	<script type="text/javascript" src="js/lib/jquery.timeago.js"></script>	
	<script type="text/javascript" src="js/lib/lib.js"></script>
	<script src="js/lib/ossjs/shim.js"></script>
	<script src="js/lib/ossjs/cpexcel.js"></script>
	<script src="js/lib/ossjs/xls.js"></script>
	<script src="js/lib/ossjs/jszip.js"></script>
	<script src="js/lib/ossjs/xlsx.js"></script>
	<script src="js/lib/ossjs/dropsheet.js"></script>
	<script src="js/lib/ossjs/main.js"></script>

	<script type="text/javascript" src="js/init.js"></script>
	<script type="text/javascript" src="js/numeric.js"></script>
	<script type="text/javascript" src="js/constanta.js"></script>
	<script type="text/javascript">
		<?php 
			echo "window.initApp = '$app_class', 
				window.nama_app='$app_nama',
				window.keterangan_app='$app_keterangan';
				window.app_logo_depan='$app_logo_depan';";

		?>		
	</script>
	<style>
    
    .loader {
        border: 10px solid #f3f3f3; /* Light grey */
        border-top: 10px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 20px;
        height: 20px;
        animation: spin 2s linear infinite;
    }
    @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
	[contenteditable=true]:empty:before{
	content: attr(placeholder);
	display: block; /* For Firefox */
	}
    </style>
</head>

<body >
	  <div id="system_block" class="system_block"></div>				  	  	  
	  <div id="system" class="system">
		 <div id="systemform" class="system_form"></div>			 
	  </div>	  	 
	  <div style='position:absolute;width:100%;height:20px;top:100%;left:0px;' align="center">		
			<div id="progress" class="progress">
				<table border=0 cellspacing=0 cellpadding=0>
				<tr><td><img id="progress_img" style="left:10px;top:20px;" src="image/progress/39.gif" /><td>			
					<td>&nbsp;<span id="progress_text" style="width:auto:height:auto;white-space: nowrap;color:#0099cc;font-size:10px;">Loading...</span></td>
				</tr>
				</table>
			</div>
	  </div>
	  <div id='loading' style='position:absolute;width:100%;height:100%;top:0;left:0px;background:rgba(255,255,255,0.5);' align="center">		
			<img id="loading_img" style='position:absolute;z-index:1000' width=60 height=60 src='icon/transparent.png' />
			<span id='loading_txt' style='position:absolute;z-index:1000;color:#5CB7FF;width:auto;top:100px;width:400px'></span>
	  </div>
	  <div id="splash" class="splash">
			<img id="banner" style="position:absolute;left:10px;top:20px;" src="image/logo/telkomindonesia.png" />			
			<img id="load" style="position:absolute;left:200px;top:10px;" src="image/progress/loader.gif" />			
	  </div>	  
	  <div id='hint' class="hint">
		<span  id="hint_msg" class="hint_msg"></span>
	  </div>
	  <div id='error_log' class="error_log">
		  <div id="error_bg" class="error_bg"></div>
		  <div id="error_log_cont" class="error_log_cont"></div>
	  </div>
	 	 
	   <iframe id='downloader' style='display:none' src='downloadCtrl.html'></iframe>
</body>
</html>
