//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.util_standar = function(){
	window.util_standar.prototype.parent.constructor.call(this);
	this.className = "util_standar";
};
window.util_standar.extend(window.Function);
window.util_standar.implement({
	showListData: function(FormRequester, caption, cbbl, editNama, sql, sql2, fields, operator, labels,withBlank){
		try
		{
			FormRequester.block();
			system.activeApplication._mainForm.listDataForm.setServices(undefined);
			system.activeApplication._mainForm.listDataForm.setCaption(caption);
			system.activeApplication._mainForm.listDataForm.setRequester(FormRequester, cbbl, 0,0,false,editNama);		
			system.activeApplication._mainForm.listDataForm.setScriptSql(sql, sql2);						
			system.activeApplication._mainForm.listDataForm.setFields(fields, operator);
			system.activeApplication._mainForm.listDataForm.setLabels(labels);
			system.activeApplication._mainForm.listDataForm.show(withBlank);
			system.activeApplication._mainForm.listDataForm.setDataFromItems();		
			system.activeApplication._mainForm.listDataForm.setFocus();		
		}catch(e){
			systemAPI.alert("[standar]::showlistDataFromItems:"+e);
		}
	},
	showListData2: function(FormRequester, caption, cbbl, editNama, sql, sql2, fields, operator, labels,withBlank){
		try
		{		
			this.showListData(FormRequester, caption, cbbl, editNama, sql, sql2, fields, operator, labels,withBlank);
		}catch(e){
			systemAPI.alert("[standar]::showlistDataFromItems"+e);
		}
	},
	showListDataFromItems: function(FormRequester, caption, requester, sql, sql2, fields, operator,labels, withBlank){
		try
		{
			FormRequester.block();
			system.activeApplication._mainForm.listDataForm.setServices(undefined);
			system.activeApplication._mainForm.listDataForm.setCaption(caption);
			system.activeApplication._mainForm.listDataForm.setRequester(FormRequester, requester);		
			system.activeApplication._mainForm.listDataForm.setScriptSql(sql, sql2);				
			system.activeApplication._mainForm.listDataForm.setFields(fields, operator);
			system.activeApplication._mainForm.listDataForm.setLabels(labels);
			system.activeApplication._mainForm.listDataForm.show(withBlank);
			system.activeApplication._mainForm.listDataForm.setDataFromItems();		
			system.activeApplication._mainForm.listDataForm.setFocus();		
		}catch(e){
			systemAPI.alert("[standar]::showlistDataFromItems"+e);
		}
	},
	showListDataForSG: function(FormRequester, caption, requester, row, col, sql, sql2, fields, operator,labels,withBlank, multiSelection){
		try{
			FormRequester.block();
			if (multiSelection){
				if (system.activeApplication.fMultipleSelection === undefined) 
				{
					uses("system_fSelectOptions");
					system.activeApplication.fMultipleSelection = new system_fSelectOptions(system.activeApplication);					
					
				}
				system.activeApplication.fMultipleSelection.setCaption(caption);
				system.activeApplication.fMultipleSelection.setRequester(FormRequester, requester, row,col,false,undefined);		
				system.activeApplication.fMultipleSelection.setScriptSql(sql, sql2);
				system.activeApplication.fMultipleSelection.setFields(fields, operator);
				system.activeApplication.fMultipleSelection.setLabels(labels);
				system.activeApplication.fMultipleSelection.showForm(withBlank);				
				system.activeApplication.fMultipleSelection.setFocus();
			}else{
				system.activeApplication._mainForm.listDataForm.setServices(undefined);
				system.activeApplication._mainForm.listDataForm.setCaption(caption);
				system.activeApplication._mainForm.listDataForm.setRequester(FormRequester, requester, row, col);		
				system.activeApplication._mainForm.listDataForm.setScriptSql(sql, sql2);		
				system.activeApplication._mainForm.listDataForm.setFields(fields, operator);
				system.activeApplication._mainForm.listDataForm.setLabels(labels);
				system.activeApplication._mainForm.listDataForm.show(withBlank);
				system.activeApplication._mainForm.listDataForm.setDataFromItems();
			}
		}catch(e)
		{
			systemAPI.alert("[standar]::showlistDataFromItems"+e);
		}
	},
	showListDataForSGFilter: function(FormRequester, caption, requester, row, col, sql, sql2, fields, operator,labels,withBlank, multiSelection){
		try{
			FormRequester.block();
			if (multiSelection){
				if (system.activeApplication.fMultipleSelection === undefined) 
				{
					uses("system_fSelectOptions");
					system.activeApplication.fMultipleSelection = new system_fSelectOptions(system.activeApplication);					
					
				}
				system.activeApplication.fMultipleSelection.setCaption(caption);
				system.activeApplication.fMultipleSelection.setRequester(FormRequester, requester, row,col,true,undefined);		
				system.activeApplication.fMultipleSelection.setScriptSql(sql, sql2);
				system.activeApplication.fMultipleSelection.setFields(fields, operator);
				system.activeApplication.fMultipleSelection.setLabels(labels);
				system.activeApplication.fMultipleSelection.showForm(withBlank);				
				system.activeApplication.fMultipleSelection.setFocus();
			}else{
				system.activeApplication._mainForm.listDataForm.setServices(undefined);
				system.activeApplication._mainForm.listDataForm.setCaption(caption);
				system.activeApplication._mainForm.listDataForm.setRequester(FormRequester, requester, row, col, true);		
				system.activeApplication._mainForm.listDataForm.setScriptSql(sql, sql2);		
				system.activeApplication._mainForm.listDataForm.setFields(fields, operator);
				system.activeApplication._mainForm.listDataForm.setLabels(labels);
				system.activeApplication._mainForm.listDataForm.show(withBlank);
				system.activeApplication._mainForm.listDataForm.setDataFromItems();
			}
		}catch(e)
		{
			systemAPI.alert("[standar]::showlistDataFromItems"+e);
		}
	},
	showListDataForSG2: function(FormRequester, caption, requester, row, col, sql, sql2, fields, operator,labels,withBlank){
		try{
			this.showListDataForSG(FormRequester, caption, requester, row, col, sql, sql2, fields, operator,labels,withBlank);
		}catch(e){
			systemAPI.alert("[standar]::showlistDataFromItems"+e);
		}
	},
	isiCBNNextPeriode: function(periode, nnext, cb){
		var bln = parseInt(periode.substr(4, 6), 10);
		var thn = parseInt(periode.substr(0, 4), 10);
		var res = "";
		var sBln = undefined;
		try
		{
			cb.addItem(0,periode);
			for (var i = 1 ; i <= nnext; i++)
			{
				if (bln == 12)
				{
					thn++;
					bln = 0;
				}
				bln++;
				if (bln < 10)
					sBln = "0" + bln;	
				else sBln = bln;
				res = thn +""+ sBln;
					
				cb.addItem(i,res);	
			}
		}catch(e){
			systemAPI.alert("[util_standar]::isiCBNextPeriode : " + e);
		}
	},
	noBuktiOtomatis: function(dbLib, table, field, formatNoBukti, formatFloat,addFilter,reverse){
		try{
			if (addFilter == undefined) addFilter = "";
		  var format = "";
		  var result = "";
		  var res = 0;
		  var frmt = /*"DP"+*/formatNoBukti;
		  for (var i=0;i < formatFloat.length;i++)
		      format += "_";
		  if (reverse == true)
			var tmp = dbLib.getDataProvider("select max("+field+") as "+field+" from "+table+" where "+field+" like '"+format+formatNoBukti+"' " + addFilter,true);    
		  else 
			var tmp = dbLib.getDataProvider("select max("+field+") as "+field+" from "+table+" where "+field+" like '"+formatNoBukti+format+"' " + addFilter,true);    
		  if (typeof tmp != "string"){
    		  if (tmp.rs.rows[0] == undefined)
    		    res = 1;
    		  else 
    		  {         
		        eval("tmp = tmp.rs.rows[0]."+field);
		        if (tmp == undefined || tmp == "-") {
					if (reverse == true)
						tmp = formatFloat+frmt;
					else 
						tmp = frmt+formatFloat;
				}
		        if (reverse == true)
					res = parseFloat(tmp.substr(0,formatFloat.length));
				else 
					res = parseFloat(tmp.substr(frmt.length));
    		    res++;//alert(tmp[1].substr(frmt.length));
    		  }  
    		  result = res.toString();
    		  for (var i =0;i < format.length;i++)
    		  {
    		    if (result.length < format.length)
    		        result = "0" + result;      
    		  }
		  }else result = "";
		  if (reverse == true)
			return result + frmt;
		  else 
			return frmt + result;
		}catch(e){
		  systemAPI.alert("util_standar:noBuktiOtomatis:"+e);
		}      
	},
	noBuktiOtomatis2: function(dbLib, table, field, formatNoBukti1,formatNoBukti2, formatFloat,addFilter){
		try{
		  if (addFilter == undefined) addFilter = "";
		  var format = "";
		  var result = "";
		  var res = 0;
		  var frmt = formatNoBukti1;
		  for (var i=0;i < formatFloat.length;i++)
		      format += "_";
		  var tmp = dbLib.getDataProvider("select max("+field+") as "+field+" from "+table+" where "+field+" like '"+formatNoBukti1+format+formatNoBukti2+"' " + addFilter,true);    
		  if (typeof tmp != "string"){
    		  if (tmp.rs.rows[0] == undefined)
    		    res = 1;
    		  else 
    		  {         
		        eval("tmp = tmp.rs.rows[0]."+field);
		        if (tmp == undefined || tmp == "-") {
					tmp = frmt+formatFloat+formatNoBukti2;
				}
		        res = parseFloat(tmp.substr(frmt.length - 1, formatFloat.length));
    		    res++;//alert(tmp[1].substr(frmt.length));
    		  }  
    		  result = res.toString();
    		  for (var i =0;i < format.length;i++)
    		  {
    		    if (result.length < format.length)
    		        result = "0" + result;      
    		  }
		  }else result = "";
		  return frmt + result + formatNoBukti2;
		}catch(e){
		  systemAPI.alert("util_standar:noBuktiOtomatis:"+e);
		}      
	},
	nextNoBuktiOtomatis: function(no_bukti, formatNoBukti, formatFloat,reverse){
		try{
			if (addFilter == undefined) addFilter = "";
			var format = "";
			var result = "";
			var res = 0;
			var frmt = /*"DP"+*/formatNoBukti;
			for (var i=0;i < formatFloat.length;i++)
				format += "_";
			var tmp = no_bukti; 
			if (tmp == undefined || tmp == "-") tmp = frmt+formatFloat;
			if (reverse == true)
				res = parseFloat(tmp.substr(0,length(formatFloat)));
			else 
				res = parseFloat(tmp.substr(frmt.length));
			res++;

			result = res.toString();
			for (var i =0;i < format.length;i++)
			{
				if (result.length < format.length)
					result = "0" + result;      
			 }

		  if (reverse == true)
			return result + frmt;
		  else 
			return frmt + result;
		}catch(e){
		  systemAPI.alert("util_standar:noBuktiOtomatis:"+e);
		}      
	},
	strToArray: function(str){
		try{
			uses("control_arrayList");	
			var result = new control_arrayList();
			if (str != "")
			{
				var lines = str.split("\r\n");
				var line = undefined;	
				var list = undefined;
				var first = true;
				for (var i in lines)	
				{
					line = lines[i];
					line = line.split(";");
					if (first)
					{
						first = false;
					}else
					{
						list = new control_arrayList();		
						for (var j in line)
						{			
							list.add(line[j]);
						}
						result.add(list);
					}
				}
			}
			return result;
		}catch(e){
			systemAPI.alert("[strToArray]:"+e);
		}
	},
	isiItemsWithPeriode: function(items){
		if (system.activeApplication._mainForm.dbLib != undefined)
		{
			var periode = system.activeApplication._mainForm.dbLib.getAllPeriode();	
			items.clear();
			periode = periode.split("\r\n");
			var values = undefined;
			var first = true;
			for (var i in periode)
			{
				if (first)
				{
					first = false;
					continue;
				}
				items.set(i,periode[i]);
			}
		}
	},
	isiItemsWithPeriodeLok: function(lok,items){
		if (system.activeApplication._mainForm.dbLib != undefined)
		{
			var periode = system.activeApplication._mainForm.dbLib.getAllPeriodeLok(lok);
			items.clear();
			periode = periode.split("\r\n");
			var values = undefined;
			var first = true;
			for (var i in periode)
			{
				if (first)
				{
					first = false;
					continue;
				}
				items.set(i,periode[i]);
			}
		}
	},
	ListDataSGFilter: function(FormRequester, caption, requester, row, col,sql, sql2, fields, operator,labels, withBlank, multiSelection){
		try
		{
			if (multiSelection){
				if (system.activeApplication.fMultipleSelection === undefined) 
				{
					uses("system_fSelectOptions");
					system.activeApplication.fMultipleSelection = new system_fSelectOptions(system.activeApplication);					
					
				}
								
				
				system.activeApplication.fMultipleSelection.setCaption(caption);
				system.activeApplication.fMultipleSelection.setRequester(FormRequester, requester, row,col,true);		
				system.activeApplication.fMultipleSelection.setScriptSql(sql, sql2);
				system.activeApplication.fMultipleSelection.setFields(fields, operator);
				system.activeApplication.fMultipleSelection.setLabels(labels);
				system.activeApplication.fMultipleSelection.showForm(withBlank);				
				system.activeApplication.fMultipleSelection.setFocus();
			}else{
				FormRequester.block();
				system.activeApplication._mainForm.listDataForm.setCaption(caption);			
				system.activeApplication._mainForm.listDataForm.setRequester(FormRequester, requester, row, col, true);
				system.activeApplication._mainForm.listDataForm.setScriptSql(sql, sql2);			
				system.activeApplication._mainForm.listDataForm.setFields(fields, operator);
				system.activeApplication._mainForm.listDataForm.setLabels(labels);
				system.activeApplication._mainForm.listDataForm.show(withBlank);
				system.activeApplication._mainForm.listDataForm.setDataFromItems();			
			}
		}catch(e)
		{
			systemAPI.alert("[filterLib]::ListDataSGFilter:"+e);
		}
	},
	ListDataSGFilter2: function(FormRequester, caption, requester, row, col,sql, sql2, fields, operator,labels, withBlank, multiSelection){
		try{
			this.ListDataSGFilter(FormRequester, caption, requester, row, col,sql, sql2, fields, operator,labels, withBlank, multiSelection);
		}catch(e)
		{
			systemAPI.alert("[filterLib]::ListDataSGFilter:"+e);
		}
	},
	clearByTag: function(container, tag, focusControl){
		try{
			var comp = undefined;
			for (var i in container.childs.objList)
			{
				comp = system.getResource(container.childs.objList[i]);
				for (var j = 0; j < tag.length;j++)
				{
					if (comp.getTag() == parseInt(tag[j]) )
					{					  
						if ((comp.className == "control_saiLabelEdit") || (comp.className == "control_saiEdit") || (comp.className == "control_saiCBBL") || (comp.className == "control_saiCB") || (comp.className == "control_saiMemo") || (comp.className == "control_saiCBB")) 
						{
							comp.setText("");
							if (comp.className == "control_saiCBBL")
								comp.setRightLabelCaption("");
							if (comp == focusControl) comp.setFocus();		
							if ((comp.className == "control_saiLabelEdit") || (comp.className == "control_saiEdit") || (comp.className == "control_saiCBB"))
							{ 
							    if (comp.tipeText == ttNilai)
							    {
							      comp.setText("0");
				                }
				            }
						}else if ((comp.className == "control_saiSG")|| (comp.className == "control_saiGrid"))
						{
							comp.clear();
						}else if ( comp.className == "control_tinymceCtrl"){
							comp.setCode("");
						}
						break;
					}
				}
				if ((comp instanceof control_containerControl))
				{
					this.clearByTag(comp, tag, focusControl);
				}
			}
		}catch(e){
			systemAPI.alert("Error Message",e);
		}
	},
	getNextPeriode: function(periode){
		var bln = parseFloat(periode.substr(4,2));//'201101';
		var thn = parseFloat(periode.substr(0,4)); 
		if (bln < 12) bln +=1;
		else {
			bln = 1;
			thn += 1;
		}
		if (bln < 10) bln = "0"+bln;
		else bln = bln.toString();
		return thn.toString()+bln;
	},
	checkEmptyByTag: function(container, tag){
		try{
			var comp = undefined;
			var valid = true; 
			for (var i in container.childs.objList)
			{
				comp = system.getResource(container.childs.objList[i]);			
				for (var j = 0; j < tag.length;j++)
				{
					if (comp.getTag() == parseInt(tag[j]) )
					{					  
						if ((comp.className == "control_saiLabelEdit") || (comp.className == "control_saiEdit") || (comp.className == "control_saiCBBL") || (comp.className == "control_saiCB") || (comp.className == "control_saiMemo")  || (comp.className == "control_saiCBB"))
						{
							if ((comp.getText() == "")&&(comp.visible))
				            {															
				              //comp.fadeBackground("ffff00","ff0000",100,5,comp.getFullId() +"_edit");
				              comp.setFocus();
				              if (!(comp.className == "control_saiEdit"))                
				                system.alert(container,"field tidak boleh kosong ("+comp.getCaption()+")");
				              else system.alert(undefined,"field tidak boleh kosong ("+comp.getName()+")");                 
				              valid = false;              
				              return valid;
				              break;            
				            }								
						}else if ((comp.className == "control_saiSG")||(comp.className == "control_saiGrid")||(comp.className == "control_treeGrid")||(comp.className == "control_stringGrid")||(comp.className == "control_mdGrid"))
						{						  
				            /*
							for (var i=0; i < comp.rows.getLength(); i++){
				                for (var c=0;c<comp.columns.getLength();c++)
				                {
				                   if (comp.getCell(c,i) == "")
				                   {
				                      system.alert(container,"field tidak boleh kosong \n"+
				                        "column :"+comp.columns.get(c).getTitle()+"\n"+
				                        "row    :"+i);
				                      valid = false;              
				                      return valid;
				                   } 
				                }
				            }*/
				            if (comp.getRowValidCount() == 0)
				            {
				              system.alert(container,"Table tidak boleh kosong \n");
				              valid = false;
				              return valid;
				            }					    
				        }          
					}				
				}			
				if ((comp instanceof control_containerControl))
				{
					valid = this.checkEmptyByTag(comp, tag);
					if (!valid) return valid;
				}				
			}
			return valid;
		}catch(e){
			systemAPI.alert("Error Message",e);
		}
	},
	doTimer: function(comp){
	    try{
	        if ( Math.random ( ) > .5 )
	        {
	          comp.setColor('#fcff0c');
	        }
	        else
	        {
	          comp.setColor('#ff7e0c');
	        }                
	        window.setInterval("this.doTimer(comp)", 100);
	    }
	    catch (e){			
	    }        
	},
	getSqlCount: function(sql){		
		return "select count(*) from ("+sql+") a";
	},
	showSelection : function(FormRequester, caption, object, sql,  fields, labels,withBlank){
		var app = system.activeApplication;
		if (app.fMultipleSelection === undefined) 
		{
			uses("system_fSelectOptions");
			app.fMultipleSelection = new system_fSelectOptions(app);					
			
		}
		app.fMultipleSelection.setCaption("Filter Data ("+caption+")");
		app.fMultipleSelection.setRequester(FormRequester, object, 0,0,false,undefined);		
		app.fMultipleSelection.setScriptSql("select "+fields+" from ("+sql +") a ", this.getSqlCount(sql));
		app.fMultipleSelection.setFields(fields, "where");
		app.fMultipleSelection.setLabels(labels);
		app.fMultipleSelection.showForm(false);				
		app.fMultipleSelection.setFocus();	
	}
});
