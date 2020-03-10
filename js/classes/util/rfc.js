//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//*	fikrs :Fund Management Area
//*	kokrs :Controlling Area
//* wrttp: value type (actual cost, plan, release)
//* ver : 0 : payment, 7: commitment
//***********************************************************************************************
window.util_rfc = function(connection, filename){
	try{
		this.remoteClassName = "server_util_rfc";
		if (filename == undefined) filename = system.getActiveApplication()._rfcSetting;
		window.util_rfc.prototype.parent.constructor.call(this, connection,filename);		
		this.className = "util_rfc";
		this.filename = filename;
	}catch(e){
		systemAPI.alert("[util_rfc]::constructor:" + e);
	}
};
window.util_rfc.extend(window.server_RemoteObject);
window.util_rfc.implement({	
	cekSaldo: function(login, tahun, bln1, bln2, cc, akun, fikrs, kokrs, wrttp, ver){		
		this.params.clear();
		this.params.add(login);	
		this.params.add(tahun);	
		this.params.add(bln1);	
		this.params.add(bln2);	
		this.params.add(cc);	
		this.params.add(akun);	
		this.params.add(fikrs);	
		this.params.add(kokrs);	
		this.params.add(wrttp);	
		this.params.add(ver);	
		return this.call("cekSaldo");
	},
	cekSaldo2: function(login, value){		
		this.params.clear();
		this.params.add(login);	
		this.params.add(value);			
		return this.call("cekSaldo2");
	},
	cekSaldos: function(login, tahun, data, fikrs, kokrs, wrttp, ver){		
		this.params.clear();
		this.params.add(login);	
		this.params.add(tahun);			
		this.params.add(data);			
		this.params.add(fikrs);	
		this.params.add(kokrs);	
		this.params.add(wrttp);	
		this.params.add(ver);	
		return this.call("cekSaldos");
	},
	dataGar: function(login, tahun, data, fikrs, kokrs, wrttp, ver){		
		this.params.clear();
		this.params.add(login);	
		this.params.add(tahun);			
		this.params.add(data);			
		this.params.add(fikrs);	
		this.params.add(kokrs);	
		this.params.add(wrttp);	
		this.params.add(ver);	
		return this.call("dataGar");
	},
	dataGar2: function(login, tahun, data){		
		this.params.clear();
		this.params.add(login);	
		this.params.add(tahun);			
		this.params.add(data);					
		return this.call("dataGar2");
	},
	cekSaldoThn: function(login, tahun, data, fikrs, kokrs, wrttp, ver){		
		this.params.clear();
		this.params.add(login);	
		this.params.add(tahun);			
		this.params.add(data);			
		this.params.add(fikrs);	
		this.params.add(kokrs);	
		this.params.add(wrttp);	
		this.params.add(ver);	
		return this.call("cekSaldoThn");
	},
	release:function(login, tahun, data, batch){		
		this.params.clear();
		this.params.add(login);
		this.params.add(tahun);		
		this.params.add(data);
		this.params.add(batch);
		return this.call("FR51");		
	},
	releaseCapex:function(login, tahun, data){		
		this.params.clear();
		this.params.add(login);
		this.params.add(tahun);		
		this.params.add(data);		
		return this.call("releaseCapex");		
	},
	keepPlan: function(login, tahun, data, kokrs, fikrs, batch, ver){
		this.params.clear();
		this.params.add(login);
		this.params.add(tahun);		
		this.params.add(data);		
		this.params.add(kokrs);
		this.params.add(fikrs);
		this.params.add(batch);
		this.params.add(ver);
		return this.call("keepPlan");		
	},
	transfer: function(login, tahun, data, kokrs, fikrs, batch, ver){		
		this.params.clear();
		this.params.add(login);		
		this.params.add(tahun);		
		this.params.add(data);		
		this.params.add(kokrs);
		this.params.add(fikrs);
		this.params.add(batch);
		this.params.add(ver);
		return this.call("transfer");
	},
	transferCapex: function(login, tahun, data){		
		this.params.clear();
		this.params.add(login);		
		this.params.add(tahun);		
		this.params.add(data);			
		return this.call("prosesCapex");
	},
	getAkunCC: function(login, tahun, data){		
		this.params.clear();
		this.params.add(login);		
		this.params.add(tahun);		
		this.params.add(data);						
		return this.call("transferCPX");
	},
	getSAPInfo : function(login){
		this.params.clear();
		this.params.add(login);
		return this.call("getSAPInfo");
	},
	getPLSAPGL: function(login, periode1, periode2, fs, ledger, ubis  ){
		this.params.clear();
		this.params.add(login);
		this.params.add(periode1);
		this.params.add(periode2);
		this.params.add(fs);
		this.params.add(ledger);
		this.params.add(ubis);
		return this.call("getPLSAPGL");
	},
	getActualSAPGL: function(login, tahun, fs, ledger, ubis){
		this.params.clear();
		this.params.add(login);
		this.params.add(tahun);
		this.params.add(fs);
		this.params.add(ledger);
		this.params.add(ubis);
		return this.call("getActualSAPGL");
	},
	getTBCC : function(login, tahun, ubis){
		this.params.clear();
		this.params.add(login);
		this.params.add(tahun);
		this.params.add(ubis);
		return this.call("getTBCC");

	}
});
