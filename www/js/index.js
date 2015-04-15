$(function(){

	
	var diaSemana = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];


	var minimapa = $("#miniMapa");
	var numDias = 31
	var dias = [];
	for (var i = 1;i <= numDias; i++){

		var newdia = new ESTRUCTURA.Dia({diaSemana:i%7,date:diaSemana[i%7]+" "+i});
		var turnoM = new ESTRUCTURA.Turno({tipo:"maniana",date:"dia: "+ (i)});
		var turnoT = new ESTRUCTURA.Turno({tipo:"tarde",date:"dia: "+ (i)});
		var turnoN = new ESTRUCTURA.Turno({tipo:"noche",date:"dia: "+ (i)});
		
		turnoM.instertPuestosFromObject(TEMPDATA.lugares);
		turnoT.instertPuestosFromObject(TEMPDATA.lugares);
		turnoN.instertPuestosFromObject(TEMPDATA.lugares);

		newdia.setTurno("maniana",	turnoM);
		newdia.setTurno("tarde",	turnoT);
		newdia.setTurno("noche",	turnoN);

		dias.push(newdia);
	}
var vDetalle = new ESTRUCTURA.VisualizadorDetalle({dias:dias});
	
	var visualizadorActual = new ESTRUCTURA.Visualizador({dias:dias,detalle:vDetalle});
	
	visualizadorActual.reinsertHtml();
	vDetalle.reinsertHtml();

	var visualizadorHTML = visualizadorActual.getHtml();
	$("#detalle").prepend(vDetalle.getHtml());
	
	$("#central").prepend(visualizadorActual.getHtml());
	
	$("#cabeceraDias").prepend(visualizadorActual.getCabeceraDiasHtml());
	

  	for (var i = 1; i<= numDias ; i++){
  		var minidia = $("<div class='miniDia'>"+i+"</div>");
  		if (i == 1){
  			$(minidia).addClass("selected");
  		}
  		minidia.on("click",function(){
  			var position = $(this)[0].innerText;
  			//TweenMax.to(visualizadorHTML, 0.75, {x:"-"+((position-1)*156), ease:Sine.easeOut});
  			visualizadorActual.gotoDay(position);
  			//vDetalle.gotoDay(position);
  			$(".miniDia").removeClass("selected");
  			$(this).addClass("selected");
  		});
		minimapa.append(minidia);

	}

	var personal = [];

		//console.log(TEMPDATA.gruposPersonal);

	for (var i = 0 ; i<TEMPDATA.gruposPersonal.length; i++){
		var grupo = TEMPDATA.gruposPersonal[i];
		//console.log(grupo);
		for (var j = grupo.personal.length - 1; j >= 0; j--) {
			var persona = new ESTRUCTURA.Persona(grupo.personal[j]);
			personal.push(persona);
		};
	}


	for (var i = dias.length - 1; i >= 0; i--) {
		var personalDisponible = [];
		for (var j = personal.length - 1; j >= 0; j--) {
		
			if (personal[j].estado[i] == "T"){
			
				personalDisponible.push(personal[j]);
			} 
		};
	//	console.log("dia: ", i," Numpersonas ",personalDisponible.length);
		//turno maniana
	//	console.log(personalDisponible.length);

		for (var j = dias[i].turnoManiana.puestos.length - 1; j >= 0; j--) {
			var puesto  = dias[i].turnoManiana.puestos[j];
			for (var k = puesto.slots.length - 1; k >= 0; k--) {
				var slot =  puesto.slots[k];
				if (personalDisponible.length == 0){

				}else{
					var Random = Math.floor((Math.random() * personalDisponible.length));
					slot.setLinkedElement(personalDisponible[Random]);
					personalDisponible.splice(Random, 1);
				}
			};
		};
		// turno tarde
			for (var j = dias[i].turnoTarde.puestos.length - 1; j >= 0; j--) {
			var puesto  = dias[i].turnoTarde.puestos[j];
			for (var k = puesto.slots.length - 1; k >= 0; k--) {
				var slot =  puesto.slots[k];
				if (personalDisponible.length == 0){

				}else{
				var Random = Math.floor((Math.random() * personalDisponible.length));
				slot.setLinkedElement(personalDisponible[Random]);
				personalDisponible.splice(Random, 1);
				}
			};
		};
		//turno noche
			for (var j = dias[i].turnoNoche.puestos.length - 1; j >= 0; j--) {
			var puesto  = dias[i].turnoNoche.puestos[j];
			for (var k = puesto.slots.length - 1; k >= 0; k--) {
				var slot =  puesto.slots[k];
				if (personalDisponible.length == 0){
			//		console.log("no se ha podido rellenar","noche" ,puesto.nombre);
				}else{
				var Random = Math.floor((Math.random() * personalDisponible.length));
				slot.setLinkedElement(personalDisponible[Random]);
				personalDisponible.splice(Random, 1);
				}
			};
		};

	//	console.log(personalDisponible.length);

	};





	$("#modo_maniana").on("click",function(){
		visualizadorActual.modo.maniana();
		vDetalle.modo.maniana();
		$("#modo_maniana").removeClass("selected");
		$("#modo_tarde").removeClass("selected");
		$("#modo_noche").removeClass("selected");
		$(this).addClass("selected");
	});

	$("#modo_tarde").on("click",function(){
		visualizadorActual.modo.tarde();
		vDetalle.modo.tarde();
			$("#modo_maniana").removeClass("selected");
		$("#modo_tarde").removeClass("selected");
		$("#modo_noche").removeClass("selected");
		$(this).addClass("selected");
	});

	$("#modo_noche").on("click",function(){
		visualizadorActual.modo.noche();
		vDetalle.modo.noche();
		$("#modo_maniana").removeClass("selected");
		$("#modo_tarde").removeClass("selected");
		$("#modo_noche").removeClass("selected");
		$(this).addClass("selected");
	});
});