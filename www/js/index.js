var dias = [];
var personal = {};
$(function(){
	//window.addEventListener('contextmenu', function (evt){evt.preventDefault();console.log(evt)}, false);
	
	$("body").on("contextmenu", function(event){
			//event.preventDefault();
			console.log(event);
	});

	var diaSemana = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];


	var minimapa = $("#miniMapa");
	var numDias = 31
	//var dias = [];

	var visualizadorActual= {};
	for (var i = 1;i <= numDias; i++){

		var newdia = new ESTRUCTURA.Dia({numero:i-1,diaSemana:i%7,date:diaSemana[i%7]+" "+i});
		var puestosParaDia = {};
		var turnosParaDia = {};

		for (var turno in TEMPDATA.turnos) {
			puestosParaDia[turno] = [];
		}
		if (i%7 >4){
			for (var tipoPuesto in TEMPDATA.tiposPuestoFinde){
				var nuevoPuesto = new ESTRUCTURA.Puesto({tipoPuesto:TEMPDATA.tiposPuestoFinde[tipoPuesto]});
				puestosParaDia[TEMPDATA.tiposPuestoFinde[tipoPuesto].turnoAbstracto].push(nuevoPuesto);
			}
		}else{
			for (var tipoPuesto in TEMPDATA.tiposPuesto){
				var nuevoPuesto = new ESTRUCTURA.Puesto({tipoPuesto:TEMPDATA.tiposPuesto[tipoPuesto]});
				puestosParaDia[TEMPDATA.tiposPuesto[tipoPuesto].turnoAbstracto].push(nuevoPuesto);
			}
		}

		for (var turno in TEMPDATA.turnos) {
			turnosParaDia[turno] = new ESTRUCTURA.Turno({tipo:turno,date:"dia: "+ (i),diaNum:i});
			turnosParaDia[turno].instertPuestosFromObject(puestosParaDia[turno]);

			newdia.setTurno(turno,	turnosParaDia[turno]);
		}	
		newdia.comprobarIncidencias();
		dias.push(newdia);
	}
	GLOBAL.vDetalle = new ESTRUCTURA.VisualizadorDetalle({dias:dias});
	
	GLOBAL.visualizadorActual = new ESTRUCTURA.Visualizador({dias:dias,detalle:GLOBAL.vDetalle});
	
	GLOBAL.visualizadorActual.reinsertHtml();
	GLOBAL.vDetalle.reinsertHtml();
	GLOBAL.turno = "Mañana";
	GLOBAL.diaActual = 0;


	var visualizadorHTML = GLOBAL.visualizadorActual.getHtml();
	$("#detalle").prepend(GLOBAL.vDetalle.getHtml());
	
	$("#central").prepend(GLOBAL.visualizadorActual.getHtml());
	
	$("#cabeceraDias").prepend(GLOBAL.visualizadorActual.getCabeceraDiasHtml());
	$("#foot").prepend(GLOBAL.visualizadorActual.getFootTurnosHtml());
	var mes = $("<div class='Mes'>JULIO</div>");
	mes.on("contextmenu",function(){
		event.preventDefault();
			VISUAL.menuContextual(
				{opciones:[
					{ Titulo: "CAMBIO DE MES" , Operacion : function(){alert("Seleccion de calendario");
				$("body > .menuContextual").remove();}}
					],
				event:event
				});
	});
	minimapa.append(mes);
  	for (var i = 1; i<= numDias ; i++){
  		var minidia = $("<div class='miniDia'>"+i+"</div>");
  		if (i == 1){
  			$(minidia).addClass("selected");
  		}
  		minidia.on("click",function(){
  			var position = $(this)[0].innerText;
  			//TweenMax.to(visualizadorHTML, 0.75, {x:"-"+((position-1)*156), ease:Sine.easeOut});
  			console.log(position);
  			GLOBAL.visualizadorActual.gotoDay(position);
  			//vDetalle.gotoDay(position);
  			//$(".miniDia").removeClass("selected");
  			//$(this).addClass("selected");
  		});
		minimapa.append(minidia);

	}

	 personal = {};

		//console.log(TEMPDATA.gruposPersonal);

		for (var grupo in TEMPDATA.gruposPersonal){
				personal[grupo] = [];
				for (var j = TEMPDATA.gruposPersonal[grupo].personal.length - 1; j >= 0; j--) {
						var persona = new ESTRUCTURA.Persona(TEMPDATA.gruposPersonal[grupo].personal[j]);
						personal[grupo].push(persona);
				};
		}

	var personalDisp = {};

	for (var i = dias.length - 1; i >= 0; i--) {
		
		for (var turno in TEMPDATA.turnos){

		

		//	console.log(personal);
		dias[i].turno[turno].asignarPersonal(personal);


		}
		

	//	console.log(personalDisponible.length);

	};
setTimeout(function() {for (var i = 0 ; i< dias.length;i++){
			dias[i].comprobarIncidencias();
		}
}, 1000);
	


	$("#modo_maniana").on("click",function(){
		GLOBAL.visualizadorActual.modo.maniana();
		GLOBAL.vDetalle.modo.maniana();
		GLOBAL.turno = "Mañana";
		$("#modo_maniana").removeClass("selected");
		$("#modo_tarde").removeClass("selected");
		$("#modo_noche").removeClass("selected");
		$(this).addClass("selected");
	});

	$("#modo_tarde").on("click",function(){

		GLOBAL.turno = "Tarde";
		GLOBAL.visualizadorActual.modo.tarde();
		GLOBAL.vDetalle.modo.tarde();
			$("#modo_maniana").removeClass("selected");
		$("#modo_tarde").removeClass("selected");
		$("#modo_noche").removeClass("selected");
		$(this).addClass("selected");
	});

	$("#modo_noche").on("click",function(){

		GLOBAL.turno = "Noche";
		GLOBAL.visualizadorActual.modo.noche();
		GLOBAL.vDetalle.modo.noche();
		$("#modo_maniana").removeClass("selected");
		$("#modo_tarde").removeClass("selected");
		$("#modo_noche").removeClass("selected");
		$(this).addClass("selected");
	});

	$("#imprimirDetalle").on("click",function(){
		var impreso = $("<div class='informe'> INFORME DE TURNO </div>")
		VISUAL.popUp({body:impreso});
	});

	$("#buscarProblemas").on("click",function(){
		for (var i = 0 ; i< dias.length;i++){
			dias[i].comprobarIncidencias();
		}
	});


	$("#verPersonas").on("click",function(){
		var resumenCompleto = $("<div class='resumenCompletoPersonas'></div>");



		for (var grupo in personal){
				for (var j = personal[grupo].length - 1; j >= 0; j--) {
					
					var persona = personal[grupo][j];
					resumenCompleto.prepend(persona.getResumen());
				};
			}
		VISUAL.popUp({body:resumenCompleto});

	});

	$("#recalcular").on("click",function(){
	//	console.log(dias[GLOBAL.diaActual],dias[GLOBAL.diaActual].getTurno(GLOBAL.turno));
		dias[GLOBAL.diaActual].getTurno(GLOBAL.turno).asignarPersonal(personal);

	});

});