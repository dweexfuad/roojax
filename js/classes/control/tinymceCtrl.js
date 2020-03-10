//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************

window.control_tinymceCtrl = function(owner, options){
	window.control_tinymceCtrl.prototype.parent.constructor.call(this, owner, options);
	try{
		this.className = "control_tinymceCtrl";
		this.filePath = "";	
		this.hint = "image";        
		this.showHint = false;
		this.autoView = false;	
		this.viewType = 0;	
		this.content = "";
		this.readOnly = false;
		if (options !== undefined){
			this.updateByOptions(options);		
			if (options.readOnly != undefined) this.readOnly = options.readOnly;
		}
		this.ready = false;
		//this.init();
		
	}catch(e){
		alert(e);
	}
};
window.control_tinymceCtrl.extend(window.control_control);
window.tinymceCtrl = window.control_tinymceCtrl;
window.control_tinymceCtrl.implement({
	onLoad: function(e){		
		try{			
			window.tinymceloaded = true;
			//this.init();						
			//getTinyMCECtrl(system.getActiveApplication()._mainForm);
		}catch(e){
			alert(e);
		}
	},
	init: function(){
		try{	
			var self = this;
			if (tinymce){
				//console.log(tinymce);
				tinymce.init({
					selector: "textarea#"+this.getFullId() +"_area",
					branding: false,
					menubar : false,
					theme: 'modern',
					plugins: 'print preview fullpage paste searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount spellchecker imagetools contextmenu colorpicker textpattern help',
					toolbar1: 'formatselect| cut copy paste | undo redo | bold italic strikethrough forecolor backcolor | link | table | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat ', 
					image_advtab: true,
					paste_data_images: true,
					init_instance_callback : function(editor) {
						    console.log("Editor: " + editor.id + " is now initialized.");
						    self.ready = true;
						    if (self.content != "")
							    editor.setContent(self.content);
						  }
				   });
				
			}	
			  
			/*
			if (this.readonly){
				this.editor = $("#"+this.getFullId()+"_view");
				this.editor.show();
				$("#"+this.getFullId()+"_container").hide();
			}else {
				this.editor = new TINY.editor.edit('editor', {
						id: this.getFullId()+"_area",
						width: "100%",
						height: this.height - 50,
						cssclass: 'tinyeditor',
						controlclass: 'tinyeditor-control',
						rowclass: 'tinyeditor-header',
						dividerclass: 'tinyeditor-divider',
						controls: ['bold', 'italic', 'underline', 'strikethrough', '|', 'subscript', 'superscript', '|',
							'orderedlist', 'unorderedlist', '|', 'outdent', 'indent', '|', 'leftalign',
							'centeralign', 'rightalign', 'blockjustify', '|', 'unformat', '|', 'undo', 'redo', 'n',
							'font', 'size', 'style', '|', 'image', 'hr', 'link', 'unlink', '|', 'print'],
						footer: false,
						fonts: ['Verdana','Arial','Georgia','Trebuchet MS'],
						xhtml: true,
						cssfile: 'custom.css',
						bodyid: 'editor',
						footerclass: 'tinyeditor-footer',
						resize: false
					});
				this.tinyeditor = this.editor;
			}	
			*/
		}catch(e){
			error_log("tinyMCECtrl " + e);
		}
	},
	doEditorReady: function(e){		
		//this.setReadOnly(this.readOnly);
	},
	doDraw: function(canvas){		
		canvas.css({background : "#ffffff" });
		var html = "<div id='"+ this.getFullId() +"_view' style='position:absolute;left:0;top:0;width:100%;height:100%;display:none'></div>"+
					"<div id='"+ this.getFullId() +"_container' style='position:absolute;left:0;top:0;width:100%;height:100%;'>"+	
					"<textarea id ='"+ this.getFullId() +"_area' name='"+ this.getFullId() +"_area' style='position:absolute;left:0;top:0;width:100%;height:100%;' "+					
					"></textarea>"+
					"</div>";
		this.setInnerHTML(html, canvas);
		this.init();
		
		
	},	
	getCode: function(){
		return tinymce.get(this.getFullId() +"_area").getContent();
	},
	setCode: function(code){
		try{
			if (this.ready)
			 	tinymce.get(this.getFullId() +"_area").setContent(code);
			this.content = code;
		}catch(e){
			error_log(e);
		}
	},
	setReadOnly: function(readonly){
		try{
			/*
			this.readonly = readonly;
			if (this.readonly){
				this.editor = $("#"+this.getFullId()+"_view");
				this.editor.show();
				$("#"+this.getFullId()+"_container").hide();
				this.tmpEditor = this.editor;
			}else {
				$("#"+this.getFullId()+"_view").hide();
				$("#"+this.getFullId()+"_container").show();
				if (this.tinyeditor == undefined){
					this.editor = new TINY.editor.edit('editor', {
						id: this.getFullId()+"_area",
						width: "100%",
						height: this.height - 50,
						cssclass: 'tinyeditor',
						controlclass: 'tinyeditor-control',
						rowclass: 'tinyeditor-header',
						dividerclass: 'tinyeditor-divider',
						controls: ['bold', 'italic', 'underline', 'strikethrough', '|', 'subscript', 'superscript', '|',
							'orderedlist', 'unorderedlist', '|', 'outdent', 'indent', '|', 'leftalign',
							'centeralign', 'rightalign', 'blockjustify', '|', 'unformat', '|', 'undo', 'redo', 'n',
							'font', 'size', 'style', '|', 'image', 'hr', 'link', 'unlink', '|', 'print'],
						footer: false,
						fonts: ['Verdana','Arial','Georgia','Trebuchet MS'],
						xhtml: true,
						cssfile: 'custom.css',
						bodyid: 'editor',
						footerclass: 'tinyeditor-footer',
						resize: false
					});
					this.tinyeditor = this.editor;	
				}
				this.editor = this.tinyeditor;
			}	
			*/
		}catch(e){
			alert(e);
		}
	}
});
