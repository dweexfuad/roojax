<?
ob_start();
session_start();
$jenis_file="pdf";
include "../generate/gen_bukubesar.php";
$handle  = fopen($nama_file_txt, "r");
$html = fread($handle , filesize($nama_file_txt));
fclose($handle);
ob_end_clean();
include "../pdf/html2fpdf.php"; 
$pdf = new HTML2FPDF('P','mm','A4');
$pdf->AddPage();
$pdf->SetAutoPageBreak(FALSE, 30);
$pdf->WriteHTML($html);
$pdf->Output();
unlink($nama_file_txt);

?>