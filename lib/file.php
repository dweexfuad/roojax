<?php

class clFile
{
	protected $fileName;
	
	function __construct($fileName)
	{
		$this->fileName = $fileName;
	}
	
	//------------------------------- Setter & Getter --------------------------------
	
    function createDir($childName = null)
    {
        if ($childName == null)
            mkdir($this->fileName);
        else
            mkdir($this->fileName . "/". $childName);            
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
    
        rmdir($dirName);
    }
       	
	function isDir()
	{
		return is_dir($this->fileName);
	}
	
	function isFile()
	{
		return is_file($this->fileName);
	}

	function isExist()
	{
		return file_exists($this->fileName);
	}
	
	function realPath()
	{
		if ($this->isExists())
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
	
	function delete()
	{
        unlink($this->fileName);
	}
	
	function listDir()
	{
		global $dirSeparator;
		
		$ret = scandir($this->fileName, 1);
		$result = array();
		
		if ($ret)
		{
			if (substr($this->fileName, -1) == $dirSeparator)
			{
				foreach ($ret as $key => $value)
				{
					$result->add(new clFile($this->fileName . $value));
				}
			}
			else
			{	
				foreach ($ret as $key => $value)
				{
					$result->add(new clFile($this->fileName . $dirSeparator . $value));
				}
			}
		}
		
		return $result;
	}
	
	function getDriveList()
	{	
		$result = array();
	
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
	
	function getContents()
	{
        return file_get_contents($this->fileName);
	}
	
	function setContents($data, $flags = null)
	{
        if ($flags != null)
            file_put_contents($this->fileName, $data, $flags);
        else
            file_put_contents($this->fileName, $data);
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
}

?>
