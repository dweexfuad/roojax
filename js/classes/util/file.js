//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.util_file = function(connection, filename){
	try{
		this.remoteClassName = "server_util_File";
		window.util_file.prototype.parent.constructor.call(this, connection,filename);
		this.className = "util_file";
		this.filename = filename;
	}catch(e){
		systemAPI.alert("[util_file]::constructor:" + e);
	}
};
window.util_file.extend(window.server_RemoteObject);
window.util_file.implement({
	getExtension : function(){
	   if (this.filename == undefined) return "";
       var ext = this.filename.substr(this.filename.lastIndexOf(".")); 
       return ext;
    },
    setFilename: function(filename){
		this.filename = filename;
        this.params.clear();
		this.params.add(filename);	
		return this.call("setFilename");
	},
	setFilenameA: function(filename, callback, requester){
		this.filename = filename;
        this.params.clear();
		this.params.add(filename);	
		this.callAsynch("setFilename", callback, requester);
	},
	createDir: function(childName, callback, requester){
		this.params.clear();
		this.params.add(childName);	
		this.callAsynch("createDir", callback, requester);
	},
	deleteDir: function(childName, callback, requester){
		this.params.clear();
		this.params.add(childName);	
		this.callAsynch("deleteDir", callback, requester);
	},
	isDir: function(filename){
		this.params.clear();
		this.params.add(filename);
		return this.call("isDir");
	},
	isDirA: function(filename, callback, requester){
		this.params.clear();
		this.params.add(filename);
		this.callAsynch("isDir", callback, requester);
	},
	isFile: function(filename){
		this.params.clear();
		this.params.add(filename);
		return this.call("isFile");
	},
	isExist: function(filename){
		this.params.clear();
		this.params.add(filename);
		return this.call("isExist");
	},
	realPath: function(){
		this.params.clear();
		return this.call("realPath");
	},
	copyTo: function(destName, overwrite, callback, requester){
		this.params.clear();
		this.params.add(destName);	
		this.params.add(overwrite);	
		this.callAsynch("copyTo", callback, requester);
	},
	copyFileTo: function(filename, destName, overwrite, callback, requester){
		this.params.clear();
		this.params.add(filename);	
		this.params.add(destName);	
		this.params.add(overwrite);	
		this.callAsynch("copyFileTo", callback, requester);
	},
    copyFilesTo: function(filename, destName, overwrite, callback, requester){
		this.params.clear();
		this.params.add(filename);	
		this.params.add(destName);	
		this.params.add(overwrite);	
		this.callAsynch("copyFilesTo", callback, requester);
	},	
	deleteFile: function(filename, callback, requester){
		this.params.clear();	
		this.params.add(filename);
		this.callAsynch("deleteFile", callback, requester);
	},
	deleteFiles: function(filename, callback, requester){
		this.params.clear();	
		this.params.add(filename);
		this.callAsynch("deleteFiles", callback, requester);
	},
	listDir: function(dir){
		this.params.clear();	
		this.params.add(dir);
		return this.call("listDir");
	},
	listDirA: function(dir, callback, requester){
		this.params.clear();	
		this.params.add(dir);
		this.callAsynch("listDir", callback, requester);
	},
	listAllDir: function(dir){
		this.params.clear();	
		this.params.add(dir);
		return this.call("listAllDir");
	},
	listFile: function(){
		this.params.clear();	
		return this.call("listFile");
	},
	listFolder: function(folder){
		this.params.clear();	
		this.params.add(folder);
		return this.call("listFolder");
	},
	listFolderA: function(folder, callback, requester){
		this.params.clear();	
		this.params.add(folder);
		this.callAsynch("listFolder", callback, requester);
	},
	getDriveList: function(){
		this.params.clear();	
		return this.call("getDriveList");
	},
	getContents: function(encd){
		this.params.clear();	
		this.params.add(encd);	
		return this.call("getContents");
	},
	getFileContents: function(filename){
		this.params.clear();	
		this.params.add(filename);	
		return this.getRequestObj("getFileContents");
	},
	setContents: function(data, flag, filename, callback, requester){
		this.params.clear();	
		this.params.add(data);	
		this.params.add(flag);			
		this.params.add(filename);	
		this.callAsynch("setContents", callback, requester);
	},
	getFileName: function(){
		this.params.clear();		
		return this.call("getFileName");
	},
	getBaseName: function(){
		this.params.clear();		
		return this.call("getBaseName");
	},
	getBaseFileName: function(){
		this.params.clear();		
		return this.call("getBaseFileName");
	},
	getBaseFileNameOfFile: function(file){
		this.params.clear();		
		this.params.add(file);	
		return this.call("getBaseFileNameOfFile");
	},
	getExtention: function(){
		this.params.clear();			
		return this.call("getExtention");
	},
	getAccessTime: function(){
		this.params.clear();			
		return this.call("getAccessTime");
	},
	getModifTime: function(){
		this.params.clear();			
		return this.call("getModifTime");
	},
	getFileSize: function(){
		this.params.clear();			
		return this.call("getFileSize");
	},
	getTempDir: function(){
		this.params.clear();			
		return this.call("getTempDir");
	},
	getRootDir: function(){
		this.params.clear();			
		return this.call("getRootDir");
	},
	getRootDirA: function(callback, requester){
		this.params.clear();			
		this.callAsynch("getRootDir", callback, requester);
	},
	deleteTemp: function(user, callback, requester){
		this.params.clear();			
		this.params.add(user);
		this.callAsynch("deleteTemp", callback, requester);
	},
	delDirContent: function(callback, requester){
		this.params.clear();			
		this.callAsynch("delDirContent", callback, requester);
	},
	rename: function(oldname,newname, callback, requester){
		this.params.clear();			
		this.params.add(oldname);
		this.params.add(newname);
		this.callAsynch("rename", callback, requester);
	},
	getProperties: function(callback, requester){
		this.params.clear();			
		this.callAsynch("getProperties", callback, requester);
	},
	del: function(callback, requester){
		this.params.clear();		
		this.callAsynch("delete", callback, requester);
	},
	cleanUp: function(folder, callback, requester){
	    this.params.clear();		
	    this.params.add(folder);
		this.callAsynch("cleanUp", callback, requester);
    }	
});
