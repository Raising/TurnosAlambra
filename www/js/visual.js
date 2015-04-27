

var VISUAL = {};

VISUAL.popUp = function (params){
	var pop = this;
	$("body > .total").remove();
	console.log("creado popup",params);
	this.html = $("<div class='popup'></div>");
	this.head = $("<div class='popupHead'></div>");
	this.body = $("<div class='popupBody'></div>");
	this.closeIcon = $("<div class='popupHeadIcon'>X</div>");

	this.hideBack = $("<div class='total traslucido'></div>");

	this.head.append(this.closeIcon);
	
	this.body.append(params.body);

	this.html
			.append(this.head)
			.append(this.body);
	
	this.hideBack.append(this.html);
	
	this.hideBack.on("click",function(){
		pop.hideBack.remove();
	});
	
	this.closeIcon.on("click",function(){
		pop.hideBack.remove();
	});

	$("body").append(this.hideBack);
}

/*
	params.opciones es un array con objetos { Titulo: "texto" , Operacion : function()}
*/
VISUAL.menuContextual = function(params){
	var menu = this;
	$("body > .total").remove();
	this.html = $("<div class='menuContextual'></div>");
	
	

	for (var i in params.opciones){
		var  nueva_opcion = $("<div class='contextualOption'>"+params.opciones[i].Titulo+"</div>");
		nueva_opcion.on("click",params.opciones[i].Operacion);
		this.html.append(nueva_opcion);
	}

	menu.html.css({top: params.event.clientY, left: params.event.clientX});

	this.hideBack = $("<div class='total'></div>");
	this.hideBack.on("click",function(){
		menu.hideBack.remove();
	});
	this.hideBack.append(this.html);
	$("body").append(this.hideBack);

	/*$("body").click(function(){
		menu.html.remove();
	});*/

}