//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_buttonState = function(x, y)
{
    window.control_buttonState.prototype.parent.constructor.call(this);
    this.className = "control_buttonState";   
    this.altKey = false;
    this.altLeft = false;
    this.ctrlKey = false;
    this.ctrlLeft = false;
    this.shiftKey = false;
    this.shiftLeft = false;
};
window.control_buttonState.extend(window.Function);
window.buttonState = window.control_buttonState;
window.control_buttonState.prototype.toString = function(){
	return "control_buttonState([])";
};
window.control_buttonState.implement({			
			set: function(event){
			    if (event.altKey)
			        this.altKey = true;
			    else
			        this.altKey = false;

			    if (event.altLeft)
			        this.altLeft = true;
			    else
			        this.altLeft = false;

			    if (event.ctrlKey)
			        this.ctrlKey = true;
			    else
			        this.ctrlKey = false;

			    if (event.ctrlLeft)
			        this.ctrlLeft = true;
			    else
			        this.ctrlLeft = false;

			    if (event.shiftKey)
			        this.shiftKey = true;
			    else
			        this.shiftKey = false;

			    if (event.shiftLeft)
			        this.shiftLeft = true;
			    else
			        this.shiftLeft = false;
			},
			isAltKey:function(){
				return this.altKey;
			},
			isAltLeft:function(){
				return this.altLeft;
			},
			isAltRight: function(){
				return this.altKey && (!this.altLeft);
			},
			isCtrlKey: function(){
				return this.ctrlKey;
			},
			isCtrlLeft: function(){
				return this.ctrlLeft;
			},
			isCtrlRight: function(){
				return this.ctrlKey && !this.ctrlLeft;
			},
			isShiftKey: function(){
				return this.shiftKey;
			},
			isShiftLeft:function(){
				return this.shiftLeft;
			},
			isShiftRight: function(){
				return this.shiftKey && !this.shiftLeft;
			}
		});
