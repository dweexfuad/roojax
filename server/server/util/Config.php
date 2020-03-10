<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_util_XMLAble");
uses("server_util_File");
uses("server_util_Map");

class server_util_Config extends server_util_XMLAble
{
	protected $configName;
	protected $configMap;

	function __construct($configName)
	{
		parent::__construct();

		$this->configName = $configName;
		$this->configMap = new server_util_Map();
		
		global $serverDir;
		global $dirSeparator;
		
		$file = new server_util_File($serverDir . $dirSeparator . "server/conf" . $dirSeparator . $configName . ".conf");
		//error_log("loadfile ".$serverDir . $dirSeparator . "server/conf" . $dirSeparator . $configName . ".conf");
		if ($file->isExist() && $file->isFile())
		{
            $setting = $file->getContents();
            $setting = str_replace("\r","",$setting);            
            $settingList = explode("\n", $setting);
            
            foreach ($settingList as $lineNo => $line)
            {
                $pos = strpos($line, "=");
                
                if ((substr($line, 0, 1) != "#") && ($pos > 0))
                {
                    $this->configMap->set(substr($line, 0, $pos), substr($line, $pos + 1));
                }
            }
		}else error_log("file not found.". $serverDir . $dirSeparator . "server/conf" . $dirSeparator . $configName . ".conf");
	}

	//--------------------------------- Setter & Getter -------------------------------

	public function set($name, $value)
	{
        $this->configMap->set($name, $value);
	}

	public function get($name)
	{
        return $this->configMap->get($name);
	}

	public function save()
	{
        $result = "";
        
        foreach ($this->configMap->getArray() as $key => $value)
        {
            $result .= "\r\n" . $key . "=" . $value;
        }
        
        if ($result != "")
            $result = substr($result, 2);
        
        $file = new server_util_File($serverDir . $dirSeparator . "conf" . $dirSeparator . $configName . ".conf");
        $file->setContents($result);
	}
}

?>
