var ESTRUCTURA = {}


ESTRUCTURA.CabeceraDias = function(params){
	var cabecera = this;
	this.dias = [];
}

ESTRUCTURA.Visualizador = function (params) {
	var visualizador = this;
	this.dias = params.dias ? params.dias : [];
	this.numDias = this.dias.length;
	this.rowManiana = {};
	this.rowTarde	= {};
	this.rowNoche	= {};
	this.offset = 190;
	this.anchoColumna = 52;

	

	console.log(this);

	this.html = $("<div class = 'visualizador'></div>");
	this.html.width(this.numDias * this.anchoColumna + this.offset);
	this.currentDay  = 1;
	this.dias[this.currentDay-1].show();
	Draggable.create(visualizador.html, {
			bounds:$("#central"),
			type:"y,x",
			//edgeResistance :0,
			throwProps:true,
			zIndexBoost:false,
			onDrag:function() {
	         var xPos = Math.floor((this.x)/((-1)*visualizador.anchoColumna)) +1;
	      

	       	 if (visualizador.currentDay != xPos){
	       	 	visualizador.dias[visualizador.currentDay-1].hide();
	       	 	visualizador.currentDay = xPos;
	       	 	visualizador.dias[visualizador.currentDay-1].show();
	       	 	$(".miniDia").removeClass("selected");
				$($("#miniMapa").children()[xPos-1]).addClass("selected");
	       	 }
	        },
	        snap: {
		        x: function(endValue) {
		        	console.log(endValue);
		            return Math.floor(endValue/visualizador.anchoColumna)* visualizador.anchoColumna;
		        },
		         y: function(endValue) {
		            return endValue;
		        }
		    },
	        onDragEnd:function(){
	        	var xPos = Math.min(0,Math.floor((this.x/visualizador.anchoColumna)+1)*visualizador.anchoColumna);
				
			
				
				TweenMax.to(visualizador.html, 0.25, {x:xPos, ease:Sine.easeOut});
	        },
	        onPress:function(){
	       
	        	
	        }



		});

	this.gotoDay = function(diaNum){
		visualizador.dias[visualizador.currentDay-1].hide();
		visualizador.currentDay = diaNum;
	    visualizador.dias[diaNum-1].show();

		TweenMax.to(visualizador.html, 0.75, {x:"-"+(((diaNum-1)*visualizador.anchoColumna)), ease:Sine.easeOut});
	}

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

		visualizador.rowManiana 	= new ESTRUCTURA.Row({turnos:turnosManiana});
		visualizador.rowTarde	= new ESTRUCTURA.Row({turnos:turnosTarde});
		visualizador.rowNoche	= new ESTRUCTURA.Row({turnos:turnosNoche});

		visualizador.html
					.append(visualizador.rowManiana.getHtml())
					.append(visualizador.rowTarde.getHtml())
					.append(visualizador.rowNoche.getHtml());

		visualizador.modo.maniana();

visualizador.modo.maniana();
	}

	this.getHtml = function(){
		return visualizador.html;	
	}

	this.modo = {};
	this.modo.actual = "Vacio";

	this.modo.maniana = function(){
		console.log(visualizador.rowManiana.getHtml().height(),visualizador.getHtml().height());
		//animaciones para cambio de estado
		if (visualizador.modo.actual == "noche"){
			visualizador.rowManiana.showUp();
			//visualizador.rowTarde.hideDown();
			visualizador.rowNoche.hideDown();
			visualizador.html.css("height",Math.min(600,visualizador.rowManiana.getHtml().height()));
		}
		else if (visualizador.modo.actual == "tarde"){
			visualizador.rowManiana.showUp();
			visualizador.rowTarde.hideDown();
			//visualizador.rowNoche.hideDown();
			visualizador.html.css("height",Math.min(600,visualizador.rowManiana.getHtml().height()));

		}else{
			//visualizador.rowManiana.showUp();
			console.log("hiddingall");
			visualizador.rowTarde.hide();
			visualizador.rowNoche.hide();
			visualizador.html.css("height",Math.min(600,visualizador.rowManiana.getHtml().height()));
		}
		visualizador.modo.actual = "maniana";

	}	
	this.modo.tarde = function(){
		
		//animaciones para cambio de estado
		if (visualizador.modo.actual == "noche"){
			//visualizador.rowManiana.hideDown();
			visualizador.rowTarde.showUp();
			visualizador.rowNoche.hideDown();
			visualizador.html.css("height",Math.min(600,visualizador.rowManiana.getHtml().height()));
		}else if(visualizador.modo.actual == "maniana"){
			visualizador.rowManiana.hideUp();
			visualizador.rowTarde.showDown();
			//visualizador.rowNoche.hideDown();
			visualizador.html.css("height",Math.min(600,visualizador.rowManiana.getHtml().height()));

		}
		visualizador.modo.actual = "tarde";
	}	
	this.modo.noche = function(){

		//animaciones para cambio de estado
		if (visualizador.modo.actual == "tarde"){
			//visualizador.rowManiana.hideUp();
			visualizador.rowTarde.hideUp();
			visualizador.rowNoche.showDown();
			visualizador.html.css("height",Math.min(600,visualizador.rowManiana.getHtml().height()));
		}
		else if(visualizador.modo.actual == "maniana"){
			visualizador.rowManiana.hideUp();
			visualizador.rowNoche.showDown();
			visualizador.html.css("height",Math.min(600,visualizador.rowManiana.getHtml().height()));
		}
				visualizador.modo.actual = "noche";
	}

	

}

ESTRUCTURA.Row = function(params){
	var row = this;
	this.listaTurnos = params.turnos ? params.turnos : [];
	this.html = $("<div class = 'turnosRow'></div>");
	this.listaTurnosHtml = [];
	this.perspectiva = "900px";
	for (var i = 0 ;i< row.listaTurnos.length ;i++){
		row.html.append(row.listaTurnos[i].getHtml());
		row.listaTurnosHtml.push(row.listaTurnos[i].getHtml());
	}

	this.reinsertHtml = function () {
		row.html.empty(); 
		row.listaTurnosHtml = [];
		for (var i = 0; i < row.listaTurnos.length; i ++){
			row.html.append(row.listaTurnos[i].getHtml());
			row.listaTurnosHtml.push(row.listaTurnos[i].getHtml());
		}
	}

	this.getHtml = function () {
		return row.html;
	}

	this.showDown = function(){
		
		TweenMax.fromTo(row.listaTurnosHtml, 1.25,  {rotationX:-30,y:Math.min(600,row.html.height())},{rotationX:0,y:0,transformPerspective:row.perspectiva,transformOrigin:"0 0",ease:Sine.easeOut});
	}	
	this.showUp = function(){
	
		TweenMax.fromTo(row.listaTurnosHtml, 1.25,{rotationX:30,y:Math.min(600,row.html.height())*-1},{rotationX:0,y:0,transformPerspective:row.perspectiva,transformOrigin:"0 100%" ,ease:Sine.easeOut});
	}	
	this.hideUp = function(){
		TweenMax.fromTo(row.listaTurnosHtml, 1.25,{rotationX:0,y:0}, {rotationX:30,y:Math.min(600,row.html.height())*-1,transformPerspective:row.perspectiva,transformOrigin:"0 100%", ease:Sine.easeOut});
	}	
	this.hideDown = function(){
		TweenMax.fromTo(row.listaTurnosHtml, 1.25,{rotationX:0,y:0}, {rotationX:-30,y:Math.min(600,row.html.height()),transformPerspective:row.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
		
	}
	this.hide = function(){
		TweenMax.to(row.listaTurnosHtml, 0.25,{y:1000,transformPerspective:row.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
	
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


	this.show = function(){
		dia.turnoManiana.show();
		dia.turnoTarde.show();
		dia.turnoNoche.show();
	}
	this.hide = function(){
		dia.turnoManiana.hide();
		dia.turnoTarde.hide();
		dia.turnoNoche.hide();
	}

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

	this.show = function(){
		TweenMax.to(turno.html,0.5,{width:"240px",ease:Sine.easeOut});
		for (var i = 0; i < turno.puestos.length; i++){
			turno.puestos[i].show();
		}
		
	}
	this.hide = function(){
		TweenMax.to(turno.html,0.5,{width:"50px",ease:Sine.easeOut});
		for (var i = 0; i < turno.puestos.length; i++){
			turno.puestos[i].hide();
		}
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
	this.htmlSlot = $("<div class='puestoSlotContainer'></div>");
	this.htmlColapsed = $("<div class='puestoColapsed'>"+this.slotsMinimos+"</div>");

	this.html
		//.append(this.htmlSlot)
		.append(this.htmlColapsed)
		.append(this.htmlHeader)
		.append("<div style='clear:both'></div>");

	for (var i = 0 ; i < puesto.slotsMinimos; i ++){
		var slot = new ESTRUCTURA.Slot();
		puesto.htmlSlot.append(slot.getHtml());
		puesto.slots.push(slot);
	}

	this.getHtml = function(){
		return puesto.html;
	}

	this.reinsertHtml = function() {
		puesto.html.empty()
			.append(puesto.htmlColapsed)
			//.append(puesto.htmlSlot)
			.append(puesto.htmlHeader)
			.append("<div style='clear:both'></div>");
		for (var i = 0 ; i < puesto.slots.length; i ++){
			puesto.htmlSlot.append(puesto.slots[i].getHtml());
		}
	}

	this.addSlot = function(){
		var slot = new ESTRUCTURA.Slot();
		puesto.htmlSlot.append(slot.getHtml());
		puesto.slots.push(slot);
	}

	this.show = function () {
		puesto.html
			.prepend(puesto.htmlSlot);
		TweenMax.fromTo(puesto.htmlSlot,0.5,{width:"25px"},{width:"90px"});
		puesto.htmlColapsed.remove();
	
	}

	this.hide = function () {
			puesto.html
			.prepend(puesto.htmlColapsed);
			TweenMax.to(puesto.htmlSlot,0.5,{width:"25px"});
			puesto.htmlSlot.remove();
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
		slot.htmlSetArea.addClass("bussy");
	}
	this.emptyLinkedElement = function () {
		slot.linkedElement = {};
		slot.htmlSetArea.addClass("bussy");
	}
}


ESTRUCTURA.Persona = function(params){
	var persona = this;
	this.nombre = params.nombre ? params.nombre : "John Doe";
	this.estado = params.estado;
	this.vacaciones = params.vacaciones ? params.vacaciones : 4;
	this.iluminaciones = params.iluminaciones ? params.iluminaciones : 0;

	this.asignacion = new Array(this.estado.length);
	for (var i = this.estado.length - 1; i >= 0; i--) {
		if (this.estado[i] == "T"){
			this.asignacion[i] = 0;	
		}else{
			this.asignacion[i] = -1;	
		}
	};

	this.html = $("<div class='personaIcon'></div>");


	this.getHtml = function(){
		return persona.html;
	}

}