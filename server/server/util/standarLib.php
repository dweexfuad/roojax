<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT  and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/

class server_util_standarLib
{		
    function __construct()
	{		
	}	
//----------------------------------------	
	function spasi($menu,$jum)
	{
		$dat="";;
		for ($i = 0; $i < $jum; $i++) 
		{
	  		$dat=$dat."&nbsp;&nbsp;&nbsp;&nbsp;";
	  	}
		if ($menu==".")
		  {$menu="";}
		return $dat.$menu;
	}
	
	function judul_laporan($judul,$lokasi,$filter)
	{
		$tanggal=date("d/m/Y  H:m:s");
		$judul=strtoupper ($judul);
		$lokasi=strtoupper($lokasi);
		$filter=ucwords(strtolower($filter)); 
		$tmp="<table border='0' cellspacing='0' cellpadding='0'>
  <tr>
    <td colspan='2' class='lokasi_laporan'><div align='center'>$lokasi</div></td>
  </tr>
  <tr>
    <td  class='lokasi_laporan'><div align='center'>$judul</div></td>
  </tr>
  <tr>
    <td class='lokasi_laporan'><div align='center'>$filter</div></td>
  </tr>
  <tr>
    <td class='tanggal_laporan'><div align='center'>Dicetak : ".$tanggal."</div></td>
  </tr>
</table>";
		return $tmp;
		
	}
	
	function ubah_periode($periode)
	{
	  $bulan=substr($periode,4,2);
	  $tahun=substr($periode,0,4);
	  switch ($bulan) 
	  {
	    case "01":
	      $tmp="Januari";
	      break;
		case "02":
		  $tmp="Februari";
	      break;
		case "03":
	      $tmp="Maret";
	      break;
		case "04":
	      $tmp="April";
	      break;
		case "05":
	      $tmp="Mei";
	      break;
		case "06":
	      $tmp="Juni";
	      break;
		case "07":
	      $tmp="Juli";
	      break;
		case "08":
	      $tmp="Agustus";
	      break;  
		case "09":
	      $tmp="September";
	      break;  
		case "10":
	      $tmp="Oktober";
	      break;  
		case "11":
	      $tmp="November";
	      break;  
		case "12":
	      $tmp="Desember";
	      break;  
		case "13":
	      $tmp="Desember 2";
	      break;    
	  }
	  return $tmp." ".$tahun;
	}
	
	function terbilang($bilangan) {

	  $angka = array('0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0');
	  $kata = array('','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan');
	  $tingkat = array('','ribu','juta','milyar','triliun');

	  $panjang_bilangan = strlen($bilangan);

	  /* pengujian panjang bilangan */
	  if ($panjang_bilangan > 15) {
	    $kalimat = "Diluar Batas";
	    return $kalimat;
	  }

	  /* mengambil angka-angka yang ada dalam bilangan,
	     dimasukkan ke dalam array */
	  for ($i = 1; $i <= $panjang_bilangan; $i++) {
	    $angka[$i] = substr($bilangan,-($i),1);
	  }

	  $i = 1;
	  $j = 0;
	  $kalimat = "";


	  /* mulai proses iterasi terhadap array angka */
	  while ($i <= $panjang_bilangan) {

	    $subkalimat = "";
	    $kata1 = "";
	    $kata2 = "";
	    $kata3 = "";

	    /* untuk ratusan */
	    if ($angka[$i+2] != "0") {
	      if ($angka[$i+2] == "1") {
	        $kata1 = "seratus";
	      } else {
	        $kata1 = $kata[$angka[$i+2]] . " ratus";
	      }
	    }

	    /* untuk puluhan atau belasan */
	    if ($angka[$i+1] != "0") {
	      if ($angka[$i+1] == "1") {
	        if ($angka[$i] == "0") {
	          $kata2 = "sepuluh";
	        } elseif ($angka[$i] == "1") {
	          $kata2 = "sebelas";
	        } else {
	          $kata2 = $kata[$angka[$i]] . " belas";
	        }
	      } else {
	        $kata2 = $kata[$angka[$i+1]] . " puluh";
	      }
	    }

	    /* untuk satuan */
	    if ($angka[$i] != "0") {
	      if ($angka[$i+1] != "1") {
	        $kata3 = $kata[$angka[$i]];
	      }
	    }

	    /* pengujian angka apakah tidak nol semua,
	       lalu ditambahkan tingkat */
	    if (($angka[$i] != "0") OR ($angka[$i+1] != "0") OR
	        ($angka[$i+2] != "0")) {
	      $subkalimat = "$kata1 $kata2 $kata3 " . $tingkat[$j] . " ";
	    }

	    /* gabungkan variabe sub kalimat (untuk satu blok 3 angka)
	       ke variabel kalimat */
	    $kalimat = $subkalimat . $kalimat;
	    $i = $i + 3;
	    $j = $j + 1;

	  }

	  /* mengganti satu ribu jadi seribu jika diperlukan */
	  if (($angka[5] == "0") AND ($angka[6] == "0")) {
	    $kalimat = str_replace("satu ribu","seribu",$kalimat);
	  }
	  $kalimat=$kalimat." rupiah";
	  return trim($kalimat);

	}

	
}

?>