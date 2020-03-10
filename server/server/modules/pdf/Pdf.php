<?php 
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_util_Pdf");
uses("server_BasicObject");

class server_pdf_Pdf extends server_BasicObject
{
	protected $html;
	protected $orientation;
	protected $unit;
	protected $format;
	protected $maxPageRow;
	protected $pdf;
	protected $sql;
	function __construct()
	{
		parent::__construct();
		
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
	
//------------------------
	function createPdf($html, $orientation, $unit, $format, $margin, $fontSize, $lineHeight,$response = '')
	{
		$this->sethtml($html);
		$this->setOrientation($orientation);
		$this->setUnit($unit);
		$this->setFormat($format);
		$this->setMaxPageRow($margin);
		$this->pdf = new server_util_Pdf($html);	
		return $this->pdf->getPdf($orientation, $unit, $format, $margin, $fontSize, $lineHeight,$response);
	}
	function createPdfD($html, $orientation, $unit, $format, $margin, $fontSize, $lineHeight)
	{
		$this->sethtml($html);
		$this->setOrientation($orientation);
		$this->setUnit($unit);
		$this->setFormat($format);
		$this->setMaxPageRow($margin);
		$this->pdf = new server_util_Pdf($html);
		$ret = $this->pdf->getPdfD($orientation, $unit, $format, $margin, $fontSize, $lineHeight);				
		return $ret;
	}
	function createPdfFromSQL($sql, $orientation, $unit, $format, $margin, $fontSize, $lineHeight)
	{		
		$this->setSql($sql);
		$this->setOrientation($orientation);
		$this->setUnit($unit);
		$this->setFormat($format);
		$this->setMaxPageRow($margin);
		$this->createHtml($sql);		
		$this->pdf = new server_util_Pdf($this->html);
		return $this->pdf->getPdf($orientation, $unit, $format, $margin, $fontSize, $lineHeight);
	}	
//------------------------ setter getter
	function createHtml($sql)
	{
		global $dbLib;
		$resultSet = $dbLib->execute($sql);		
		$html = "<table width='900' border='1' cellpadding='0' cellspacing='0' bordercolor='#000000'>".				
					"<tr bgcolor='#666666' style='{font-size:13;color:#ffffff;}'>".
					"<th width='10' nowrap='nowrap' scope='col'><font color='#ffffff'>&nbsp;No&nbsp;</font></th>";	
		$first = true;
		if (!$resultSet)
			$html .= "</tr>";	
		else
		{
			$r = 0;
			while (!$resultSet->EOF)
			{
				if ($first)
				{
					for ($i = 0; $i < $resultSet->FieldCount(); $i++)
					{
						$name = $resultSet->FetchField($i)->name;					
						$html .= "<th nowrap='nowrap' scope='col'><font color='#ffffff'>". $name ."</font></th>";
					}					
					$first = false;
					$html .= "</tr>";
				}
				$r++;
				$html .= "<tr>".
						 	"<th bgcolor='#666666' style='{font-size:10;color:#ffffff;}' scope=\"row\" ><font color='#ffffff'>$r</font></th>";
				for ($i = 0; $i < $resultSet->FieldCount(); $i++)
				{
					$value = $resultSet->fields[$i];											
					$type = $resultSet->MetaType($resultSet->FetchField($i)->type);
					if ($type == 'N')
						$html .= "<td nowrap='nowrap' style='{font-size:10;}' align=right>&nbsp;". number_format($value, 2, ',', '.')."&nbsp;</td>";
					else
						$html .= "<td nowrap='nowrap' style='{font-size:10;}'>&nbsp;". $value."&nbsp;</td>";
				}		
				$resultSet->MoveNext();
				$html .= "</tr>";
			}				
		}
		$resultSet->close();
		$html .= "</table>";
		$this->sethtml($html);
		return $html;
	}
	function getFullHtml($sql)
	{
		$this->createHtml($sql);		
		$html = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1' /><title>Untitled Document</title></head><body><br>";
		$html .= $this->html;
		$html .="</body></html>";		
		return $html;		
	}
	function getXlsFromSQL($sql)
	{
		$this->createHtml($sql);
		$html = $this->html;
		$name = md5(uniqid(rand(), true)) .".xls";
		global $manager;
		$save = $manager->getTempDir() . "/$name";
		$f=fopen($save,'w');
		fputs($f,$html);
		fclose($f);
		return "server/tmp/$name";
	}
	function sethtml($data)
	{
		$this->html = $data;
	}	
	function gethtml($data)
	{
		return $this->html;
	}
	function setOrientation($data)
	{
		$this->orientation = $data;
	}
	function getOrientation($data)
	{
		return $this->orientation;
	}
	function setUnit($data)
	{
		$this->unit = $data;
	}
	function getUnit()
	{
		return $this->unit;
	}
	function setFormat($data)
	{
		$this->format = $data;
	}
	function getFormat()
	{
		return $this->format;
	}
	function setMaxPageRow($data)
	{
		$this->maxPageRow = $data;
	}
	function getMaxPageRow()
	{
		return $this->maxPageRow;
	}
	function setSql($sql)
	{
		$this->sql = $sql;
	}
}	
?>
