var ESTRUCTURA = {};


ESTRUCTURA.Visualizador = function (params) {
	var visualizador = this;
	this.dias = [];
	
	this.html = $("<div class = 'visualizador'></div>");

	this.reinsertHtml = function () {
		this.html.empty();
		var turnosManiana = [];
		var turnosTarde = [];
		var turnosNoche = [];

		for (var i = 0 ; i < visualizador.dias.length; i++){
			turnoManiana.push(visualizador.dias.getTurno("maniana"));
			turnoTarde.push(visualizador.dias.getTurno("tarde"));
			turnoNoche.push(visualizador.dias.getTurno("noche"));
		}

		var rowManiana = new ESTRUCTURA.Row({turnos:turnosManiana});
		var rowTarde= new ESTRUCTURA.Row({turnos:turnosTarde});
		var rowNoche= new ESTRUCTURA.Row({turnos:turnosNoche});

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
	this.diaSemana = paramas.diaSemana ? paramas.diaSemana : 0 ;  // 0  = lunes ; 6 = domingo
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
		var nPuestos = object.puestos.length;
		for (var i = 0; i < nPuestos; i ++){
			var puesto = new ESTRUCTURA.Puesto(object.puestos[i]);
			turno.puestos.push(puesto);
		}		
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
	this.htmlHeader = $("<div class='puestoHeader'></div>");
	this.htmlSlot = $("div class='puestoSlot'></div>");

	this.html
		.append(this.htmlHeader);

	for (var i = 0 ; i < puesto.slotsMinimos; i ++){
		var slot = new ESTRUCTURA.Slot();
		puesto.html.append(slots.getHtml());
		puesto.slots.push(slot);
	}

	this.getHtml = function(){
		return puesto.html;
	}

	this.reinsertHtml = function() 
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
	this.html = $("div class='puestoSlot'></div>");
	this.htmlSetArea = $("div class='puestoSlotArea'></div>");

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