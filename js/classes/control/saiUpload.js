//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_saiUpload = function(owner, options){
    if (owner)
    {
        this.caption = "";
		window.control_saiUpload.prototype.parent.constructor.call(this, owner, options);		
        this.className = "control_saiUpload";
        this.owner = owner;
        this.address = "./server/upload.php";
		this.bgColor = "transparent";
		this.scrolling = false;
		if (options !== undefined){
			this.updateByOptions(options);
            if (options.addParam) this.setAddParam(options.addParam);
            if (options.caption) this.setCaption(options.caption);
		}
    }
};
window.control_saiUpload.extend(window.control_control);
window.saiUpload = window.control_saiUpload;
//---------------------------- Function ----------------------------------------
window.control_saiUpload.implement({
	doDraw: function(canvas){
        /*
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
        padding: 0;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        filter: alpha(opacity=0);
        */		
		canvas.css({background : "#AE1B1A", overflow : "hidden", cursor: "pointer", border:"1px solid #888888", borderRadius:"5px" });
        var id = this.getFullId();
        var html =  "<span id='"+ id +"_caption' style='cursor:pointer;color:#ffffff;position:absolute;width:100%;height:100%;display:flex;align-items: center;justify-content:center'> Upload </span>"+
                    "<div id='"+ id +"_spin' style='position:absolute;width:100%;height:100%;display:flex;align-items: center;justify-content:center'><img src='icon/spinner.svg' width=20 height=20 style='position:absolute;'/></div> "+
                    "<form id='"+ id +"_form' style='position:absolute;width:100%;height:100%;opacity: 0;filter: alpha(opacity=0)'>"+
                    "<input id='"+ id +"_files' type='file' style='cursor:pointer;opacity: 0;filter: alpha(opacity=0);position:absolute;width:100%;height:100%'/>"+
                    "</form>";
        canvas.html(html);
        this.form = $("#"+id + "_form");
        var self = this;
        $("#"+ id +"_spin").hide();
        $("#"+ id +"_files").on("change", function(event){
            self.files = event.target.files;
            self.emit("change", $("#"+id+"_files").val(), event);
            //$("#"+ id + "_caption").html( $("#"+id+"_files").val() );
            //self.submit();
        });
        $("#"+ id +"_form").on("submit", function(event){
            console.log("Submit");
            event.stopPropagation(); // Stop stuff happening
            event.preventDefault(); // Totally stop stuff happening

            // START A LOADING SPINNER HERE

            // Create a formdata object and add the files
            $("#"+ id +"_spin").show();
            $("#"+ id +"_caption").hide();
            self.form.hide();
            var data = new FormData();
            $.each(self.files, function(key, value)
            {
                data.append(key, value);
            });
            if (self.addParam){
                $.each(self.addParam, function(key, value)
                {
                    data.append(key, value);
                });
            }
            $.ajax({
                url: self.address + '?files',
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function(data, textStatus, jqXHR)
                {
                    console.log("Done Send File " + JSON.stringify(data));
                    $("#"+ id +"_spin").hide();
                    self.form.show();
                    $("#"+ id +"_caption").show();
                    self.emit("onload", data);
                    
                    $("#"+id+"_files").val("");
                    if(typeof data.error === 'undefined')
                    {
                      
                    }
                    else
                    {
                        // Handle errors here
                         console.log('submit success ERRORS: ' + data.error);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown)
                {
                    // Handle errors here
                    console.log('submit ERRORS: ' + textStatus);
                    self.emit("onload", data);
                    // STOP LOADING SPINNER
                    self.form.show();
                    $("#"+ id +"_spin").hide();
                    $("#"+ id +"_caption").show();
                    $("#"+id+"_files").val("");
                }
            });
        });
	},
    submit: function(){
        this.form.submit();
    },
    submitData: function(event, data){
        // Create a jQuery object from the form
        console.log("SubmitData");
        var self = this;
        var id = this.getFullId();
        self.emit("submit", event);
            
        $form = $(event.target);

        // Serialize the form data
        var formData = $form.serialize();

        // You should sterilise the file names
        $.each(data.files, function(key, value)
        {
            formData = formData + '&filenames[]=' + value;
        });

        $.ajax({
            url: self.address,
            type: 'POST',
            data: formData,
            cache: false,
            dataType: 'json',
            success: function(data, textStatus, jqXHR)
            {
                //console.log(JSON.stringify(data) );
                $("#"+ id +"_spin").hide();
                if(typeof data.error === 'undefined')
                {
                    // Success so call function to process the form
                    console.log('SUCCESS: ' + data.success);
                }
                else
                {
                    // Handle errors here
                    $("#"+ id +"_caption").show();
                    console.log('SubmitData Success ERRORS: ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                // Handle errors here
                self.form.show();
                $("#"+ id +"_spin").hide();
                $("#"+ id +"_caption").show();
                console.log('SubmitData ERRORS: ' + textStatus);
            },
            complete: function()
            {
                // STOP LOADING SPINNER
                console.log("Done");
                self.form.show();
                $("#"+ id +"_caption").show();
                $("#"+ id +"_spin").hide();
            }
        });
    },
    setCaption: function(caption){
        this.caption = caption;
        $("#" + this.getFullId() +"_caption").html(caption);
    },
    setAddParam: function (param){
        this.addParam = param;
    }
});
