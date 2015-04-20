

var VISUAL = {};

VISUAL.popUp = function (params){
	var pop = this;
	$("body > .popup").remove();
	console.log("creado popup",params);
	this.html = $("<div class='popup'></div>");
	this.head = $("<div class='popupHead'></div>");
	this.body = $("<div class='popupBody'></div>");
	this.closeIcon = $("<div class='popupHeadIcon'>X</div>");

	this.head.append(this.closeIcon);
	
	this.body.append(params.body);

	this.html
			.append(this.head)
			.append(this.body);
	console.log(this.html);
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
	$("body > .menuContextual").remove();
	this.html = $("<div class='menuContextual'></div>");
	
	var  nueva_opcion = $("<div class='contextualOption'> Cerrar </div>");
		nueva_opcion.on("click",function(){menu.html.remove();});
		this.html.append(nueva_opcion);

	for (var i in params.opciones){
		var  nueva_opcion = $("<div class='contextualOption'>"+params.opciones[i].Titulo+"</div>");
		nueva_opcion.on("click",params.opciones[i].Operacion);
		this.html.append(nueva_opcion);
	}
	menu.html.css({top: params.event.clientY, left: params.event.clientX});
	$("body").append(this.html);

	/*$("body").click(function(){
		menu.html.remove();
	});*/

}