<?php
$serverDir = __FILE__;
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
    {
    	$dirSeparator = "\\";        
    }
    else
    {
    	$dirSeparator = "/";     
    }
    
$pos = strrpos($serverDir, $dirSeparator);
$path = substr($serverDir, 0, $pos);

ini_set('display_errors', 'Off');
ini_set ('track_errors', 'On');	 
ini_set ('max_execution_time', '3000');	 
ini_set ('memory_limit', '2024M');
ini_set ('upload_max_filesize	', '100M');
ini_set ('post_max_size	', '20M');
ini_set ('log_errors',   'On');
ini_set ('error_log',    $path .$dirSeparator."server".$dirSeparator."tmp".$dirSeparator."php_error.log");	

?>
<html>
	<head>
		<style>
			div.button {				
				background:#3c85c8;
				font-size:11px;
			}
			input.fileinput{
				filter:alpha(opacity:100);
				position:relative;
				text-align: left;
				opacity: 1;
				moz-opacity: 1;
				background:#3c85c8;
				border:1px solid #cccccc;
				cursor: pointer;
			}
		</style>
    	<script>
			//url(icon/dynpro/button.png) 0 0 repeat-x
    	    function init()
    	    {		
    	        window.parent.system.getResource(<?php echo($_REQUEST["resId"]); ?>).doInit(<?php echo($_REQUEST["col"]); ?>);
    	    }
    	    function doClick(){					
				if (document.all) 
					document.formUpload.uploadFile.click();					
				else document.formUpload.uploadFile.click();												
			}
    	    function doChange(event)
    	    {				    	        
				window.parent.system.getResource(<?php echo($_REQUEST["resId"]); ?>).doChange(event,<?php echo($_REQUEST["col"]); ?>);
    	    }			
    	</script>
    </head>
	<body onLoad="init()"  style="overflow: hidden;font-family: Arial;font-size: 10pt;color:#ffffff;background:#3c85c8;" bgcolor='#3c85c8' leftmargin="0" rightmargin="0" topmargin="0" bottommargin="0">
	    <form name="formUpload" enctype="multipart/form-data" action="uploadHandler.php" method="POST">																								
			<?php 	
					echo "<div  class='button' style='background-image:url(image/whitegradsmalltop.png);background-position:0 0;background-color:#3c85c8;cursor:pointer;position: absolute;z-index:2;width: 100%; height:100%;top:0' align='center'>
							<div id='content' style='position:absolute;top:3;text-align:center;width:100%;height:auto;'>".$_REQUEST["caption"]."</div></div>";
					if ($_REQUEST["ctrl"]== "default"){						
						$style = "cursor: hand;filter:alpha(opacity:0);position:relative;text-align: left;opacity: 0;moz-opacity: 0;z-index:3;";						
					}else{
						$style = "cursor: hand;filter:alpha(opacity:0);position:relative;text-align: left;opacity: 0;moz-opacity: 0;z-index:3;background:#fdb54e;border:1px solid #cccccc;";
					}						
					echo '<input type="file" name="uploadFile" style="'. $style . ';background:url(icon/dynpro/button.png) 0 0 repeat-x;cursor:pointer;width:100%;height:100%;font-family: Arial;font-size: 9pt;top:0"  onChange="doChange(event)"/>';
			?>		
			<input type="hidden" name="resId" value="<?php echo($_REQUEST["resId"]); ?>"/>
			<input type="hidden" name="uploadClassName" value=""/>
			<input type="hidden" name="funcName" value=""/>
			<input type="hidden" name="param1" value=""/>
			<input type="hidden" name="param2" value=""/>
			<input type="hidden" name="param3" value=""/>
			<input type="hidden" name="param4" value=""/>			
			<input type="hidden" name="col" value="<?php echo($_REQUEST["col"]); ?>"/>
		</form>
	</body>
</html>


