<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_BasicObject");
uses("server_util_Map");
uses("server_barcode_FColor",false);
uses("server_barcode_BarCode",false);
uses("server_barcode_FDrawing",false);
define('IMG_FORMAT_PNG',	1);
define('IMG_FORMAT_JPEG',	2);
define('IMG_FORMAT_WBMP',	4);
define('IMG_FORMAT_GIF',	8);
class server_util_barcode  extends server_BasicObject
{
	function __construct()
	{
		parent::__construct();
		$this->type = array('codabar','code11','code39','code93','code128','ean8','ean13','i25','s25','MSI','upca','upce','upcext2','upcext5','postnet','othercode');
		$this->typeDesc = array('codabar' => 'Codabar','code11' =>'Code 11','code39' => 'Code 39','code93' =>'Code 93','code128' =>'Code 128','ean8' => 'EAN-8',
                'ean13' => 'EAN-13 / ISBN','i25' =>'Interleaved 2 of 5','s25' => 'Standard 2 of 5','MSI' => 'MSI Plessey','upca' => 'UPC-A','upce' => 'UPC-E',
                'upcext2' => 'UPC Extension 2 Digits','upcext5' => 'UPC Extension 5 Digits','postnet' => 'PostNet','othercode' => 'Other Barcode');
		
	}
	protected function doSerialize()
	{
		parent::doSerialize();
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}
	function getType(){
	   $result = "{";
	   $first = true;
	   foreach($this->typeDesc as $key => $value){
	       if (!$first) $result .= ",";
           $result .= "\"$key\"" . ": \"$value\"";    
	       $first = false;
       }    
	   $result .= "}";    
	   return $result;
	   
    }
	function getBarcode($type, $text, $output = 1,$thicknes = 30, $res = 2, $font = 2,$a1 = null, $a2 = null)
	{
	    if (!isset($output)) $output = 1;
        if (!isset($thicknes)) $thicknes = 30;
        if (!isset($res)) $res = 2;
        if (!isset($font)) $font = 2;
       	if(include('server/barcode/'.$type.'.barcode.php')){ 		
       	    $color_black = new FColor(0,0,0);
    		$color_white = new FColor(255,255,255);
    		if(!empty($_GET['a2']))
    			$code_generated = new $type($thicknes,$color_black,$color_white,$res,$text,$font,$a1,$a2);
    		elseif(!empty($_GET['a1']))
    			$code_generated = new $type($thicknes,$color_black,$color_white,$res,$text,$font,$a1);
    		else
    			$code_generated = new $type($thicknes,$color_black,$color_white,$res,$text,$font);
   			global $serverDir;
   			$file = md5(time("r"));
   			while (file_exists($serverDir. '/tmp/'. $file .'.png')){
   			   $file = md5(time("r"));   
            }
    		$drawing = new FDrawing(1024,1024,$serverDir. '/tmp/'. $file .'.png',$color_white);
    		$drawing->init();
    		$drawing->add_barcode($code_generated);
    		$drawing->draw_all();
    		$im = $drawing->get_im();
    		$im2 = imagecreate($code_generated->lastX,$code_generated->lastY);
    		imagecopyresized($im2, $im, 0, 0, 0, 0, $code_generated->lastX, $code_generated->lastY, $code_generated->lastX, $code_generated->lastY);
    		$drawing->set_im($im2);
    		$drawing->finish($output);
    		return 'server/tmp/'. $file.'.png';
       	}
	}
}
?>
