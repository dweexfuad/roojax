//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.util_dbLib = function(connection,options){
	try{	
		this.remoteClassName = "server_DBConnection_dbLib";
		if (options == "undefined") options = system.getActiveApplication()._dbSetting;
		window.util_dbLib.prototype.parent.constructor.call(this, connection,options);
		this.className = "util_dbLib";
		
	}catch(e){
		systemAPI.alert("[util_dbLib] :: constructor : ", e);
	}
};
window.util_dbLib.extend(window.server_RemoteObject);
window.util_dbLib.implement({
	setRequester: function(data){
		this.requester = data;
	},
	runQuery: function(sql, callback, requester){
		try{
			
			this.params.clear();
			this.params.add(sql);
			this.callAsynch("runQuery",callback, requester);
		}catch(e){
			if (system != undefined)
				system.alert(undefined,e,"[util_dbLib]::runQuery");
			else alert("[util_dbLib]::runQuery : " + e);
		}
	},
	runQueryA: function(sql,callback, requester){
		try{
			
			this.params.clear();
			this.params.add(sql);
			this.callAsynch("runQuery",callback, requester);
		}catch(e)
		{
			if (systemAPI != undefined)
				systemAPI.alert("[util_dbLib]::runQuery : " + e,"");
			else alert("[util_dbLib]::runQuery : " + e);
		}
	},
	runSQL: function(sql){
		try{
			this.params.clear();
			this.params.add(sql);		
			return this.call("runSQL");
		}catch(e)
		{
			if (systemAPI != undefined)
				systemAPI.alert("[util_dbLib]::runSQL : " + e,"");
			else alert("[util_dbLib]::runSQL : " + e);
		}
	},
	runSQLA: function(sql,callback, requester){
		try{
			
			this.params.clear();
			this.params.add(sql);
			this.callAsynch("runSQL",callback, requester);
		}catch(e)
		{
			if (systemAPI != undefined)
				systemAPI.alert("[util_dbLib]::runSQL : " + e,"");
			else alert("[util_dbLib]::runSQL : " + e);
		}
	},
	loadQuery: function(sql){
		try{
			this.params.clear();
			this.params.add(sql);
			return this.call("runQuery");
		}catch(e)
		{
			if (systemAPI != undefined)
				systemAPI.alert("[util_dbLib]::loadQuery : " + e,"");
			else alert("[util_dbLib]::loadQuery : " + e);
		}
	},
	getDataProvider: function(sql, isObject, rowPerPage){
		try{					
			if (rowPerPage != undefined){
				var tmp = new arrayList();												
				var tot = this.getDataProvider("select count(*) as tot from ("+sql+") a ",true);								
				tot = Math.ceil(tot.rs.rows[0].tot / rowPerPage); 						
				for (var pg=1; pg <= tot; pg++){
					var dt = this.getDataProviderPage(sql,pg, rowPerPage, true);					
					tmp.add(dt);
				}	
				ret = {rs:{rows:[]}};
				for (var i in tmp.objList){
					for (var r in tmp.get(i).rs.rows){
						ret.rs.rows.push(tmp.get(i).rs.rows[r]);
					}
				}			
				return ret;
			}else{
				this.params.clear();
				this.params.add(sql);											
				var ret = this.call("getDataProvider");
				if (isObject) {
				  try{
					eval("ret = "+ret+";");
				}catch(e){
					try{
						ret = JSON.parse(ret);
					}catch(e){
						throw e;
					}
				}
				}
			}
			return ret;
		}catch(e){
			if (system != undefined)
				system.alert(undefined,"[util_dbLib]::dataProvider:"+ret,e);
			else alert("[util_dbLib]::dataProvider : " + e+"\r\n"+ret);
		}
	},
	getDataProviderKeyMap: function(sql, isObject, keyField){
		try{								
			this.params.clear();
			this.params.add(sql);											
			this.params.add(keyField);		
			var ret = this.call("getDataProviderKeyMap");
			if (isObject) {
				try{
					eval("ret = "+ret+";");
				}catch(e){
					systemAPI.alert(e);
					try{
						ret = JSON.parse(ret);
					}catch(e){
						throw e;
					}
				}				
			}
			return ret;
		}catch(e){
			if (system != undefined)
				system.alert(undefined,"[util_dbLib]::dataProvider:"+ret,e);
			else alert("[util_dbLib]::dataProvider : " + e+"\r\n"+ret);
		}
	},
	getDataProviderA: function(sql,callback, requester){
		try{			
			this.params.clear();
			this.params.add(sql);
			this.callAsynch("getDataProvider",callback, requester);
		}catch(e)
		{
			if (system !== undefined)
				system.alert(undefined,"[util_dbLib]::dataProviderA:"+ret,e);
			else alert("[util_dbLib]::dataProvider : " + e);
		}
	},
	getDataProviderR: function(sql){
		try{			
			this.params.clear();
			this.params.add(sql);
			return this.getRequestObj("getDataProvider");
		}catch(e)
		{
			if (systemAPI !== undefined)
				systemAPI.alert("[util_dbLib]::dataProvider : " + e,"");
			else alert("[util_dbLib]::dataProvider : " + e);
		}
	},
	getDataProviderPage: function(sql,start, offset, isObject){
		try{
			
			this.params.clear();
			this.params.add(sql);
			this.params.add(start);
			this.params.add(offset);
			var ret = this.call("getDataProviderPage");
			if (isObject) {
				try{
					eval("ret = "+ret+";");
				}catch(e){
					try{
						ret = JSON.parse(ret);
					}catch(e){
						throw e;
					}
				}
			}
			return ret;
		}catch(e)
		{
			if (system != undefined)
				system.alert(undefined,"[util_dbLib]::dataProviderPage:"+ret,e);
			else alert("[util_dbLib]::dataProvider : " + e+"\r\n"+ret);
		}
	},
	getDataProviderPageA: function(sql,start, offset,callback, requester){
		try{
			
			this.params.clear();
			this.params.add(sql);
			this.params.add(start);
			this.params.add(offset);
			this.callAsynch("getDataProviderPage",callback, requester);
		}catch(e)
		{
			if (systemAPI != undefined)
				systemAPI.alert("[util_dbLib]::dataProvider : " + e,"");
			else alert("[util_dbLib]::dataProvider : " + e);
		}
	},
	getMultiDataProvider: function(sql, isObject){
		try{		
			this.params.clear();
			this.params.add(sql);
			var ret = this.call("getMultiDataProvider");
			if (isObject) {
				try{
					eval("ret = "+ret+";");
				}catch(e){
					try{
						ret = JSON.parse(ret);
					}catch(e){
						throw e;
					}
				}
			}
			return ret;
		}catch(e){
			if (system != undefined)
				system.alert(undefined,"[util_dbLib]::multiDataProvider:"+ret,e);
			else alert("[util_dbLib]::dataProvider : " + e);
			return ret;
		}
	},
	getMultiDataProviderR: function(sql){
		try{		
			this.params.clear();
			this.params.add(sql);
			var ret = this.getRequestObj("getMultiDataProvider");			
			return ret;
		}catch(e){
			if (system != undefined)
				system.alert(undefined,e,"[util_dbLib]::multiDataProvider ");
			else alert("[util_dbLib]::dataProvider : " + e);			
		}
	},
	getMultiDataProviderA: function(sql,callback, requester){
		try{		
			this.params.clear();
			this.params.add(sql);
			this.callAsynch("getMultiDataProvider",callback, requester);						
		}catch(e){
			if (systemAPI != undefined)
				systemAPI.alert("[util_dbLib]::dataProvider : " + e,"");
			else alert("[util_dbLib]::dataProvider : " + e);
		}
	},
	loadQueryA: function(sql,callback, requester){
		try{
			
			this.params.clear();
			this.params.add(sql);
			this.callAsynch("runQuery",callback, requester);
		}catch(e)
		{
			if (systemAPI != undefined)
				systemAPI.alert("[util_dbLib]::loadQuery : " + e,"");
			else alert("[util_dbLib]::loadQuery : " + e);
		}
	},
	execSQL: function(sql, rowPerPage, start){
		try{		
			this.params.clear();
			this.params.add(sql);
			this.params.add(rowPerPage);
			this.params.add(start);
			var res = this.call("execSQL");
			res = eval('('+res+')');
			return res;
		}catch(e)
		{		
			systemAPI.alert("[util_dbLib]::execSQL : " + e,"");
			return false;
		}
	},
	execSQLA: function(sql, rowPerPage, start, requester,callback){
		try{
			
			this.params.clear();
			this.params.add(sql);
			this.params.add(rowPerPage);
			this.params.add(start);		
			//this.requester = requester;
			this.callAsynch("execSQL",callback, requester);				
		}catch(e)
		{		
			system.alert(undefined,e,"[util_dbLib]::execSQL");
			return false;
		}
	},
	execSQLAsync: function(sql, rowPerPage, start,callback, requester){
		try{
			
			this.params.clear();
			this.params.add(sql);
			this.params.add(rowPerPage);
			this.params.add(start);
			this.callAsynch("execSQL",callback, requester);				
		}catch(e)
		{		
			systemAPI.alert("[util_dbLib]::execSQL : " + e,"");
			return false;
		}
	},
	getRowCount: function(sql, rowPerPage){
		this.params.clear();
		this.params.add(sql);
		this.params.add(rowPerPage);
		return this.call("getRowCount");
	},
	getRowCountA: function(sql, rowPerPage,callback, requester){
		this.params.clear();
		this.params.add(sql);
		this.params.add(rowPerPage);
		this.callAsynch("getRowCount",callback, requester);
	},
	execQuery: function(sql,callback, requester){
		this.params.clear();
		this.params.add(sql);
		this.callAsynch("execQuery",callback, requester);
	},
	execQueryA: function(sql,callback, requester){
		this.params.clear();
		this.params.add(sql);
		this.callAsynch("execQuery",callback, requester);
	},
	updateBlob: function(table, col, value, id){
		this.params.clear();
		this.params.add(table);
		this.params.add(col);
		this.params.add(value);
		this.params.add(id);
		return this.call("updateBlob");
	},
	updateBlobA: function(table, col, value, id,callback, requester){
		this.params.clear();
		this.params.add(table);
		this.params.add(col);
		this.params.add(value);
		this.params.add(id);
		this.callAsynch("updateBlob",callback, requester);
	},
	execQuerySync: function(sql){
		this.params.clear();
		this.params.add(sql);
		return this.call("execQuery");
	},
	execArraySQL: function(sql,callback, requester){
		this.params.clear();
		this.params.add(sql);
		this.callAsynch("execArraySQL",callback, requester);
	},
	execArraySQLS: function(sql){
		this.params.clear();
		this.params.add(sql);
		return this.call("execArraySQL");
	},
	beginTrans: function(){
		this.params.clear();
		this.callAsynch("beginTrans");
	},
	completeTrans: function(){
		this.params.clear();
		this.callAsynch("completeTrans");
	},
	checkTrans: function(){
		this.params.clear();
		this.callAsynch("checkTrans");
	},
	insertData: function(tableName, fields, values){
		this.params.clear();
		this.params.add(tableName);
		this.params.add(fields);
		this.params.add(values);
		this.callAsynch("insertData");
	},
	insertDataString: function(tableName, fields, values){
		this.params.clear();
		this.params.add(tableName);
		this.params.add(fields);
		this.params.add(values);
		this.callAsynch("insertDataString");
	},
	locateData: function(tableName, keyFields, keyValues, fieldReturns, allFields){
		this.params.clear();
		this.params.add(tableName);
		this.params.add(keyFields);
		this.params.add(keyValues);
		this.params.add(fieldReturns);
		this.params.add(allFields);
		return this.call("locateData");
	},
	locateAndEditData: function(tableName, keyFields, keyValues, fields, values){
		this.params.clear();
		this.params.add(tableName);
		this.params.add(keyFields);
		this.params.add(keyValues);
		this.params.add(fields);
		this.params.add(values);
		this.callAsynch("locateAndEditData");
	},
	locateAndDeleteData: function(tableName, keyFields, keyValues){
		this.params.clear();
		this.params.add(tableName);
		this.params.add(keyFields);
		this.params.add(keyValues);
		this.callAsynch("locateAndDeleteData");
	},
	listData: function(sql, page, rowPerPage,callback, requester){
		try{		
			this.params.clear();
			this.params.add(sql);
			this.params.add(page);
			this.params.add(rowPerPage);
			this.callAsynch("listData",callback, requester);
		}catch(e){
			if (systemAPI != undefined)
				systemAPI.alert("[util_dbLib]::listData : " + e,"");
			else alert("[util_dbLib]::listData:" + e);
		}
	},
	listDataObj: function(sql, page, rowPerPage){
		try{
			
			this.params.clear();
			this.params.add(sql);
			this.params.add(page);
			this.params.add(rowPerPage);
			return this.call("listDataObj");
		}catch(e)
		{
			if (systemAPI != undefined)
				systemAPI.alert("[util_dbLib]::listDataObj : " + e,"");
			else alert("[util_dbLib]::listDataObj:" + e);
		}
	},
	listDataObjA: function(sql, page, rowPerPage,callback, requester){
		try{
			
			this.params.clear();
			this.params.add(sql);
			this.params.add(page);
			this.params.add(rowPerPage);
			this.callAsynch("listDataObj",callback, requester);
		}catch(e){
			if (systemAPI != undefined)
				systemAPI.alert("[util_dbLib]::listDataObj : " + e,"");
			else alert("[util_dbLib]::listDataObj:" + e);
		}
	},	
	getTempDir: function(){
		this.params.clear();
		return this.call("getTempDir");
	},
	getTempDirA: function(callback, requester){
		this.params.clear();
		this.callAsynch("getTempDir",callback, requester);
	},
	getPeriode: function(lokasi){
		this.params.clear();
		this.params.add(lokasi);
		return this.call("getPeriode");
	},
	getPeriodeA: function(lokasi,callback, requester){
		this.params.clear();
		this.params.add(lokasi);
		this.callAsynch("getPeriode",callback, requester);
	},
	getPP: function(user, lokasi){
		this.params.clear();
		this.params.add(user);
		this.params.add(lokasi);
		return this.call("getPP");
	},
	getPPA: function(user, lokasi,callback, requester){
		this.params.clear();
		this.params.add(user);
		this.params.add(lokasi);
		this.callAsynch("getPP",callback, requester);
	},
	getLokasi: function(user){
		this.params.clear();
		this.params.add(user);
		return this.call("getLokasi");
	},
	getLokasiA: function(user,callback, requester){
		this.params.clear();
		this.params.add(user);
		this.call("getLokasiA",callback, requester);
	},
	getAllPeriode: function(){
		this.params.clear();
		return this.call("getAllPeriode");
	},
	getAllPeriodeA: function(callback, requester){
		this.params.clear();
		this.callAsynch("getAllPeriode",callback, requester);
	},
	getAllPeriodeLok: function(lok){
		this.params.clear();
		this.params.add(lok);
		return this.call("getAllPeriodeLok");
	},
	getAllPeriodeLokA: function(lok,callback, requester){
		this.params.clear();
		this.params.add(lok);
		this.callAsynch("getAllPeriodeLok",callback, requester);
	},
	getDBName: function(){
		this.params.clear();
		return this.call("getDBName");
	},
	getDBNameA: function(callback, requester){
		this.params.clear();
		this.callAsynch("getDBName",callback, requester);
	},
	getDBHost: function(){
		this.params.clear();
		return this.call("getDBHost");
	},
	getDBHostA: function(callback, requester){
		this.params.clear();
		this.callAsynch("getDBHost",callback, requester);
	},
	getAllTables: function(){
		this.params.clear();
		return this.call("getAllTables");
	},
	getAllTablesA: function(callback, requester){
		this.params.clear();
		this.callAsynch("getAllTables",callback, requester);
	},
	getColumnOfTable: function(table){
		this.params.clear();
		this.params.add(table);
		return this.call("getColumnOfTable");
	},
	getColumnOfTableA: function(table,callback, requester){
		this.params.clear();
		this.params.add(table);
		this.callAsynch("getColumnOfTable",callback, requester);
	},
	addUserLog: function(uid, hostname, userlok, ip){
		this.params.clear();
		this.params.add(uid);
		this.params.add(hostname);
		this.params.add(userlok);
		this.params.add(ip);
		return this.call("addUserLog");
	},
	addUserLogA: function(uid, hostname, userlok, ip,callback, requester){
		this.params.clear();
		this.params.add(uid);
		this.params.add(hostname);
		this.params.add(userlok);
		this.params.add(ip);
		this.callAsynch("addUserLog",callback, requester);
	},
	logout: function(sesId){
		this.params.clear();
		this.params.add(sesId);	
		return this.call("logout");
	},
	logoutA: function(sesId,callback, requester){
		this.params.clear();
		this.params.add(sesId);	
		this.callAsynch("logout",callback, requester);
	},
	addUserFormAccess: function(uid, form, userlok, sesId ){
		this.params.clear();
		this.params.add(uid);
		this.params.add(form);
		this.params.add(userlok);
		this.params.add(sesId);
		return this.call("addUserFormAccess");
	},
	addUserFormAccessA: function(uid, form, userlok, sesId,callback, requester ){
		this.params.clear();
		this.params.add(uid);
		this.params.add(form);
		this.params.add(userlok);
		this.params.add(sesId);
		this.callAsynch("addUserFormAccess",callback, requester);
	},
	getData: function(table, keyField, keyValues, fieldReturn,allFields){
		if (keyField.length != keyValues.length){
			systemAPI.alert(this, "Programming Error","keyField and keyValues has different length");
			return false;
		}
		uses("server_util_Map");
		fields = new server_util_Map();
		for (var i=0;i<keyField.length;i++)
			fields.set(i, keyField[i]);
		values = new server_util_Map();	
		for (var i=0;i<keyValues.length;i++)
		values.set(i,keyValues[i]);
		return this.locateData(table,fields, values, fieldReturn,allFields);
	},
	execMasterDetailSQL: function(sql){
		this.params.clear();
		this.params.add(sql);
		return this.call("execMasterDetailSQL");
	},
	bufferTable: function(table){
		this.params.clear();
		this.params.add(table);
		return this.call("bufferTable");
	},
	sqlToHtml: function(sql,page,rowPerPage, title,width, fieldType, withTotal,groupBy, summary, groupHeader,calFields, totalPerGroup){
		this.params.clear();
		this.params.add(sql);
		this.params.add(page);
		this.params.add(rowPerPage);
		this.params.add(title);
		this.params.add(width);
		this.params.add(fieldType);
		this.params.add(withTotal);
		this.params.add(groupBy);
		this.params.add(summary);
		this.params.add(groupHeader);
		this.params.add(calFields);
		this.params.add(totalPerGroup);
		return this.call("sqlToHtml");
	},
	sqlToHtmlA: function(sql,page,rowPerPage, title,width, fieldType, withTotal,groupBy, summary, groupHeader,calFields, totalPerGroup,callback, requester){
		this.params.clear();
		this.params.add(sql);
		this.params.add(page);
		this.params.add(rowPerPage);
		this.params.add(title);
		this.params.add(width);
		this.params.add(fieldType);
		this.params.add(withTotal);
		this.params.add(groupBy);
		this.params.add(summary);
		this.params.add(groupHeader);
		this.params.add(calFields);
		this.params.add(totalPerGroup);
		this.callAsynch("sqlToHtml",callback, requester);
	},
	sqlToHtmlGrouping: function(sql,page,rowPerPage, title,width, fieldType, withTotal,groupBy){
		this.params.clear();
		this.params.add(sql);
		this.params.add(page);
		this.params.add(rowPerPage);
		this.params.add(title);
		this.params.add(width);
		this.params.add(fieldType);
		this.params.add(withTotal);
		this.params.add(groupBy);
		return this.call("sqlToHtmlGrouping");
	},
	sqlToHtmlGroupingA: function(sql,page,rowPerPage, title,width, fieldType, withTotal,groupBy,callback, requester){
		this.params.clear();
		this.params.add(sql);
		this.params.add(page);
		this.params.add(rowPerPage);
		this.params.add(title);
		this.params.add(width);
		this.params.add(fieldType);
		this.params.add(withTotal);
		this.params.add(groupBy);
		this.callAsynch("sqlToHtmlGrouping",callback, requester);
	},
	sqlToHtmlWithHeader: function(sql,page,rowPerPage, title,width, fieldType, withTotal,groupBy, summary, groupHeader,calFields, formHeader, lokasi, periode, totalPerGroup,callback, requester){
		this.params.clear();
		this.params.add(sql);
		this.params.add(page);
		this.params.add(rowPerPage);
		this.params.add(title);
		this.params.add(width);
		this.params.add(fieldType);
		this.params.add(withTotal);
		this.params.add(groupBy);
		this.params.add(summary);
		this.params.add(groupHeader);
		this.params.add(calFields);
		this.params.add(formHeader);
		this.params.add(lokasi);
		this.params.add(periode);
		this.params.add(totalPerGroup);
		this.callAsynch("sqlToHtmlWithHeader",callback, requester);
	},
	sqlToHtmlWithHeaderR: function(sql,page,rowPerPage, title,width, fieldType, withTotal,groupBy, summary, groupHeader,calFields, formHeader, lokasi, periode, totalPerGroup){
		this.params.clear();
		this.params.add(sql);
		this.params.add(page);
		this.params.add(rowPerPage);
		this.params.add(title);
		this.params.add(width);
		this.params.add(fieldType);
		this.params.add(withTotal);
		this.params.add(groupBy);
		this.params.add(summary);
		this.params.add(groupHeader);
		this.params.add(calFields);
		this.params.add(formHeader);
		this.params.add(lokasi);
		this.params.add(periode);
		this.params.add(totalPerGroup);
		return this.getRequestObj("sqlToHtmlWithHeader");
	},
	sqlToXls: function(sql,page,rowPerPage, title,width, fieldType, withTotal,groupBy,file){
		this.params.clear();
		this.params.add(sql);
		this.params.add(page);
		this.params.add(rowPerPage);
		this.params.add(title);
		this.params.add(width);
		this.params.add(fieldType);
		this.params.add(withTotal);
		this.params.add(groupBy);
		this.params.add(file);	
		return this.getUrl("sqlToXls");
	},
	sqlToXls2: function(sql,title,file){
		this.params.clear();
		this.params.add(sql);
		this.params.add(title);
		this.params.add(file);	
		return this.getRequestObj("sqlToXls2");
	},
	sqlToXls3: function(sql,title,file){
		this.params.clear();
		this.params.add(sql);
		this.params.add(title);
		this.params.add(file);	
		return this.call("sqlToXls3");
	},
	sqlToPdf: function(sql,page,rowPerPage, title,width, fieldType, withTotal,groupBy){
		this.params.clear();
		this.params.add(sql);
		this.params.add(page);
		this.params.add(rowPerPage);
		this.params.add(title);
		this.params.add(width);
		this.params.add(fieldType);
		this.params.add(withTotal);
		this.params.add(groupBy);	
		return this.getUrl("sqlToPdf");
	},	
	getPdf: function(sql,title, titleHeight, titleFontSize, orientation, pageFormat, fontSize, rowHeight, header, headerFontSize, headerHeight, headerWidth, namafile, margin){
		this.params.clear();
		this.params.add(sql);
		this.params.add(title);
		this.params.add(titleHeight);	
		this.params.add(titleFontSize);	
		this.params.add(orientation);	
		this.params.add(pageFormat);	
		this.params.add(fontSize);	
		this.params.add(rowHeight);	
		this.params.add(header);	
		this.params.add(headerFontSize);	
		this.params.add(headerHeight);	
		this.params.add(headerWidth);	
		this.params.add(namafile);	
		this.params.add(margin);	
		return this.getRequestObj("sqlToPdfExt");
	},
	updateEngine: function(){
		this.params.clear();
		return this.call("updateEngine");
	},
	updateEngineA: function(){
		this.params.clear();
		this.callAsynch("updateEngine");
	},
	getDataXML: function(sql){
		this.params.clear();
		this.params.add(sql);
		return this.call("getDataXML");
	},
	getDataXMLA: function(sql, callback, requester){
		this.params.clear();
		this.params.add(sql);
		this.callAsynch("getDataXML", callback, requester);
	},
	killAllConnection:function(callback, requester){
		this.params.clear();		
		this.callAsynch("killAllConnection",callback, requester);
	},
	getPeriodeFromSQL: function(sql){
		try{
			var data = this.getDataProvider(sql,true);
			if (data.rs.rows[0] !== undefined){
				return data.rs.rows[0].periode;
			}return "";
		}catch(e){			
			systemAPI.alert("getPeriodeFromSQL",e);
			return "";
		}
	},
	setItemsFromSQL: function(sql, items){
		try{
			var data = this.getDataProvider(sql,true);
			if (data.rs.rows[0] !== undefined){
				var line, values = [];
				for (var i in data.rs.rows){
					line = data.rs.rows[i];
					for (var l in line)
					values[values.length] = line[l];
				}
				for (var i in items){
					for (var v in values)
						items[i].set(v,values[v]);
				}
			}
		}catch(e){			
			systemAPI.alert(e);
			return "";
		}
	},
	getTableStructure: function(table){
		this.params.clear();
		this.params.add(table);
		return this.call("getTableStructure");
	},
	getTableStructureA: function(table,callback, requester){
		this.params.clear();
		this.params.add(table);
		this.callAsynch("getTableStructure",callback, requester);
	},
	getAllTableStructure: function(table){
		this.params.clear();
		this.params.add(table);
		return this.call("getAllTableStructure");
	},
	getAllTableStructureA: function(table,callback, requester){
		this.params.clear();
		this.params.add(table);
		this.callAsynch("getAllTableStructure",callback, requester);
	},
	loginAndLoad: function(sql, usr, pwd, ldap,callback, requester){
		this.params.clear();
		this.params.add(sql);		
		this.params.add(usr);		
		this.params.add(pwd);
		this.params.add(ldap);
		this.callAsynch("loginAndLoad",callback, requester);
	},
	listUser: function(){
		this.params.clear();		
		this.callAsynch("listUser");
	},
	onlineUser: function(){
		this.params.clear();		
		this.callAsynch("onlineUser");
	}
});
