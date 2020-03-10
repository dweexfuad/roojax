<?php
class server_util_PowerPoint extends server_BasicObject
{
	protected $ppt;
	function __construct()
	{
		parent::__construct();
		$this->ppt = new PHPPowerPoint();
		
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
	//----------------------------------
	function createTemplatedSlide(PHPPowerPoint $objPHPPowerPoint){
		// Create slide
		$slide = $objPHPPowerPoint->createSlide();

	    // Add logo
	    $slide->createDrawingShape()
	          ->setName('logo telkom')
	          ->setDescription('PT TELKOM')
	          ->setPath('../image/telkomppt.png')
	          ->setHeight(72)
	          ->setWidth(112)
	          ->setOffsetX(840)
	          ->setOffsetY(0);
	    $shape = $slide->createDrawingShape();

	    $shape->setName('header')
	          ->setDescription('PT TELKOM')
	          ->setPath('../image/header.png')
	          ->setHeight(45)
	          ->setWidth(822)
	          ->setOffsetX(-5)
	          ->setOffsetY(-5);
	    $shadow = $shape->getShadow();
	    $shadow->setVisible(true)
				->setDirection(45)
	          	->setDistance(4)
	          	->setAlignment('tl')
	          	->setBlurRadius(5.3)
	          	->setAlpha(22);
	    $textShape = $slide->createRichTextShape()
					->setHeight(20)
				    ->setWidth(960)
				    ->setOffsetX(0)
				    ->setOffsetY(700);
		$fill = $textShape->getFill();
		$fill->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID)
			 ->setStartColor(new PHPPowerPoint_Style_Color('FF828282'))
			 ->setEndColor(new PHPPowerPoint_Style_Color('FF828282'));
		
	    $textShape = $slide->createRichTextShape()
					->setHeight(20)
				    ->setWidth(100)
				    ->setOffsetX(0)
				    ->setOffsetY(700);
		$fill = $textShape->getFill();
		$fill->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID)
			 ->setStartColor(new PHPPowerPoint_Style_Color('FFFF0000'))
			 ->setEndColor(new PHPPowerPoint_Style_Color('FFFF0000'));
		$textShape->getParagraph()->getAlignment()->setHorizontal(PHPPowerPoint_Style_Alignment::HORIZONTAL_CENTER);
		
		$title = $textShape->createTextRun('Stricly Confidential');
		$title->getFont()->setSize(7)
						 ->setColor(new PHPPowerPoint_Style_Color('FFFFFFFF'));
	    // Return slide
	    return $slide;

	}
	/*
	  options = arrayMap( {
				 x,y :
				 w,h :	
	  			 title:
	  			 type : PIE, LINE, BAR (COLUMN)
	  			 categories:[]} );
	  series = arrayList ([{
					name : ,
					data : ,
	  			}])
	*/
	function generate($slideOptions){
		$this->ppt->getProperties()->setCreator("Telkom Indonesia")
								  ->setLastModifiedBy("FBCC")
								  ->setTitle($slideOptions->get("title"))
								  ->setSubject($slideOptions->get("title"))
								  ->setDescription($slideOptions->get("title"))
								  ->setKeywords("Executive Summary Report")
								  ->setCategory("Executive Summary");

		// Remove first slide
		
		$this->ppt->removeSlideByIndex(0);
		if ($slideOptions->get("table")){
			
		}else if ($slideOptions->get("page")){
			foreach ($slideOptions->get("page")->getArray() as $k => $page){
				$currentSlide = $this->createTemplatedSlide($this->ppt); // local function
				foreach ($page->get("data")->getArray() as $key => $slideVal) {
					if ($slideVal->get("type") == "table"){
						$options = $slideVal->get("options");
						$shape = $currentSlide->createTableShape(11);
						$shape->setHeight($options->get("height"));
						$shape->setWidth($options->get("width"));
						$shape->setOffsetX($options->get("x"));
						$shape->setOffsetY($options->get("y"));
						$periode = $options->get("periode");
						$periode2 = $options->get("periode2");
						if (!isset($periode)) $periode = date("Y");
						if (!isset($periode2))
							$periode2= floatval($periode) - 1;

						$row = $shape->createRow();
						$row->setHeight(15);
						$cell = $row->nextCell();
						$cell->setRowSpan(2);
						$cell->setWidth(200);
						$cell->createTextRun('P&L Items')->getFont()->setBold(true)
						                                            ->setSize(9);
						$cell->getBorders()->getBottom()->setLineWidth(1)
														->setLineStyle(PHPPowerPoint_Style_Border::LINE_SINGLE);
						$cell->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID)
						               ->setStartColor(new PHPPowerPoint_Style_Color('FF808000'))
						               ->setEndColor(new PHPPowerPoint_Style_Color('FFFFFFFF'));
						$cell->getParagraph()->getAlignment()->setHorizontal(PHPPowerPoint_Style_Alignment::HORIZONTAL_CENTER);
						$cell = $row->nextCell();
						$cell->setWidth(70);
						$cell->setRowSpan(2);
						$cell->createTextRun('Actual Previous Month')->getFont()->setBold(true)
						                                            	   ->setSize(9)
						                                            	   ->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$cell->getBorders()->getBottom()->setLineWidth(1)
														->setLineStyle(PHPPowerPoint_Style_Border::LINE_SINGLE);
						$cell->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID)
						               ->setStartColor(new PHPPowerPoint_Style_Color('FF000080'));
						$cell->getParagraph()->getAlignment()->setHorizontal(PHPPowerPoint_Style_Alignment::HORIZONTAL_CENTER);
						$cell = $row->nextCell();
						$cell->setWidth(70);
						$cell->setColSpan(4);
						$cell->createTextRun('Current Month')->getFont()->setBold(true)
						                                            ->setSize(9)
						                                            ->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$cell->getBorders()->getBottom()->setLineWidth(1)
														->setLineStyle(PHPPowerPoint_Style_Border::LINE_SINGLE);
						$cell->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID)
						               ->setStartColor(new PHPPowerPoint_Style_Color('FF000080'));
						$cell->getParagraph()->getAlignment()->setHorizontal(PHPPowerPoint_Style_Alignment::HORIZONTAL_CENTER);
						$cell = $row->nextCell();$cell->setWidth(70);
						$cell = $row->nextCell();$cell->setWidth(70);
						$cell = $row->nextCell();$cell->setWidth(70);

						$cell = $row->nextCell();$cell->setWidth(70);
						$cell->setRowSpan(2);
						$cell->createTextRun("Ytd $periode2")->getFont()->setBold(true)
						                                            ->setSize(9)
						                                           	->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$cell->getBorders()->getBottom()->setLineWidth(1)
														->setLineStyle(PHPPowerPoint_Style_Border::LINE_SINGLE);
						$cell->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID)
						               ->setStartColor(new PHPPowerPoint_Style_Color('FF000080'));
						$cell = $row->nextCell();
						$cell->setColSpan(4);
						$cell->createTextRun("Ytd Okt $periode")->getFont()->setBold(true)
						                                            ->setSize(9)
						                                           	->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$cell->getBorders()->getBottom()->setLineWidth(1)
														->setLineStyle(PHPPowerPoint_Style_Border::LINE_SINGLE);
						$cell->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID)
						               ->setStartColor(new PHPPowerPoint_Style_Color('FF000080'));
						$cell->getParagraph()->getAlignment()->setHorizontal(PHPPowerPoint_Style_Alignment::HORIZONTAL_CENTER);               
						$row = $shape->createRow();
						$row->setHeight(15);
						$row->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID)
						               ->setStartColor(new PHPPowerPoint_Style_Color('FF000080'));
						$row->nextCell()->createTextRun('R1C1')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$row->nextCell()->createTextRun('R1C2')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$row->nextCell()->createTextRun('Budget')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$row->nextCell()->createTextRun('Actual')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$row->nextCell()->createTextRun('Ach.')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$row->nextCell()->createTextRun('Growth')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$row->nextCell()->createTextRun('-')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$row->nextCell()->createTextRun('Budget')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$row->nextCell()->createTextRun('Actual')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$row->nextCell()->createTextRun('Ach.')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));
						$row->nextCell()->createTextRun('Growth')->getFont()->setBold(true)
																		->setColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_WHITE));

						foreach ($row->getCells() as $cell) {
							$cell->getBorders()->getTop()->setLineWidth(1)
														 ->setLineStyle(PHPPowerPoint_Style_Border::LINE_SINGLE);
						}
						$data = $slideVal->get("data");
						foreach ($data->getArray() as $k => $value){
							$row = $shape->createRow();$row->setHeight(10);
							if ($value->get("level") == 0){
								$row->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID)
						                       ->setStartColor(new PHPPowerPoint_Style_Color('FF800000'));

							}else if ($value->get("level") == 1){
								$row->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID)
						                       ->setStartColor(new PHPPowerPoint_Style_Color('FF66FFFF'));

							}
							$cell = $row->nextCell();$cell->createTextRun(str_replace("&nbsp;"," ",$value->get("nama")) )->getFont()
																														 ->setSize(9)
																														 ->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
							$cell = $row->nextCell();$cell->createTextRun($value->get("nilai_actlalu"))->getFont()
																									   ->setSize(9)
																									  ->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
							$cell = $row->nextCell();$cell->createTextRun($value->get("nilai_agg"))->getFont()->setSize(9)
																												->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
							$cell = $row->nextCell();$cell->createTextRun($value->get("nilai_act"))->getFont()->setSize(9)
																														 ->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
							$cell = $row->nextCell();$cell->createTextRun(round($value->get("nilai_ach"),2) )->getFont()->setSize(9)
																														 ->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
							$cell = $row->nextCell();$cell->createTextRun(round($value->get("nilai_growth"),2) )->getFont()->setSize(9)
																														 ->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
							$cell = $row->nextCell();$cell->createTextRun($value->get("nilai_ytdlalu"))->getFont()->setSize(9)
																														 ->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
							$cell = $row->nextCell();$cell->createTextRun($value->get("nilai_ytdagg"))->getFont()->setSize(9)
																														 ->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
							$cell = $row->nextCell();$cell->createTextRun($value->get("nilai_ytdact"))->getFont()->setSize(9)
																														 ->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
							$cell = $row->nextCell();$cell->createTextRun(round($value->get("nilai_ytdach"),2) )->getFont()->setSize(9)
																														 ->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
							$cell = $row->nextCell();$cell->createTextRun(round($value->get("nilai_ytdgrowth"),2) )->getFont()->setSize(9)
																														 ->setColor(new PHPPowerPoint_Style_Color($value->get("level") == 0 ? PHPPowerPoint_Style_Color::COLOR_WHITE : PHPPowerPoint_Style_Color::COLOR_BLACK));
						}
					} else
					{  
						$options = $slideVal->get("options");
						$series  = $slideVal->get("series"); 
						// Create templated slide
						$shape = $currentSlide->createChartShape();
						$shape->setName($options->get("title"))
						      ->setResizeProportional(false)
						      ->setHeight($options->get("height"))
						      ->setWidth($options->get("width"))
						      ->setOffsetX($options->get("x"))
						      ->setOffsetY($options->get("y"))
						      ->setIncludeSpreadsheet(true)
						      ->setView2D(true);
						/*$shape->getShadow()->setVisible(true)
						                   ->setDirection(45)
						                   ->setDistance(10);
						$shape->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_GRADIENT_LINEAR)
						                 ->setStartColor(new PHPPowerPoint_Style_Color('FFCCCCCC'))
						                 ->setEndColor(new PHPPowerPoint_Style_Color('FFFFFFFF'))
						                 ->setRotation(270);
						*/
						//$shape->getBorder()->setLineStyle(PHPPowerPoint_Style_Border::LINE_SINGLE);
						$shape->getTitle()->setOffsetX(350);
						$shape->getTitle()->setText($options->get("title"));
						$shape->getTitle()->getFont()->setSize(20);
						//$shape->getTitle()->getFont()->setItalic(true);

						// Generate data for first chart
						if ($options->get("type") == "COMBINE"){
							$shape->getLegend()->setVisible(false);	
							$dataTable = new PHPPowerPoint_Shape_Chart_DataTable();
							$dataTable->setShowHorzBorder(true);
							$dataTable->setShowVertBorder(true);
							$dataTable->setShowOutline(true);
							$dataTable->setShowKeys(true);
							$types = new server_util_Map();
							$type = "";
							foreach ($series->getArray() as $key => $value) {
								if ($type != $value->get("type")){
									$type = $value->get("type");
									$types->set($type, new server_util_arrayList());
								}
								$types->get($type)->add($value);
							}
							foreach ($types->getArray() as $key => $valType) {
								$model = "";
								if ($key === "BAR"){
									$barChart = new PHPPowerPoint_Shape_Chart_Type_Bar();
									
									foreach ($valType->getArray() as $key => $value) {
										
										if ($value->get("model")){
											$barChart->setGrouping($value->get("model"));
											$model = $value->get("model");
										}else $model = "";	
										$series1Data = array();
										$arrayData = $value->get("data")->getArray();
										foreach ($options->get("categories")->getArray() as $key => $catVal) {
											$series1Data[$catVal] = $arrayData[$key];
											
										}
										$serie = new PHPPowerPoint_Shape_Chart_Series($value->get("name"), $series1Data);
										$serie->setShowLegendKey(false);
										$color = $value->get("color");
										if ($value->get("visible") === false || $value->get("visible") === "0" ){
											$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_NONE);
											$serie->setShowDataLabel(false);
											$serie->setShowValue(false);
										}else {
											$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID);
											switch ($color){
												case "red" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_RED) );
																break;
												case "darkred" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKRED) );
																break;
												case "blue" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_BLUE) );
																break;
												case "darkblue" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKBLUE) );
																break;
												case "yellow" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_YELLOW) );
																break;
												case "darkyellow" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DAKRYELLOW) );
																break;
												case "green" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKGREEN) );
																break;
												case "darkgreen" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_GREEN) );
																break;
											}
										}
										$showValue = $value->get("showValue");
										if ($value->get("showValue") === "1" || !isset($showValue) ){
											$serie->setShowValue(true);
											$serie->setShowDataLabel(true);
											error_log("show value ".$serie->getTitle() .":".$serie->getShowDataLabel());
										}else {
											$serie->setShowValue(false);
											$serie->setShowDataLabel(false);
											error_log("show value false ".$serie->getTitle() .":".$serie->getShowDataLabel());
										}
										$barChart->addSeries( $serie );	
									}
									if ($model == "stacked"){
										$shape->getLegend()->setVisible(false);
									}
									$shape->getPlotArea()->addTypes($barChart);
								}else if ($key == "LINE"){
									$lineChart = new PHPPowerPoint_Shape_Chart_Type_Line();
									foreach ($valType->getArray() as $key => $value) {
										$seriesData = array();
										$arrayData = $value->get("data")->getArray();
										foreach ($options->get("categories")->getArray() as $key => $catVal) {
											$seriesData[$catVal] = $arrayData[$key];
										}
										$serie = new PHPPowerPoint_Shape_Chart_Series($value->get("name"), $seriesData);
										$serie->setShowSeriesName(true);
										$color = $value->get("color");
										if ($value->get("visible") == false || $value->get("visible") === "0"){
											$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_NONE);
											$serie->setShowDataLabel(false);
										}else {
											$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID);
											switch ($color){
												case "red" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_RED) );
																break;
												case "darkred" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKRED) );
																break;
												case "blue" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_BLUE) );
																break;
												case "darkblue" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKBLUE) );
																break;
												case "yellow" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_YELLOW) );
																break;
												case "darkyellow" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DAKRYELLOW) );
																break;
												case "green" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_GREEN) );
																break;
												case "darkgreen" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKGREEN) );
																break;
												default : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_BLUE) );
																break;
											}
										}

										$lineChart->addSeries($serie);
									}
									$lineChart->setShowSymbol(false);
									$shape->getPlotArea()->addTypes($lineChart);
								}

							}
							
							
							// Create a shape (chart)
							$shape->getPlotArea()->setMultiType(true);
							if ($model != "stacked")
								$shape->getPlotArea()->setDataTable($dataTable);
							$shape->getPlotArea()->getAxisX()->setTitle($options->get("xTitle"));
							$shape->getPlotArea()->getAxisY()->setTitle($options->get("yTitle"));
							//$shape->getPlotArea()->setType($bar3DChart);

						}else if ($options->get("type") == "BAR" || $options->get("type") == "COLUMN"){
							$dataTable = new PHPPowerPoint_Shape_Chart_DataTable();
							$dataTable->setShowHorzBorder(true);
							$dataTable->setShowVertBorder(true);
							$dataTable->setShowOutline(true);
							$dataTable->setShowKeys(true);
							$shape->getPlotArea()->setMultiType(true);

							$bar3DChart = new PHPPowerPoint_Shape_Chart_Type_Bar();
							foreach ($series->getArray() as $key => $value) {
								$series1Data = array();
								$arrayData = $value->get("data")->getArray();
								foreach ($options->get("categories")->getArray() as $key => $catVal) {
									$series1Data[$catVal] = $arrayData[$key];
									
								}
								$serie = new PHPPowerPoint_Shape_Chart_Series($value->get("name"), $series1Data);
								$serie->setShowLegendKey(false);
								$color = $value->get("color");
								if ($value->get("visible") == false){
									$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_NONE);
									$serie->setShowDataLabel(false);
								}else {
									$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID);
									switch ($color){
										case "red" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_RED) );
														break;
										case "darkred" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKRED) );
														break;
										case "blue" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_BLUE) );
														break;
										case "darkblue" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKBLUE) );
														break;
										case "yellow" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_YELLOW) );
														break;
										case "darkyellow" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DAKRYELLOW) );
														break;
										case "green" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_GREEN) );
														break;
										case "darkgreen" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKGREEN) );
														break;
										default : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_BLUE) );
														break;
									}
								}

								$bar3DChart->addSeries( $serie );	
							}
							
							// Create a shape (chart)

							$shape->getPlotArea()->setDataTable($dataTable);
							$shape->getPlotArea()->getAxisX()->setTitle($options->get("xTitle"));
							$shape->getPlotArea()->getAxisY()->setTitle($options->get("yTitle"));
							$shape->getPlotArea()->setType($bar3DChart);

							//$shape->getView3D()->setRightAngleAxes(true);
							//$shape->getView3D()->setAutoScale(true);
							//$shape->getView3D()->setRotationX(40);
							//$shape->getView3D()->setRotationY(40);
						}else if ($options->get("type") == "PIE"){
							$shape->setView2D(false);
							$shape->getLegend()->setVisible($options->get("showLegend"));
							$pie3DChart = new PHPPowerPoint_Shape_Chart_Type_Pie3D();
							foreach ($series->getArray() as $key => $value) {
								$seriesData = array();
								$arrayData = $value->get("data")->getArray();
								foreach ($options->get("categories")->getArray() as $key => $catVal) {

									$seriesData[$catVal] = $arrayData[$key];
								}
								$shape->setName($series->get("name"));
								$serie = new PHPPowerPoint_Shape_Chart_Series($series->get("name"), $seriesData);
								$serie->setShowDataLabel($options->get("showDataLabel"));
								$serie->setShowCategoryName(true);
								$serie->setShowPercentage(true);
								$serie->setLabelPosition($options->get("dataLabelPos"));
								$pie3DChart->addSeries( $serie );
							}
							$shape->getPlotArea()->setType($pie3DChart);
							$shape->getView3D()->setRotationX(45);
							$shape->getView3D()->setPerspective(0);
						}else if ($options->get("type") == "LINE"){
							$lineChart = new PHPPowerPoint_Shape_Chart_Type_Line();
							foreach ($series->getArray() as $key => $value) {
								$seriesData = array();
								$arrayData = $value->get("data")->getArray();
								foreach ($options->get("categories")->getArray() as $key => $catVal) {
									$seriesData[$catVal] = $arrayData[$key];
								}
								$serie = new PHPPowerPoint_Shape_Chart_Series($value->get("name"), $seriesData);
								$serie->setShowSeriesName(false);
								$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID);
								$serie->setShowDataLabel(true);
								$lineChart->addSeries($serie);
							}	
							$shape->getPlotArea()->setType($lineChart);
							
						}
						$shape->getLegend()->getBorder()->setLineStyle(PHPPowerPoint_Style_Border::LINE_SINGLE);
						$shape->getLegend()->setPosition(PHPPowerPoint_Shape_Chart_Legend::POSITION_BOTTOM);
						$shape->getLegend()->getFont()->setItalic(true);
						if ($slideVal->get("comment")){
							$comment = $slideVal->get("comment");
							if ($comment->get("title") != "" && $comment->get("title") != null){
								$textShape = $currentSlide->createRichTextShape()
											->setHeight(20)
										    ->setWidth($comment->get("width"))
										    ->setOffsetX($comment->get("x"))
										    ->setOffsetY($comment->get("y") - 20);
								$title = $textShape->createTextRun($comment->get("title"));
								$title->getFont()->setSize(12)
												 ->setBold(true);
								
							}
							$textShape = $currentSlide->createRichTextShape()
										->setHeight($comment->get("height"))
									    ->setWidth($comment->get("width"))
									    ->setOffsetX($comment->get("x"))
									    ->setOffsetY($comment->get("y"));
							$textShape->getActiveParagraph()->getAlignment()->setHorizontal( PHPPowerPoint_Style_Alignment::HORIZONTAL_LEFT )
											->setMarginLeft(25)
											->setIndent(-25);
							$textShape->getActiveParagraph()->getFont()->setSize(12);
							if ($comment->get("type") == "list"){
								$textShape->getActiveParagraph()->getBulletStyle()->setBulletType(PHPPowerPoint_Style_Bullet::TYPE_BULLET);
								
								$value = $comment->get("value");
								if (gettype($value) == "string"){
									$textShape->createParagraph()->createTextRun($value);
								}else {
									foreach ($value->getArray() as $val){
										if (gettype($val) == 'string'){
											$textShape->createParagraph()->createTextRun($val);
										}else {
											$p = $textShape->createParagraph();
											$t = $p->createTextRun($val->get("text"));
											$t->getFont()->setSize($val->get("font")->get("size"))
		                   					   			 ->setColor( new PHPPowerPoint_Style_Color( $val->get("font")->get("color") ) );
		                   					if ($val->get("font")->get("style") == "bold"){
		                   						$t->getFont()->setBold(true);
		                   					}else if ($val->get("font")->get("style") == "italic"){
		                   						$t->getFont()->setItalic(true);
		                   					}   			 
		                   				}
									}
								}
							}else {
								$textShape->createTextRun($comment->get("value"));	
							}
						}
					}
				}
			}
		}else {
			foreach ($slideOptions->get("data")->getArray() as $key => $slideVal) {
				$options = $slideVal->get("options");
				$series  = $slideVal->get("series"); 
				// Create templated slide
				if ($slideOptions->get("page") != "single")
					$currentSlide = $this->createTemplatedSlide($this->ppt); // local function
				$shape = $currentSlide->createChartShape();

				$shape->setName($options->get("title"))
				      ->setResizeProportional(false)
				      ->setHeight($options->get("height"))
				      ->setWidth($options->get("width"))
				      ->setOffsetX($options->get("x"))
				      ->setOffsetY($options->get("y"))
				      ->setIncludeSpreadsheet(true)
				      ->setView2D(true);
				/*$shape->getShadow()->setVisible(true)
				                   ->setDirection(45)
				                   ->setDistance(10);
				$shape->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_GRADIENT_LINEAR)
				                 ->setStartColor(new PHPPowerPoint_Style_Color('FFCCCCCC'))
				                 ->setEndColor(new PHPPowerPoint_Style_Color('FFFFFFFF'))
				                 ->setRotation(270);
				*/
				//$shape->getBorder()->setLineStyle(PHPPowerPoint_Style_Border::LINE_SINGLE);
				$shape->getTitle()->setOffsetX(350);
				$shape->getTitle()->setText($options->get("title"));
				$shape->getTitle()->getFont()->setSize(20);
				//$shape->getTitle()->getFont()->setItalic(true);

				// Generate data for first chart
				if ($options->get("type") == "COMBINE"){
					$shape->getLegend()->setVisible(false);	
					$dataTable = new PHPPowerPoint_Shape_Chart_DataTable();
					$dataTable->setShowHorzBorder(true);
					$dataTable->setShowVertBorder(true);
					$dataTable->setShowOutline(true);
					$dataTable->setShowKeys(true);
					$types = new server_util_Map();
					$type = "";
					foreach ($series->getArray() as $key => $value) {
						if ($type != $value->get("type")){
							$type = $value->get("type");
							$types->set($type, new server_util_arrayList());
						}
						$types->get($type)->add($value);
					}
					foreach ($types->getArray() as $key => $valType) {
						if ($key === "BAR"){
							$barChart = new PHPPowerPoint_Shape_Chart_Type_Bar();
							foreach ($valType->getArray() as $key => $value) {
								$series1Data = array();
								$arrayData = $value->get("data")->getArray();
								foreach ($options->get("categories")->getArray() as $key => $catVal) {
									$series1Data[$catVal] = $arrayData[$key];
									
								}
								$serie = new PHPPowerPoint_Shape_Chart_Series($value->get("name"), $series1Data);
								$serie->setShowLegendKey(false);
								$color = $value->get("color");
								if ($value->get("visible") == false){
									$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_NONE);
									$serie->setShowDataLabel(false);
									$serie->setShowValue(false);
									
								}else {
									$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID);
									switch ($color){
										case "red" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_RED) );
														break;
										case "darkred" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKRED) );
														break;
										case "blue" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_BLUE) );
														break;
										case "darkblue" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKBLUE) );
														break;
										case "yellow" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_YELLOW) );
														break;
										case "darkyellow" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DAKRYELLOW) );
														break;
										case "green" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_GREEN) );
														break;
										case "darkgreen" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKGREEN) );
														break;
										default : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_BLUE) );
														break;
									}
								}

								$barChart->addSeries( $serie );	
							}
							if ($model == "stacked"){
								$shape->getLegend()->setVisible(false);
							}
							$shape->getPlotArea()->addTypes($barChart);
						}else if ($key == "LINE"){
							$lineChart = new PHPPowerPoint_Shape_Chart_Type_Line();
							foreach ($valType->getArray() as $key => $value) {
								$seriesData = array();
								$arrayData = $value->get("data")->getArray();
								foreach ($options->get("categories")->getArray() as $key => $catVal) {
									$seriesData[$catVal] = $arrayData[$key];
								}
								$serie = new PHPPowerPoint_Shape_Chart_Series($value->get("name"), $seriesData);
								$serie->setShowSeriesName(true);
								if ($value->get("visible") == false){
									$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_NONE);
									$serie->setShowDataLabel(false);

								}
								$lineChart->addSeries($serie);
							}
							$lineChart->setShowSymbol(false);
							$shape->getPlotArea()->addTypes($lineChart);
						}

					}
					
					if ($model != "stacked")
							$shape->getPlotArea()->setDataTable($dataTable);
							
					// Create a shape (chart)
					$shape->getPlotArea()->setMultiType(true);
					$shape->getPlotArea()->setDataTable($dataTable);
					$shape->getPlotArea()->getAxisX()->setTitle($options->get("xTitle"));
					$shape->getPlotArea()->getAxisY()->setTitle($options->get("yTitle"));
					//$shape->getPlotArea()->setType($bar3DChart);

				}else if ($options->get("type") == "BAR" || $options->get("type") == "COLUMN"){
					$dataTable = new PHPPowerPoint_Shape_Chart_DataTable();
					$dataTable->setShowHorzBorder(true);
					$dataTable->setShowVertBorder(true);
					$dataTable->setShowOutline(true);
					$dataTable->setShowKeys(true);
					$shape->getPlotArea()->setMultiType(true);

					$bar3DChart = new PHPPowerPoint_Shape_Chart_Type_Bar();
					foreach ($series->getArray() as $key => $value) {
						$series1Data = array();
						$arrayData = $value->get("data")->getArray();
						foreach ($options->get("categories")->getArray() as $key => $catVal) {
							$series1Data[$catVal] = $arrayData[$key];
							
						}
						$serie = new PHPPowerPoint_Shape_Chart_Series($value->get("name"), $series1Data);
						$serie->setShowLegendKey(false);
						$color = $value->get("color");
						if ($value->get("visible") == false){
							$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_NONE);
							$serie->setShowDataLabel(false);
						}else {
							$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID);
							switch ($color){
								case "red" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_RED) );
												break;
								case "darkred" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKRED) );
												break;
								case "blue" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_BLUE) );
												break;
								case "darkblue" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKBLUE) );
												break;
								case "yellow" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_YELLOW) );
												break;
								case "darkyellow" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DAKRYELLOW) );
												break;
								case "green" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_GREEN) );
												break;
								case "darkgreen" : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_DARKGREEN) );
												break;
								default : $serie->getFill()->setStartColor(new PHPPowerPoint_Style_Color(PHPPowerPoint_Style_Color::COLOR_BLUE) );
												break;
							}
						}

						$bar3DChart->addSeries( $serie );	
					}
					
					// Create a shape (chart)

					$shape->getPlotArea()->setDataTable($dataTable);
					$shape->getPlotArea()->getAxisX()->setTitle($options->get("xTitle"));
					$shape->getPlotArea()->getAxisY()->setTitle($options->get("yTitle"));
					$shape->getPlotArea()->setType($bar3DChart);

					//$shape->getView3D()->setRightAngleAxes(true);
					//$shape->getView3D()->setAutoScale(true);
					//$shape->getView3D()->setRotationX(40);
					//$shape->getView3D()->setRotationY(40);
				}else if ($options->get("type") == "PIE"){
					$shape->setView2D(false);
					$shape->getLegend()->setVisible($options->get("showLegend"));
					$pie3DChart = new PHPPowerPoint_Shape_Chart_Type_Pie3D();
					foreach ($series->getArray() as $key => $value) {
						$seriesData = array();
						$arrayData = $value->get("data")->getArray();
						foreach ($options->get("categories")->getArray() as $key => $catVal) {

							$seriesData[$catVal] = $arrayData[$key];
						}
						$shape->setName($series->get("name"));
						$serie = new PHPPowerPoint_Shape_Chart_Series($series->get("name"), $seriesData);
						$serie->setShowDataLabel($options->get("showDataLabel"));
						$serie->setShowCategoryName(true);
						$serie->setShowPercentage(true);
						$serie->setLabelPosition($options->get("dataLabelPos"));
						$pie3DChart->addSeries( $serie );
					}
					$shape->getPlotArea()->setType($pie3DChart);
					$shape->getView3D()->setRotationX(45);
					$shape->getView3D()->setPerspective(0);
				}else if ($options->get("type") == "LINE"){
					$lineChart = new PHPPowerPoint_Shape_Chart_Type_Line();
					foreach ($series->getArray() as $key => $value) {
						$seriesData = array();
						$arrayData = $value->get("data")->getArray();
						foreach ($options->get("categories")->getArray() as $key => $catVal) {
							$seriesData[$catVal] = $arrayData[$key];
						}
						$serie = new PHPPowerPoint_Shape_Chart_Series($value->get("name"), $seriesData);
						$serie->setShowSeriesName(false);
						$serie->getFill()->setFillType(PHPPowerPoint_Style_Fill::FILL_SOLID);
						$serie->setShowDataLabel(true);
						$lineChart->addSeries($serie);
					}	
					$shape->getPlotArea()->setType($lineChart);
					
				}
				$shape->getLegend()->getBorder()->setLineStyle(PHPPowerPoint_Style_Border::LINE_SINGLE);
				$shape->getLegend()->setPosition(PHPPowerPoint_Shape_Chart_Legend::POSITION_BOTTOM);
				$shape->getLegend()->getFont()->setItalic(true);
				if ($slideVal->get("comment")){
					$comment = $slideVal->get("comment");
					if ($comment->get("title") != "" && $comment->get("title") != null){
						$textShape = $currentSlide->createRichTextShape()
									->setHeight(20)
								    ->setWidth($comment->get("width"))
								    ->setOffsetX($comment->get("x"))
								    ->setOffsetY($comment->get("y") - 20);
						$title = $textShape->createTextRun($comment->get("title"));
						$title->getFont()->setSize(12)
										 ->setBold(true);
						
					}
					$textShape = $currentSlide->createRichTextShape()
								->setHeight($comment->get("height"))
							    ->setWidth($comment->get("width"))
							    ->setOffsetX($comment->get("x"))
							    ->setOffsetY($comment->get("y"));
					$textShape->getActiveParagraph()->getAlignment()->setHorizontal( PHPPowerPoint_Style_Alignment::HORIZONTAL_LEFT )
									->setMarginLeft(25)
									->setIndent(-25);
					$textShape->getActiveParagraph()->getFont()->setSize(12);
					if ($comment->get("type") == "list"){
						$textShape->getActiveParagraph()->getBulletStyle()->setBulletType(PHPPowerPoint_Style_Bullet::TYPE_BULLET);
						$value = $comment->get("value");
						if (gettype($value) == "string"){
							$textShape->createParagraph()->createTextRun($value);
						}else {
							foreach ($value->getArray() as $val){
								$p = $textShape->createParagraph();
								if (gettype($val) == 'string'){
									$t = $p->createTextRun($val);
								}else {
									$t = $p->createTextRun($val->get("text"));
									$t->getFont()->setSize($val->get("font")->get("size"))
	               					   			 ->setColor( new PHPPowerPoint_Style_Color( $val->get("font")->get("color") ) );
	               					if ($val->get("font")->get("style") == "bold"){
	               						$t->getFont()->setBold(true);
	               					}else if ($val->get("font")->get("style") == "italic"){
	               						$t->getFont()->setItalic(true);
	               					}   			 
	               				}
							}
						}
					}else {
						$textShape->createTextRun($comment->get("value"));	
					}
					
				}
			}
		}
	}
	function save($namafile){
		$objWriter = PHPPowerPoint_IOFactory::createWriter($this->ppt, 'PowerPoint2007');
		$objWriter->save("./tmp/$namafile");	
	}
}
?>