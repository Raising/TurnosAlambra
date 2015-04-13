$(function(){

	var visualizadorActual = new ESTRUCTURA.Visualizador();
	visualizadorActual.reinsertHtml();
	var visualizadorHTML = visualizadorActual.getHtml();
	$("#central").prepend(visualizadorActual.getHtml());

	var minimapa = $("#miniMapa");
  	for (var i = 1; i< 32 ; i++){
  		var minidia = $("<div class='miniDia'>"+i+"</div>");
  		if (i == 1){
  			$(minidia).addClass("selected");
  		}
  		minidia.on("click",function(){
  			var position = $(this)[0].innerText;
  			TweenMax.to(visualizadorHTML, 0.75, {x:"-"+((position-1)*156), ease:Sine.easeOut});
  			$(".miniDia").removeClass("selected");
  			$(this).addClass("selected");
  		});
		minimapa.append(minidia);

	}
});