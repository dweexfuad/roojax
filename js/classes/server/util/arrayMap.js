//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.server_util_arrayMap = function(options){
    window.server_util_arrayMap.prototype.parent.constructor.call(this,options);
    this.className = "server_util_Map";
        
};
window.server_util_arrayMap.extend(window.control_arrayMap);
window.server_util_Map = window.server_util_arrayMap;
