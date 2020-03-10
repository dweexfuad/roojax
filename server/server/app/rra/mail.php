<?php
/***********************************************************************************************
*	Copyright (c) 2008 SAI
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_ShareObject");
uses("server_util_Map");
uses("server_util_arrayList");
uses("server_util_mail");
uses("server_util_AddOnLib");
class server_app_rra_mail  extends server_util_mail
{	
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
	
	
	function sendPDRK($from = null, $to, $subject, $text, $pdrk, $attach = null){	
		$css = $this->getCSS("server_util_laporan");
		$body = $css;
		
		$pdrk1 = $this->getPDRK1($pdrk);
		$pdrk2 = $this->getPDRK2($pdrk);
		$pdrk3 = $this->getPDRK3($pdrk);
		
		$body .= "<body > 
					$text
					<table border=1 class='kotak'>
					<tr> <td><b>PDRK 1</b> </td></tr>
					<tr> <td> $pdrk1 </td></tr>
					<tr> <td><b>Justifikasi</b> </td></tr>
					<tr> <td> $pdrk2 </td></tr>
					<tr> <td><b>PDRK 3</b> </td></tr>
					<tr> <td> $pdrk3 </td></tr>
					</table>
				</body>";
		error_log($from);
		error_log($to);
		error_log($body);
		return $this->sendMail($from, $to, $subject, $body, $attach);
		
	}
	function getCSS($path){
		global $dirSeparator;
		$realPath = str_replace("_", $dirSeparator, $path) . ".css";
		uses("server_util_File");
		$tmp = new server_util_File($realPath);
		if ($tmp->isFile())
		{
			$ctns = $tmp->getContents();
			return ($ctns);
		}	
		return "";
	}
	function getPDRK1($pdrk)
	{
		$dbLib = $this->dbLib;				
		$dbLib->connect();
		$dbdriver = $dbLib->connection->dbDriver;
		$filter = "where a.no_pdrk = '$pdrk'";
		$sql="select a.no_pdrk,a.tanggal,a.jenis_agg,b.nama as nama_ubis,c.nama as nama_gubis,
				   to_char(a.tanggal,'DD') as tgl, to_char(a.tanggal,'MM') as bulan,to_char(a.tanggal,'YYYY') as tahun,
				  nvl(f.nik_app1, nvl(e.nik_app1,a.nik_app1)) as nik_app1,y.nama as nama_app1, y.jabatan as jabatan1,
				   nvl(f.nik_app2, nvl(e.nik_app2,a.nik_app2)) as nik_app2,x.nama as nama_app2, x.jabatan as jabatan2,				   
				   nvl(f.nik_app3, nvl(e.nik_app3,a.nik_app3)) as nik_app3,z.nama as nama_app3, z.jabatan as jabatan3,				   
				   g.nama as kota
			from rra_pdrk_m a
			left outer join rra_rev_m e on e.no_pdrk = a.no_pdrk and e.kode_lokasi  = a.kode_lokasi 
			left outer join rra_grev_m f on f.no_pdrk = a.no_pdrk and f.kode_lokasi  = a.kode_lokasi 
			left outer join rra_kota g on g.kode_kota = a.kode_kota
			left outer join rra_ubis b on a.kode_ubis=b.kode_ubis and a.kode_lokasi=b.kode_lokasi
			left outer join rra_gubis c on a.kode_gubis=c.kode_gubis and a.kode_lokasi=c.kode_lokasi 
			left outer join rra_karyawan y on nvl(f.nik_app1, nvl(e.nik_app1,a.nik_app1))= y.nik and a.kode_lokasi=y.kode_lokasi
			left outer join rra_karyawan x on nvl(f.nik_app2, nvl(e.nik_app2,a.nik_app2))= x.nik and a.kode_lokasi=x.kode_lokasi
			left outer join rra_karyawan z on nvl(f.nik_app3, nvl(e.nik_app3,a.nik_app3))= z.nik and a.kode_lokasi=z.kode_lokasi
			$filter order by a.no_pdrk   ";		
				
		$rs=$dbLib->execute($sql);	
		
		$i = 1;
		$jum=$rs->recordcount();
		$html = "<div align='center'>"; 
		$AddOnLib=new server_util_AddOnLib();		
		while ($row = $rs->FetchNextObject($toupper=false))
		{
			
			$sql2 ="select a.no_pdrk,a.tanggal,a.jenis_agg,b.nama as nama_ubis,c.nama as nama_gubis,
						g.kode_cc,g.nama_cc,g.kode_akun,g.nama_akun,g.kode_ba,g.target,g.nilai as nilai_penerima					   
						,g.kode_drk, g.nmdrk 
				from rra_pdrk_m a
				left outer join rra_ubis b on a.kode_ubis=b.kode_ubis and a.kode_lokasi=b.kode_lokasi
				left outer join rra_gubis c on a.kode_gubis=c.kode_gubis and a.kode_lokasi=c.kode_lokasi 
				left outer join rra_karyawan d on a.nik_app1=d.nik and a.kode_lokasi=d.kode_lokasi
				left outer join rra_karyawan e on a.nik_app2=e.nik and a.kode_lokasi=e.kode_lokasi
				left outer join rra_karyawan f on a.nik_app3=f.nik and a.kode_lokasi=f.kode_lokasi
				left join (select distinct x.no_bukti as no_pdrk,x.periode, x.kode_lokasi,x.kode_akun,x.kode_cc,x.kode_drk, w.nama as nmdrk,y.kode_ba,y.nama as nama_cc,z.nama as nama_akun,x.target,x.nilai
							, nilai_gar, saldo, nilai_pakai
						   from rra_anggaran x
						   inner join rra_cc y on x.kode_cc=y.kode_cc and x.kode_lokasi=y.kode_lokasi
						   inner join rra_masakun z on x.kode_akun=z.kode_akun and x.kode_lokasi=z.kode_lokasi						   
						   left outer join rra_drk w on w.kode_drk = x.kode_drk and w.kode_lokasi = x.kode_lokasi
							where dc='D' 
					   )g on a.no_pdrk=g.no_pdrk and a.kode_lokasi=g.kode_lokasi
				left join (select no_bukti as no_pdrk,kode_lokasi,sum(nilai) as nilai_usulan
						   from rra_anggaran
					   where dc='D'
						   group by no_bukti,kode_lokasi
					  )i on a.no_pdrk=i.no_pdrk and a.kode_lokasi=i.kode_lokasi
				where a.no_pdrk = '$row->no_pdrk'  ";		
			//donor	
			$sql3 ="select a.no_pdrk,a.tanggal,a.jenis_agg,b.nama as nama_ubis,c.nama as nama_gubis,
						h.kode_cc2,h.nama_cc2,h.kode_akun2,h.nama_akun2,h.kode_ba2,h.nilai as nilai_donor,
						h.kode_drk2, h.nmdrk2,
					   isnull(h.nilai_gar,0) as nilai_gar,
					   isnull(h.saldo,0) as saldo,
					   isnull(h.nilai_pakai,0) as nilai_pakai,
					   isnull(h.nilai,0) as nilai_real
				from rra_pdrk_m a
				left outer join rra_ubis b on a.kode_ubis=b.kode_ubis and a.kode_lokasi=b.kode_lokasi
				left outer join rra_gubis c on a.kode_gubis=c.kode_gubis and a.kode_lokasi=c.kode_lokasi 
				left outer join rra_karyawan d on a.nik_app1=d.nik and a.kode_lokasi=d.kode_lokasi
				left outer join rra_karyawan e on a.nik_app2=e.nik and a.kode_lokasi=e.kode_lokasi
				left outer join rra_karyawan f on a.nik_app3=f.nik and a.kode_lokasi=f.kode_lokasi
				left join (select distinct no_bukti as no_pdrk, x.kode_lokasi,x.kode_akun as kode_akun2,x.kode_drk as kode_drk2, w.nama as nmdrk2,x.kode_cc as kode_cc2,y.kode_ba as kode_ba2,y.nama as nama_cc2,z.nama as nama_akun2, 
							sum(x.nilai) as nilai
							, 0 as nilai_gar, 0 as saldo, nilai_pakai
						   from rra_anggaran x
						   inner join rra_cc y on x.kode_cc=y.kode_cc and x.kode_lokasi=y.kode_lokasi
						   inner join rra_masakun z on x.kode_akun=z.kode_akun and x.kode_lokasi=z.kode_lokasi
						   left outer join rra_drk w on w.kode_drk = x.kode_drk and w.kode_lokasi = x.kode_lokasi
						   where dc='C'
					   group by no_bukti, x.kode_lokasi, x.kode_akun, x.kode_drk, w.nama, x.kode_cc, y.kode_ba, y.nama, z.nama, x.nilai_pakai)h on a.no_pdrk=h.no_pdrk and a.kode_lokasi=h.kode_lokasi			
				where a.no_pdrk = '$row->no_pdrk' ";	
			
						  	
				$hari=$AddOnLib->ubahNamaHari($row->hari);
				$bulan=$AddOnLib->ubah_bulan($row->bulan);
				$nilai_usulan=number_format($row->nilai_usulan,0,',','.');
				//$nilai_real=number_format($row->nilai_real,0,',','.');
				//$sisa=number_format($row->sisa,0,',','.');
				//$sisa_agg=number_format($row->sisa_agg,0,',','.');
				$html .= "<table width='800'  border='0' cellpadding='0' cellspacing='0'>
			  <tr>
				<td><table width='100%'  border='0'>
				  <tr>
					<td align='center'>PERUBAHAN DAFTAR RENCANA KEGIATAN </td>
				  </tr>
				  <tr>
					<td align='center'>RESCHEDULING / REDISTRIBUSI / REALOKASI / ABT </td>
				  </tr>
				  <tr>
					<td align='center'>".strtoupper($row->jenis_agg)." </td>
				  </tr>
				  <tr>
					<td align='center'>&nbsp;</td>
				  </tr>
				</table></td>
			  </tr>
			  <tr>
				<td><table width='100%'  border='0'>
				  <tr>
					<td width='28%'>Penanggung Jawab Program </td>
					<td width='72%'>: $row->nama_ubis </td>
				  </tr>
				  <tr>
					<td>Direktorat</td>
					<td>: $row->nama_gubis </td>
				  </tr>
				  <tr>
					<td>Nomor PDRK</td>
					<td>: $row->no_pdrk </td>
				  </tr>
				  <tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
				  </tr>
				</table></td>
			  </tr>
			  <tr>
				<td><table width='100%'  border='0'>
				  <tr>
					<td width='3%'>I</td>
					<td colspan='3'>IDENTITAS PROGRAM (YANG DIUSULKAN REVISI) REVISI / SUPLISI </td>
					</tr>
				  <tr>
					<td>&nbsp;</td>
					<td colspan='3'>
				<table width='100%' border='1' class='kotak'><tr>
					<td width='100' align='center'>Cost Center</td>				
					<td align='center'>WBS</td>
					<td align='center'>Nomor/Nama Akun</td>				
					<td width='150' align='center'>Target Selesai</td>
					<td width='100' align='center'>Nilai Yang Diusulkan</td>
				</tr>
				<tr>
					<td align='center'>1</td>
					<td align='center'>2</td>
					<td align='center'>3</td>
					<td align='center'>4</td>
					<td align='center'>5</td>				
				</tr>";
				$rs2 = $dbLib->execute($sql2);			
				$jum = $rs2->recordcount();
				while ($row2 = $rs2->FetchNextObject($toupper=false))
				{	
					$html .= "<tr>					
						<td>$row2->kode_cc</td>					
						<td>$row2->kode_drk - $row2->nmdrk</td>					
						<td>$row2->kode_akun - $row2->nama_akun</td>					
						<td>$row2->target</td>
						<td align='right'>".number_format( $row2->nilai_penerima,0,',','.')."</td>
					</tr>";		
				}			
				
			$html  .= "</table></td>        
		  </tr>
		  
		  <tr>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		  </tr>
		  <tr>
			<td>II</td>
			<td colspan='3'>USULAN PROGRAM / ANGGARAN YANG DIALIHKAN </td>
			</tr>
		  <tr>
			<td>&nbsp;</td>
			<td colspan='3'>
				<table width='100%' border='1' class='kotak'><tr>
					<td align='center'>Cost Center</td>				
					<td align='center'>WBS</td>				
					<td align='center'>Nomor / Nama Akun</td>				
					<td align='center'>Jumlah Anggaran</td>
					<td align='center'>Realisasi</td>
					<td align='center'>Sisa Anggaran</td>
					<td align='center'>RRR / ABT</td>
					<td align='center'>Sisa Anggaran</td>				
				</tr>
				<tr>
					<td align='center'>1</td>
					<td align='center'>2</td>
					<td align='center'>3</td>
					<td align='center'>4</td>
					<td align='center'>5</td>
					<td align='center'>6 = 4 - 5</td>
					<td align='center'>7</td>
					<td align='center'>8 = 6 - 7</td>		
				</tr>";
				$rs2 = $dbLib->execute($sql3);			
				$sql4 = "select a.kode_cc,a.kode_akun,isnull(a.kode_drk,'-') as kode_drk, a.kode_lokasi, 
							case  when a.versi = '000' or a.versi = '0'  then 'P' when a.versi = '7' or a.versi = '007' then 'C' else 
							case when '".$row->jenis_agg."' = 'OPEX' then 'K' else a.versi end end as jenis, 
									  sum(a.nilai) as total 
							   from (select a.* from rra_pdrk_orgi a left outer join rra_rev_m b on b.no_pdrk = a.no_pdrk  and b.kode_lokasi = a.kode_lokasi where b.no_rev is null and a.no_pdrk = '$row->no_pdrk'  
											union
								select a.* from rra_rev_orgi a left outer join rra_grev_m b on b.no_rev = a.no_rev and b.no_pdrk = a.no_pdrk and b.kode_lokasi = a.kode_lokasi   where b.no_grev is null and a.no_pdrk = '$row->no_pdrk' 
								union 
								select a.* from rra_grev_orgi a left outer join rra_mrev_m b on b.no_grev = a.no_grev and b.no_pdrk = a.no_pdrk and b.kode_lokasi = a.kode_lokasi  where b.no_mrev is null and a.no_pdrk = '$row->no_pdrk'
								union 
								select * from rra_mrev_orgi where no_pdrk = '$row->no_pdrk' 
							   ) a
							   group by a.versi, a.kode_cc,a.kode_akun,a.kode_drk, a.kode_lokasi ";
				
				while ($row2 = $rs2->FetchNextObject($toupper=false))
				{	
					$rs3 = $dbLib->execute("select * from (".$sql4.") a where kode_cc = '".$row2->kode_cc2."' 
										and kode_drk = '".$row2->kode_drk2."' and kode_akun = '".$row2->kode_akun2."' and jenis = 'K' ");
					
					$nilai_gar = 0;
					while ($row3 = $rs3->FetchNextObject($toupper=false))
					{	
						$nilai_gar = $row3->total;
					}
					$html  .= "<tr>
						<td width='100'>$row2->kode_cc2</td>
						<td>$row2->kode_drk2 - $row2->nmdrk2</td>															
						<td>$row2->kode_akun2 - $row2->nama_akun2</td>					
						<td width='100' align='right'>".number_format( $nilai_gar,0,',','.')."</td>
						<td width='100' align='right'>".number_format( $row2->nilai_pakai,0,',','.')."</td>
						<td width='100' align='right'>".number_format( $nilai_gar - $row2->nilai_pakai,0,',','.')."</td>
						<td width='100' align='right'>".number_format( $row2->nilai_donor,0,',','.')."</td>
						<td width='100' align='right'>".number_format( $nilai_gar - $row2->nilai_pakai - $row2->nilai_donor,0,',','.' )."</td>
					</tr>";		
				}			
						
					$html  .= "</table></td>        
				  </tr> 
				  <tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
				  </tr>
				  <tr>
					<td>III</td>
					<td colspan='3'>JUSTIFIKASI TERLAMPIR </td>
					</tr>
				  <tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
				  </tr>
				</table></td>
			  </tr>
			  <tr>
				<td><table width='100%'  border='0' cellpadding='0' cellspacing='0'>
				  <tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>$row->kota, $row->tgl $bulan $row->tahun </td>
				  </tr>
				  <tr>
					<td width='28%'>&nbsp;</td>
					<td width='35%'>&nbsp;</td>
					<td width='37%'>&nbsp;</td>
				  </tr>
				  <tr>
					<td align='center'>Mengetahui / Menyetujui</td>
					<td>&nbsp;</td>
					<td align='center'>Penanggung Jawab Program </td>
				  </tr>
				  <tr>
					<td align='center'>$row->jabatan2</td>
					<td>&nbsp;</td>
					<td align='center'>$row->jabatan1</td>
				  </tr>
				  <tr>
					<td height='70' align='center' valign='bottom'>$row->nama_app2</td>
					<td>&nbsp;</td>
					<td align='center' valign='bottom'>$row->nama_app1</td>
				  </tr>
				  <tr>
					<td align='center'>NIK : $row->nik_app2</td>
					<td>&nbsp;</td>
					<td align='center'>NIK : $row->nik_app1</td>
				  </tr>
				  <tr>
					<td>&nbsp;</td>
					<td align='center'>Menyetujui dan Menetapkan </td>
					<td>&nbsp;</td>
				  </tr>
				  <tr>
					<td>&nbsp;</td>
					<td align='center'>$row->jabatan3</td>
					<td>&nbsp;</td>
				  </tr>
				  <tr>
					<td height='70'>&nbsp;</td>
					<td align='center' valign='bottom'>$row->nama_app3</td>
					<td>&nbsp;</td>
				  </tr>
				  <tr>
					<td>&nbsp;</td>
					<td align='center'>NIK : $row->nik_app3</td>
					<td>&nbsp;</td>
				  </tr>
				</table></td>
			  </tr>
			</table>
			";
		 
			$i=$i+1;
		}
		$html  .= "</div>";
			
		return $html;
	}
	function getPDRK2($pdrk){		
		$dbLib = $this->dbLib;								
		$filter = "where a.no_pdrk = '$pdrk'";
		$sql="select a.no_pdrk,a.tanggal,a.jenis_agg,b.nama as nama_ubis,c.nama as nama_gubis, a.keterangan, 
			   to_char(a.tanggal,'DD') as tgl,to_char(a.tanggal,'MM') as bulan,to_char(a.tanggal,'YYYY') as tahun,
			   nvl(f.nik_appjust, nvl(e.nik_appjust,a.nik_appjust)) as nik_app2,x.nama as nama_app2, x.jabatan as jabatan2,
			   nvl(f.nik_appjust2, nvl(e.nik_appjust2,a.nik_appjust2)) as nik_app1,z.nama as nama_app1,z.jabatan as jabatan1,
			   nvl(f.nik_app3, nvl(e.nik_app3,a.nik_app3)) as nik_app3,y.nama as nama_app3,y.jabatan as jabatan3,
			   g.kode_cc,g.nama_cc,g.kode_akun,g.nama_akun,g.kode_ba,g.target, g.kode_drk, g.nmdrk,
			   h.kode_cc2,h.nama_cc2,h.kode_akun2,h.nama_akun2,h.kode_ba2, h.kode_drk2, h.nmdrk2, 
			   isnull(i.nilai_usulan,0) as nilai_usulan,isnull(j.nilai_gar,0) as nilai_gar,
			   isnull(j.saldo,0) as saldo,isnull(j.nilai_pakai,0) as nilai_pakai,isnull(j.nilai,0) as nilai_real,
			   isnull(ff.justifikasi, isnull(f.justifikasi, isnull(e.justifikasi,a.justifikasi))) as justifikasi, isnull(e.sts_pdrk, a.sts_pdrk) as sts_pdrk, l.nama as kota
		from rra_pdrk_m a			
		inner join rra_ubis b on a.kode_ubis=b.kode_ubis and a.kode_lokasi=b.kode_lokasi
		inner join rra_gubis c on a.kode_gubis=c.kode_gubis and a.kode_lokasi=c.kode_lokasi 
		left outer join rra_rev_m e on e.no_pdrk = a.no_pdrk and e.kode_lokasi  = a.kode_lokasi 
		left outer join rra_grev_m f on f.no_pdrk = a.no_pdrk and f.kode_lokasi  = a.kode_lokasi 
		left outer join rra_frev_m ff on ff.no_pdrk = a.no_pdrk and ff.kode_lokasi  = a.kode_lokasi 
		left outer join rra_karyawan x on nvl(f.nik_appjust, nvl(e.nik_appjust,a.nik_appjust))= x.nik and a.kode_lokasi=x.kode_lokasi
		left outer join rra_karyawan z on nvl(f.nik_appjust2, nvl(e.nik_appjust2,a.nik_appjust2))= z.nik and a.kode_lokasi=z.kode_lokasi
		left outer join rra_karyawan y on nvl(f.nik_app3, nvl(e.nik_app3,a.nik_app3))= y.nik and a.kode_lokasi=y.kode_lokasi
		left outer join rra_Kota l on l.kode_kota = a.kode_kota 			
		left join (select distinct x.no_bukti as no_pdrk,x.kode_lokasi,x.kode_akun,x.kode_drk, w.nama as nmdrk, x.kode_cc,y.kode_ba,y.nama as nama_cc,z.nama as nama_akun,x.target
				   from rra_anggaran x
				   inner join rra_cc y on x.kode_cc=y.kode_cc and x.kode_lokasi=y.kode_lokasi
				   inner join rra_masakun z on x.kode_akun=z.kode_akun and x.kode_lokasi=z.kode_lokasi
				   left outer join rra_drk w on w.kode_drk = x.kode_drk and w.kode_lokasi = x.kode_lokasi
					where dc='D'
			   )g on a.no_pdrk=g.no_pdrk and a.kode_lokasi=g.kode_lokasi
		left join (select distinct x.no_bukti as no_pdrk,x.kode_lokasi,x.kode_akun as kode_akun2,x.kode_drk as kode_drk2, w.nama as nmdrk2,x.kode_cc as kode_cc2,y.kode_ba as kode_ba2,y.nama as nama_cc2,z.nama as nama_akun2
				   from rra_anggaran x
				   inner join rra_cc y on x.kode_cc=y.kode_cc and x.kode_lokasi=y.kode_lokasi
				   inner join rra_masakun z on x.kode_akun=z.kode_akun and x.kode_lokasi=z.kode_lokasi
				   left outer join rra_drk w on w.kode_drk = x.kode_drk and w.kode_lokasi = x.kode_lokasi
				   where dc='C'
			   )h on a.no_pdrk=h.no_pdrk and a.kode_lokasi=h.kode_lokasi
		left join (select no_bukti as no_pdrk,kode_lokasi,sum(nilai) as nilai_usulan
				   from rra_anggaran
			   where dc='D'
				   group by no_bukti,kode_lokasi
			  )i on a.no_pdrk=i.no_pdrk and a.kode_lokasi=i.kode_lokasi
		left join (select no_bukti as no_pdrk,kode_lokasi,
						  sum(nilai_gar) as nilai_gar,sum(saldo) as saldo,sum(nilai_pakai) as nilai_pakai,sum(nilai) as nilai
				   from rra_anggaran
			   where dc='C'
				   group by no_bukti,kode_lokasi
			  )j on a.no_pdrk=j.no_pdrk and a.kode_lokasi=j.kode_lokasi	 $filter order by a.no_pdrk  ";				
		$rs=$dbLib->execute($sql);	
		
		$i = 1;
		$jum=$rs->recordcount();
		$html = "<div align='center'>"; 
		$AddOnLib=new server_util_AddOnLib();
		while ($row = $rs->FetchNextObject($toupper=false))
		{
			$hari=$AddOnLib->ubahNamaHari($row->hari);
			$bulan=$AddOnLib->ubah_bulan($row->bulan);
			$nilai_usulan=number_format($row->nilai_usulan,0,',','.');
			$html .= "<table width='700' border='0' cellspacing='2' cellpadding='1'>
			  <tr>
				<td align='center'><bold>JUSTIFIKASI </bold></td>
			  </tr>
			  <tr>
				<td align='center'><bold>".strtoupper($row->sts_pdrk == "RRR" ? "RESCHEDULLING/REDISTRIBUSI/REALOKASI":$row->sts_pdrk)." </bold></td>
			  </tr>
			  <tr>
				<td align='center'><bold>".strtoupper($row->jenis_agg)."</bold></td>
			  </tr>
			  <tr>
				<td>&nbsp;</td>
			  </tr>
			  <tr>
				<td><hr><table width='100%'  border='0' cellspacing='2' cellpadding='1'>
				  <tr>
					<td width='5%' align='center'><bold>1.</bold></td>
					<td width='30%'><bold>Nama Kegiatan</bold> </td>
					<td width='65%'><bold>: $row->keterangan</bold>  </td>
				  </tr>
				  <tr>
					<td align='center'><bold>2.</bold></td>
					<td><bold>Nomor DRK</bold> </td>
					<td><bold>:$row->kode_drk</bold></td>
				  </tr>
				  <tr>
					<td align='center'><bold>3.</bold></td>
					<td><bold>Unit Kerja</bold> </td>
					<td>: $row->nama_cc</td>
				  </tr>
				  <tr>
					<td align='center'><bold>4.</bold></td>
					<td><bold>Total Nilai</bold> </td>
					<td>: $nilai_usulan </td>
				  </tr>
				  <tr>
					<td align='center'><bold>5.</bold></td>
					<td><bold>Nomor Cost Center </bold></td>
					<td>: " . ($row->jenis_agg == "CAPEX" ? "":$row->kode_cc). " </td>
				  </tr>
				  <tr>
					<td align='center'><bold>6.</bold></td>
					<td><bold>Nama Cost Center</bold> </td>
					<td>: " . ($row->jenis_agg == "CAPEX" ? "":$row->nama_cc). " </td>
				  </tr>
				  <tr>
					<td align='center'><bold>7</bold></td>
					<td><bold>Actifity Type</bold> </td>
					<td>:  </td>
				  </tr>
				  <tr>
					<td align='center'><bold>8.</bold></td>
					<td><bold>Kode Fund Center</bold> </td>
					<td>: " . ($row->jenis_agg == "CAPEX" ? $row->kode_cc:""). " </td>
				  </tr>
				  <tr>
					<td align='center'><bold>9.</bold></td>
					<td><bold>Nomor Akun</bold></td>
					<td>: $row->kode_akun </td>
				  </tr>
				  <tr>
					<td align='center'><bold>10.</bold></td>
					<td><bold>Nama Akun </bold></td>
					<td>: $row->nama_akun </td>
				  </tr>
				  <tr>
					<td align='center'><bold>11.</bold></td>
					<td><bold>Saat Penggunaaan </bold></td>
					<td>: $row->target </td>
				  </tr>
				</table><hr></td>
			  </tr>
			  <tr>
				<td>&nbsp;</td>
			  </tr>
			  <tr>
				<td>".urldecode($row->justifikasi)."</td>
			  </tr>
			  <tr>
				<td>&nbsp;</td>
			  </tr>
			  <tr>
				<td><table width='100%'  border='0' cellspacing='2' cellpadding='1'>
				  <tr>
					<td>&nbsp;</td>
					<td align='center'>$row->kota, $row->tgl $bulan $row->tahun </td>
				  </tr>
				  <tr align='center'>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
				  </tr>
				  <tr align='center'>
					<td>Mengetahui / Menyetujui </td>
					<td>Penanggung Jawab Program </td>
				  </tr>
				  <tr align='center'>
					<td>$row->jabatan1 </td>
					<td>$row->jabatan2 </td>
				  </tr>
				  <tr align='center'>
					<td height='60'>&nbsp;</td>
					<td>&nbsp;</td>
				  </tr>
				  <tr align='center'>
					<td>$row->nama_app1</td>
					<td>$row->nama_app2</td>
				  </tr>
				  <tr align='center'>
					<td>NIK : $row->nik_app1</td>
					<td>NIK : $row->nik_app2</td>
				  </tr>";
				if ($row->sts_pdrk == "OPN"){
					$html .= "<tr align='center'>
					<td colspan=2>Menyetujui </td>        
				  </tr>
				  <tr align='center'>
					<td colspan=2>$row->jabatan3 </td>        
				  </tr>
				  <tr align='center'>
					<td colspan=2 height='60'>&nbsp;</td>        
				  </tr>
				  <tr align='center'>
					<td colspan=2>$row->nama_app3</td>        
				  </tr>
				  <tr align='center'>
					<td colspan=2>NIK : $row->nik_app3</td>        
				  </tr>";
				}
				$html .= "</table></td>
					  </tr>
					</table>";
		 
			$i=$i+1;
		}
		$html .= "</div>";
			
		return $html ;
	}
	function getPDRK3($pdrk){
		$dbLib = $this->dbLib;
		$hdrRRR1 = "";
		$hdrRRR2 = "";
		$hdrRRR3 = "";
		$hdrOpn1 = "PLAN BUDGET";
		$hdrOpn2 = "RELEASE BUDGET";
		$hdrOpn3 = "PERMINTAAN";
		
		$sql="select a.no_pdrk,a.kode_ubis,b.nama as nama_ubis,c.nama as nama_gubis,
				   to_char(a.tanggal,'DD') as tgl,to_char(a.tanggal,'MM') as bulan,to_char(a.tanggal,'YYYY') as tahun,
				   nvl(f.nik_apppdrk3, nvl(e.nik_apppdrk3,a.nik_apppdrk3)) as nik_app1,d.nama as nama_app1, d.jabatan,
				   g.nama as kota, a.jenis_agg, a.sts_pdrk
			from rra_pdrk_m a
			left outer join rra_rev_m e on e.no_pdrk = a.no_pdrk and e.kode_lokasi  = a.kode_lokasi 
			left outer join rra_grev_m f on f.no_pdrk = a.no_pdrk and f.kode_lokasi  = a.kode_lokasi 
			left outer join rra_ubis b on a.kode_ubis=b.kode_ubis and a.kode_lokasi=b.kode_lokasi
			left outer join rra_gubis c on a.kode_gubis=c.kode_gubis and a.kode_lokasi=c.kode_lokasi 
			left outer join rra_kota g on g.kode_kota = a.kode_kota
			left outer join rra_karyawan d on nvl(f.nik_apppdrk3, nvl(e.nik_apppdrk3,a.nik_apppdrk3))=d.nik and a.kode_lokasi=d.kode_lokasi
			$this->filter order by a.no_pdrk ";				
		$rs=$dbLib->execute($sql);	
				
		$i = 1;
		$jum=$rs->recordcount();
		//echo "<div align='center'>"; 
		$html = "";
		$AddOnLib=new server_util_AddOnLib();
		while ($row = $rs->FetchNextObject($toupper=false))
		{
			
			$hari=$AddOnLib->ubahNamaHari($row->hari);
			$bulan=$AddOnLib->ubah_bulan($row->bulan);
			$nilai_usulan=number_format($row->nilai_usulan,0,',','.');
			//$nilai_real=number_format($row->nilai_real,0,',','.');
			//$sisa=number_format($row->sisa,0,',','.');
			//$sisa_agg=number_format($row->sisa_agg,0,',','.');
			$html .= "<table width='2000' border='0' cellspacing='2' cellpadding='1'>
				  <tr>
					<td align='center'>PERMINTAAN RELEASE / DESKRIPSI ANGGARAN $row->jenis_agg </td>
				  </tr>
				  <tr>
					<td>&nbsp;</td>
				  </tr>
				  <tr>
					<td><table  border='0' cellspacing='2' cellpadding='1'>
					  <tr>
						<td width='10%' class='header_laporan'>Unit Kerja </td>
						<td width='90%' class='header_laporan'>: $row->kode_ubis - $row->nama_ubis </td>
					  </tr>
					  <tr>
						<td class='header_laporan'>Nomor PDRK </td>
						<td class='header_laporan'>: $row->no_pdrk </td>
					  </tr>
					</table></td>
				  </tr>
				 
				  <tr>
					<td><table  border='1' cellspacing='0' cellpadding='0' class='kotak'>
					  <tr>
						<td width='40' rowspan='2' align='center' class='header_laporan'>No</td>
						<td width='70' rowspan='2' align='center' class='header_laporan'>Cost Center</td>
						<td width='70' rowspan='2' align='center' class='header_laporan'>Nomor Akun </td>
						<td width='300' rowspan='2' align='center' class='header_laporan'>Nama Akun</td>
						<td colspan='12' align='center' class='header_laporan'>".($row->sts_pdrk == "OPN" || $row->sts_pdrk == "STB" ? $hdrOpn1 :"Sebelum Resheduling / Redistribusi / Realokasi / ABT *)")."</td>
						<td width='100' rowspan='2' align='center' class='header_laporan'>Jumlah</td>
					  </tr>
					  <tr>
						<td width='90' align='center' class='header_laporan'>1</td>
						<td width='90' align='center' class='header_laporan'>2</td>
						<td width='90' align='center' class='header_laporan'>3</td>
						<td width='90' align='center' class='header_laporan'>4</td>
						<td width='90' align='center' class='header_laporan'>5</td>
						<td width='90' align='center' class='header_laporan'>6</td>
						<td width='90' align='center' class='header_laporan'>7</td>
						<td width='90' align='center' class='header_laporan'>8</td>
						<td width='90' align='center' class='header_laporan'>9</td>
						<td width='90' align='center' class='header_laporan'>10</td>
						<td width='90' align='center' class='header_laporan'>11</td>
						<td width='90' align='center' class='header_laporan'>12</td>
						</tr>";
				if ($row->sts_pdrk == "OPN" || $row->sts_pdrk == "STB"){
					$sql1="select a.kode_akun,c.nama as nama_akun,a.kode_cc,b.nama as nama_cc , case a.jenis when  'C' then 'COMMITMENT' when 'P' then 'PAYMENT' else a.jenis end as version
					   ,isnull(d.t01,0) as t01,isnull(d.t02,0) as t02,isnull(d.t03,0) as t03,isnull(d.t04,0) as t04, 
					   isnull(d.t05,0) as t05,isnull(d.t06,0) as t06,isnull(d.t07,0) as t07,isnull(d.t08,0) as t08, 
					   isnull(d.t09,0) as t09,isnull(d.t10,0) as t10,isnull(d.t11,0) as t11,isnull(d.t12,0) as t12,isnull(d.total,0) as total        
				from (select distinct kode_cc,kode_akun,kode_lokasi, kode_drk, jenis 
					  from rra_anggaran
					  where no_bukti='$row->no_pdrk'
					  ) a  
				inner join rra_cc b on a.kode_cc=b.kode_cc and a.kode_lokasi=b.kode_lokasi 
				inner join rra_masakun c on a.kode_akun=c.kode_akun and a.kode_lokasi=c.kode_lokasi 
				left join (select a.kode_cc,a.kode_akun,a.kode_lokasi, 
								  sum(case when substring(a.periode,5,2)='01' then a.nilai else 0 end )as t01, 
								  sum(case when substring(a.periode,5,2)='02' then a.nilai else 0 end )as t02, 
						  sum(case when substring(a.periode,5,2)='03' then a.nilai else 0 end )as t03, 
								  sum(case when substring(a.periode,5,2)='04' then a.nilai else 0 end )as t04, 
						  sum(case when substring(a.periode,5,2)='05' then a.nilai else 0 end )as t05, 
								  sum(case when substring(a.periode,5,2)='06' then a.nilai else 0 end )as t06, 
						  sum(case when substring(a.periode,5,2)='07' then a.nilai else 0 end )as t07, 
								  sum(case when substring(a.periode,5,2)='08' then a.nilai else 0 end )as t08, 
						  sum(case when substring(a.periode,5,2)='09' then a.nilai else 0 end )as t09, 
								  sum(case when substring(a.periode,5,2)='10' then a.nilai else 0 end )as t10, 
						  sum(case when substring(a.periode,5,2)='11' then a.nilai else 0 end )as t11, 
								  sum(case when substring(a.periode,5,2)='12' then a.nilai else 0 end )as t12, 
								  sum(case when substring(a.periode,5,2) between '01' and '12' then a.nilai else 0 end )as total 
						   from (
							select a.* from rra_rev_orgi a 
									left outer join rra_grev_m b on b.no_rev = a.no_rev and b.no_pdrk = a.no_pdrk  
									left outer join rra_frev_m c on c.no_pdrk = a.no_pdrk and c.no_frev like 'FCREV%'
									where b.no_grev is null and a.no_pdrk = '$row->no_pdrk' and a.versi = 'P' and c.no_frev is null															
							union 
							
							select a.* from rra_grev_orgi a 
								left outer join rra_mrev_m b on b.no_grev = a.no_grev and b.no_pdrk = a.no_pdrk  
								left outer join rra_frev_m c on c.no_pdrk = a.no_pdrk and c.no_frev like 'FCREV%'									
								where b.no_grev is null and a.no_pdrk = '$row->no_pdrk' and a.versi = 'P'	 and c.no_frev is null
						   ) a
						   group by a.kode_cc,a.kode_akun,a.kode_lokasi 
						   )d on a.kode_akun=d.kode_akun and a.kode_cc=d.kode_cc and a.kode_lokasi=d.kode_lokasi 
					order by a.kode_cc,a.kode_akun";
				}else $sql1="select a.kode_akun,c.nama as nama_akun,a.kode_cc,b.nama as nama_cc, a.kode_drk, 
						case a.jenis when  'C' then 'COMMITMENT' when 'P' then 'PAYMENT' when null then 'K' else a.jenis end as version
						,isnull(d.t01,0) as t01,isnull(d.t02,0) as t02,isnull(d.t03,0) as t03,isnull(d.t04,0) as t04, 
					   isnull(d.t05,0) as t05,isnull(d.t06,0) as t06,isnull(d.t07,0) as t07,isnull(d.t08,0) as t08, 
					   isnull(d.t09,0) as t09,isnull(d.t10,0) as t10,isnull(d.t11,0) as t11,isnull(d.t12,0) as t12,isnull(d.total,0) as total        
				from (select distinct kode_cc,kode_akun,kode_drk, nvl(jenis,'K') as jenis, kode_lokasi 
					  from rra_anggaran
					  where no_bukti='$row->no_pdrk'
					  ) a  
				inner join rra_cc b on a.kode_cc=b.kode_cc and a.kode_lokasi=b.kode_lokasi 
				inner join rra_masakun c on a.kode_akun=c.kode_akun and a.kode_lokasi=c.kode_lokasi 
				left join (select a.kode_cc,a.kode_akun,isnull(a.kode_drk,'-') as kode_drk, a.kode_lokasi, case  when a.versi = '000' or a.versi = '0'  then 'P' when a.versi = '7' or a.versi = '007' then 'C' else case when '".$row->jenis_agg."' = 'OPEX' then 'K' else a.versi end end as jenis, 
								  sum(case when substring(a.periode,5,2)='01' then a.nilai else 0 end )as t01, 
								  sum(case when substring(a.periode,5,2)='02' then a.nilai else 0 end )as t02, 
						  sum(case when substring(a.periode,5,2)='03' then a.nilai else 0 end )as t03, 
								  sum(case when substring(a.periode,5,2)='04' then a.nilai else 0 end )as t04, 
						  sum(case when substring(a.periode,5,2)='05' then a.nilai else 0 end )as t05, 
								  sum(case when substring(a.periode,5,2)='06' then a.nilai else 0 end )as t06, 
						  sum(case when substring(a.periode,5,2)='07' then a.nilai else 0 end )as t07, 
								  sum(case when substring(a.periode,5,2)='08' then a.nilai else 0 end )as t08, 
						  sum(case when substring(a.periode,5,2)='09' then a.nilai else 0 end )as t09, 
								  sum(case when substring(a.periode,5,2)='10' then a.nilai else 0 end )as t10, 
						  sum(case when substring(a.periode,5,2)='11' then a.nilai else 0 end )as t11, 
								  sum(case when substring(a.periode,5,2)='12' then a.nilai else 0 end )as t12, 
								  sum(case when substring(a.periode,5,2) between '01' and '12' then a.nilai else 0 end )as total 
						   from (
							select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_pdrk_orgi a 
										left outer join rra_rev_m b on b.no_pdrk = a.no_pdrk  and b.kode_lokasi = a.kode_lokasi 										
										where b.no_rev is null and a.no_pdrk = '$row->no_pdrk'  
							union
							select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_rev_orgi a 
										left outer join rra_grev_m b on b.no_rev = a.no_rev and b.no_pdrk = a.no_pdrk and b.kode_lokasi = a.kode_lokasi   
										left outer join rra_frev_m c on c.no_frev like 'FREV%' and c.no_pdrk = a.no_pdrk and c.kode_lokasi = a.kode_lokasi   
										where b.no_grev is null and a.no_pdrk = '$row->no_pdrk' and c.no_frev is null
							union 
							select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_grev_orgi a 
									left outer join rra_mrev_m b on b.no_grev = a.no_grev and b.no_pdrk = a.no_pdrk and b.kode_lokasi = a.kode_lokasi  
									left outer join rra_frev_m c on c.no_frev like 'FREV%' and c.no_pdrk = a.no_pdrk and c.kode_lokasi = a.kode_lokasi   
									where b.no_mrev is null and a.no_pdrk = '$row->no_pdrk' and c.no_frev is null
							union 
							select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_mrev_orgi a 
								left outer join rra_frev_m c on c.no_frev like 'FREV%' and c.no_pdrk = a.no_pdrk and c.kode_lokasi = a.kode_lokasi   
								where a.no_pdrk = '$row->no_pdrk'  and c.no_frev is null
							union 
							select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_frev_orgi a where no_frev like 'FREV%' and no_pdrk = '$row->no_pdrk'
						   ) a
						   group by a.versi, a.kode_cc,a.kode_akun,a.kode_drk, a.kode_lokasi 
						   )d on a.kode_akun=d.kode_akun and a.kode_drk = d.kode_drk and a.kode_cc=d.kode_cc and a.kode_lokasi=d.kode_lokasi and ifnull(a.jenis,'-') = ifnull(d.jenis,'-')
				order by a.kode_cc,a.kode_akun";//case when  a.jenis  = 'C' then 'COMMITMENT' when a.jenis  = 'P' then 'PAYMENT' when a.jenis  is null then 'K' else a.jenis end
			$rs1 = $dbLib->execute($sql1);				
			
			$j=0;
			$jt01=0;$jt02=0;$jt03=0;$jt04=0;$jt05=0;$jt06=0;
			$jt07=0;$jt08=0;$jt09=0;$jt10=0;$jt11=0;$jt12=0;$jt=0;
			while ($row1 = $rs1->FetchNextObject($toupper=false))
			{	
				$j=$j+1;
				$jt01=$jt01+$row1->t01;$jt02=$jt02+$row1->t02;$jt03=$jt03+$row1->t03;$jt04=$jt04+$row1->t04;$jt05=$jt05+$row1->t05;$jt06=$jt06+$row1->t06;
				$jt07=$jt07+$row1->t07;$jt08=$jt08+$row1->t08;$jt09=$jt09+$row1->t09;$jt10=$jt10+$row1->t10;$jt11=$jt11+$row1->t11;$jt12=$jt12+$row1->t12;$jt=$jt+$row1->total;
				$t01=number_format($row1->t01,0,',','.');
				$t02=number_format($row1->t02,0,',','.');
				$t03=number_format($row1->t03,0,',','.');
				$t04=number_format($row1->t04,0,',','.');
				$t05=number_format($row1->t05,0,',','.');
				$t06=number_format($row1->t06,0,',','.');
				$t07=number_format($row1->t07,0,',','.');
				$t08=number_format($row1->t08,0,',','.');
				$t09=number_format($row1->t09,0,',','.');
				$t10=number_format($row1->t10,0,',','.');
				$t11=number_format($row1->t11,0,',','.');
				$t12=number_format($row1->t12,0,',','.');
				$total=number_format($row1->total,0,',','.');
			  $html .= "<tr>
				<td class='isi_laporan' align='center'>$j</td>
				<td class='isi_laporan'>$row1->kode_cc</td>
				<td class='isi_laporan'>$row1->kode_akun</td>
				<td class='isi_laporan'>$row1->nama_akun ". ( $row1->version == "" || $row->jenis_agg == 'OPEX' ? "" : "($row1->version)" )."</td>
				<td class='isi_laporan' align='right'>$t01</td>
				<td class='isi_laporan' align='right'>$t02</td>
				<td class='isi_laporan' align='right'>$t03</td>
				<td class='isi_laporan' align='right'>$t04</td>
				<td class='isi_laporan' align='right'>$t05</td>
				<td class='isi_laporan' align='right'>$t06</td>
				<td class='isi_laporan' align='right'>$t07</td>
				<td class='isi_laporan' align='right'>$t08</td>
				<td class='isi_laporan' align='right'>$t09</td>
				<td class='isi_laporan' align='right'>$t10</td>
				<td class='isi_laporan' align='right'>$t11</td>
				<td class='isi_laporan' align='right'>$t12</td>
				<td class='isi_laporan' align='right'>$total</td>
			  </tr>";
			}
				$jt01=number_format($jt01,0,',','.');
				$jt02=number_format($jt02,0,',','.');
				$jt03=number_format($jt03,0,',','.');
				$jt04=number_format($jt04,0,',','.');
				$jt05=number_format($jt05,0,',','.');
				$jt06=number_format($jt06,0,',','.');
				$jt07=number_format($jt07,0,',','.');
				$jt08=number_format($jt08,0,',','.');
				$jt09=number_format($jt09,0,',','.');
				$jt10=number_format($jt10,0,',','.');
				$jt11=number_format($jt11,0,',','.');
				$jt12=number_format($jt12,0,',','.');
				$jt=number_format($jt,0,',','.');
			$html .= "<tr>
				<td colspan='4' align='right'>Total&nbsp;</td>
				<td class='isi_laporan' align='right'>$jt01</td>
				<td class='isi_laporan' align='right'>$jt02</td>
				<td class='isi_laporan' align='right'>$jt03</td>
				<td class='isi_laporan' align='right'>$jt04</td>
				<td class='isi_laporan' align='right'>$jt05</td>
				<td class='isi_laporan' align='right'>$jt06</td>
				<td class='isi_laporan' align='right'>$jt07</td>
				<td class='isi_laporan' align='right'>$jt08</td>
				<td class='isi_laporan' align='right'>$jt09</td>
				<td class='isi_laporan' align='right'>$jt10</td>
				<td class='isi_laporan' align='right'>$jt11</td>
				<td class='isi_laporan' align='right'>$jt12</td>
				<td class='isi_laporan' align='right'>$jt</td>
			  </tr>";
		$html .= "</table></td>
			  </tr>
			  <tr>
				<td>&nbsp;</td>
			  </tr>
			  <tr>
				<td><table  border='1' cellspacing='0' cellpadding='0' class='kotak'>
				  <tr>
					<td width='40' rowspan='2' align='center' class='header_laporan'>No</td>
					<td width='70' rowspan='2' align='center' class='header_laporan'>Cost Center</td>
					<td width='70' rowspan='2' align='center' class='header_laporan'>Nomor Akun </td>
					<td width='300' rowspan='2' align='center' class='header_laporan'>Nama Akun</td>
					<td colspan='12' align='center' class='header_laporan'>".($row->sts_pdrk == "OPN" || $row->sts_pdrk == "STB" ? $hdrOpn2 : "Resheduling / Redistribusi / Realokasi / ABT *)")."</td>
					<td width='100' rowspan='2' align='center' class='header_laporan'>Jumlah</td>
				  </tr>
				  <tr>
					<td width='90' align='center' class='header_laporan'>1</td>
					<td width='90' align='center' class='header_laporan'>2</td>
					<td width='90' align='center' class='header_laporan'>3</td>
					<td width='90' align='center' class='header_laporan'>4</td>
					<td width='90' align='center' class='header_laporan'>5</td>
					<td width='90' align='center' class='header_laporan'>6</td>
					<td width='90' align='center' class='header_laporan'>7</td>
					<td width='90' align='center' class='header_laporan'>8</td>
					<td width='90' align='center' class='header_laporan'>9</td>
					<td width='90' align='center' class='header_laporan'>10</td>
					<td width='90' align='center' class='header_laporan'>11</td>
					<td width='90' align='center' class='header_laporan'>12</td>
					</tr>";
			if ($row->sts_pdrk == "OPN" || $row->sts_pdrk == "STB"){
				$sql1="select a.kode_akun,c.nama as nama_akun,a.kode_cc,b.nama as nama_cc , case a.jenis when  'C' then 'COMMITMENT' when 'P' then 'PAYMENT' else a.jenis end as version
					   ,isnull(d.t01,0) as t01,isnull(d.t02,0) as t02,isnull(d.t03,0) as t03,isnull(d.t04,0) as t04, 
					   isnull(d.t05,0) as t05,isnull(d.t06,0) as t06,isnull(d.t07,0) as t07,isnull(d.t08,0) as t08, 
					   isnull(d.t09,0) as t09,isnull(d.t10,0) as t10,isnull(d.t11,0) as t11,isnull(d.t12,0) as t12,isnull(d.total,0) as total        
				from (select distinct kode_cc,kode_akun,kode_lokasi, kode_drk, jenis 
					  from rra_anggaran
					  where no_bukti='$row->no_pdrk'
					  ) a  
				inner join rra_cc b on a.kode_cc=b.kode_cc and a.kode_lokasi=b.kode_lokasi 
				inner join rra_masakun c on a.kode_akun=c.kode_akun and a.kode_lokasi=c.kode_lokasi 
				left join (select a.kode_cc,a.kode_akun,a.kode_lokasi, 
								  sum(case when substring(a.periode,5,2)='01' then a.nilai else 0 end )as t01, 
								  sum(case when substring(a.periode,5,2)='02' then a.nilai else 0 end )as t02, 
						  sum(case when substring(a.periode,5,2)='03' then a.nilai else 0 end )as t03, 
								  sum(case when substring(a.periode,5,2)='04' then a.nilai else 0 end )as t04, 
						  sum(case when substring(a.periode,5,2)='05' then a.nilai else 0 end )as t05, 
								  sum(case when substring(a.periode,5,2)='06' then a.nilai else 0 end )as t06, 
						  sum(case when substring(a.periode,5,2)='07' then a.nilai else 0 end )as t07, 
								  sum(case when substring(a.periode,5,2)='08' then a.nilai else 0 end )as t08, 
						  sum(case when substring(a.periode,5,2)='09' then a.nilai else 0 end )as t09, 
								  sum(case when substring(a.periode,5,2)='10' then a.nilai else 0 end )as t10, 
						  sum(case when substring(a.periode,5,2)='11' then a.nilai else 0 end )as t11, 
								  sum(case when substring(a.periode,5,2)='12' then a.nilai else 0 end )as t12, 
								  sum(case when substring(a.periode,5,2) between '01' and '12' then a.nilai else 0 end )as total 
						   from (
							select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_rev_orgi a left outer join rra_grev_m b on b.no_rev = a.no_rev and b.no_pdrk = a.no_pdrk  where b.no_grev is null and a.no_pdrk = '$row->no_pdrk' and a.versi = 'R'
							union 
							select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_grev_orgi a left outer join rra_mrev_m b on b.no_grev = a.no_grev and b.no_pdrk = a.no_pdrk  where b.no_mrev is null and a.no_pdrk = '$row->no_pdrk' and a.versi = 'R'							
						   ) a
						   group by a.kode_cc,a.kode_akun,a.kode_lokasi 
						   )d on a.kode_akun=d.kode_akun and a.kode_cc=d.kode_cc and a.kode_lokasi=d.kode_lokasi 
					order by a.kode_cc,a.kode_akun";
			}else
			$sql1="select a.kode_akun,c.nama as nama_akun,a.kode_cc,b.nama as nama_cc , a.kode_drk, case a.jenis when  'C' then 'COMMITMENT' when 'P' then 'PAYMENT' else a.jenis end as version
			   ,isnull(d.t01,0) as t01,isnull(d.t02,0) as t02,isnull(d.t03,0) as t03,isnull(d.t04,0) as t04, 
			   isnull(d.t05,0) as t05,isnull(d.t06,0) as t06,isnull(d.t07,0) as t07,isnull(d.t08,0) as t08, 
			   isnull(d.t09,0) as t09,isnull(d.t10,0) as t10,isnull(d.t11,0) as t11,isnull(d.t12,0) as t12,isnull(d.total,0) as total        
		from (select distinct kode_cc,kode_akun,kode_lokasi, kode_drk, jenis
				from rra_anggaran
				where no_bukti='$row->no_pdrk' ) a  
		inner join rra_cc b on a.kode_cc=b.kode_cc and a.kode_lokasi=b.kode_lokasi 
		inner join rra_masakun c on a.kode_akun=c.kode_akun and a.kode_lokasi=c.kode_lokasi 
		left join (select a.kode_cc,a.kode_akun,a.kode_lokasi, a.kode_drk, a.jenis, 
						  sum(case when substring(a.periode,5,2)='01' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t01, 
						  sum(case when substring(a.periode,5,2)='02' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t02, 
						  sum(case when substring(a.periode,5,2)='03' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t03, 
						  sum(case when substring(a.periode,5,2)='04' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t04, 
						  sum(case when substring(a.periode,5,2)='05' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t05, 
						  sum(case when substring(a.periode,5,2)='06' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t06, 
						  sum(case when substring(a.periode,5,2)='07' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t07, 
						  sum(case when substring(a.periode,5,2)='08' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t08, 
						  sum(case when substring(a.periode,5,2)='09' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t09, 
						  sum(case when substring(a.periode,5,2)='10' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t10, 
						  sum(case when substring(a.periode,5,2)='11' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t11, 
						  sum(case when substring(a.periode,5,2)='12' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t12, 
						  sum(case when substring(a.periode,5,2) between '01' and '12' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as total 
				   from rra_anggaran a
					where a.no_bukti='$row->no_pdrk' 
				   group by a.jenis, a.kode_drk, a.kode_cc,a.kode_akun,a.kode_lokasi
				   )d on a.kode_akun=d.kode_akun and a.kode_cc=d.kode_cc and a.kode_lokasi=d.kode_lokasi and a.kode_drk = d.kode_drk and nvl(a.jenis,'-') = nvl(d.jenis,'-')
		order by a.kode_cc,a.kode_akun";
			
			$rs1 = $dbLib->execute($sql1);			
			$j=0;
			$jt01=0;$jt02=0;$jt03=0;$jt04=0;$jt05=0;$jt06=0;
			$jt07=0;$jt08=0;$jt09=0;$jt10=0;$jt11=0;$jt12=0;$jt=0;
			while ($row1 = $rs1->FetchNextObject($toupper=false))
			{	
				$j=$j+1;
				$jt01=$jt01+$row1->t01;$jt02=$jt02+$row1->t02;$jt03=$jt03+$row1->t03;$jt04=$jt04+$row1->t04;$jt05=$jt05+$row1->t05;$jt06=$jt06+$row1->t06;
				$jt07=$jt07+$row1->t07;$jt08=$jt08+$row1->t08;$jt09=$jt09+$row1->t09;$jt10=$jt10+$row1->t10;$jt11=$jt11+$row1->t11;$jt12=$jt12+$row1->t12;$jt=$jt+$row1->total;
				$t01=number_format($row1->t01,0,',','.');
				$t02=number_format($row1->t02,0,',','.');
				$t03=number_format($row1->t03,0,',','.');
				$t04=number_format($row1->t04,0,',','.');
				$t05=number_format($row1->t05,0,',','.');
				$t06=number_format($row1->t06,0,',','.');
				$t07=number_format($row1->t07,0,',','.');
				$t08=number_format($row1->t08,0,',','.');
				$t09=number_format($row1->t09,0,',','.');
				$t10=number_format($row1->t10,0,',','.');
				$t11=number_format($row1->t11,0,',','.');
				$t12=number_format($row1->t12,0,',','.');
				$total=number_format($row1->total,0,',','.');
			  $html .= "<tr>
				<td class='isi_laporan' align='center'>$j</td>
				<td class='isi_laporan'>$row1->kode_cc</td>
				<td class='isi_laporan'>$row1->kode_akun</td>
				<td class='isi_laporan'>$row1->nama_akun ". ( $row1->version == "" || $row->jenis_agg == 'OPEX' ? "" : "($row1->version)" )."</td>
				<td class='isi_laporan' align='right'>$t01</td>
				<td class='isi_laporan' align='right'>$t02</td>
				<td class='isi_laporan' align='right'>$t03</td>
				<td class='isi_laporan' align='right'>$t04</td>
				<td class='isi_laporan' align='right'>$t05</td>
				<td class='isi_laporan' align='right'>$t06</td>
				<td class='isi_laporan' align='right'>$t07</td>
				<td class='isi_laporan' align='right'>$t08</td>
				<td class='isi_laporan' align='right'>$t09</td>
				<td class='isi_laporan' align='right'>$t10</td>
				<td class='isi_laporan' align='right'>$t11</td>
				<td class='isi_laporan' align='right'>$t12</td>
				<td class='isi_laporan' align='right'>$total</td>
			  </tr>";
			}
			$jt01=number_format($jt01,0,',','.');
				$jt02=number_format($jt02,0,',','.');
				$jt03=number_format($jt03,0,',','.');
				$jt04=number_format($jt04,0,',','.');
				$jt05=number_format($jt05,0,',','.');
				$jt06=number_format($jt06,0,',','.');
				$jt07=number_format($jt07,0,',','.');
				$jt08=number_format($jt08,0,',','.');
				$jt09=number_format($jt09,0,',','.');
				$jt10=number_format($jt10,0,',','.');
				$jt11=number_format($jt11,0,',','.');
				$jt12=number_format($jt12,0,',','.');
				$jt=number_format($jt,0,',','.');
			$html .= "<tr>
				<td colspan='4' align='right'>Total&nbsp;</td>
				<td class='isi_laporan' align='right'>$jt01</td>
				<td class='isi_laporan' align='right'>$jt02</td>
				<td class='isi_laporan' align='right'>$jt03</td>
				<td class='isi_laporan' align='right'>$jt04</td>
				<td class='isi_laporan' align='right'>$jt05</td>
				<td class='isi_laporan' align='right'>$jt06</td>
				<td class='isi_laporan' align='right'>$jt07</td>
				<td class='isi_laporan' align='right'>$jt08</td>
				<td class='isi_laporan' align='right'>$jt09</td>
				<td class='isi_laporan' align='right'>$jt10</td>
				<td class='isi_laporan' align='right'>$jt11</td>
				<td class='isi_laporan' align='right'>$jt12</td>
				<td class='isi_laporan' align='right'>$jt</td>
			  </tr>";
			$html .= "</table></td>
				  </tr>
				  <tr>
					<td>&nbsp;</td>
				  </tr>
				  <tr>
					<td><table  border='1' cellspacing='0' cellpadding='0' class='kotak'>
					  <tr>
						<td width='40' rowspan='2' align='center' class='header_laporan'>No</td>
						<td width='70' rowspan='2' align='center' class='header_laporan'>Cost Center</td>
						<td width='70' rowspan='2' align='center' class='header_laporan'>Nomor Akun </td>
						<td width='300' rowspan='2' align='center' class='header_laporan'>Nama Akun</td>
						<td colspan='12' align='center' class='header_laporan'>".($row->sts_pdrk == "OPN" || $row->sts_pdrk == "STB" ? $hdrOpn3 :"Setelah Resheduling / Redistribusi / Realokasi / ABT *)")."</td>
						<td width='100' rowspan='2' align='center' class='header_laporan'>Jumlah</td>
					  </tr>
					  <tr>
						<td width='90' align='center' class='header_laporan'>1</td>
						<td width='90' align='center' class='header_laporan'>2</td>
						<td width='90' align='center' class='header_laporan'>3</td>
						<td width='90' align='center' class='header_laporan'>4</td>
						<td width='90' align='center' class='header_laporan'>5</td>
						<td width='90' align='center' class='header_laporan'>6</td>
						<td width='90' align='center' class='header_laporan'>7</td>
						<td width='90' align='center' class='header_laporan'>8</td>
						<td width='90' align='center' class='header_laporan'>9</td>
						<td width='90' align='center' class='header_laporan'>10</td>
						<td width='90' align='center' class='header_laporan'>11</td>
						<td width='90' align='center' class='header_laporan'>12</td>
						</tr>";
				if ($row->sts_pdrk == "OPN" || $row->sts_pdrk == "STB"){
					$sql1="select a.kode_akun,c.nama as nama_akun,a.kode_cc,b.nama as nama_cc 
							,isnull(a.t01,0) as t01,isnull(a.t02,0) as t02,isnull(a.t03,0) as t03,isnull(a.t04,0) as t04, 
							isnull(a.t05,0) as t05,isnull(a.t06,0) as t06,isnull(a.t07,0) as t07,isnull(a.t08,0) as t08, 
							isnull(a.t09,0) as t09,isnull(a.t10,0) as t10,isnull(a.t11,0) as t11,isnull(a.t12,0) as t12,
							isnull(a.total,0) as total        
					 from (select a.kode_cc,a.kode_akun,a.kode_lokasi, 
							   sum(case when substring(a.periode,5,2)='01' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t01, 
							  sum(case when substring(a.periode,5,2)='02' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t02, 
							  sum(case when substring(a.periode,5,2)='03' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t03, 
							  sum(case when substring(a.periode,5,2)='04' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t04, 
							  sum(case when substring(a.periode,5,2)='05' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t05, 
							  sum(case when substring(a.periode,5,2)='06' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t06, 
							  sum(case when substring(a.periode,5,2)='07' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t07, 
							  sum(case when substring(a.periode,5,2)='08' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t08, 
							  sum(case when substring(a.periode,5,2)='09' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t09, 
							  sum(case when substring(a.periode,5,2)='10' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t10, 
							  sum(case when substring(a.periode,5,2)='11' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t11, 
							  sum(case when substring(a.periode,5,2)='12' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t12, 
							  sum(case when substring(a.periode,5,2) between '01' and '12' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as total 
					   from rra_anggaran a 
					   where a.no_bukti='$row->no_pdrk'
					   group by a.kode_cc,a.kode_akun,a.kode_lokasi 
					   ) a 
					 inner join rra_cc b on a.kode_cc=b.kode_cc and a.kode_lokasi=b.kode_lokasi 
					 inner join rra_masakun c on a.kode_akun=c.kode_akun and a.kode_lokasi=c.kode_lokasi 					 
					 order by a.kode_cc,a.kode_akun";
				}else 
							$sql1="select a.kode_akun,c.nama as nama_akun,a.kode_cc,b.nama as nama_cc, a.kode_drk, case a.jenis when  'C' then 'COMMITMENT' when 'P' then 'PAYMENT' else a.jenis end as version 
							   ,isnull(d.t01,0)+isnull(e.t01,0) as t01,isnull(d.t02,0)+isnull(e.t02,0) as t02,isnull(d.t03,0)+isnull(e.t03,0) as t03,isnull(d.t04,0)+isnull(e.t04,0) as t04, 
							   isnull(d.t05,0)+isnull(e.t05,0) as t05,isnull(d.t06,0)+isnull(e.t06,0) as t06,isnull(d.t07,0)+isnull(e.t07,0) as t07,isnull(d.t08,0)+isnull(e.t08,0) as t08, 
							   isnull(d.t09,0)+isnull(e.t09,0) as t09,isnull(d.t10,0)+isnull(e.t10,0) as t10,isnull(d.t11,0)+isnull(e.t11,0) as t11,isnull(d.t12,0)+isnull(e.t12,0) as t12,
							   isnull(d.total,0)+isnull(e.total,0) as total        
						from (select distinct kode_cc,kode_akun,kode_lokasi, kode_drk, nvl(jenis,'K') as jenis
							  from rra_anggaran
							  where no_bukti='$row->no_pdrk') a 
						inner join rra_cc b on a.kode_cc=b.kode_cc and a.kode_lokasi=b.kode_lokasi 
						inner join rra_masakun c on a.kode_akun=c.kode_akun and a.kode_lokasi=c.kode_lokasi 
						left join (select a.kode_cc,a.kode_akun,a.kode_lokasi, a.kode_drk, nvl(a.jenis,'K') as jenis,
										   sum(case when substring(a.periode,5,2)='01' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t01, 
										  sum(case when substring(a.periode,5,2)='02' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t02, 
										  sum(case when substring(a.periode,5,2)='03' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t03, 
										  sum(case when substring(a.periode,5,2)='04' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t04, 
										  sum(case when substring(a.periode,5,2)='05' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t05, 
										  sum(case when substring(a.periode,5,2)='06' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t06, 
										  sum(case when substring(a.periode,5,2)='07' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t07, 
										  sum(case when substring(a.periode,5,2)='08' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t08, 
										  sum(case when substring(a.periode,5,2)='09' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t09, 
										  sum(case when substring(a.periode,5,2)='10' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t10, 
										  sum(case when substring(a.periode,5,2)='11' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t11, 
										  sum(case when substring(a.periode,5,2)='12' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as t12, 
										  sum(case when substring(a.periode,5,2) between '01' and '12' then (case when a.dc='D' then a.nilai else -a.nilai end) else 0 end )as total 
								   from rra_anggaran a 
								   where a.no_bukti='$row->no_pdrk'
								   group by a.kode_drk, a.jenis,  a.kode_cc,a.kode_akun,a.kode_lokasi
								   )d on a.kode_akun=d.kode_akun and a.kode_cc=d.kode_cc and a.kode_lokasi=d.kode_lokasi and a.kode_drk = d.kode_drk  and nvl(a.jenis,'-') = nvl(d.jenis,'-')
						left join (select a.kode_cc,a.kode_akun,a.kode_lokasi, isnull(a.kode_drk,'-') as kode_drk , case when a.versi = '000' or a.versi = '0'  then 'P' when a.versi = '7' or a.versi = '007' then 'C' else case when '".$row->jenis_agg."' = 'OPEX' then 'K' else a.versi end end as jenis, 
															sum(case when substring(a.periode,5,2)='01' then a.nilai else 0 end )as t01, 
															sum(case when substring(a.periode,5,2)='02' then a.nilai else 0 end )as t02, 
															sum(case when substring(a.periode,5,2)='03' then a.nilai else 0 end )as t03, 
															sum(case when substring(a.periode,5,2)='04' then a.nilai else 0 end )as t04, 
															sum(case when substring(a.periode,5,2)='05' then a.nilai else 0 end )as t05, 
															sum(case when substring(a.periode,5,2)='06' then a.nilai else 0 end )as t06, 
															sum(case when substring(a.periode,5,2)='07' then a.nilai else 0 end )as t07, 
															sum(case when substring(a.periode,5,2)='08' then a.nilai else 0 end )as t08, 
															sum(case when substring(a.periode,5,2)='09' then a.nilai else 0 end )as t09, 
															sum(case when substring(a.periode,5,2)='10' then a.nilai else 0 end )as t10, 
															sum(case when substring(a.periode,5,2)='11' then a.nilai else 0 end )as t11, 
															sum(case when substring(a.periode,5,2)='12' then a.nilai else 0 end )as t12, 
															sum(case when substring(a.periode,5,2) between '01' and '12' then a.nilai else 0 end )as total
								   from (
									select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_pdrk_orgi a 
													left outer join rra_rev_m b on b.no_pdrk = a.no_pdrk  and b.kode_lokasi = a.kode_lokasi 										
													where b.no_rev is null and a.no_pdrk = '$row->no_pdrk'  
										union
										select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_rev_orgi a 
													left outer join rra_grev_m b on b.no_rev = a.no_rev and b.no_pdrk = a.no_pdrk and b.kode_lokasi = a.kode_lokasi   
													left outer join rra_frev_m c on c.no_frev like 'FREV%' and c.no_pdrk = a.no_pdrk and c.kode_lokasi = a.kode_lokasi   
													where b.no_grev is null and a.no_pdrk = '$row->no_pdrk' and c.no_frev is null
										union 
										select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_grev_orgi a 
												left outer join rra_mrev_m b on b.no_grev = a.no_grev and b.no_pdrk = a.no_pdrk and b.kode_lokasi = a.kode_lokasi  
												left outer join rra_frev_m c on c.no_frev like 'FREV%' and c.no_pdrk = a.no_pdrk and c.kode_lokasi = a.kode_lokasi   
												where b.no_mrev is null and a.no_pdrk = '$row->no_pdrk' and c.no_frev is null
										union 
										select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_mrev_orgi a 
											left outer join rra_frev_m c on c.no_frev like 'FREV%' and c.no_pdrk = a.no_pdrk and c.kode_lokasi = a.kode_lokasi   
											where a.no_pdrk = '$row->no_pdrk'  and c.no_frev is null
										union 
										select a.versi, a.kode_cc, a.kode_akun, a.kode_drk, a.kode_lokasi, a.periode, a.nilai from rra_frev_orgi a where no_frev like 'FREV%' and no_pdrk = '$row->no_pdrk'
								) a 				   
								   group by a.versi, a.kode_drk, a.kode_cc,a.kode_akun,a.kode_lokasi 
								   )e on a.kode_akun=e.kode_akun and a.kode_cc=e.kode_cc and a.kode_lokasi=e.kode_lokasi and a.kode_drk = e.kode_drk and a.jenis = e.jenis
						order by a.kode_cc,a.kode_akun";//case when  a.jenis  = 'C' then 'COMMITMENT' when a.jenis  = 'P' then 'PAYMENT' when a.jenis  is null then 'K' else a.jenis end
				
				$rs1 = $dbLib->execute($sql1);
				$j=0;
				$jt01=0;$jt02=0;$jt03=0;$jt04=0;$jt05=0;$jt06=0;
				$jt07=0;$jt08=0;$jt09=0;$jt10=0;$jt11=0;$jt12=0;$jt=0;
				while ($row1 = $rs1->FetchNextObject($toupper=false))
				{	
					$j=$j+1;
					$jt01=$jt01+$row1->t01;$jt02=$jt02+$row1->t02;$jt03=$jt03+$row1->t03;$jt04=$jt04+$row1->t04;$jt05=$jt05+$row1->t05;$jt06=$jt06+$row1->t06;
					$jt07=$jt07+$row1->t07;$jt08=$jt08+$row1->t08;$jt09=$jt09+$row1->t09;$jt10=$jt10+$row1->t10;$jt11=$jt11+$row1->t11;$jt12=$jt12+$row1->t12;$jt=$jt+$row1->total;
					$t01=number_format($row1->t01,0,',','.');
					$t02=number_format($row1->t02,0,',','.');
					$t03=number_format($row1->t03,0,',','.');
					$t04=number_format($row1->t04,0,',','.');
					$t05=number_format($row1->t05,0,',','.');
					$t06=number_format($row1->t06,0,',','.');
					$t07=number_format($row1->t07,0,',','.');
					$t08=number_format($row1->t08,0,',','.');
					$t09=number_format($row1->t09,0,',','.');
					$t10=number_format($row1->t10,0,',','.');
					$t11=number_format($row1->t11,0,',','.');
					$t12=number_format($row1->t12,0,',','.');
					$total=number_format($row1->total,0,',','.');
					$html .= "<tr>
						<td class='isi_laporan' align='center'>$j</td>
						<td class='isi_laporan'>$row1->kode_cc</td>
						<td class='isi_laporan'>$row1->kode_akun</td>
						<td class='isi_laporan'>$row1->nama_akun". ( $row1->version == "" || $row->jenis_agg == 'OPEX' ? "" : "($row1->version)" )."</td>
						<td class='isi_laporan' align='right'>$t01</td>
						<td class='isi_laporan' align='right'>$t02</td>
						<td class='isi_laporan' align='right'>$t03</td>
						<td class='isi_laporan' align='right'>$t04</td>
						<td class='isi_laporan' align='right'>$t05</td>
						<td class='isi_laporan' align='right'>$t06</td>
						<td class='isi_laporan' align='right'>$t07</td>
						<td class='isi_laporan' align='right'>$t08</td>
						<td class='isi_laporan' align='right'>$t09</td>
						<td class='isi_laporan' align='right'>$t10</td>
						<td class='isi_laporan' align='right'>$t11</td>
						<td class='isi_laporan' align='right'>$t12</td>
						<td class='isi_laporan' align='right'>$total</td>
					  </tr>";
				}
				$jt01=number_format($jt01,0,',','.');
				$jt02=number_format($jt02,0,',','.');
				$jt03=number_format($jt03,0,',','.');
				$jt04=number_format($jt04,0,',','.');
				$jt05=number_format($jt05,0,',','.');
				$jt06=number_format($jt06,0,',','.');
				$jt07=number_format($jt07,0,',','.');
				$jt08=number_format($jt08,0,',','.');
				$jt09=number_format($jt09,0,',','.');
				$jt10=number_format($jt10,0,',','.');
				$jt11=number_format($jt11,0,',','.');
				$jt12=number_format($jt12,0,',','.');
				$jt=number_format($jt,0,',','.');
				$html .= "<tr>
					<td colspan='4' align='right'>Total&nbsp;</td>
					<td class='isi_laporan' align='right'>$jt01</td>
					<td class='isi_laporan' align='right'>$jt02</td>
					<td class='isi_laporan' align='right'>$jt03</td>
					<td class='isi_laporan' align='right'>$jt04</td>
					<td class='isi_laporan' align='right'>$jt05</td>
					<td class='isi_laporan' align='right'>$jt06</td>
					<td class='isi_laporan' align='right'>$jt07</td>
					<td class='isi_laporan' align='right'>$jt08</td>
					<td class='isi_laporan' align='right'>$jt09</td>
					<td class='isi_laporan' align='right'>$jt10</td>
					<td class='isi_laporan' align='right'>$jt11</td>
					<td class='isi_laporan' align='right'>$jt12</td>
					<td class='isi_laporan' align='right'>$jt</td>
				  </tr>";
				$html .= "</table></td>
				  </tr>
				  <tr>
					<td><table width='100%'  border='0' cellspacing='2' cellpadding='1'>
					  <tr>
						<td width='80%'>&nbsp;</td>
						<td width='20%'>$row->kota, $row->tgl $bulan $row->tahun </td>
					  </tr>
					  <tr>
						<td>&nbsp;</td>
						<td>Pelaksana Program </td>
					  </tr>
					  <tr>
						<td>&nbsp;</td>
						<td>$row->jabatan </td>
					  </tr>
					  <tr>
						<td>&nbsp;</td>
						<td height='50'>&nbsp;</td>
					  </tr>
					  <tr>
						<td>&nbsp;</td>
						<td>$row->nama_app1</td>
					  </tr>
					  <tr>
						<td>&nbsp;</td>
						<td>NIK $row->nik_app1</td>
					  </tr>
					</table></td>
				  </tr>
				  <tr>
					<td>&nbsp;</td>
				  </tr>
				</table>
				";
		 
			$i=$i+1;
		}
		//echo "</div>";
			
		return $html;
	}
}
?>
