<?php

class ExcelExport {

  //Class variables
  var $excel;
  var $columns;
  var $data;
  var $title;
  var $export_type;
  var $active_sheet;
  var $writer_type;
  var $writer;

  /**
  * put your comment there...
  *
  * @param mixed $key
  * @return ExcelExport
  */
  function __construct($export_type = '', $filename = '') {
    $this->excel = new PHPExcel();
    if($export_type == '') {
      $this->export_type = variable_get('default_export_type', 'xls');
    } else {
      $this->export_type = $export_type;
    }
    if($title == '') {
      $this->title = 'Report';
    } else {
      $this->title = $title;
    }
    if($this->export_type == 'xlsx') {
      header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      header('Content-Disposition: attachment;filename="'.$filename.'.xlsx"');
      header('Cache-Control: max-age=0');
      $this->writer_type = 'Excel2007';
    } else if ($this->export_type == 'pdf') {
      header('Content-Type: application/pdf');
      header('Content-Disposition: attachment;filename="'.$filename.'.pdf"');
      header('Cache-Control: max-age=0');
      $this->writer_type = 'PDF';
    } else {
      header('Content-Type: application/vnd.ms-excel');
      header('Content-Disposition: attachment;filename="'.$filename.'.xls"');
      header('Cache-Control: max-age=0');
      $this->writer_type = 'Excel5';
    }
    $this->writer = PHPExcel_IOFactory::createWriter($this->excel, $this->writer_type);
    $this->active_sheet = $this->excel->setActiveSheetIndex(0);
  }

  /**
  * This adds a worksheet that is of tabular data.
  *
  * @param mixed $columns
  * @param mixed $data
  * @param mixed $title
  * @param mixed $styled
  * @param mixed $sheet
  */
  function add_table($columns = NULL, $data = NULL, $title = '', $styled = true, $sheet = 0) {
    //Create a new sheet
    $this->create_new_sheet($sheet, $title);

    $col = 0;
    $row = 1;
    //This adds a title row to the worksheet
    if($styled) {
      $letters = range('A', 'Z');
      $this->active_sheet->setCellValueByColumnAndRow($col, $row, $title);
      //The 'cells_to_merge' variable looks something like 'A1:J1' as you would see in Excel
      $cells_to_merge = $letters[0].$row.':'.$letters[count($columns)-1].$row;
      $this->active_sheet->mergeCells($cells_to_merge);
      $style_array = array(
        'font' => array('bold' => true),
        'alignment' => array('horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER)
      );
      $this->active_sheet->getStyleByColumnAndRow($col, $row)->applyFromArray($style_array);
      $row++;
    }

    $col = 0;
    //This adds the header
    foreach($columns as $column) {
      if($styled) {
        $this->active_sheet->setCellValueByColumnAndRow($col, $row, $column);
        $style_array = array(
          'font' => array('bold' => true),
          'alignment' => array('horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER)
        );
        $this->active_sheet->getStyleByColumnAndRow($col, $row)->applyFromArray($style_array);
        $this->active_sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
      } else {
        $this->active_sheet->setCellValueByColumnAndRow($col, $row, $column);
      }
      $col++;
    }

    $col = 0;
    $row++;
    //This adds the data
    foreach($data as $rows) {
      foreach($rows as $column) {
        $this->active_sheet->setCellValueByColumnAndRow($col, $row, $column);
        $col++;
      }
      $col = 0;
      $row++;
    }
  }

  /**
  * This adds a worksheet that contains an image
  *
  * @param mixed $title
  * @param mixed $image_name
  * @param mixed $image_description
  * @param mixed $image_location
  * @param mixed $image_coordinates
  * @param mixed $sheet
  */
  function add_image($title = '', $image_name = '', $image_description = '', $image_location = '', $image_coordinates = 'A1', $sheet = 0) {
    //Create a new sheet
    $this->create_new_sheet($sheet, $title);

    $image = new PHPExcel_Worksheet_Drawing();
    $image->setName($image_name);
    $image->setDescription($image_description);
    $image->setPath($image_location);
    $image->setCoordinates($image_coordinates);
    $image->setWorksheet($this->active_sheet);
  }

  /**
  * This function starts the export that pushes the data to the user as a download
  *
  */
  function download() {
    $this->active_sheet = $this->excel->setActiveSheetIndex(0);
    if($this->export_type == 'pdf') {
      $this->active_sheet->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
      $this->active_sheet->getPageSetup()->setFitToWidth(1);
      $this->active_sheet->getPageSetup()->setFitToHeight(1);
      $this->writer->writeAllSheets();
    }
    $this->writer->save('php://output');
    exit;
  }

  /**
  * By default, a workbook has a single worksheet, to which we can append more worksheets.
  * To dynamically add worksheets, we need to keep track of how many worksheets we have, and
  * make sure that we make the lastest addition, the active worksheet.
  */
  function create_new_sheet($sheet, $title) {
    if($this->excel->getSheetCount()-1 < $sheet) {
      $this->excel->createSheet($sheet);
    }
    $this->active_sheet = $this->excel->setActiveSheetIndex($sheet);
    $this->active_sheet->setTitle($title);
  }

  /**
  * Default destruct function
  *
  */
  function __destruct() {

  }
}
?>
