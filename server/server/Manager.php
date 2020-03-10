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
uses("server_util_Map");

uses("server_util_File");

uses("server_Request");
uses("server_Response");
uses("server_Object");
uses("server_BasicObject");
uses("server_ShareObject");
class server_Manager extends server_BasicObject
{
    protected $response;
    protected $workingDir;
    protected $sendResponse;
    protected $sessionId;
    
    public function __construct($workingDir = null)
	{
		parent::__construct();
		$this->response = new server_Response();
		$this->response->onEncrypt->set(1, "encrypt");
		
		if ($workingDir == null)
		{
            global $dirSeparator;
            global $serverDir;
            $workingDir = $serverDir;
		}
		
		$this->workingDir = $workingDir;
		$this->sendResponse = true;
	}
	
	//------------------------------ Remote Function ---------------------------
	
	public function init()
	{
        $sesId = md5(date("r"));
        
        $cont = true;
        
        global $dirSeparator;
        $tmpDir = $this->getTempDir();
//		error_log($tmpDir);
        do
        {
            $fileName = $tmpDir . $dirSeparator . "ses_$sesId";
            
            if (file_exists($fileName))
                $sesId = md5(date("r"));
            else
            {
                $this->sessionId = $sesId;
                $this->synch();
                
                $cont = false;
            }
                
        } while ($cont);        

        return $sesId;
	}
		
	public function synch()
	{
        $this->setSessionObject("lastAccess", time());
        
        return true;
	}
	
	public function login($userName, $userPassword)
	{
	}
	
	public function logout()
	{
	}
	
	public function reset()
	{
	}
	
	public function createObject($className, $addParam = null)
	{
        global $dirSeparator;
        $sessionMap = new server_util_Map();
        $sessionConf = new server_util_File($this->getConfDir() . $dirSeparator . "session.xml");
//        error_log($this->getConfDir() . $dirSeparator . "session.xml");        
        if ($sessionConf->isFile())  
        {
            $cont = true;
            $xml = "";
                    
            do
            {
                try
                {
                    $xml = $sessionConf->getContents();
                    $cont = false;
                }
                catch (Exception $e)
                {
                }
            } while ($cont);
        }
                    
        try
        {
//			error_log($xml);
            $sessionMap->fromXML($xml);
        }
        catch (Exception $e)
        {
        }
        
        $classDesc = $sessionMap->get($className);
		//error_log("create object " . $className);        
        if ($classDesc != null)
        {
            $objId = md5(date("r"));
            $object = null;
            $cont = true;            
            
            do
            {
                if ($this->getSessionObject($objId) != null)
                    $objId = md5(date("r"));
                else
                    $cont = false;
            } while ($cont);
            
            uses($className);
            
            if (class_exists($className))
            {                
				$script = "\$object = new $className(\"$addParam\");";			
                eval($script);
                if ($object instanceof server_Object)
                {
                    $object->init();
                    $this->setSessionObject($objId, $object);
                    return $objId;
                }
                else
                    return null;
            }
            else
                return null;
        }
        else
            return null;
	}
	public function delObject($objectId){		
		/*if (($this->sessionId != null) && ($this->sessionId != ""))
        {
            global $dirSeparator;
            
            $sessionMap = new server_util_Map();
            
            $sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "ses_" . $this->sessionId);
                
            if ($sessionTmp->isFile())
            {
                $cont = true;
                $xml = "";
                    
                do
                {
                    try
                    {
                        $xml = $sessionTmp->getContents();
                        $cont = false;
                    }
                    catch (Exception $e)
                    {
                    }
                } while ($cont);
            }
                    
            try
            {				
                $sessionMap->fromXML($xml);
            }
            catch (Exception $e)
            {
            }
             
            $sessionMap->del($objectId);
            $xml = $sessionMap->toXML();
                                
			try
			{
				$sessionTmp->setContents($xml);
				$cont = false;
			}
			catch (Exception $e)
			{
			}
        }*/
                
	}
	
	
	//--------------------------------- Function -------------------------------
	
	protected function cleanUp()
    {
        $tmpDir = new server_util_File($this->getTempDir());
        
        $oldest = strtotime("-24 hour");
        
        if ($tmpDir->isDir())
        {
            $fileList = $tmpDir->listDir();
            
            foreach ($fileList->getArray() as $key => $value)
            {
                if ($value->isFile() && (substr($value->getBaseFileName(), 0, 4) == "ses_"))
                {
                    if ($value->getModifTime() < $oldest)
                        $value->delete();
                }                             
            }
        }
    }
    
	public function getSessionObject($objId)
    {
        $result = null;
        
        if (($this->sessionId != null) && ($this->sessionId != ""))
        {
            global $dirSeparator;
            
            $sessionMap = new server_util_Map();
            
            $sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "ses_" . $this->sessionId);
                
            if ($sessionTmp->isFile())
            {
                $cont = true;
                $xml = "";
                    
                do
                {
                    try
                    {
                        $xml = $sessionTmp->getContents();
                        $cont = false;
                    }
                    catch (Exception $e)
                    {
                    }
                } while ($cont);
            }
                    
            try
            {				
                $sessionMap->fromXML($xml);
            }
            catch (Exception $e)
            {
            }
             
            $result = $sessionMap->get($objId);
            
            if ($result instanceof server_BasicObject)
                $result->setManager($this);
        }
        
        return $result;
    }
    
    public function getSessionObjectByClass($className)
    {
        $result = null;

        if (($this->sessionId != null) && ($this->sessionId != ""))
        {
            global $dirSeparator;

            $sessionMap = new server_util_Map();
            $sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "ses_" . $this->sessionId);

            if ($sessionTmp->isFile())
            {
                $cont = true;
                $xml = "";

                do
                {
                    try
                    {
                        $xml = $sessionTmp->getContents();
                        $cont = false;
                    }
                    catch (Exception $e)
                    {
                    }
                } while ($cont);
            }

            try
            {
                $sessionMap->fromXML($xml);
            }
            catch (Exception $e)
            {
            }

            foreach ($sessionMap->getArray() as $key => $value)
            {
                if ($value instanceof server_util_XMLAble)
                {
                    if ($value->getClassName() == $className)
                    {
                        $result = $value;
                        break;
                    }
                }
            }
            
            if ($result instanceof server_BasicObject)
                $result->setManager($this);
        }

        return $result;
    }
    
    protected function setSessionObject($objId, $obj)
    {

        if (($this->sessionId != null) && ($this->sessionId != ""))
        {
            global $dirSeparator;
            
            $sessionMap = new server_util_Map();
            $sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "ses_" . $this->sessionId);
                
            if ($sessionTmp->isFile())
            {
                $cont = true;
                $xml = "";
                    
                do
                {
                    try
                    {
                        $xml = $sessionTmp->getContents();
                        $cont = false;
                    }
                    catch (Exception $e)
                    {
                    }
                } while ($cont);
            } 
                    
            try
            {
                $sessionMap->fromXML($xml);
            }
            catch (Exception $e)
            {
            }
                    
            $sessionMap->set($objId, $obj);
        
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
    }
    
    public function getServerObject($objId)
    {
        $result = null;
        
        global $dirSeparator;
        
        $serverMap = new server_util_Map();
        $serverTmp = new server_util_File($this->getTempDir() . $dirSeparator . "server");
                
        if ($serverTmp->isFile())
        {
            $cont = true;
            $xml = "";

            do
            {
                try
                {
                    $xml = $serverTmp->getContents();
                    $cont = false;
                }
                catch (Exception $e)
                {
                }
            } while ($cont);
                    
            try
            {
                $serverMap->fromXML($xml);
            }
            catch (Exception $e)
            {
            }
        }
                
        $result = $serverMap->get($objId);
        
        if ($result instanceof server_BasicObject)
            $result->setManager($this);
                
        return $result;
    }
    
    protected function setServerObject($objId, $obj)
    {
        global $dirSeparator;
        
        $serverMap = new server_util_Map();
        $serverTmp = new server_util_File($this->getTempDir() . $dirSeparator . "server");
                
        if ($serverTmp->isFile())
        {
            $cont = true;
            $xml = "";
                    
            do
            {
                try
                {
                    $xml = $serverTmp->getContents();
                    $cont = false;
                }
                catch (Exception $e)
                {
                }
            } while ($cont);
                    
            try
            {
                $serverMap->fromXML($xml);
            }
            catch (Exception $e)
            {
            }
        }
                
        $serverMap->set($objId, $obj);
        
        $cont = true;
        $xml = $serverMap->toXML();
                    
        do
        {
            try
            {
                $serverTmp->setContents($xml);
                $cont = false;
            }
            catch (Exception $e)
            {
            }
        } while ($cont);
    }
    
    protected function isValidMethod($object, $methodName)
    {
        $methodArray = get_class_methods($object->getClassName());
        return (array_search($methodName, $methodArray) !== false);
    }
    
    public function invoke($request)
    {   
		
		$this->cleanUp();			
        if ($request instanceof server_Request)
        {
            $this->sessionId = $request->getSessionId();
            $this->response->clear();
            if ($request->getEncryption() != 0)
            {
                $request->onDecrypt->setHandler(this, "decrypt");
                $request->decrypt();
            }
			
            $object = null;
            $objType = 0;           
            
            if ($request->getObjectId() == "manager")
            {
                $object = $this;
                $objType = 1;
            }
            else
            {
                $object = $this->getSessionObject($request->getObjectId());
                
                if (!($object instanceof server_Object))
                {
                    $object = $this->getServerObject($request->getObjectId());            
                    if ($object instanceof server_Object)
                        $objType = 3;
                }
                else
                    $objType = 2;
            }
            if ($object instanceof server_Object)
            {
				$step = $object ."-" .$request->getMethodName();
                if ($this->isValidMethod($object, $request->getMethodName()))
                {                
                    $result = null;

                    $params = "";
                    $pNo = 0;
                    
                    foreach ($request->params->getArray() as $key => $value)
                    {
                        $params .= ",\$p$pNo";
                        
                        eval("\$p$pNo = \$value;");
                        
                        $pNo++;
                    }
                    
                    if ($params != "")
                        $params = substr($params, 1);                    
                    $script = "\$result = \$object->" . $request->getMethodName() . "($params);";					
                    
                    eval($script);
                    
                    switch ($objType)
                    {
                        case 2 : // session object
                                $this->setSessionObject($request->getObjectId(), $object);
                                break;
                        case 3 : // server object
                                $this->setServerObject($request->getObjectId(), $object);
                                break;
                    }                    
                    $this->response->setCode(0);
                    $this->response->setValue($result);					
                }
                else
                {
                    $this->response->setCode(1);
                    $this->response->setValue("Undefined method !". $request->getMethodName());					
                }
            }
            else
            {
                $this->response->setCode(1);
                $this->response->setValue("Undefined object !". (gettype($object) == "string" ? $object : $object) );		
            }
        }
        else
        {
            $this->response->setCode(1);
            $this->response->setValue("Invalid request !");			
        }
        return $this->response;
    }
    
    public function decrypt($type, $value)
    {
        $result = $value;
        
        switch ($type)
        {
            case 1 : // ToDo : 
                    break;
        }
        
        return $result;
    }
    
    public function encrypt($type, $value)
    {
        $result = $value;
        
        switch ($type)
        {
            case 1 : // ToDo : 
                    break;
        }
        
        return $result;
    }
    //------------------------------- share Object ---------------------------------
    public function initAndRegister()
	{
        $sesId = md5(date("r"));
        
        $cont = true;
        
        global $dirSeparator;
        $tmpDir = $this->getTempDir();
//		error_log($tmpDir);
        do
        {
            $fileName = $tmpDir . $dirSeparator . "ses_$sesId";
            
            if (file_exists($fileName))
                $sesId = md5(date("r"));
            else
            {
                $this->sessionId = $sesId;
                $this->register($sesId);
                
                $cont = false;
            }
                
        } while ($cont);        

        return $sesId;
	}
    public function register($sessionId)
	{        
		$this->setShareObject($sessionId, time());
	}
	public function createShareObject($className)
	{
		global $dirSeparator;
        $sessionMap = new server_util_Map();
        $sessionConf = new server_util_File($this->getConfDir() . $dirSeparator . "session.xml");
//        error_log($this->getConfDir() . $dirSeparator . "session.xml");        
        if ($sessionConf->isFile())  
        {
            $cont = true;
            $xml = "";
                    
            do
            {
                try
                {
                    $xml = $sessionConf->getContents();
                    $cont = false;
                }
                catch (Exception $e)
                {
                }
            } while ($cont);
        }
                    
        try
        {
//			error_log($xml);
            $sessionMap->fromXML($xml);
        }
        catch (Exception $e)
        {
        }
        
        $classDesc = $sessionMap->get($className);
		//error_log("create object " . $className);        
        if ($classDesc != null)
        {
            $objId = md5(date("r"));
            $object = null;
            $cont = true;            
            
            do
            {
                if ($this->getShareObject($objId) != null)
                    $objId = md5(date("r"));
                else
                    $cont = false;
            } while ($cont);
            
            uses($className);
            
            if (class_exists($className))
            {                
				$script = "\$object = new $className(\"$addParam\");";
                eval($script);
                if ($object instanceof server_Object)
                {
                    $object->init();
                    $this->setShareObject($objId, $object);
                    return $objId;
                }
                else
                    return null;
            }
            else
                return null;
        }
        else
            return null;
	}
	public function getShareObject($shareObject)
	    {
		$result = null;
		
		if (($this->sessionId != null) && ($this->sessionId != ""))
		{
		    global $dirSeparator;
		    
		    $sessionMap = new server_util_Map();
		    $sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "shareObject");
			
		    if ($sessionTmp->isFile())
		    {
			$cont = true;
			$xml = "";
			    
			do
			{
			    try
			    {
				$xml = $sessionTmp->getContents();
				$cont = false;
			    }
			    catch (Exception $e)
			    {
			    }
			} while ($cont);
		    }
			    
		    try
		    {
			$sessionMap->fromXML($xml);
		    }
		    catch (Exception $e)
		    {
		    }
			    
		    $result = $sessionMap->get($shareObject);
		    
		    if ($result instanceof server_BasicObject)
			$result->setManager($this);
		}
		
		return $result;
	}
    protected function setShareObject($objId, $obj)
    {

        if (($this->sessionId != null) && ($this->sessionId != ""))
        {
            global $dirSeparator;
            
            $sessionMap = new server_util_Map();
            $sessionTmp = new server_util_File($this->getTempDir() . $dirSeparator . "shareObject");
                
            if ($sessionTmp->isFile())
            {
                $cont = true;
                $xml = "";
                    
                do
                {
                    try
                    {
                        $xml = $sessionTmp->getContents();
                        $cont = false;
                    }
                    catch (Exception $e)
                    {
                    }
                } while ($cont);
            } 
                    
            try
            {
                $sessionMap->fromXML($xml);
            }
            catch (Exception $e)
            {
            }
                    
            $sessionMap->set($objId, $obj);
        
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
    }
    
    
   
    //------------------------------- Setter & Getter --------------------------------
    
    public function getWorkingDir()
    {
        return $this->workingDir;
    }
    
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
    
    public function isSendResponse()
    {
        return $this->sendResponse;
    }
    
    public function setSendResponse($data)
    {
        $this->sendResponse = $data;
    }
}

?>
