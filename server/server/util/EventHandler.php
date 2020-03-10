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

class server_util_EventHandler extends server_util_XMLAble
{
	protected $target;
	protected $method;
	
	function __construct($target = null, $method = null)
	{
		parent::__construct();
		
		$this->target = $target;
		$this->method = $method;
	}
	
	protected function doSerialize()
	{
		parent::doSerialize();
		
		$oldTarget = $this->target;
		
		if (gettype ($this->target) != "string")
            $this->target = null;
            
		$this->serialize("target", "string");
		$this->serialize("method", "string");
		
		$this->target = $oldTarget;
	}
	
	public function toString()
	{
	   return $this->method . "@" . $this->target;
	}
	
	//--------------------------------- Function -------------------------------
	
	public function call($p1 = "__e__", $p2 = "__e__", $p3 = "__e__", $p4 = "__e__", $p5 = "__e__",
    					 $p6 = "__e__", $p7 = "__e__", $p8 = "__e__", $p9 = "__e__", $p10 = "__e__")
	{
        $result = null;
        
        if ((gettype($this->target) == "object") && (gettype($this->method) == "string") && (strlen($this->method) > 0))
        {
            $param = "";
    		$max = 0;
		
    		if ($p10 != "__e__")
    			$max = 10;
    		else if ($p9 !== "__e__")
    			$max = 9;
    		else if ($p8 !== "__e__")
    			$max = 8;
    		else if ($p7 !== "__e__")
    			$max = 7;
    		else if ($p6 !== "__e__")
    			$max = 6;
    		else if ($p5 !== "__e__")
    			$max = 5;
    		else if ($p4 !== "__e__")
    			$max = 4;
    		else if ($p3 !== "__e__")
    			$max = 3;
    		else if ($p2 !== "__e__")
    			$max = 2;
    		else if ($p1 !== "__e__")
    			$max = 1;
			
    		for ($i = 1; $i <= $max; $i++)
    			$param .= ", \$p$i";
		
    		if ($max > 0)
    			$param = substr($param, 2);	 
                
            $target = $this->target;
            
            $script = "\$result = \$target->" . $this->method . "($param);";
            
            try
            {
                eval($script);
            }
            catch (Exception $e)
            {
                $result = null;
            }
        }
        
        return $result;
	}
	
	//--------------------------------- Setter & Getter -------------------------------
	
	public function set($target, $method)
	{
        $this->target = $target;
        $this->method = $method;
	}
	
	public function getTarget()
	{
        return $this->target;
	}
	
	public function setTarget($data)
	{
        $this->target = $data;
	}
	
	public function getMethod()
	{
        return $this->method;
	}
	
	public function setMethod($data)
	{
        $this->method = $data;
	}
}

?>