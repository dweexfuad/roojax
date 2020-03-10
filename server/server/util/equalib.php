<?php 

//class equalib
//{
	$stack = array();
	
	define("opKRGBUKA" ,"(");
    define("opKRGTUTUP",")");
    define("opKALI"    ,"*");
    define("opBAGI"    ,"/");
    define("opMINUS"   ,"-");
    define("opPLUS"    ,"+");
    define("opPANGKAT" ,"^");
	/*
	function IsOp(C : Char) : boolean;
  function IsNumeric(c : char) : boolean;
  function IsDecimalSeparator(c: char): boolean;
  function IsMathOp(c:char) : boolean;
  function GetOpDerajat(C:Char) : integer;
  function Calc(Value1, Value2 : real; Op : Char) : real;
  function IsStackEmpty(Stack : TArrayOfVar) : boolean;
	*/
	function replaceFn($Fn)
	{
		$arrOp = array(opKRGBUKA,opKRGTUTUP,opKALI,opBAGI,opMINUS,opPLUS,opPANGKAT);
		$newFn = str_replace($arrOp,";",$Fn);
		$newFn = split(";",$newFn);
		cetakArray($newFn);
		foreach ($newFn as $value) 
		{
			if ($value !="")
			{
				$Fn = str_replace($value, 10, $Fn);
			}			
		}
		return $Fn;
	}
	
	function hitung_rasio($kode_lokasi)
	{
	    $stackNum = array();
	    $stackOp = array();
	    $sql="select kode_rasio,rumus from rasio_m where kode_lokasi='$kode_lokasi' ";
		query_sql($sql,$rs,$conn);
		$arrOp = array(opKRGBUKA,opKRGTUTUP,opKALI,opBAGI,opMINUS,opPLUS,opPANGKAT);
		while ($row = $rs->FetchNextObject($toupper=false)) 
		{
            $Fn=$row->rumus;
			$kode_rasio=$row->kode_rasio;
			
			$newFn = str_replace($arrOp,";",$Fn);
			$newFn = split(";",$newFn);
			foreach ($newFn as $value) 
			{
				if ($value !="")
				{
					$sql1="select n4 as nilai from neraca where kode='$value' and kode_lokasi=$kode_lokasi";
					query_sql($sql1,$rs1,$conn);
					$row1 = $rs1->FetchNextObject($toupper=false);
					$nilai=$row1->nilai;
					$Fn = str_replace($value, $nilai, $Fn);
				}			
			}
			//echo $Fn;
			$total=ExecuteFn($Fn,$stackNum, $stackOp);
			$sql2="update rasio_m set n1=".$total." where kode_rasio='$kode_rasio' and kode_lokasi='$kode_lokasi'";
			
			query_sql($sql2,$rs2,$conn); 
			
		}
		
	}
	function coba()
	{
		for ($i = 0; $i < 5; ++$i) {
			  if ($i == 2)
			  {
				  continue;
			  }
			  print "$i\n";
		  }

	}
	function cetakArray($sk)
	{
		foreach ($sk as $value) {
							echo "value = $value<br />\n";
		}
	}
	function isOp($c)
	{			
		return in_array($c,array(opKRGBUKA,opKRGTUTUP,opKALI,opBAGI,opMINUS,opPLUS,opPANGKAT));		
	}
	function isNumeric($c)
	{	
		return in_array($c,array(0,1,2,3,4,5,6,7,8,9));
	}
	
	function isMathOp($c)
	{
		return in_array($c,array(opKALI, opBAGI, opPLUS, opMINUS));
	}
	function getOpDerajat($c)
	{
		switch($c)
		{
			case "(" :
			case ")" : return 4;
				break;
			case "*" :
			case "/" : return 2;
				break;
			case "+" :
			case "/" : return 1;
				break;
			default  : return 0; 
				break;
		}
	}
	function calc($value1, $value2, $op)
	{
		switch ($op)
		{
			case "*" : return $value1 * $value2;
				break;
			case "/" : 
					if ($value2 == 0)
						return 0;
					else return $value1 / $value2;
				break;
			case "+" : return $value1 + $value2;
				break;
			case "-" : return $value1 - $value2;
				break;			
			default : 0;
				break;
		}
	}
	function isStackEmpty($stc)
	{
		return ($stc == array());
	}
	
	function pop(&$stc, &$value)
	{
	   if ($stc == array())
	   	 $value = 0;
	   else
		$value = array_pop($stc);
	}
	function push($value, &$stc)
	{
		array_push($stc, $value);
	}
	function ExecuteFn($Fn,&$stackNumeric, &$stackOp)
	{	
		$arrFn = str_split($Fn);		
		$newFn = "";
		$tempNum = "";
		$i = 0;
		$reset = false;
		try
		{			
			while ($i < count($arrFn))
			{
//				print($i . "<br>");
				if (isOp($arrFn[$i]))
				{
					if (isStackEmpty($stackOp))
					{
						array_push($stackOp,$arrFn[$i]);						
					} else
					{
//						print("op lewat ".$arrFn[$i] ."<br>");
					 	if ( $arrFn[$i] == opKRGBUKA)
						{
							$newFn = "";							
							$itemp = $i;
							$i++;
							while (($i< count($arrFn)) && ($arrFn[$i] != opKRGTUTUP))
							{
								$newFn .= $arrFn[$i];
//								print($i."-".$arrFn[$i]."-".$newFn);
								$i++;
							}
//							print("<br>");							
							$i = $itemp;
//							print("new Function ".$newFn."<br>");
							$sNum = array();
							$sOp = array();
							$res = ExecuteFn($newFn, $sNum, $sOp);
//							print("Res".$res."<br>");
							$newFn = "(" . $newFn .")";
							$Fn = str_replace($newFn,$res,$Fn);
							$i = 0;
							$stackNumeric=array();
							$stackOp=array();
							$arrFn = str_split($Fn);		
//							print("New Funtion Glob " .$Fn."<br>");							
							//$reset = true;
							continue;
						}
						if (isMathOp($stackOp[count($stackOp)-1]) && getOpDerajat($stackOp[count($stackOp)-1]) < getOpDerajat($arrFn[$i]) && $arrFn[$i] <> opKRGTUTUP)
						{
//							print(" pus stack op (1)");
							array_push($stackOp,$arrFn[$i]);
						}else if (!isMathOp($stackOp[count($stackOp)-1]) && getOpDerajat($stackOp[count($stackOp)-1]) > getOpDerajat($arrFn[$i]))
						{
//						    print(" lewat pus stack op (2)");
							array_push($stackOp,$arrFn[$i]);
						}else
						{ 
//							print("loop 1 <br>");
//							cetakArray($stackNumeric);
//							cetakArray($stackOp);
//							print("End loop 1 <br>");
						    $varOp = array_pop($stackOp);
							if (isMathOp($varOp))
							{
								$varNumeric = array_pop($stackNumeric);
								if ($tempNum == "")
								{
									$varNumeric2 = array_pop($stackNumeric);
									$tempNum = $varNumeric2;
								}			
//								print('calc 1 '.$tempNum."<br>");
								$tempNum = calc($varNumeric, $tempNum, $varOp);
//								print('calc 1.1 '.$tempNum."<br>");
							}
							$varOp = array_pop($stackOp);
							while (!(($varOp = opKRGBUKA) || isStackEmpty($stackOp) || 
								    (!isStackEmpty($stackOp) && getOpDerajat($stackOp[count($stackOp)-1]) < getOpDerajat($arrFn[$i]))) ) 
							{								
								if (isMathOp($varOp))
								{
									$varNumeric = array_pop($stackNumeric);
									if ($tempNum == "")
									{
										$varNumeric2 = array_pop($stackNumeric);
										$tempNum = $varNumeric2;
									}			
									$tempNum = calc($varNumeric, $tempNum, $varOp);									
//									print('calc 2 '.$tempNum."<br>");
								}
								$varOp = array_pop($stackOp);
							}
							if ((isMathOp($arrFn[$i]) && isStackEmpty($stackOp)) || 
								((!isStackEmpty($stackOp)) && isMathOp($arrFn[$i]) && 
								 (getOpDerajat($stackOp[count($stackOp)-1]) < GetOpDerajat($arrFn[$i]))) )
					          array_push($stackOp,$arrFn[$i]);
							  
//							print("loop 1.1 <br>");
//							cetakArray($stackNumeric);
//							cetakArray($stackOp);
//							print("End loop 1.1 <br>");							  
						}
					}
					if (!$reset)
					{
						if ($tempNum != "")
							array_push($stackNumeric, $tempNum);					
//						print("loop 1.2 <br>");
//						cetakArray($stackNumeric);
//						cetakArray($stackOp);
//						print("End loop 1.2 <br>");
						$tempNum = "";
					}
				}else if (isNumeric($arrFn[$i]))
				{
//					print("num ".$i."- ".$arrFn[$i] ."<br>");
					$tempNum .= $arrFn[$i];	
				} else
				{	
//					print("Else ". $arrFn[$i] ."<br>");
					return 0;				
					exit;
				}	
				if (!$reset)
				{
					$i++;
//					print("temp = ".$tempNum."<br>");
				}
			}
			
			if ($tempNum <> "")
				array_push($stackNumeric,$tempNum);
			$varNumeric = array_pop($stackNumeric);
			$total = 0;
			$masuk = false;
//			print("Num = " .$tempNum. " = " . $varNumeric . "<br>" );
//			cetakArray($stackNumeric);
//			cetakArray($stackOp);
			while (!isStackEmpty($stackNumeric))
			{
				$varNumeric2 = array_pop($stackNumeric);
				$varOp = array_pop($stackOp);
				$total = $total + calc($varNumeric2, $varNumeric, $varOp);
				$masuk = true;
			}
//			cetakArray($stackNumeric);
//			cetakArray($stackOp);
			if (!$masuk) 
				$total = $varNumeric;
			return $total;
			
		}catch (Exception $e)
		{
			print "Error " .$e;
			return 0;
		}
		
	}
	
//}
?>