$(function(){

	
	var diaSemana = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];


	var minimapa = $("#miniMapa");
	var numDias = 31
	var dias = [];
	var visualizadorActual= {};
	for (var i = 1;i <= numDias; i++){

		var newdia = new ESTRUCTURA.Dia({diaSemana:i%7,date:diaSemana[i%7]+" "+i});
		var puestosParaDia = {};
		var turnosParaDia = {};

		for (var turno in TEMPDATA.turnos) {
			puestosParaDia[turno] = [];
		}

		for (var tipoPuesto in TEMPDATA.tiposPuesto){
			var nuevoPuesto = new ESTRUCTURA.Puesto({tipoPuesto:TEMPDATA.tiposPuesto[tipoPuesto]});
			puestosParaDia[TEMPDATA.tiposPuesto[tipoPuesto].turnoAbstracto].push(nuevoPuesto);
		}

		for (var turno in TEMPDATA.turnos) {
			turnosParaDia[turno] = new ESTRUCTURA.Turno({tipo:turno,date:"dia: "+ (i),diaNum:i});
			turnosParaDia[turno].instertPuestosFromObject(puestosParaDia[turno]);

			newdia.setTurno(turno,	turnosParaDia[turno]);
		}	

		dias.push(newdia);
	}
	GLOBAL.vDetalle = new ESTRUCTURA.VisualizadorDetalle({dias:dias});
	
	GLOBAL.visualizadorActual = new ESTRUCTURA.Visualizador({dias:dias,detalle:GLOBAL.vDetalle});
	
	GLOBAL.visualizadorActual.reinsertHtml();
	GLOBAL.vDetalle.reinsertHtml();

	var visualizadorHTML = GLOBAL.visualizadorActual.getHtml();
	$("#detalle").prepend(GLOBAL.vDetalle.getHtml());
	
	$("#central").prepend(GLOBAL.visualizadorActual.getHtml());
	
	$("#cabeceraDias").prepend(GLOBAL.visualizadorActual.getCabeceraDiasHtml());
	$("#foot").prepend(GLOBAL.visualizadorActual.getFootTurnosHtml());
	

  	for (var i = 1; i<= numDias ; i++){
  		var minidia = $("<div class='miniDia'>"+i+"</div>");
  		if (i == 1){
  			$(minidia).addClass("selected");
  		}
  		minidia.on("click",function(){
  			var position = $(this)[0].innerText;
  			//TweenMax.to(visualizadorHTML, 0.75, {x:"-"+((position-1)*156), ease:Sine.easeOut});
  			GLOBAL.visualizadorActual.gotoDay(position);
  			//vDetalle.gotoDay(position);
  			$(".miniDia").removeClass("selected");
  			$(this).addClass("selected");
  		});
		minimapa.append(minidia);

	}

	var personal = {};

		//console.log(TEMPDATA.gruposPersonal);

	

	for (var i = dias.length - 1; i >= 0; i--) {


		



		
		for (var turno in TEMPDATA.turnos){

			for (var grupo in TEMPDATA.gruposPersonal){
				personal[grupo] = [];
				for (var j = TEMPDATA.gruposPersonal[grupo].personal.length - 1; j >= 0; j--) {
					if( TEMPDATA.gruposPersonal[grupo].personal[j].estado[i] == "T"){
						var persona = new ESTRUCTURA.Persona(TEMPDATA.gruposPersonal[grupo].personal[j]);
						personal[grupo].push(persona);
					}			
				};
			}


		//	console.log(personal);
			dias[i].turno[turno].asignarPersonal(personal);


		}
		

	//	console.log(personalDisponible.length);

	};





	$("#modo_maniana").on("click",function(){
		GLOBAL.visualizadorActual.modo.maniana();
		GLOBAL.vDetalle.modo.maniana();
		$("#modo_maniana").removeClass("selected");
		$("#modo_tarde").removeClass("selected");
		$("#modo_noche").removeClass("selected");
		$(this).addClass("selected");
	});

	$("#modo_tarde").on("click",function(){
		GLOBAL.visualizadorActual.modo.tarde();
		GLOBAL.vDetalle.modo.tarde();
			$("#modo_maniana").removeClass("selected");
		$("#modo_tarde").removeClass("selected");
		$("#modo_noche").removeClass("selected");
		$(this).addClass("selected");
	});

	$("#modo_noche").on("click",function(){
		GLOBAL.visualizadorActual.modo.noche();
		GLOBAL.vDetalle.modo.noche();
		$("#modo_maniana").removeClass("selected");
		$("#modo_tarde").removeClass("selected");
		$("#modo_noche").removeClass("selected");
		$(this).addClass("selected");
	});
});