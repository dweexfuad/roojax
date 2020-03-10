//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
uses("server_RemoteObject");
window.server_report_report = function(connection, config)
{
	try
	{
		this.remoteClassName = "server_report_report";
		if (config == undefined) config = system.getActiveApplication()._dbSetting;
		window.server_report_report.prototype.parent.constructor.call(this, connection, config);
		this.className = "server_report_report";
		
	}catch(e){
		alert("[server_report_report] :: constructor : " + e);
	}

};
window.server_report_report.extend(window.server_RemoteObject);
window.server_report_report.prototype.preview = function(report, filter, page, rows, showFilter, perusahaan, filter2, dataFilter, resultType)
{
	this.params.clear();
	this.params.add(report);
	this.params.add(filter);
	this.params.add(page);
	this.params.add(rows);
	this.params.add(showFilter);
	this.params.add(perusahaan);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.params.add(resultType);
	this.callAsynch("preview");
};
window.server_report_report.prototype.getGroupHtml = function(report, filter, showFilter, perusahaan, filter2, dataFilter)
{
	this.params.clear();
	this.params.add(report);
	this.params.add(filter);	
	this.params.add(showFilter);
	this.params.add(perusahaan);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.callAsynch("getGroupHtml");
};
window.server_report_report.prototype.previewHTML = function(html,tipe,file)
{	
	this.params.clear();
	this.params.add(html);
	this.params.add(tipe);
	this.params.add(file);
	return this.getUrl("previewHTML");
};
window.server_report_report.prototype.previewWithHeader = function(report, filter, page, rows, showFilter, perusahaan, filter2, dataFilter, connection)
{
	this.params.clear();
	this.params.add(report);
	this.params.add(filter);
	this.params.add(page);
	this.params.add(rows);
	this.params.add(showFilter);
	this.params.add(perusahaan);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.params.add(connection);
	return this.getUrl("previewWithHeader");
};
window.server_report_report.prototype.previewHTML = function(report, filter, page, rows, showFilter, perusahaan, filter2, dataFilter, connection)
{
	this.params.clear();
	this.params.add(report);
	this.params.add(filter);
	this.params.add(page);
	this.params.add(rows);
	this.params.add(showFilter);
	this.params.add(perusahaan);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.params.add(connection);
	return this.getRequestObj("previewWithHeader");
};
window.server_report_report.prototype.getTotalPage = function(report, filter, rows, filter2, dataFilter, connection)
{
	this.params.clear();
	this.params.add(report);
	this.params.add(filter);
	this.params.add(rows);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.params.add(connection);
	return this.call("getTotalPage");
};

window.server_report_report.prototype.createPdf = function(report, filter, page, rows, showFilter, perusahaan,filter2, dataFilter, connection)
{
	this.params.clear();
	this.params.add(report);
	this.params.add(filter);
	this.params.add(page);
	this.params.add(rows);
	this.params.add(showFilter);
	this.params.add(perusahaan);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.params.add(connection);
	return this.getUrl("createPdf");
};
window.server_report_report.prototype.createPdf2 = function(report, filter, page, rows, showFilter, perusahaan,filter2, dataFilter, connection)
{
	this.params.clear();
	this.params.add(report);
	this.params.add(filter);
	this.params.add(page);
	this.params.add(rows);
	this.params.add(showFilter);
	this.params.add(perusahaan);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.params.add(connection);
	return this.call("createPdf");
};
window.server_report_report.prototype.createXls = function(report, filter, page, rows, showFilter, perusahaan, filter2, dataFilter, connection)
{
	this.params.clear();
	this.params.add(report);
	this.params.add(filter);
	this.params.add(page);
	this.params.add(rows);
	this.params.add(showFilter);
	this.params.add(perusahaan);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.params.add(connection);
	return this.getUrl("createXls");
};
window.server_report_report.prototype.createExcel = function(report, filter, page, rows, showFilter, perusahaan, filter2, dataFilter, connection)
{
	this.params.clear();
	this.params.add(report);
	this.params.add(filter);
	this.params.add(page);
	this.params.add(rows);
	this.params.add(showFilter);
	this.params.add(perusahaan);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.params.add(connection);
	return this.getRequestObj("createXls");
};

window.server_report_report.prototype.createCSV = function(classObj, filter, page, rows, showFilter, perusahaan, filter2, dataFilter)
{
	this.params.clear();
	this.params.add(classObj);
	this.params.add(filter);
	this.params.add(page);
	this.params.add(rows);
	this.params.add(showFilter);
	this.params.add(perusahaan);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.callAsynch("createCSV");
};
window.server_report_report.prototype.createTxt = function(classObj, filter, page, rows, showFilter, perusahaan, filter2, dataFilter)
{
	this.params.clear();
	this.params.add(classObj);
	this.params.add(filter);
	this.params.add(page);
	this.params.add(rows);
	this.params.add(showFilter);
	this.params.add(perusahaan);
	this.params.add(filter2);
	this.params.add(dataFilter);
	this.callAsynch("createTxt");
};

window.server_report_report.prototype.setReportName = function(report)
{
	this.params.clear();
	this.params.add(report);
	this.callAsynch("setReportName");
};
window.server_report_report.prototype.setClassObj = function(classObj)
{
	this.params.clear();
	this.params.add(classObj);
	this.callAsynch("setClassObj");
};

window.server_report_report.prototype.downloadChart = function(classObj)
{
	this.params.clear();	
	return this.getUrl("downloadChart");
};
