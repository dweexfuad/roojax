//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.app_saku_fForm = function(owner){
	if (owner){
		try
		{			
			window.app_saku_fForm.prototype.parent.constructor.call(this,owner);
			this.className  = "app_saku_fForm";					
			this.itemsValue = new arrayList();						
			this.app._mainForm.childFormConfig(this, "mainButtonClick","Data Form", 0);			
//------------------------------------------------------------------------
			uses("saiCBBL");
			this.e0 = new saiCBBL(this,{bound:[20,30,200,20], caption:"TCODE", change:[this,"doEditChange"],multiSelection:false,	 
				sql:["select kode_form, nama_form from m_form", ["kode_form","nama_form"],false,["TCODE","Nama"],"where","Daftar Program",false]});
			this.e1 = new saiLabelEdit(this,{bound:[20,55,400,20], caption:"Nama Form"});
			this.e2 = new saiLabelEdit(this,{bound:[20,80,400,20], caption:"Program"});
			this.maximize();
			this.setTabChildIndex();
			this.rearrangeChild(20,23);
			uses("util_dbLib;util_standar");
			this.dbLib = new util_dbLib();
			this.dbLib.addListener(this);			
			this.standarLib = new util_standar();
		}catch(e)
		{
			systemAPI.alert("fForm:Constructor:"+e);
		}
	}
};
window.app_saku_fForm.extend(window.childForm);
//------------------------------------------------------------------ event
window.app_saku_fForm.implement({
	mainButtonClick: function(sender){
		if (sender == this.app._mainForm.bClear){
			system.confirm(this, "clear", "screen akan dibersihkan?","form inputan ini akan dibersihkan");
		}else if (sender == this.app._mainForm.bSimpan){
			system.confirm(this, "simpan", "Apa data sudah benar?","data diform ini apa sudah benar.");
		}else if (sender == this.app._mainForm.bEdit){
			system.confirm(this, "ubah", "Apa perubahan data sudah benar?","perubahan data diform ini akan disimpan.");
		}else if (sender == this.app._mainForm.bHapus){
			system.confirm(this, "hapus", "Yakin data akan dihapus?","data yang sudah disimpan tidak bisa di<i>retrieve</i> lagi.");
		}
	},
	doModalResult: function(event, modalResult){
		switch (event){
			case "clear" :
				if (modalResult == mrOk){
					this.e0.setText("");
					this.e0.setRightLabelCaption("");
					this.e1.setText("");				
					this.e2.setText("");
				}
				break;
			case "simpan" :
				if (modalResult == mrOk){
					try{
						uses("server_util_arrayList");
						sql = new server_util_arrayList();
						sql.add("delete from m_form where kode_form = '"+this.e0.getText()+"' ");
						sql.add("insert into m_form (kode_form, nama_form, form) values ('"+this.e0.getText()+"','"+this.e1.getText()+"','"+this.e2.getText()+"') ");
						this.dbLib.execArraySQL(sql);	
					}catch(e){
						system.alert(this, e,"");
					}
				}
				break;
			case "hapus" :
			   if (modalResult == mrOk){
				    try{
						uses("server_util_arrayList");
						sql = new server_util_arrayList();
						sql.add("delete from  m_form where kode_form = '"+this.e0.getText()+"' ");
						this.dbLib.execArraySQL(sql);	
					}catch(e){
						system.alert(this, e,"");
					}
			   }
				break;
		}
		this.e0.setFocus();
	},
	keyPress: function(sender, charCode, buttonState ){
	},
	doEditChange: function(sender){
		if (this.e0.getText() != ""){
			try{
				var temp = this.dbLib.getDataProvider("select nama_form, form from m_form where kode_form = '"+this.e0.getText()+"' ");
			    eval("temp = "+temp+";");
			    var nama = (temp.rs.rows[0] !== undefined ? temp.rs.rows[0].nama_form : "");
				if ( (nama!= "") && (nama != undefined)){
					this.e1.setText(nama);
					this.e2.setText(temp.rs.rows[0].form);
					this.e0.setRightLabelCaption(nama);
					
				}
			}catch(e){
				system.alert(this, e,"");
			}
		}
	},
	EditExit: function(sender){
	},
	FindBtnClick: function(sender, event){
		
	},
	doRequestReady: function(sender, methodName, result){		
		try{
			if (sender == this.dbLib){			
				switch	(methodName){
					case "execArraySQL" :
						if (result.toLowerCase().search("error") == -1){
							system.info(this.getForm(),"Transaksi Sukses ("+ this.e0.getText()+")","");						
							this.doModalResult("clear",mrOk);
						}else system.alert(this.getForm(), result,""); 
						break;
				}
			}
		}catch(e){
			systemAPI.alert(e);
		}
	}
});