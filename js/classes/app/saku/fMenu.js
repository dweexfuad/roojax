//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.app_saku_fMenu = function(owner){
	if (owner){
		try{
			window.app_saku_fMenu.prototype.parent.constructor.call(this, owner);
			this.className = "app_saku_fMenu";
			this.app._mainForm.childFormConfig(this, "mainButtonClick","Setting Menu", 0);					
			this.maximize();
			uses("saiCB;imageButton;treeView");
			this.e0 = new saiCB(this,{bound:[20,12,200,20], caption:"Kelompok Menu", checkItem: false});						
			this.btn = new button(this,{bound:[220,12,70,18], caption:"Reload", icon:"icon/refresh.png", click:"doClick"});								
			this.addBtn = new button(this,{bound:[27,13,20,20], mouseOver:[this,"doButtonMouseOver"], mouseOut:[this, "doButtonMouseOut"],caption:" ", icon:"icon/plus.png", click:[this,"entriesClick"]});				
			this.editBtn = new button(this,{bound:[50,13,20,20], mouseOver:[this,"doButtonMouseOver"], mouseOut:[this, "doButtonMouseOut"],caption:" ",icon:"icon/edit.png", click:[this,"entriesClick"]});				
			this.delBtn = new button(this,{bound:[73,13,20,20], mouseOver:[this,"doButtonMouseOver"], mouseOut:[this, "doButtonMouseOut"],caption:" ",icon:"icon/minus.png", click:[this,"entriesClick"]});		
			this.relBtn = new button(this,{bound:[96, 13, 20, 20], mouseOver:[this,"doButtonMouseOver"], mouseOut:[this, "doButtonMouseOut"],caption:" ", icon:"icon/link.png", click:[this,"entriesClick"]});		
			this.downBtn = new button(this,{bound:[119,13,20,20],mouseOver:[this,"doButtonMouseOver"], mouseOut:[this, "doButtonMouseOut"], caption:" ", icon:"icon/arrow-down.png", click:[this,"entriesClick"]});				
			this.upBtn = new button(this,{bound:[142,13,20,20], mouseOver:[this,"doButtonMouseOver"], mouseOut:[this, "doButtonMouseOut"],caption:" ", icon:"icon/arrow-up.png", click:[this,"entriesClick"]});		
			this.leftBtn = new button(this,{bound:[165,13,20,20], mouseOver:[this,"doButtonMouseOver"], mouseOut:[this, "doButtonMouseOut"],caption:" ", icon:"icon/arrow-left.png", click:[this,"entriesClick"]});				
			this.rightBtn = new button(this,{bound:[188,13,20,20],mouseOver:[this,"doButtonMouseOver"], mouseOut:[this, "doButtonMouseOut"], caption:" ", icon:"icon/arrow-right.png", click:[this,"entriesClick"]});								
			this.rootBtn = new button(this,{bound:[211,13,20,20], mouseOver:[this,"doButtonMouseOver"], mouseOut:[this, "doButtonMouseOut"],caption:"Tidak ada yang pilih", caption:" ",icon:"icon/settings.png", click:[this,"entriesClick"]});						
			this.treev = new treeView(this,{bound:[20,14,900,this.getHeight() - 130], dblClick:[this,"treeClick"]});
			this.treev.childLength = 700;				
			this.treev.setShadow(true);
			
						
			this.dblib = this.app.dbLib;
			this.dblib.addListener(this);			
			this.e0.setText(this.app._kodeMenu);			
			var klp = this.dblib.getDataProvider("select distinct kode_klp from menu");					
			eval("klp= "+klp+";");
			if (klp.rs.rows[0] !== undefined) {
				this.e0.clearItem();
				for (var i in klp.rs.rows){							
					this.e0.addItem(i,klp.rs.rows[i].kode_klp);
				}
			}
			this.menuStr = "";
			this.rearrangeChild(20,23);
			this.rowIndex = 0;		
			this.setTabChildIndex();
			this.onClose.set(this, "doClose");
		}catch(e){
			systemAPI.alert(e);
		}
	}
};
window.app_saku_fMenu.extend(window.childForm);
window.app_saku_fMenu.implement({
	doClose: function(sender){
		this.dblib.delListener(this);
	},
	mainButtonClick: function(sender){
		if (sender == this.app._mainForm.bClear)	
			system.confirm(this, "clear", "screen akan dibersihkan?","");		
		else if (sender == this.app._mainForm.bSimpan)
			system.confirm(this, "simpan", "Apa data sudah benar?","");
		else if (sender == this.app._mainForm.bEdit)
			system.confirm(this, "ubah", "Apa perubahan data sudah benar?","");
		else if (sender == this.app._mainForm.bHapus)
			system.confirm(this, "hapus", "Yakin data akan dihapus?","");		
	},
	doRequestReady: function(sender, methodName, result, request){
		if (sender == this.dblib && this == request){			
			switch (methodName){
				
				case "getDataProvider" : 									
					eval("this.menuStr = "+result+";");
					this.loadMenu();					
					break;
				case "execArraySQL":
					if (result.toLowerCase().search("error") == -1)
						system.info(this, "transaction completed","");
					else
						system.alert(this, result,"");
					hideLoading();
					break;
			}
		}
	},
	doModalResult: function(event, modalResult, value){
		switch (event){
			case "Add" :
			   if ( modalResult == mrOk){
	    			var valArray = value.split(";");
	    			var node = this.selectedItem;
	    			if (node == undefined)
	    			  node = new treeNode(this.treev);
	    			else
	    			  node = new treeNode(this.selectedItem);
	    			node.setKode(valArray[0]);
	    			node.setCaption(valArray[1]);	
	    			node.setKodeForm(valArray[2]);
	    			if (node.data === undefined){
	    				node.data = {icon : "-"};
	    			}
	    			node.data.icon = valArray[3];
	    			if (trim(valArray[2]) != "")
				       node.setShowKode(true);
				    else node.setShowKode(false);
				}
				break;
			case "Edit" :
				if (modalResult == mrOk){
					var item = this.selectedItem;
					var valArray = value.split(";");
					item.setKode(valArray[0]);
					item.setCaption(valArray[1]);
					item.setKodeForm(valArray[2]);
					item.data.icon = valArray[3];
					if (trim(valArray[2]) != "")
				       item.setShowKode(true);
				    else item.setShowKode(false);
				}
				break;
			case "Remove" :
				if (modalResult == mrOk)			
					 this.treev.delItem(this.selectedItem);
				break;
			case "clear" :
				if (modalResult == mrOk)
					this.treev.clear();
				break;
			case "hapus" :
				uses("server_util_arrayList");
				sql = new server_util_arrayList();
				sql.add("delete from menu where kode_klp = '"+this.e0.getText()+"'");
				this.dblib.execArraySQL(sql, undefined, this);	
				break;
			case "simpan" :
				if (modalResult == mrOk){
					this.rowIndex = 0;
					showLoading();
					var value = this.getTreeData(this.treev);
					var sqlScripts = value.split(";");
					try{						
						uses("server_util_arrayList");
						sql = new server_util_arrayList();
						sql.add("delete from menu where kode_klp = '"+this.e0.getText()+"'");
						for (var i in sqlScripts)
						{
						   if (trim(sqlScripts[i])!= "")
						       sql.add(sqlScripts[i]);
						}
						this.dblib.execArraySQL(sql, undefined, this);						
					}catch(e){
						hideLoading();
						systemAPI.alert(e);
					}
				}
				break;		
		}
	},
	loadMenu: function(){
		try{
			var menu = this.menuStr;
			var rowNo = 0;			
			var itemValues = undefined;
			if (this.treev != undefined)
				this.treev.clear();				
			var kode = undefined;
			var nama = undefined;
			var kodeForm = undefined;
			var level = undefined;			
			var node = undefined;
			for (var rowNo in menu.rs.rows)
			{
				itemValues = menu.rs.rows[rowNo];					
				kode = itemValues.kode_menu;
				nama = itemValues.nama;
				kodeForm = itemValues.kode_form;
				level = itemValues.level_menu;
				level++;
				if (node == undefined)
					node = new treeNode(this.treev);
				else if (node.getLevel() == level - 1)
					node = new treeNode(node);								
				else if ((node.getLevel() == level))
					node = new treeNode(node.owner);				
				else if (node.getLevel() > level)
				{
					node = node.owner;
					while (node.getLevel() > level)
					    if (node.owner instanceof treeNode)
							node = node.owner;					
					node = new treeNode(node.owner);								
				}		
				node.setKodeForm(kodeForm);
				node.setKode(kode);
				node.setCaption(nama);
				node.setShowKode(true);				
				node.data = itemValues;				
			}			
		}catch(e){
			systemAPI.alert(rowNo +" "+e);
		}
	},
	doClick: function(sender){		
		this.dblib.getDataProviderA("select * from menu where kode_klp = '"+this.e0.getText()+"' order by rowindex",undefined, this);		
	},
	entriesClick: function(sender){
		try{
			uses("app_saku_fMenuDetail",true);	
			if (this.entryMenu !== undefined) this.entryMenu.free();
			this.entryMenu = new app_saku_fMenuDetail(this.app);
			this.entryMenu.setBound((this.app._mainForm.width / 2)- 200,(this.app._mainForm.height / 2) - 150,400,200);
			this.entryMenu.doAfterResize(this.entryMenu.width, this.entryMenu.height);				
			if (sender == this.addBtn){
				var item = this.treev.getSelectedItem();
				if (item != undefined){
					this.selectedItem = item;		
					this.entryMenu.setCaption(item.getCaption());
					this.entryMenu.setItemParent(item);
				}else{
					this.selectedItem = undefined;		
					this.entryMenu.setCaption("Create Entries");			
				}
				this.entryMenu.event = "Add";
				this.entryMenu.formRequester = this;
				this.entryMenu.e0.setReadOnly(false);
				this.entryMenu.e0.setText("");
				this.entryMenu.e1.setText("");
				this.entryMenu.e2.setText("");
				this.entryMenu.e3.setText("-");
				this.entryMenu.showModal();		
			}else if (sender == this.editBtn){
				var item = this.treev.getSelectedItem();
				this.selectedItem = item;
				this.entryMenu.event = "Edit";
				this.entryMenu.formRequester = this;
				this.entryMenu.setCaption(item.getCaption());
				this.entryMenu.setItemParent(item);
				this.entryMenu.e0.setText(item.getKode());				
				this.entryMenu.e1.setText(trim(item.getCaption()));
				this.entryMenu.e2.setText(item.getKodeForm());
				this.entryMenu.e3.setText(item.data.icon);
				this.entryMenu.showModal();		
			}else if (sender == this.rootBtn){
				this.treev.doSelectItem(undefined);	
				this.selectedItem = undefined;				
			}else if (sender == this.delBtn){
				var item = this.treev.getSelectedItem();	
				this.selectedItem = item;
				system.confirm(this, "Remove","Yakin menu "+item.getCaption()+" akan dihapus?");
			}else if (sender == this.upBtn){
				var item = this.treev.getSelectedItem();
				var owner = item.owner;
				var child ,tmp;				
				for (var i=0; i < owner.childsIndex.length;i++)
				{
					tmp = system.getResource(owner.childsIndex[i]);								
					if (tmp.childIndex == (item.childIndex - 1)) 
						child = tmp;																	
				}
				if (child != undefined)
					this.switchItem(item, child);					
			}else if (sender == this.downBtn){
				var item = this.treev.getSelectedItem();
				var owner = item.owner;
				var child ,tmp;
				for (var i=0; i < owner.childsIndex.length;i++)
				{
					tmp = system.getResource(owner.childsIndex[i]);
					if (tmp.childIndex == (item.childIndex + 1)) 
						child = tmp;																
				}				
				if (child != undefined)
					this.switchItem(item, child);				
			}else if (sender == this.leftBtn){
				var item = this.treev.getSelectedItem();
				var owner = item.owner;
				var child = owner;
				if (child != undefined)
				{	
					if (owner instanceof treeView) return false;
					this.moveItem(item, owner.owner);
				}
			}else if (sender == this.rightBtn){
				var item = this.treev.getSelectedItem();
				var owner = item.owner;				
				var child,tmp;
				for (var i=0;i < owner.childsIndex.length;i++)
				{			
					tmp = system.getResource(owner.childsIndex[i])	;			
					if (tmp != undefined && tmp.childIndex == (item.childIndex - 1)) 
						child = tmp;																	
				}
				if (child != undefined)									
					this.moveItem(item, child);
			}			
		}catch(e){
			system.alert(this, "FMenu::Entries Click"+e);
		}
	},
	treeClick: function(item){	
	},
	getTreeData: function(node){
		var result = "";
		var child = undefined;
		if (node instanceof treeView){
			for (var i=0; i < node.childsIndex.length;i++){
				child = system.getResource(node.childsIndex[i]);
				if(child != undefined)
					result += this.getTreeData(child);	
			}
		}else{
			this.rowIndex++;
			result += "insert into menu (kode_menu, nama, level_menu, kode_form, rowindex, kode_klp, icon) values ";
			result += "('" +node.getKode() +"','" + trim(node.getCaption());
			result += "','"+(node.getLevel() - 1).toString()+"','"+node.getKodeForm()+"','"+this.rowIndex+"','"+this.e0.getText()+"', '"+node.data.icon+"');";
			if (node.isHasChild())
				for (var i=0;i < node.childsIndex.length;i++)
				{
					child = system.getResource(node.childsIndex[i]);
					if(child != undefined)
						result += this.getTreeData(child);	
				}
			
		}
		return result;
	},
	doChange: function(sender){
		this.treev.clear();
	},
	copyChilds: function(from, to){
		var temp = undefined;
		for (var i=0; i < from.childsIndex.length;i++){
			temp = system.getResource(from.childsIndex[i]);						
			chld = new treeNode(to);
			chld.setKodeForm(temp.getKodeForm());
			chld.setKode(temp.getKode());
			chld.setCaption(temp.getCaption());
			chld.setShowKode(temp.showKode);													
			chld.data = temp.data;
			if (temp.childs.getLength() != 0)
				this.copyChilds(temp,chld);			
		}
		from.clearChild();
		to.setShowKode(true);
	},
	switchItem: function(from, to){
		var item = from; 
		var child = to;
		var kdForm ,kd,caption ,tmp;
		kdForm = child.getKodeForm();
		kd = child.getKode();	
		var data = child.data; 
		caption = child.getCaption();
		child.setKodeForm(item.getKodeForm());
		child.setKode(item.getKode());
		child.setCaption(item.getCaption());				
		child.setShowKode(true);	
		child.data = item.data;
		item.setKodeForm(kdForm);
		item.setKode(kd);
		item.setCaption(caption);
		item.setShowKode(true);							
		item.owner.rearrange();
		item.data = data;
		child.doSelect();					
		if (item.childs.getLength() != 0){
			tmp = new treeNode(this.treev);
			this.copyChilds(item, tmp);	
		}				
		if (child.childs.getLength() != 0)
			this.copyChilds(child, item);												
		if (tmp instanceof treeNode){
			if (tmp.childs.getLength() != 0){
				this.copyChilds(tmp, child);
				this.treev.delItem(tmp);
			}				
		}	
	},
	moveItem: function(item, owner){	
		var tmp, child = new treeNode(owner);
		child.setKodeForm(item.getKodeForm());
		child.setKode(item.getKode());
		child.setCaption(item.getCaption());				
		child.setShowKode(item.showKode);	
		child.data = item.data;				
		if (item.childs.getLength() != 0){
			tmp = new treeNode(this.treev);
			this.copyChilds(item, tmp);	
		}									
		if (tmp instanceof treeNode){
			if (tmp.childs.getLength() != 0)
			{				
				this.copyChilds(tmp, child);			
				this.treev.delItem(tmp);
			}				
		}		
		child.doSelect();
		this.treev.delItem(item);
	}
});
