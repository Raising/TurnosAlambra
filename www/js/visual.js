

var VISUAL = {};

VISUAL.popUp = function (params){
	var pop = this;
	this.html = $("<div class='popup'></div>");
	this.head = $("<div class='popupHead'></div>");
	this.body = $("<div class='popupBody'></div>");
	this.closeIcon = $("<div class='popupHeadIcon'>X</div>");

	this.head.append(this.closeIcon);
	
	this.body.append(params.body);

	this.html.append(this.head)
			.append(this.body);

	$("body").append(this.html);

	this.closeIcon.on("click",function(){
		pop.html.remove();
	});
}

/*
	params.opciones es un array con objetos { Titulo: "texto" , Operacion : function()}
*/
VISUAL.menuContextual = function(params){
	var menu = this;
	this.html = $("<div class='menuContextual'></div>");
	
	for (var i in params.opciones){
		var  opcion = $("<div>"+params.opcion[i].texto+"</div>");
		opcion.on("click",params.opcion[i].Operacion);
		this.html.append(opcion);
	}
	$("body").append(this.html);

	("body").on("click",function(){
		menu.html.remove();
	});
}