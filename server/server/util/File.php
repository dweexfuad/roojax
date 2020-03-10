<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_util_arrayList");
uses("server_BasicObject");

class server_util_File extends server_BasicObject
{
	protected $fileName;
	protected $isFolder;
	function __construct($fileName = null)
	{
		parent::__construct();
		$this->fileName = $fileName;		
		$this->isFolder = $this->isDir();
	}	
	protected function doSerialize()
	{
		parent::doSerialize();
		$this->serialize("fileName", "string");                
		$this->serialize("isFolder", "boolean");                
	}
	function init()
	{
		parent::init();
	}
	function deinit()
	{
		parent::deinit();
	}
	//------------------------------- Setter & Getter --------------------------------
	function setFilename($filename)
	{		
		$this->fileName = $filename;
	}
    function createDir($childName = null)
    {
		try{
			if ($childName == null)
				return mkdir($this->fileName);
			else
				return  mkdir($this->fileName . "/". $childName);            
		}catch(Exception $e){
			error_log($this->fileName .":".$e->getMessage());
			return $e->getMessage();
		}
    }
    
    function deleteDir($childName = null)
    {
        if ($childName == null)
            $this->doDelDir($this->fileName);
        else
            $this->doDelDir($this->fileName . "/". $childName);            
    }
    
    function doDelDir($dirName)
    {        
		$list = scandir($dirName);
	
		foreach ($list as $key => $value)
		{
			if (($value != ".") && ($value != ".."))
			{
				if (is_dir($dirName . "/" . $value))
					$this->deleteDir($dirName . "/" . $value);
				else
					@unlink($dirName . "/" . $value);
			}
		}
	
		return rmdir($dirName);		
    }
       	
	function isDir($filename = null)
	{
		if ($filename == null)
			return is_dir($this->fileName);
		else return is_dir($filename);
	}
	
	function isFile($filename = null)
	{
		if ($filename == null)
			return is_file($this->fileName);
		else return is_file($filename);
	}

	function isExist($filename = null)
	{
		if ($filename == null)
			return file_exists($this->fileName);
		else return file_exists($filename);
	}
	
	function realPath()
	{
		if ($this->isExist())
		{
			return realpath($this->fileName);
		}
		else
			return "";
	}
	
	function copyTo($destName, $overwrite = false)
	{		
		if (file_exists($destName))
		{
			if ($overwrite)
			{
				unlink($destName);
				copy($this->fileName, $destName);
			}
		}
		else
			copy($this->fileName, $destName);
	}
	function copyFileTo($filename, $destName, $overwrite = false)
	{		
		try {			
			if (file_exists($destName))
			{
				if ($overwrite)
				{
					unlink($destName);
					return copy($filename, $destName);
				}
			}
			else {
				if (file_exists($filename))
					return copy($filename, $destName);
				else return "error : file temporary tidak ditemukan";
			}
		}catch(Exception $e){
			return "error " . $e->getMessage();
		}
	}
	function copyFilesTo($filename, $destname, $overwrite = false)
	{		
		try{
			$files = explode(";",$filename);
			$destfiles= explode(";",$destname);
			if (count($files) != count($destfiles)){
			   return "error : Jumlah copied files dan destination tidak sama";
            }
			foreach ($files as $key => $filename){
                if (file_exists($destfiles[$key]))
    			{
    				if ($overwrite)
    				{
    					unlink($destfiles[$key]);
    					copy($filename, $destfiles[$key]);
    				}
    			}else {
    				if (file_exists($filename))
    					copy($filename, $destfiles[$key]);
    			}
			}
			return "ok";
		}catch(Exception $e){
			return "error " . $e->getMessage();
		}
	}
	function delete()
	{		
		try{
			if ($this->isFile())
				$ok = unlink($this->fileName);
			else $ok = rmdir($this->fileName);
			return $ok;
		}catch(Exception $e){
			return "error::" . $e->getMessage();
		}
       
	}
	function deleteFile($filename)
	{		
		try{
			if (is_dir($filename)){
				if (rmdir($filename)) return "Delete folder $filename success ";
				else return "error delete folder $filename";
			}else if (file_exists($filename)){
				if  (unlink($filename)) return "Delete file $filename success ";
				else return "Delete file $filename failed";
			}
		}catch(Exception $e){
			return "error " . $e->getMessage();
		}
	}
	function deleteFiles($filename)
	{		
		try{
			$files = explode(";",$filename);				
			foreach ($files as $key => $filename){
                if (is_dir($filename)){
    				if (rmdir($filename)) return "Delete folder $filename success ";
    				else return "error delete folder $filename";
    			}else if (file_exists($filename)){
    				if  (unlink($filename)) return "Delete file $filename success ";
    				else return "error: Delete file $filename failed";
    			}
			}
			return "ok";
		}catch(Exception $e){
			return "error " . $e->getMessage();
		}        					
	}
	function listDir($dir = null)
	{		
		global $dirSeparator;		
		if ($dir == null || $dir == ""){
			$ret = scandir($this->fileName, 1);			
			$result = new server_util_arrayList();		
			if ($ret)
			{
				if (substr($this->fileName, -1) == $dirSeparator)
				{
					foreach ($ret as $key => $value)
					{				
						$result->add(new server_util_File($this->fileName . $value));
					}
				}
				else
				{	
					foreach ($ret as $key => $value)
					{				  				  
						$result->add(new server_util_File($this->fileName . "/" . $value));
					}
				}
			}	
		}else {						
			
			$this->fileName = $dir;
			$ret = scandir($dir);
			$result = "";		
			if ($ret)
			{
				if (substr($this->fileName, -1) == $dirSeparator)
				{
					foreach ($ret as $key => $value)
					{				
						if ($value != ".svn")
							$result.= $value . ";";					
					}
				}				
			}
		
		}			
		return $result;
	}
	function listAllDir($dir = null)
	{		
		global $dirSeparator;	
		if ($dir == null) $dir = $this->fileName;
		$ret = scandir($dir);
		$result = "";		
		if ($ret)
		{
			foreach ($ret as $key => $value)
			{				
				if ($value != ".svn" && $value != "." && $value != "..")
					$result.= "?" . $dir . $dirSeparator . $value . "<br>";				
			}				
		}
		return $result;
	}
	function delDirCont()
	{
		global $dirSeparator;
		$ret = scandir($this->fileName, 1);				
		if ($ret)
		{
			foreach ($ret as $key => $value)
			{				  				  
				unlink($this->fileName . "/" . $value);
			}			
		}
	}
	function getTempDir()
	{
	  global $dirSeparator;
	  global $serverDir;
	  return $serverDir . $dirSeparator . "tmp" . $dirSeparator;		
	}  	
	function getRootDir()
	{
	  global $dirSeparator;
	  global $serverDir;
	  return $serverDir . $dirSeparator;		
	}  	
	function deleteTemp($user){
		$temp = $this->getTempDir();
		$ret = scandir($temp, 1);		
		
		if ($ret)
		{
			foreach ($ret as $key => $value)
			{				  				  
				if (substr($value, 0, strlen($user)) == $user){
					unlink($temp. "/" . $value);
				}				
			}			
		}
	}
	function listFile()
	{
		global $dirSeparator;
		$ret = scandir($this->fileName, 1);
		$result = "";
		
		if ($ret)
		{
			if (substr($this->fileName, -1) == $dirSeparator)
			{
				foreach ($ret as $key => $value)
				{				
					if (!is_dir($this->fileName . "/" . $value)) 
					   $result = $result . $this->getBaseFileNameOfFile($value) .";" ;
				}
			}
			else
			{	
				foreach ($ret as $key => $value)
				{				  
				  if (!is_dir($this->fileName . "/" . $value)) 
					   $result = $result . $this->getBaseFileNameOfFile($value) .";" ;
				}
			}
		}
		//error_log($result);
		return $result;
  }
  function listFolder($folder = null)
	{
		global $dirSeparator;
		try{
			if ($folder ==null){
				$ret = scandir($this->fileName, 1);
				$filename = $this->fileName;
			}else {
				$ret = scandir($folder, 1);
				$filename = $folder;
			}
			$result = "";		
			if ($ret)
			{
				if (substr($filename, -1) == $dirSeparator)
				{
					foreach ($ret as $key => $value)
					{									 
						if (is_dir($filename . "/" . $value))
							$result = $result . $value."_d;" ;
						else
						     $result = $result . $value ."_f;" ;
					}
				}
				else
				{	
					foreach ($ret as $key => $value)
					{				  				   
					     if (is_dir($filename . "/" . $value))
					       $result = $result . $value ."_d;" ;
					     else
						     $result = $result . $value ."_f;" ;
					}
				}
			}	
			return $result;
		}catch(Exception $e){
			error_log($e->getMessage());
			return "";
		}
  }
	function getDriveList()
	{	
		$result = new server_util_arrayList();
	
		if (is_dir("a:\\"))
			$result->add("a:\\");
		if (is_dir("b:\\"))
			$result->add("b:\\");
		if (is_dir("c:\\"))
			$result->add("c:\\");
		if (is_dir("d:\\"))
			$result->add("d:\\");
		if (is_dir("e:\\"))
			$result->add("e:\\");
		if (is_dir("f:\\"))
			$result->add("f:\\");
		if (is_dir("g:\\"))
			$result->add("g:\\");
		if (is_dir("h:\\"))
			$result->add("h:\\");
		if (is_dir("i:\\"))
			$result->add("i:\\");
		if (is_dir("j:\\"))
			$result->add("j:\\");
		if (is_dir("k:\\"))
			$result->add("k:\\");
		if (is_dir("l:\\"))
			$result->add("l:\\");
		if (is_dir("m:\\"))
			$result->add("m:\\");
		if (is_dir("n:\\"))
			$result->add("n:\\");
		if (is_dir("o:\\"))
			$result->add("o:\\");
		if (is_dir("p:\\"))
			$result->add("p:\\");
		if (is_dir("q:\\"))
			$result->add("q:\\");
		if (is_dir("r:\\"))
			$result->add("r:\\");
		if (is_dir("s:\\"))
			$result->add("s:\\");
		if (is_dir("t:\\"))
			$result->add("t:\\");
		if (is_dir("u:\\"))
			$result->add("u:\\");
		if (is_dir("v:\\"))
			$result->add("v:\\");
		if (is_dir("w:\\"))
			$result->add("w:\\");
		if (is_dir("x:\\"))
			$result->add("x:\\");
		if (is_dir("y:\\"))
			$result->add("y:\\");
		if (is_dir("z:\\"))
			$result->add("y:\\");

		return $result;
	}
		
	//------------------------------- Setter & Getter --------------------------------
	
	function getContents($encd = false)
	{		
	      if ($encd)
	        return crypted(file_get_contents($this->fileName));
	      else
			return file_get_contents($this->fileName);
	}
	
	function setContents($data, $flags = null, $file = null)
	{        
		if ($file == null){
			if ($flags != null)
	            file_put_contents($this->fileName, $data, $flags);
	        else
	            file_put_contents($this->fileName, $data);
		}else {						
			if ($flags != null)
	            file_put_contents($file, $data, $flags);
	        else
	            file_put_contents($file, $data);
		}
	}
	
	function getFileName()
	{
		return $this->fileName;
	}
	
	function getBaseName()
	{
		return basename($this->fileName);
	}
	
	function getBaseFileName()
	{
		$result = $this->getBaseName();
		
		$pos = strrpos($result, ".");
		
		if ($pos > 0)
            $result = substr($result, 0, $pos);
		  
		return $result;
	}
	function getBaseFileNameOfFile($file)
	{
    $result = basename($file);
		
		$pos = strrpos($result, ".");
		
		if ($pos > 0)
            $result = substr($result, 0, $pos);		  
		return $result;
	}
	function getExtention()
	{
		$baseName = $this->getBaseName();
		
		$pos = strpos($baseName, ".");
		
		if ($pos !== false)
			return substr($baseName, $pos);
		else
			return "";
	}
	
	function getAccessTime()
	{
		return fileatime($this->fileName);
	}
		
	function getModifTime()
	{
		return filemtime($this->fileName);
	}
	function getFileSize()
	{
		return filesize($this->fileName);
	}
	function appendFile($data){
		if (!file_exists( $this->fileName )){			
			$fh = fopen($this->fileName, 'w') or die("can't open file");		
		}else $fh = fopen($this->fileName, 'a') or die("can't open file");		
		fwrite($fh, $data);	
		fclose($fh);		
	}
	function getProperties()
	{
		/*
		$info = posix_getpwuid(fileowner($this->fileName));		
		$uinfo = "{";
		$first = true;
		foreach ($info as $key => $value){
			if (!$first) $uinfo .= ",";
			$uinfo .= "\"". $key ."\" : \"".$value ."\" ";	
			$first = false;
		}
		$uinfo .= "}";
		*/
		$perms = fileperms($this->fileName);
		if (($perms & 0xC000) == 0xC000) {
		    // Socket
		    $info = 's';
		} elseif (($perms & 0xA000) == 0xA000) {
		    // Symbolic Link
		    $info = 'l';
		} elseif (($perms & 0x8000) == 0x8000) {
		    // Regular
		    $info = '-';
		} elseif (($perms & 0x6000) == 0x6000) {
		    // Block special
		    $info = 'b';
		} elseif (($perms & 0x4000) == 0x4000) {
		    // Directory
		    $info = 'd';
		} elseif (($perms & 0x2000) == 0x2000) {
		    // Character special
		    $info = 'c';
		} elseif (($perms & 0x1000) == 0x1000) {
		    // FIFO pipe
		    $info = 'p';
		} else {
		    // Unknown
		    $info = 'u';
		}

		// Owner
		$info .= (($perms & 0x0100) ? 'r' : '-');
		$info .= (($perms & 0x0080) ? 'w' : '-');
		$info .= (($perms & 0x0040) ?
		            (($perms & 0x0800) ? 's' : 'x' ) :
		            (($perms & 0x0800) ? 'S' : '-'));

		// Group
		$info .= (($perms & 0x0020) ? 'r' : '-');
		$info .= (($perms & 0x0010) ? 'w' : '-');
		$info .= (($perms & 0x0008) ?
		            (($perms & 0x0400) ? 's' : 'x' ) :
		            (($perms & 0x0400) ? 'S' : '-'));

		// World
		$info .= (($perms & 0x0004) ? 'r' : '-');
		$info .= (($perms & 0x0002) ? 'w' : '-');
		$info .= (($perms & 0x0001) ?
		            (($perms & 0x0200) ? 't' : 'x' ) :
		            (($perms & 0x0200) ? 'T' : '-'));
			
		$ret = "{\"properties\" : {";
		$ret .= "\"filename\" : \"". $this->getBaseName() ."\",";
		$ret .= "\"size\" : \"". filesize($this->fileName) ."\",";
		$ret .= "\"modified\" : \"". date("F d Y H:i:s.", filemtime($this->fileName)) ."\",";
		$ret .= "\"lastaccess\" : \"". date("F d Y H:i:s.", fileatime($this->fileName)) ."\",";
		$ret .= "\"ownerinfo\" : \"". fileowner($this->fileName) ."\",";
		$ret .= "\"permission\" : \"". $info ."\"";
		$ret .= "}}";		
		
		return $ret;
	}
	function rename($oldname, $newname)
	{	
		$ok  = rename($oldname, $newname);
		if ($ok) $this->setFilename($newname);
		return $ok;
	}
	function cleanUp($folder){
	    if (is_dir($folder)){
            $ret = scandir($folder);
    		$result = "";		
    		if ($ret){
    		    $oldest = strtotime("-8 hour");  
    			foreach ($ret as $key => $value){
    			     $file = $folder . "/" . $value;
    			     if (filemtime($file) < $oldest){
    			         unlink($file);
                     }
                }			
    		}  
   		}
    }
    function getFileContents($filename)
	{		
		global $manager;
		$manager->setSendResponse(false);		
		$filename = str_replace("&","-",$filename);		
		$file = str_replace(" ","",$filename);		
		$file = basename($file);		
		header ("Content-type: application/octet-stream");
		header ("Content-Disposition: attachment; filename=". $file);
		header ("Content-Description: PHP/INTERBASE Generated Data" );				
	    $data = file_get_contents($filename);
	    $tmp = md5(date("r"));
	    file_put_contents($manager->getTempDir() ."/$tmp", $data);
	    readfile($manager->getTempDir() ."/$tmp");
	    unlink($manager->getTempDir() ."/$tmp");
	}
}

?>
