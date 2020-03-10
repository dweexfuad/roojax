/***********************************************************************************************
*	Copyright (c) 2008 SAI, PT and Salltanera Teknologi, PT   and Others 		
*	 All rights reserved. This program and the accompanying materials
*	 are made available under the terms of the Common Public License v1.0
*	 which accompanies this distribution, and is available at												
*	Contributors 
* 			SAI, PT											
***********************************************************************************************/
uses("server_RemoteObject");
window.server_ide_editor = function(connection)
{
	try
	{
		this.remoteClassName = "server_ide_editor";
		window.server_ide_editor.prototype.parent.constructor.call(this, connection);
		this.className = "server_ide_editor";
		
	}catch(e)
	{
		alert("[server_ide_editor] :: constructor : " + e);
	}

}
window.server_ide_editor.extend(window.server_RemoteObject);

window.server_ide_editor.prototype.getControls = function()
{
  this.params.clear();
  return this.call("getControls");
}
window.server_ide_editor.prototype.listDir = function(folder)
{
  this.params.clear();
  this.params.add(folder);
  return this.call("listDir");
}
window.server_ide_editor.prototype.saveForm = function(folder, filename, data)
{
  this.params.clear();
  this.params.add(folder);
  this.params.add(filename);
  this.params.add(data);
  this.callAsynch("saveForm");
}
window.server_ide_editor.prototype.loadClass = function(classname)
{
  this.params.clear();  
  this.params.add(classname);  
  return this.call("loadClass");
}
window.server_ide_editor.prototype.getContents = function(filename)
{
  this.params.clear();
  this.params.add(filename);
  return this.call("getContents");
}


