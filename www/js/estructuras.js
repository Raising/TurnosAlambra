var Puesto = function(params){
	var pusto = this;
	this.nombre = params.nombre ? params.nombre : "sin nombre";
	this.slotsMinimos = params.slotsMinimos ? params.slotsMinimos : 0;
	this.slotsMaximos = params.slotsMaximos ? params.slotsMaximos : this.slotsMinimos; //un -1 indica SIn LImite 
	this.actualSlot =

	this.html = $("<div class='puesto'></div>");
	this.htmlHeader = $("<div class='puestoHeader'></div>");
	this.htmlSlot = $("div class='puestoSlot'></div>");

}

var Slot = function(params){
	var slot = this;
	this.linkedHuman = {};
	this.html = $("div class='puestoSlot'></div>");
	this.htmlSetArea = $("div class='puestoSlotArea'></div>");

	this.html
		.append(this.htmlSetArea);


	this.getHtml = function(){
		retu
	}	
}