<?php

class JSONRPC
{
	function sendError($errCode, $errDesc, $id)
	{
		$message = array("jsonrpc" => "2.0", "error" => array("code" => $errCode, "message" => $errDesc), "id" => $id);
		echo(json_encode($message));
	}
	function cleanUp()
    {
    	global $serverDir;
        uses("server_util_File");
        $tmpDir = new server_util_File($serverDir . "/tmp");
        
        $oldest = strtotime("-24 hour");
        
        if ($tmpDir->isDir())
        {
            $fileList = $tmpDir->listDir();
            
            foreach ($fileList->getArray() as $key => $value)
            {
                if ($value->isFile() )//&& (substr($value->getBaseFileName(), 0, 4) == "ses_")
                {
                    if ($value->getModifTime() < $oldest)
                        $value->delete();
                }                             
            }
        }
    }
	public function getTempDir()
    {
        global $dirSeparator;
        global $dirSeparator;
		global $serverDir;
		$workingDir = $serverDir;
		$this->workingDir = $workingDir;

        return $this->workingDir . $dirSeparator . "tmp";
    }
	function createSession(){
		$sesId = md5(date("r"));
        
        $cont = true;
        
        global $dirSeparator;
		global $serverDir;
		$workingDir = $serverDir;
		$this->workingDir = $workingDir;
        $tmpDir = $this->getTempDir();
		
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
					error_log("Failed create file ");
                }
            } while ($cont);
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
            //error_log("xml ". $xml);        
            try
            {				
                $sessionMap->fromXML($xml);
            }
            catch (Exception $e)
            {
            }
             
            $result = $sessionMap->get($objId);
			//error_log("Object Id $objId $result");
            
        }
        
        return $result;
    }
	function invoke($handler)
	{
		if ("download" == @$_REQUEST["mode"])
		{
			$method = @$_REQUEST["method"];
			$param = array();
			
			$i = 0;
			
			while (array_key_exists("p$i", $_REQUEST))
			{
				array_push($param, $_REQUEST["p$i"]);
				$i++;
			}
			
			$handlerFunc = array($handler, $method);
			
			if (is_callable($handlerFunc))
			{
				try
				{
					ob_clean();
					call_user_func_array($handlerFunc, $param);
				}
				catch (Exception $e)
				{
					error_log("error download : $method");
				}
			}
		}
		else
		{
			$postdata = file_get_contents("php://input"); 
			
			$message = json_decode($postdata);
			
			if ($message != null)
			{
				$param = @$message->params;
				
				if ($param == null)
					$param = array();
				
				$result = null;
				
				if ($message->method == "describe")
				{
					$handlerReflector = new ReflectionClass($handler);
					
					$methodList = $handlerReflector->getMethods(ReflectionMethod::IS_PUBLIC);
					
					$result = array();
					
					foreach ($methodList as $key => $method)
					{
						if ($method->getName() != "__construct")
						{
							$paramList = array();
							
							$handlerParamList = $method->getParameters();
							
							foreach ($handlerParamList as $keyParam => $param)
							{
								array_push($paramList, $param->getName());
							}
							
							$result[$method->getName()] = $paramList;
						}
					}
					
					$message = array("jsonrpc" => "2.0", "result" => $result, "id" => $message->id);
					echo(json_encode($message));
				}
				else
				{
					$handlerFunc = array($handler, $message->method);
					//error_log("Call Method ". $message->method);
					//error_log("MessageId ". $message->user ." session " .$message->session ." ".$message->method);
					$handlerSetId = array($handler, "setId");
					if ($message->method == "login") {
						error_log("Login Heare ");
					}else if ($message->method == "callServices" && $param[1] == "login") {
						error_log("enter login callservicesre ");
					}else if (is_callable($handlerSetId)){
						$result = call_user_func_array($handlerSetId, array($message->user, $message->session));
						if ($result == 0){
							//session expired
							$this->sendError(-32604, "Session Expired. Please login.. ", $message->id);
							return;
						}
					}
					if (is_callable($handlerFunc))
					{
						try
						{
							$result = call_user_func_array($handlerFunc, $param);
							$id = @$message->id;
							if (($message->method == "login" && $result["type"] != 1)|| ($message->method == "callServices" && $param[1] == "login" && $result["type"] != 1)) {
								
								$this->setSessionObject("loginSession", $result["session"]);
							}
					
							if ($id)
								$message = array("jsonrpc" => "2.0", "result" => $result, "id" => $message->id);
							else
								$message = array("jsonrpc" => "2.0", "result" => $result);
							//error_log("Return " . json_encode($message));
							echo(json_encode($message));
						}
						catch (Exception $e)
						{
							///error_log($e->getMessage());
							$this->sendError(-32603, "Internal RPC Error : " . $e, $message->id);
						}
					}
					else
					{
						$this->sendError(-32601, "Procedure not found : " . $message->method, $message->id);
					}
				}
			}
			else
			{
				$this->sendError(-32700, "Parse error : " . $message-> method, null);
			}
		}
	}
}

?>