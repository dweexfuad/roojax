//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.util_addOnLib = function(dbSetting)
{
	try{
		window.util_addOnLib.prototype.parent.constructor.call(this);
		this.className = "util_addOnLib";		
		this.dblib = system.activeApplication.dbLib;
	}catch(e){
		systemAPI.alert("addOnLib",e);
	}
};
window.util_addOnLib.extend(window.Function);
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
window.util_addOnLib.implement({
	addListener: function(callBack){
		this.dblib.addListener(callBack);
	},
	getPerNextA: function(lok){
		this.dblib.runSQLA("select flag from spro where kode_spro = 'PERNEXT' and kode_lokasi = '"+lok+"' ");
	},
	getBarisA: function(lok){
		this.dblib.runSQLA("select value1 from spro where kode_spro = 'PAGEROW' and kode_lokasi = '"+lok+"'");	
	},
	getPerNext: function(lok){
		var rs = this.dblib.runSQL("select flag from spro where kode_spro = 'PERNEXT' and kode_lokasi = '"+lok+"' ");
		if (rs instanceof portalui_arrayMap)
		{
			var data = rs.get(0);
			if (data != undefined)
			{
				return data.get("flag");
			}else return false;		
		}else system.alert(undefined,rs,"check SQL Statement on getPerNext");
	},
	getBaris: function(lok){
		var rs = this.dblib.runSQL("select value1 from spro where kode_spro = 'PAGEROW' and kode_lokasi = '"+lok+"'");
		if (rs instanceof portalui_arrayMap)
		{
			var data = rs.get(0);
			if (data != undefined)
			{
				return data.get("value1");
			}else return false;		
		}else system.alert(undefined,rs,"check SQL Statement on getbaris");
	},
	doRequestReady: function(sender, methodName, result){
		if (sender == this.dblib)
		{
			switch (methodName)
			{
				case "listDataAkun" :
					
					break;
				case "listDataPP" :
					break;
				
			}
		}
	},
	checkAkun: function(lokasi, akun){
		var rs = this.dblib.runSQL("select kode_akun from lokasi_akun where kode_akun = '"+akun+"' and kode_lokasi = '"+lokasi+"'");
		if (rs instanceof portalui_arrayMap)
		{
			var data = rs.get(0);
			if (data != undefined)
			{
				//return data.get("nama");
				return true;	
			}else return false;		
		}else system.alert(undefined,rs,"check SQL Statement on checkAkun");
	},
	getSaldoAggAkun: function(pp, akun, drk, periode){
		try{			
			this.dbLib = this.app.dbLib;
				
			var agg = pakai = 0;
			var rs = this.dbLib.runSQL("select sum(case dc when 'D' then nilai else -nilai end) as gar "+
									   "from anggaran_d "+
									   "where kode_pp = '"+pp+"' and kode_akun='"+akun+"' and kode_drk='"+drk+"' and periode like '"+periode.substr(0,4)+"%' ");
			if (rs instanceof portalui_arrayMap)
			{
				var data = rs.get(0);
				if (data != undefined)
				{
					agg = data.get("gar");
				}
			}else system.alert(undefined,rs,"check SQL Statement on getSaldoAggAkun");
			
			var rs = this.dbLib.runSQL("select isnull(sum(nilai),0) as pakai "+
									   "from npko "+
									   "where no_del='-' and kode_pp = '"+pp+"' and kode_akun='"+akun+"' and kode_drk='"+drk+"' and periode like '"+periode.substr(0,4)+"%'");
			if (rs instanceof portalui_arrayMap)
			{
				var data = rs.get(0);
				if (data != undefined)
				{
					pakai = data.get("pakai");
				}
			}else system.alert(undefined,rs,"check SQL Statement on getSaldoAggAkun npko");
			
			var rs = this.dbLib.runSQL("select isnull(sum(b.nilai*b.kurs),0) as pakai_pj "+
									   "from panjar_m a inner join panjar_j b on a.no_panjar=b.no_panjar "+
									   "where a.progress <> '3' and a.no_del='-' and b.kode_pp = '"+pp+"' and b.kode_akun ='"+akun+"' and b.kode_drk='"+drk+"' and a.periode like '"+periode.substr(0,4)+"%'");
			if (rs instanceof portalui_arrayMap)
			{
				var data = rs.get(0);
				if (data != undefined)
				{
					pakai += data.get("pakai_pj");
				}
			}else system.alert(undefined,rs,"check SQL Statement on getSaldoAggAkun panjar");
			
			var rs = this.dbLib.runSQL("select isnull(sum(b.nilai*b.kurs),0) as pakai_ptg "+
									   "from ptg_m a inner join ptg_j b on a.no_ptg=b.no_ptg "+
									   "where a.no_del='-' and a.kode_pp = '"+pp+"' and b.kode_akun ='"+akun+"' and b.kode_drk='"+drk+"' and a.periode like '"+periode.substr(0,4)+"%'");
			if (rs instanceof portalui_arrayMap)
			{
				var data = rs.get(0);
				if (data != undefined)
				{
					pakai += data.get("pakai_ptg");
				}
			}else system.alert(undefined,rs,"check SQL Statement on getSaldAoAggAKun ptg");
			
			
			agg = agg - pakai;
			return agg;
		
		}catch(e){
			alert(e);
		}
	},
	getSaldoAggDRK: function(pp, drk, periode){
		try{			
				
			var agg = pakai = 0;
			var rs = this.dbLib.runSQL("select sum(case dc when 'D' then nilai else -nilai end) as gar "+
									   "from anggaran_d "+
									   "where kode_pp = '"+pp+"' and kode_drk='"+drk+"' and periode like '"+periode.substr(0,4)+"%' ");
			if (rs instanceof portalui_arrayMap)
			{
				var data = rs.get(0);
				if (data != undefined)
				{
					agg = data.get("gar");
				}
			}else system.alert(undefined,rs,"check SQL Statement on getSaldoAggDRK on anggaran");
			
			var rs = this.dbLib.runSQL("select isnull(sum(nilai),0) as pakai "+
									   "from npko "+
									   "where no_del='-' and kode_pp = '"+pp+"' and kode_drk='"+drk+"' and periode like '"+periode.substr(0,4)+"%'");
			if (rs instanceof portalui_arrayMap)
			{
				var data = rs.get(0);
				if (data != undefined)
				{
					pakai = data.get("pakai");
				}
			}else system.alert(undefined,rs,"check SQL Statement on getSaldoDRK npko");
			
			var rs = this.dbLib.runSQL("select isnull(sum(b.nilai*b.kurs),0) as pakai_pj "+
									   "from panjar_m a inner join panjar_j b on a.no_panjar=b.no_panjar "+
									   "where a.progress <> '3' and a.no_del='-' and b.kode_pp = '"+pp+"' and b.kode_drk='"+drk+"' and a.periode like '"+periode.substr(0,4)+"%'");
			if (rs instanceof portalui_arrayMap)
			{
				var data = rs.get(0);
				if (data != undefined)
				{
					pakai += data.get("pakai_pj");
				}
			}else system.alert(undefined,rs,"check SQL Statement on getsaldoaggDRK panjar");
			
			var rs = this.dbLib.runSQL("select isnull(sum(b.nilai*b.kurs),0) as pakai_ptg "+
									   "from ptg_m a inner join ptg_j b on a.no_ptg=b.no_ptg "+
									   "where a.no_del='-' and a.kode_pp = '"+pp+"' and b.kode_drk='"+drk+"' and a.periode like '"+periode.substr(0,4)+"%'");
			if (rs instanceof portalui_arrayMap)
			{
				var data = rs.get(0);
				if (data != undefined)
				{
					pakai += data.get("pakai_ptg");
				}
			}else system.alert(undefined,rs,"check SQL Statement on getSaldoAggDRK ptg");
			
			
			agg = agg - pakai;
			return agg;
		
		}catch(e){
			alert(e);
		}
	},
	getDataFromSG: function(sg, colAkun, colPP, colDrk,colNilai){
		var res = new portalui_arrayMap();
		var akun = pp = drk = "";
		var nilai = 0;
		var row = rowTmp = undefined;
		uses("util_number");
		this.numLib = new util_number();
		for (var i = 0;i < sg.rows.getLength();i++)
		{
			akun = sg.getCell(colAkun, i);
			pp = sg.getCell(colPP, i);
			drk = sg.getCell(colDrk, i);
			nilai = this.numLib.nilaiToFloat(sg.getCell(colNilai,i));
			row = new portalui_arrayMap();
			row.set("akun",akun);
			row.set("pp",pp);
			row.set("drk",drk);
			row.set("nilai",nilai);		
			if (res.getLength() == 0)
				res.set(0,row);
			else
			{
				var found = false;
				for (var j in res.objList)
				{
					rowTmp = res.get(j);
					if ((rowTmp.get("akun") == row.get("akun")) && (rowTmp.get("pp") == row.get("pp")) &&
						(rowTmp.get("drk") == row.get("drk")))
					{
						found = true;
						nilai = rowTmp.get("nilai") + row.get("nilai");
						rowTmp.set("nilai",nilai);
					}
				}
				if (!found)			
					res.set(res.getLength(),row);			
			}
		}
		return res;
	}
});
