var ESTRUCTURA = {};


ESTRUCTURA.Visualizador = function (params) {
	var visualizador = this;
	this.dias = [];
	this.numDias = 31;

	for (var i = 0;i < this.numDias; i++){
		var newdia = new ESTRUCTURA.Dia({diaSemana:i%7,date:"dia: "+ (i+1)});
		var turnoM = new ESTRUCTURA.Turno({tipo:"maniana",date:"dia: "+ (i+1)});
		var turnoT = new ESTRUCTURA.Turno({tipo:"tarde",date:"dia: "+ (i+1)});
		var turnoN = new ESTRUCTURA.Turno({tipo:"noche",date:"dia: "+ (i+1)});
		
		turnoM.instertPuestosFromObject(TEMPDATA.lugares);
		turnoT.instertPuestosFromObject(TEMPDATA.lugares);
		turnoN.instertPuestosFromObject(TEMPDATA.lugares);

		newdia.setTurno("maniana",	turnoM);
		newdia.setTurno("tarde",	turnoT);
		newdia.setTurno("noche",	turnoN);

		visualizador.dias.push(newdia);
	}

	console.log(this);

	this.html = $("<div class = 'visualizador'></div>");
	this.html.width(this.numDias* 156);
	this.currentDay  = 1;
	Draggable.create(visualizador.html, {
			bounds:$("#central"),
			type:"y,x",
			//edgeResistance :0,
			throwProps:true,
			zIndexBoost:false,
			onDrag:function() {
	         var xPos = Math.floor((this.x)/(-156)) +1;
	      
	       	 if (visualizador.currentDay != xPos){
	       	 	visualizador.currentDay = xPos;
	       	 	$(".miniDia").removeClass("selected");
				$($("#miniMapa").children()[xPos-1]).addClass("selected");
	       	 }
	        },
	        snap: {
		        x: function(endValue) {
		        	console.log(endValue);
		            return Math.floor(endValue/156)* 156;
		        },
		         y: function(endValue) {
		            return endValue;
		        }
		    },
	        onDragEnd:function(){
	        	var xPos = Math.min(0,Math.floor((this.x/156)+1)*156);
				
			
				
				TweenMax.to(visualizador.html, 0.25, {x:xPos, ease:Sine.easeOut});
	        },
	        onPress:function(){
	       
	        	
	        }



		});


	this.reinsertHtml = function () {
		this.html.empty();
		var turnosManiana = [];
		var turnosTarde = [];
		var turnosNoche = [];

		for (var i = 0 ; i < visualizador.dias.length; i++){
			turnosManiana.push(visualizador.dias[i].getTurno("maniana"));
			turnosTarde.push(visualizador.dias[i].getTurno("tarde"));
			turnosNoche.push(visualizador.dias[i].getTurno("noche"));
		}

		var rowManiana 	= new ESTRUCTURA.Row({turnos:turnosManiana});
		var rowTarde	= new ESTRUCTURA.Row({turnos:turnosTarde});
		var rowNoche	= new ESTRUCTURA.Row({turnos:turnosNoche});

		visualizador.html
					.append(rowManiana.getHtml)
					.append(rowTarde.getHtml)
					.append(rowNoche.getHtml);
	}

	this.getHtml = function(){
		return visualizador.html;	
	}
}

ESTRUCTURA.Row = function(params){
	var row = this;
	this.listaTurnos = params.turnos ? params.turnos : [];
	this.html = $("<div class = 'turnosRow'></div>");

	for (var i = 0 ;i< row.listaTurnos.length ;i++){
		row.html.append(row.listaTurnos[i].getHtml());
	}

	this.reinsertHtml = function () {
		row.html.empty();
		for (var i = 0; i < row.listaTurnos.length; i ++){
			row.html.append(row.listaTurnos[i].getHtml());
		}
	}

	this.getHtml = function () {
		return row.html;
	}
}

ESTRUCTURA.Dia = function (params){
	var dia = this;
	this.turnoManiana = {};
	this.turnoTarde = {};
	this.turnoNoche = {};
	this.date = params.date ? params.date : "00/00/0000";
	this.diaSemana = params.diaSemana ? params.diaSemana : 0 ;  // 0  = lunes ; 6 = domingo
	this.cuadrante = params.cuadrante ? params.cuadrante : "pecis";

	this.setTurno = function(tipo,turno){
		switch (tipo){
			case "maniana":
				dia.turnoManiana = turno;
			break;
			case "tarde":
				dia.turnoTarde = turno;
			break;
			case "noche":
				dia.turnoNoche = turno;
			break;
		}
	}

	this.comprobarIncidencias = function(){
		// TODO comprobar si no se cumplen todos los requisitos en los turnos.
	}

	this.getTurno = function(tipo){
		switch (tipo){
			case "maniana":
				return dia.turnoManiana;
			break;
			case "tarde":
				return dia.turnoTarde;
			break;
			case "noche":
				return dia.turnoNoche;
			break;
		}
	}
}



ESTRUCTURA.Turno = function  (params) {
	var turno = this;
	this.tipo = params.tipo ? params.tipo : "maniana";
	this.date = params.date ? params.date : "00/00/0000";
	this.cuadrante = params.cuadrante ? params.cuadrante : "pecis"; // sobra
	this.puestos = [];

	this.html = $("<div class='turno'></div>");

	this.instertPuestosFromObject = function(object){
		var nPuestos = object.length;
		for (var i = 0; i < nPuestos; i ++){
			var puesto = new ESTRUCTURA.Puesto(object[i]);
			turno.puestos.push(puesto);
		}		
		turno.reinsertHtml();
	}

	this.reinsertHtml = function () {
		turno.html.empty();
		for (var i = 0; i < turno.puestos.length; i ++){
			turno.html.append(turno.puestos[i].getHtml());
		}
	}

	this.getHtml= function () {
		return turno.html;
	}
}



ESTRUCTURA.Puesto = function(params){
	var puesto = this;
	this.nombre = params.nombre ? params.nombre : "sin nombre";
	this.slotsMinimos = params.slotsMinimos ? params.slotsMinimos : 0;
	this.slotsMaximos = params.slotsMaximos ? params.slotsMaximos : this.slotsMinimos; //un -1 indica SIn LImite 
	this.slots = [];

	this.html = $("<div class='puesto'></div>");
	this.htmlHeader = $("<div class='puestoHeader'>"+puesto.nombre+"</div>");
	this.htmlSlot = $("<div class='puestoSlot'></div>");

	this.html
		.append(this.htmlHeader);

	for (var i = 0 ; i < puesto.slotsMinimos; i ++){
		var slot = new ESTRUCTURA.Slot();
		puesto.html.append(slot.getHtml());
		puesto.slots.push(slot);
	}

	this.getHtml = function(){
		return puesto.html;
	}

	this.reinsertHtml = function() {
		puesto.html.empty().
			append(puesto.htmlHeader);
		for (var i = 0 ; i < puesto.slots.length; i ++){
			puesto.html.append(puesto.slots[i].getHtml());
		}
	}

	this.addSlot = function(){
		var slot = new ESTRUCTURA.Slot();
		puesto.html.append(slots.getHtml());
		puesto.slots.push(slot);
	}
}

ESTRUCTURA.Slot = function(params){
	var slot = this;
	this.linkedElement = {};
	this.html = $("<div class='puestoSlot'></div>");
	this.htmlSetArea = $("<div class='puestoSlotArea'></div>");

	this.html
		.append(this.htmlSetArea);


	this.getHtml = function(){
		return slot.html;
	}	
	this.setLinkedElement = function  (linkedElement) {
		slot.linkedElement = linkedElement;
		slot.htmlSetArea.empty().append(linkedElement.getHtml());
	}
	this.emptyLinkedElement = function () {
		slot.linkedElement = {};
		slot.htmlSetArea.empty();
	}
}