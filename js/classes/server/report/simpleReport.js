//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.server_report_simpleReport = function()
{
	try
	{
		window.server_report_simpleReport.prototype.parent.constructor.call(this);
		this.className = "server_report_simpleReport";
		this.http = new XMLHttpRequest();
		this.address = "server/report.php";		
	}catch(e){
		alert("[server_report_simpleReport] :: constructor : " + e);
	}

};
window.server_report_simpleReport.extend(window.portalui_XMLAble);
window.server_report_simpleReport.implement({
    setReport: function(report){
        this.report = report;
    },
    getUrl : function(report, method, param){
        var params = "object="+urlencode(report)+"&method="+method+"&param="+urlencode(param);
        return (this.address +"?"+params);  
    },    
    doCall: function(report, method, param){
        try{
            var params = "object="+urlencode(report)+"&method="+method+"&param="+urlencode(param);
            this.http.open("POST", this.address, false);
    		this.http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
            this.http.send(params);				
            if (this.http.status == 200)
                return this.http.responseText;
            else
    			/*	400	Bad Request
    				403	Forbidden
    				404	Not Found
    				50x	Server Errors
    				500	Internal Server Error
    			*/
            return "Error : " + this.http.status +"\n"+this.http.responseText;
        }catch(e){
            alert(e);
        }
    },
    preview: function(report, filter, page, rows, showFilter, perusahaan, filter2, dataFilter, resultType){
        try{
            var param = filter+"#"+rows+"#"+filter2+"#"+page+"#"+showFilter+"#"+perusahaan+"#"+dataFilter+"#"+resultType;        
            return this.doCall(report, "preview",param);
        }catch(e){
            alert(e);
        }    
    },
    previewWithHeader: function(report, filter, page, rows, showFilter, perusahaan, filter2, dataFilter, resultType){
    	try{
            var param = filter+"#"+rows+"#"+filter2+"#"+page+"#"+showFilter+"#"+perusahaan+"#"+dataFilter+"#"+resultType;        
            return this.getUrl(report, "previewWithHeader",param);
        }catch(e){
            alert(e);
        }
    },
    getTotalPage: function(report, filter, rows, filter2, dataFilter)
    {
    	try{
            var param = filter+"#"+rows+"#"+filter2+"####"+dataFilter;        
            return this.doCall(report, "getTotalPage",param);
        }catch(e){
            alert(e);
        }    
    },
    createPdf: function(report, filter, page, rows, showFilter, perusahaan,filter2, dataFilter){
    	try{
            var param = filter+"#"+rows+"#"+filter2+"#"+page+"#"+showFilter+"#"+perusahaan+"#"+dataFilter;        
            return this.getUrl(report, "createPdf",param);
        }catch(e){
            alert(e);
        }
    },
    createXls: function(report, filter, page, rows, showFilter, perusahaan, filter2, dataFilter){
    	try{
            var param = filter+"#"+rows+"#"+filter2+"#"+page+"#"+showFilter+"#"+perusahaan+"#"+dataFilter;        
            return this.getUrl(report, "createXls",param);
        }catch(e){
            alert(e);
        }
    },
    createCSV: function(classObj, filter, page, rows, showFilter, perusahaan, filter2, dataFilter){
    	try{
            var param = filter+"#"+rows+"#"+filter2+"#"+page+"#"+showFilter+"#"+perusahaan+"#"+dataFilter;        
            return this.doCall(report, "createCSV",param);
        }catch(e){
            alert(e);
        }
    },
    createTxt: function(classObj, filter, page, rows, showFilter, perusahaan, filter2, dataFilter){
    	try{
            var param = filter+"#"+rows+"#"+filter2+"#"+page+"#"+showFilter+"#"+perusahaan+"#"+dataFilter;        
            return this.doCall(report, "createTxt",param);
        }catch(e){
            alert(e);
        }
    }
});
