//***********************************************************************************************
//*	Copyright (c) 2009 SAI
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			SAI, PT											
//***********************************************************************************************
window.control_highchart = function(owner, options){
    if (owner)
    {
        this.caption = "";
		window.control_highchart.prototype.parent.constructor.call(this, owner, options);		
        this.className = "control_highchart";
        this.owner = owner;
		this.bgColor = "transparent";
		this.setBorder(1);
		this.scrolling = false;
		this.onPointClick = new eventHandler();
		this.onMouseDown = new eventHandler();
		var title = this.app._mainForm.ePembagi ? this.app._mainForm.ePembagi.getText()+"(Rp)" : "";
		this.chartOptions = {
								chart: {
										renderTo: this.getFullId(),
									  	type: "column",
									  	resourceId : this.resourceId	},
								title : {text : "Executive Summary" },
								xAxis: { categories: [], labels: {}},
								yAxis : { title:{ text: title } },
								credits: {
									enabled: false
								},
								plotOptions: {
										allowPointSelect: true,
										column: {
											pointPadding: 0.2,
						                    borderWidth: 0,
						                    events: {
						                    	contextmenu : function(point){
						                    		error_log("Point "+ point);
						                    	}
						                    }
										},
									 	series: {
									 		cursor :"pointer",
						                   
						                    point : {
						                    	events: {
						                    		click: function(e){
						                    			var resource = this.series.chart.options.chart.resourceId;
						                    			$$$(resource).pointClick(this.series.name, this.x, this.y);
						                    		}						                    	
						                    	}
						                    }
                						},
                						point : {

                						}
                				},
								/*legend:{
									layout: 'vertical',
					                backgroundColor: '#FFFFFF',
					                align: 'left',
					                verticalAlign: 'top',
					                x: 100,
					                y: 70,
					                floating: true,
					                shadow: true
								},*/
								tooltip: {
						                formatter: function() {
						                    return '<b>'+ this.series.name +'</b><br/>'+
						                        this.y +' '+ this.x.toLowerCase();
						                }
						            },
						        exporting: {
						        	enable:true
						        },
							 	series:[]
							};
		if (options !== undefined){
			this.updateByOptions(options);
			if (options.pointClick) this.onPointClick.set(options.pointClick[0], options.pointClick[1]);
			if (options.mouseDown) this.onMouseDown.set(options.mouseDown[0], options.mouseDown[1]);
		}
    }
};
window.control_highchart.extend(window.control_control);
window.highchart = window.control_highchart;
//---------------------------- Function ----------------------------------------
window.control_highchart.implement({
	pointClick: function(name, x, y ){
		try{
			this.onPointClick.call(this, name, x, y);
		}catch(e){
			error_log(e);
		}
	},
	doDraw: function(canvas){		
		canvas.css({background : "transparent", overflow : "hidden" });
		canvas.bind("mousedown",{resourceId: this.resourceId}, function(e){
			$$$(e.data.resourceId).onMouseDown.call($$$(e.data.resourceId), e);
		});
	},
	setColor: function(data){
		this.bgColor = data;
		this.getCanvas().css({background : this.bgColor});
	},
	getColor: function(){
		return this.bgColor;
	},
	setOptions: function(options){
		this.chartOptions = options;
	},
	addSeries: function(serie){
		this.chartOptions.series.push(serie);
	},
	setType: function(chartType){
		this.chartOptions.chart.type = chartType;
	},
	setCategories: function (cat){
		this.chartOptions.xAxis.categories = cat;
	},
	setyAxisTitle: function(title){
		this.chartOptions.yAxis.title.text = title;
	},
	setMin : function(min){
		this.chartOptions.yAxis.min = min;
	},
	setTitle: function(title){
		this.chartOptions.title.text = title;
	},
	setToolTip: function(tooltip){
		this.chartOptions.tooltip.formatter = tooltip;
	},
	redraw: function(){
		this.chart.redraw();
	},
	render:function(){
		this.chart =new Highcharts.Chart(this.chartOptions);
	},
	setPlotOptions: function(plotOptions){
		this.chartOptions.plotOptions = plotOptions;
		/*
		plotOptions: {
                column: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                var drilldown = this.drilldown;
                                if (drilldown) { // drill down
                                    setChart(drilldown.name, drilldown.categories, drilldown.data, drilldown.color);
                                } else { // restore
                                    setChart(name, categories, data);
                                }
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        color: colors[0],
                        style: {
                            fontWeight: 'bold'
                        },
                        formatter: function() {
                            return this.y +'%';
                        }
                    }
                }
            },
            */
	}

});
