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
uses("server_util_arrayList");

uses("server_BasicObject");
uses("server_util_File");
class server_ShareObject extends server_BasicObject
{	
	protected $manager;
	protected $shareName = "shareObject";
	protected $listSession;
	public $onChange;
	function __construct()
	{
		parent::__construct();
		$this->listSession = new server_util_Map();
		global $dirSeparator;
		global $serverDir;		
		$workingDir = $serverDir;
		$this->workingDir = $workingDir;
		$this->onChange = new server_util_EventHandler();		
	}

	protected function doSerialize()
	{
		parent::doSerialize();
		$this->serialize("listSession","server_util_Map",$this->listSession);
		$this->serialize("shareName","string",$this->shareName);
	}
	
	//--------------------------------------------------------------------------
	
	public function init()	
	{
		parent::init();
	}

	public function deinit()
	{
		parent::deinit();
	}
    
    //--------------------------------------------------------------------------
    public function register($sessionId)
    {				
		global $dirSeparator;
		$sessionMap = new server_util_Map();		
		$sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "_shareObject".$this->shareName);
			
		if ($sessionTmp->isFile())
		{
			$cont = true;
			$xml = $sessionTmp->getContents();
			try
			{
				$sessionMap->fromXML($xml);
			}
			catch (Exception $e)
			{
			}
			$map = new server_util_Map();
			$map->set("time", time());
			$map->set("status","REG");
			$sessionMap->set($sessionId, $map);
			$cont = true;
			$xml = $sessionMap->toXML();
					
			do
			{
				try
				{
					$sessionTmp->setContents($xml);
					$cont = false;
				}
				catch (Exception $e)
				{
				}
			} while ($cont);		
			return true;
		} 
	}
	public function createShare($shareName)
    {		
		global $dirSeparator;
		$this->shareName = $shareName;
		$sessionMap = new server_util_Map();		
		$sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "_shareObject".$this->shareName);
			
		if ($sessionTmp->isFile())
		{
			$cont = true;
			$xml = "";
			return $this->shareName;
		} 
				
		try
		{
			$sessionMap->fromXML($xml);
		}
		catch (Exception $e)
		{
		}
				
		$sessionMap->set("created", time());
		$sessionMap->set("modified", time());
		$cont = true;
		$xml = $sessionMap->toXML();
				
		do
		{
			try
			{
				$sessionTmp->setContents($xml);
				$cont = false;
			}
			catch (Exception $e)
			{
			}
		} while ($cont);
		return $this->shareName;
	}
	public function setShareValue($share, $value)
    {		
		global $dirSeparator;				
		$sessionMap = new server_util_Map();
		$sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "_shareObject".$this->shareName);
		$xml = "";
		if ($sessionTmp->isFile())
		{
			$cont = true;
			$xml = $sessionTmp->getContents();			
		} 
				
		try
		{
			$sessionMap->fromXML($xml);
		}
		catch (Exception $e)
		{
		}
		$map = new server_util_Map();
		$map->set("modified", time());
		$map->set("value",$value);		
		$sessionMap->set($share, $map);
		
	
		$cont = true;
		$xml = $sessionMap->toXML();
				
		do
		{
			try
			{
				$sessionTmp->setContents($xml);
				$cont = false;
			}
			catch (Exception $e)
			{
			}
		} while ($cont);
	}
	public function getShareValue($share, $session)
    {		
		global $dirSeparator;		
				
		//if ($time)
		
		$sessionMap = new server_util_Map();
		$sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "_shareObject".$this->shareName);
			
		
		if ($sessionTmp->isFile())
		{
			$cont = true;
			$xml = $sessionTmp->getContents();			
		} 
				
		try
		{
			$sessionMap->fromXML($xml);
		
			$time2 = $sessionMap->get($share);
			$time = $sessionMap->get($session);		
			if (isset($time2) && isset($time) ){	
				
				if ($time2 instanceof server_util_Map && $time instanceof server_util_Map && $time2->get("modified") >= $time->get("time") || $time->get("status") == "REG"){
					$res = $time2->get("value");
					$map = new server_util_Map();
					$map->set("time", time());//accestime
					$map->set("status","UPD");
					$sessionMap->set($session, $map);
					$xml = $sessionMap->toXML();
					$sessionTmp->setContents($xml);				
					if ($this->onChange->getTarget() != null){
						return $this->onChange->call($this, $share, $res);
					}
					
				}
			}
		}
		catch (Exception $e)
		{
		}
		return $share;
	}
	public function delSession($sessionId){
		
		global $dirSeparator;
		$sessionMap = new server_util_Map();		
		$sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "_shareObject".$this->shareName);
			
		if ($sessionTmp->isFile())
		{
			$cont = true;
			$xml = $sessionTmp->getContents();
			try
			{
				$sessionMap->fromXML($xml);
			}
			catch (Exception $e)
			{
			}
			$sessionMap->del($sessionId);
			$cont = true;
			$xml = $sessionMap->toXML();
					
			do
			{
				try
				{
					$sessionTmp->setContents($xml);
					$cont = false;
				}
				catch (Exception $e)
				{
				}
			} while ($cont);		
			return true;
		} 
	}
	//----------------------------------
	public function getConfDir()
    {
        global $dirSeparator;
        
        return $this->workingDir . $dirSeparator . "conf";
    }
        
    public function getTempDir()
    {
        global $dirSeparator;
        
        return $this->workingDir . $dirSeparator . "tmp";
    }
}

?>
