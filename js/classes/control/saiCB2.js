window.control_saiCB2 = function(owner, options){
    if (owner){
    		window.control_saiCB2.prototype.parent.constructor.call(this, owner,options);
	        this.className = "control_saiCB2";	        
	       	this.onChange = new eventHandler();
			if (options !== undefined){
				this.updateByOptions(options);				
				if (options.caption!== undefined) this.setCaption(options.caption);
				if (options.items !== undefined) {
					this.setItems(options.items);
				}
			}
    }
};
window.control_saiCB2.extend(window.control_control);
window.saiCB2 = window.control_saiCB2;
window.control_saiCB2.implement({
	doDraw: function(canvas){  	    
	},
	setItems: function(items){
		var n = this.getFullId();
		var html = "<select id='"+ n +"_ctrl'>";
		for (var i = 0; i < items.length;i++){
			var item = items[i];
			html += "<option value='"+item.id+"'>"+item.value+"</option>";
		}
		html += "</select>";
		this.setInnerHTML(html, this.getCanvas());
		var self = this;
		$("#"+ this.getFullId()+"_ctrl").change(function(){
			self.onChange.call(self, self.getSelectedId());
		});
		 
	},
	getSelectedId : function(){
		return $("#"+ this.getFullId()+"_ctrl").val();
	},
	getText : function(){
		return $("#"+ this.getFullId()+"_ctrl option:selected").text();
	},
	doChange: function (event){
		this.onChange.call(this, this.getSelectedId());
	}
});