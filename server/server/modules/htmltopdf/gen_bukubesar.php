<?
ob_start();
include "../include/conn.php";
$nama=$_SESSION['ses_nama_lokasi'];
$alamat=$_SESSION['ses_alamat']; 
$sql3=$_SESSION['ses_sql3'];

query_sql($sql3,$rs,$conn);
$tanggal=date("d/m/Y  H:m:s");
$periode=$_SESSION['ses_periode'];
$periode1=$_SESSION['ses_periode1'];
$periode2=$_SESSION['ses_periode2'];

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title><?=$title?></title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<?
if ($jenis_file=="txt")
{
?>
<link rel="stylesheet" href="../css/laporan.css" type="text/css" />

<?}?>


</head>

<body >
<div align="center">
<table width="721" border="0" cellspacing="2" cellpadding="1">
  <tr>
    <td colspan="2" class='judul_laporan'><div align="center">LAPORAN BUKU BESAR </div></td>
  </tr>
  <tr>
    <td width="444" class="lokasi_laporan"><?=$nama?></td>
    <td width="267" class="lokasi_laporan">&nbsp;</td>
  </tr>
  <tr>
    <td class="lokasi_laporan"><?=$alamat?></td>
    <td class="tanggal_laporan"><div align="right">Dicetak :
      <?=$tanggal?>
    </div></td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
</table>
<?
while ($row = $rs->FetchNextObject($toupper=false)) 
{ 
?>
<table width="75%" border="0" cellspacing="2" cellpadding="1">
  <tr>
    <td><table width="400" border="1" cellspacing="0" cellpadding="1" style="border-collapse: collapse" bordercolor="#111111">
      <tr>
        <td><table width="400" border="0" cellspacing="2" cellpadding="1">
            <tr>
              <td width="95" class="laporan_isi">Periode</td>
              <td width="395" class="laporan_isi"><?=$row->periode?>
              </td>
            </tr>
            <tr>
              <td class="laporan_isi">Kode Akun </td>
              <td class="laporan_isi"><?=$row->kode?>
              </td>
            </tr>
            <tr>
              <td class="laporan_isi">Nama Akun </td>
              <td class="laporan_isi"><?=$row->nama?>
              </td>
            </tr>
            <tr>
              <td class="laporan_isi">Lokasi </td>
              <td class="laporan_isi"><?=$row->kode_lokasi?>
                &nbsp;
                <?=$row->nama_lokasi?>
              </td>
            </tr>
        </table></td>
      </tr>
    </table></td>
  </tr>
  <tr>
    <td><table border="1" cellspacing="0" cellpadding="1" style="border-collapse: collapse" bordercolor="#111111">
      <tr bgcolor="#CCCCCC">
        <td width="74" height="23" class="laporan_isi">No Bukti</td>
        <td width="69" class="laporan_isi">Tanggal</td>
        <td width="233" class="laporan_isi">Keterangan</td>
        <td width="85" class="laporan_isi">PP/Proyek</td>
        <td width="80" class="laporan_isi"><div align="right">Debet</div></td>
        <td width="80" class="laporan_isi"><div align="right">Kredit</div></td>
        <td width="89" class="laporan_isi"><div align="right">Balance</div></td>
      </tr>
      <tr bgcolor="#CCCCCC">
        <td height="23" colspan="6" bgcolor="#FFFFFF" class="laporan_isi"><div align="right">Saldo Awal&nbsp; </div></td>
        <td bgcolor="#FFFFFF" class="laporan_isi"><div align="right" ><? echo number_format($row->so_awal,0,",",".")?></div></td>
      </tr>
      <?
	  $kode_lokasi=$row->kode_lokasi;
	  $kode_akun=$row->kode;
	  if ($periode1==$periode and $periode2==$periode)
	  {
	    $tabel="(select * from gldt ";
		$tabel.="where kode_lokasi='$kode_lokasi' and periode='$periode' and kode_akun='$kode_akun') ";
	  }
	  else
	  {
	
	    $tabel ="(select * from gldt_h ";
		$tabel.="where kode_lokasi='$kode_lokasi' and periode>='$periode1' and periode<='$periode2' and kode_akun='$kode_akun' ";
		$tabel.="union ";
		$tabel.="select * from gldt ";
		$tabel.="where kode_lokasi='$kode_lokasi' and periode='$periode' and kode_akun='$kode_akun') ";
	  } 
	  $sql="select a.no_bukti,a.tanggal,a.kode_akun,a.kode_pp,a.keterangan,case when a.dc='D' then nilai else 0 end as debet,case when a.dc='C' then nilai else 0 end as kredit from $tabel a ";
      $sql.="order by a.tanggal,a.no_bukti ";

	query_sql($sql,$rs1,$conn);
							$k=0;
							$saldo=$row->so_awal;
							$debet=0;
							$kredit=0;
							while ($row1 = $rs1->FetchNextObject($toupper=false)) 
						   {   $k++;	
							$saldo=$saldo + $row1->debet - $row1->kredit;	
							$debet=$debet+$row1->debet;
							$kredit=$kredit+$row1->kredit;	
					  ?>
      <tr>
        <td valign="top" class="laporan_isi"><?=$row1->no_bukti?>
        </td>
        <td height="20" valign="top" class="laporan_isi"><? echo $row1->tanggal?></td>
        <td valign="top" class="laporan_isi"><? echo ucwords(strtolower($row1->keterangan))?></td>
        <td valign="top" class="laporan_isi"><? echo $row1->kode_pp?></td>
        <td valign="top" class="laporan_isi"><div align="right" class="style3"><? echo number_format($row1->debet,0,",",".")?></div></td>
        <td valign="top" class="laporan_isi"><div align="right"><span class="style3"><? echo number_format($row1->kredit,0,",",".")?></span></div></td>
        <td valign="top" class="laporan_isi"><div align="right" class="style3"><? echo number_format($saldo,0,",",".")?></div></td>
      </tr>
      <?
							$i=$i+1;
							}
							
					?>
      <tr>
        <td height="20" colspan="4" valign="top" class="laporan_isi"><div align="right">Mutasi&nbsp;</div></td>
        <td valign="top" class="laporan_isi"><div align="right"><span class="style3"><? echo number_format($debet,0,",",".")?></span></div></td>
        <td valign="top" class="laporan_isi"><div align="right"><span class="style3"><? echo number_format($debet,0,",",".")?></span></div></td>
        <td valign="top" class="laporan_isi">&nbsp;</td>
      </tr>
      <tr>
        <td height="20" colspan="6" valign="top" class="laporan_isi"><div align="right">Saldo Akhir&nbsp; </div></td>
        <td valign="top" class="laporan_isi"><div align="right"><span class="style3"><? echo number_format($saldo,0,",",".")?></span></div></td>
      </tr>
    </table></td>
  </tr>
</table>
<br>
<?}?>
</div>
</body>
</html>
<?
// Output-Buffer in variable:
$html=ob_get_contents();
// delete Output-Buffer
ob_end_clean();
if ($jenis_file=="xls")
{
  $path=$dir_server."/upload/jurnal_";
  $nama_file_xls=$path.$_SESSION['user'].".xls";
  $fp = fopen($nama_file_xls, "w");
  fputs($fp,$html);
  fclose($fp);
}
else
{
  $path=$dir_server."/upload/jurnal_";
  $nama_file_txt=$path.$_SESSION['user'].".txt";
  $fp = fopen($nama_file_txt, "w");
  fputs($fp,$html);
  fclose($fp);
}
?>

