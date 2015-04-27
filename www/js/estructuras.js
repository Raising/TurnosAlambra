var ESTRUCTURA = {};

var GLOBAL = {};

ESTRUCTURA.CabeceraDias = function(params){
	var cabecera = this;
	this.dias = params.dias ? params.dias : [];
	this.anchoColumna = params.anchoColumna ? params.anchoColumna : 112;
	this.offset = params.offset ? params.offset : 190;
	this.html = $("<div class='cabeceraDiasContainer' ></div>");

	this.html.width(this.dias.length * this.anchoColumna +6 );
	
	for (var i = 0; i < this.dias.length; i++) {
		this.dias[i].cabecera = $("<div class='cabeceraDia'>"+this.dias[i].date+"</div>");
		if (this.dias[i].diaSemana > 4){
			this.dias[i].cabecera.addClass("finde");
		}
		this.dias[i].cabecera.width(this.anchoColumna-2);
		this.html.append(this.dias[i].cabecera);
	};
	this.marcarDia = function(diaNum){
	
		cabecera.dias[diaNum].cabecera.addClass("selected");
	}
	this.desmarcarDia = function(diaNum){
		cabecera.dias[diaNum].cabecera.removeClass("selected");
	}



	this.expandDia = function(diaNum){

		TweenMax.to(cabecera.dias[diaNum].cabecera, 0.5, {width:cabecera.offset +cabecera.anchoColumna -2, ease:Sine.easeOut});
	}
	this.contractDia = function(diaNum){
		TweenMax.to(cabecera.dias[diaNum].cabecera, 0.5, {width:cabecera.anchoColumna -2, ease:Sine.easeOut});
	}

	this.getHtml = function(){
		return cabecera.html;
	}


}



ESTRUCTURA.FooterDias = function(params){
	var footer = this;
	this.dias = params.dias ? params.dias : [];
	this.anchoColumna = params.anchoColumna ? params.anchoColumna : 112;
	this.offset = params.offset ? params.offset : 190;
	this.html = $("<div class='footerDiasContainer' ></div>");

	this.html.width(this.dias.length * this.anchoColumna + 6 );
	
	for (var i = 0; i < this.dias.length; i++) {
		var tempfooter = this.dias[i].calcularFooter();
		//console.log(footer);
		//var footer = $("<div class='footerDia'>"+this.dias[i].date+"</div>");
		if (this.dias[i].diaSemana > 4){
			tempfooter.addClass("finde");
		}
		tempfooter.width(this.anchoColumna-2);
		this.html.append(tempfooter);

	};
	this.marcarDia = function(diaNum){
	
		footer.dias[diaNum].footer.addClass("selected");
	}
	this.desmarcarDia = function(diaNum){
		footer.dias[diaNum].footer.removeClass("selected");
	}



	this.expandDia = function(diaNum){

		TweenMax.to(footer.dias[diaNum].footer, 0.5, {width:footer.offset +footer.anchoColumna -2, ease:Sine.easeOut});
	}
	this.contractDia = function(diaNum){
		TweenMax.to(footer.dias[diaNum].footer, 0.5, {width:footer.anchoColumna -2, ease:Sine.easeOut});
	}

	this.getHtml = function(){
		return footer.html;
	}
}

ESTRUCTURA.Visualizador = function (params) {
	var visualizador = this;
	this.dias = params.dias ? params.dias : [];
	this.numDias = this.dias.length;
	this.rowManiana = {};
	this.rowTarde	= {};
	this.rowNoche	= {};
	this.offset = 190;
	this.anchoColumna = 112;
	this.cabeceraDias = new ESTRUCTURA.CabeceraDias({dias:this.dias,ancho:this.anchoColumna,offset:this.offset});
	this.footerTurnos = new ESTRUCTURA.FooterDias({dias:this.dias,ancho:this.anchoColumna,offset:this.offset});
	this.visualizadorDetalle = params.detalle;

	console.log(this);

	this.html = $("<div class = 'visualizador'></div>");
	this.html.width(this.numDias * this.anchoColumna + 6);
	this.currentDay  = 1;
	//this.dias[this.currentDay-1].show();
	this.cabeceraDias.dias[0].cabecera.addClass("selected");
	this.cabeceraDias.dias[0].marcarTurno();
	Draggable.create(visualizador.html, {
			bounds:$("#central"),
			type:"y",
			//edgeResistance :0,
			throwProps:true,
			zIndexBoost:false,
			onDrag:function() {
	         /*var xPos = Math.floor((this.x)/((-1)*visualizador.anchoColumna)) +1;
	      

	       	 if (visualizador.currentDay != xPos){
	       	 	visualizador.gotoDay(xPos);
	       	 
	       	 	$(".miniDia").removeClass("selected");
				$($("#miniMapa").children()[xPos-1]).addClass("selected");
	       	 }*/
	        },
	        onDragEnd:function(){
	        	var xPos = Math.min(0,Math.floor(((this.x-1)/visualizador.anchoColumna)+1)*visualizador.anchoColumna);
				
			
				//TweenMax.to(visualizador.html, 0.25, {x:xPos, ease:Sine.easeOut});
	        },
	        onPress:function(){
	       
	        	
	        }



		});

	this.gotoDay = function(diaNum){
	//	visualizador.dias[visualizador.currentDay-1].hide();
		GLOBAL.diaActual = diaNum-1;
		$("#miniMapa").children().removeClass("selected");
		visualizador.dias[visualizador.currentDay-1].cabecera.removeClass("selected");
		visualizador.dias[visualizador.currentDay-1].desmarcarTurno();
		visualizador.dias[diaNum-1].mostrarIndecencias();
		visualizador.currentDay = diaNum;
	//   visualizador.dias[diaNum-1].show();
		visualizador.visualizadorDetalle.cambioDia(visualizador.dias[diaNum-1]);
		visualizador.dias[diaNum-1].cabecera.addClass("selected");
		visualizador.dias[diaNum-1].marcarTurno();
		$($("#miniMapa").children()[diaNum]).addClass("selected");
		//visualizador.cabeceraDias.marcarDia(diaNum-1);
		var posicion = "-"+Math.max(0, Math.min(((diaNum-5)*visualizador.anchoColumna),(visualizador.dias.length*visualizador.anchoColumna)- 878));
		TweenMax.to(visualizador.html, 1.25, {x:posicion, ease:Sine.easeOut});
		TweenMax.to(visualizador.cabeceraDias.html, 1.25, {x:posicion, ease:Sine.easeOut});
		TweenMax.to(visualizador.footerTurnos.html, 1.25, {x:posicion,transformOrigin:"100% 0",ease:Sine.easeOut});
	}

	this.reinsertHtml = function () {
		this.html.empty();
		var turnosManiana = [];
		var turnosTarde = [];
		var turnosNoche = [];

		for (var i = 0 ; i < visualizador.dias.length; i++){
			turnosManiana.push(visualizador.dias[i].getTurno("Mañana"));
			turnosTarde.push(visualizador.dias[i].getTurno("Tarde"));
			turnosNoche.push(visualizador.dias[i].getTurno("Iluminación"));
		}

		visualizador.rowManiana 	= new ESTRUCTURA.Row({turnos:turnosManiana});
		visualizador.rowTarde	= new ESTRUCTURA.Row({turnos:turnosTarde});
		visualizador.rowNoche	= new ESTRUCTURA.Row({turnos:turnosNoche});

		visualizador.html
					.append(visualizador.rowManiana.getHtml())
					.append(visualizador.rowTarde.getHtml())
					.append(visualizador.rowNoche.getHtml());

	visualizador.modo.maniana();

	}

	this.getHtml = function(){
		return visualizador.html;	
	}

	this.getCabeceraDiasHtml = function(){
		return visualizador.cabeceraDias.getHtml();
	}

	this.getFootTurnosHtml = function(){
		return visualizador.footerTurnos.getHtml();
	}

	this.modo = {};
	this.modo.actual = "Vacio";

	this.modo.maniana = function(){
		//console.log(visualizador.rowManiana.getHtml().height(),visualizador.getHtml().height());
		TweenMax.to(visualizador.footerTurnos.html, 1.25,  {y:0,transformOrigin:"100% 0",ease:Sine.easeOut});	
		TweenMax.to(visualizador.html, 1.25,  {y:0,transformOrigin:"100% 0",ease:Sine.easeOut});	
		


		//animaciones para cambio de estado
		if (visualizador.modo.actual == "noche"){
			visualizador.rowManiana.showUp();
			visualizador.rowNoche.hideDown();
			//visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));
		}
		else if (visualizador.modo.actual == "tarde"){
			visualizador.rowManiana.showUp();
			visualizador.rowTarde.hideDown();
			//visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));

		}else{
			console.log("hiddingall");
			TweenMax.fromTo(visualizador.rowManiana, 0.5,  {rotationX:0,y:0},{rotationX:0,y:0,transformOrigin:"100% 0",ease:Sine.easeOut});	
			visualizador.rowTarde.hide();
			visualizador.rowNoche.hide();
			//visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));
		}
		visualizador.modo.actual = "maniana";
		visualizador.getHtml().height(visualizador.rowManiana.getHtml().height());
	}	
	this.modo.tarde = function(){
		
		//animaciones para cambio de estado
		TweenMax.to(visualizador.footerTurnos.html, 1.25,  {y:-40,transformOrigin:"100% 0",ease:Sine.easeOut});	
		TweenMax.to(visualizador.html, 1.25,  {y:0,transformOrigin:"100% 0",ease:Sine.easeOut});	
		
		if (visualizador.modo.actual == "noche"){
			//visualizador.rowManiana.hideDown();
			visualizador.rowTarde.showUp();
			visualizador.rowNoche.hideDown();
			//visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));
		}else if(visualizador.modo.actual == "maniana"){
			visualizador.rowManiana.hideUp();
			visualizador.rowTarde.showDown();
			//visualizador.rowNoche.hideDown();
			//visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));

		}
		visualizador.modo.actual = "tarde";
		visualizador.getHtml().height(visualizador.rowTarde.getHtml().height());
	}	
	this.modo.noche = function(){

		//animaciones para cambio de estado
		TweenMax.to(visualizador.footerTurnos.html, 1.25,  {y:-80,transformOrigin:"100% 0",ease:Sine.easeOut});	
		TweenMax.to(visualizador.html, 1.25,  {y:0,transformOrigin:"100% 0",ease:Sine.easeOut});	
		
		if (visualizador.modo.actual == "tarde"){
			//visualizador.rowManiana.hideUp();
			visualizador.rowTarde.hideUp();
			visualizador.rowNoche.showDown();
			//visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));
		}
		else if(visualizador.modo.actual == "maniana"){
			visualizador.rowManiana.hideUp();
			visualizador.rowNoche.showDown();
			//visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));
		}
				visualizador.modo.actual = "noche";
				visualizador.getHtml().height(visualizador.rowNoche.getHtml().height());
	}

}



ESTRUCTURA.VisualizadorDetalle = function (params){
	ESTRUCTURA.Visualizador.call(this,params);
	var vDetalle = this;
	this.dia = params.dias[0] ? params.dias[0] : {};

	this.maniana = this.dia.getTurno("Mañana");
	this.tarde =  this.dia.getTurno("Tarde");
	this.noche= this.dia.getTurno("Iluminación");

	this.turnos = [{},{}];
	console.log(this);
	this.turnos[0].manianahtml = this.maniana.getDetalle();
	this.turnos[0].tardehtml = this.tarde.getDetalle();
	this.turnos[0].nochehtml = this.noche.getDetalle();

	this.turnos[1].manianahtml = this.maniana.getDetalle();
	this.turnos[1].tardehtml = this.tarde.getDetalle();
	this.turnos[1].nochehtml = this.noche.getDetalle();
	this.tl = {};
	this.perspectiva = "900px";
	this.html = $("<div class = 'visualizadorDetalle'></div>");
	this.caraActual = 2;
	this.primeraCara =  $("<div class = 'CaraDetalle'></div>");
	this.segundaCara =  $("<div class = 'CaraDetalle'></div>");



	vDetalle.primeraCara
			.prepend(vDetalle.turnos[0].manianahtml)
			.prepend(vDetalle.turnos[0].tardehtml)
			.prepend(vDetalle.turnos[0].nochehtml);

	vDetalle.html
			.append(vDetalle.primeraCara)
			.prepend(vDetalle.segundaCara);

	




	Draggable.create(vDetalle.html, {
			bounds:$("#detalle"),
			type:"y",
			//edgeResistance :0,
			throwProps:true,
			zIndexBoost:false,
			onDrag:function() {
	   
	        },
	        snap: {
		      
		    },
	        onDragEnd:function(){
	        	
	        },
	        onPress:function(){
	        	
	        }

		});
	
	this.cambioDia = function(dia){
		var maniana = dia.getTurno("Mañana");
		var tarde =  dia.getTurno("Tarde");
		var noche= dia.getTurno("Iluminación");

		vDetalle.turnos[(vDetalle.caraActual%2)].manianahtml = maniana.getDetalle();
		vDetalle.turnos[(vDetalle.caraActual%2)].tardehtml = tarde.getDetalle();
		vDetalle.turnos[(vDetalle.caraActual%2)].nochehtml = noche.getDetalle();


		if (vDetalle.caraActual == 1){
			vDetalle.caraActual = 2;
			vDetalle.segundaCara.empty()
			.prepend(vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml)
			.prepend(vDetalle.turnos[(vDetalle.caraActual-1)].tardehtml)
			.prepend(vDetalle.turnos[(vDetalle.caraActual-1)].nochehtml);


			TweenMax.fromTo(vDetalle.segundaCara, 0.5,  {rotationY:60,x:vDetalle.html.width()},{rotationY:0,x:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"0 0",ease:Sine.easeOut});	
			TweenMax.fromTo(vDetalle.primeraCara, 0.5,{rotationY:0,x:0}, {rotationY:-60,x:vDetalle.html.width()*(-1),transformPerspective:vDetalle.perspectiva, transformOrigin:"100% 0",ease:Sine.easeOut});
	

		}else{
			vDetalle.caraActual = 1;
			vDetalle.primeraCara.empty()
			.prepend(vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml)
			.prepend(vDetalle.turnos[(vDetalle.caraActual-1)].tardehtml)
			.prepend(vDetalle.turnos[(vDetalle.caraActual-1)].nochehtml);

			TweenMax.fromTo(vDetalle.primeraCara, 0.5,  {rotationY:60,x:vDetalle.html.width()},{rotationY:0,x:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"0 0",ease:Sine.easeOut});	
			TweenMax.fromTo(vDetalle.segundaCara, 0.5,{rotationY:0,x:0}, {rotationY:-60,x:vDetalle.html.width()*(-1),transformPerspective:vDetalle.perspectiva, transformOrigin:"100% 0",ease:Sine.easeOut});
	
		}
		vDetalle.modo.recarga();
	}

	this.reinsertHtml = function(){
		vDetalle.html.empty();
	
		vDetalle.maniana=vDetalle.dia.getTurno("Mañana");
		vDetalle.tarde	= vDetalle.dia.getTurno("Tarde");
		vDetalle.noche	=vDetalle.dia.getTurno("Iluminación");

		vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml = vDetalle.maniana.getDetalle();
		vDetalle.turnos[(vDetalle.caraActual-1)].tardehtml = vDetalle.tarde.getDetalle();
		vDetalle.turnos[(vDetalle.caraActual-1)].nochehtml = vDetalle.noche.getDetalle();


		vDetalle.primeraCara =  $("<div class = 'CaraDetalle'></div>");
		vDetalle.segundaCara =  $("<div class = 'CaraDetalle'></div>");



		vDetalle.primeraCara.empty()
			.prepend(vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml)
			.prepend(vDetalle.turnos[(vDetalle.caraActual-1)].tardehtml)
			.prepend(vDetalle.turnos[(vDetalle.caraActual-1)].nochehtml);

		vDetalle.html.empty()
			.prepend(vDetalle.primeraCara)
			.prepend(vDetalle.segundaCara);

	
		vDetalle.modo.maniana();
		setTimeout(vDetalle.modo.recarga, 1000);  vDetalle.modo.recarga();
	};
	this.showDown = function(element){  TweenMax.fromTo(element,1.05,  {y:2500},{y:0,transformOrigin:"0 0",ease:Sine.easeOut});	}		
	this.showUp = function(element){	TweenMax.fromTo(element,1.05,{y:-2500},{y:0,transformOrigin:"0 100%" ,ease:Sine.easeOut});}	
	this.hideUp = function(element){	TweenMax.fromTo(element,1.05,{y:0}, {y:-2500,transformOrigin:"0 100%", ease:Sine.easeOut});	}	
	this.hideDown = function(element){	TweenMax.fromTo(element,1.05,{y:0}, {y:2500,transformOrigin:"0 0",ease:Sine.easeOut});}
	this.hide = function(element){		TweenMax.to(element, 0.0,{y:2500,transformOrigin:"0 0",ease:Sine.easeOut});	}
	this.show = function(element){		TweenMax.to(element, 0.0,{y:0,transformOrigin:"0 0",ease:Sine.easeOut});	}


	this.modo.maniana = function(){
		//animaciones para cambio de estado
	//	vDetalle.tl.play("maniana");

		vDetalle.getHtml().height(vDetalle.turnos[vDetalle.caraActual-1].manianahtml.height());
		vDetalle.hide(vDetalle.turnos[0].nochehtml);
			vDetalle.hide(vDetalle.turnos[1].nochehtml);
			vDetalle.hide(vDetalle.turnos[0].tardehtml);
			vDetalle.hide(vDetalle.turnos[1].tardehtml);
		if (vDetalle.modo.actual == "noche"){
			vDetalle.showUp(vDetalle.turnos[0].manianahtml);
			vDetalle.showUp(vDetalle.turnos[1].manianahtml);
			vDetalle.hideDown(vDetalle.turnos[0].nochehtml);
			vDetalle.hideDown(vDetalle.turnos[1].nochehtml);
		}
		else if (vDetalle.modo.actual == "tarde"){
		
			vDetalle.showUp(vDetalle.turnos[0].manianahtml);
			vDetalle.showUp(vDetalle.turnos[1].manianahtml);
			vDetalle.hideDown(vDetalle.turnos[0].tardehtml);
			vDetalle.hideDown(vDetalle.turnos[1].tardehtml);
	
		}else{
			vDetalle.showUp(vDetalle.turnos[0].manianahtml);
			vDetalle.showUp(vDetalle.turnos[1].manianahtml);
			vDetalle.hide(vDetalle.turnos[0].nochehtml);
			vDetalle.hide(vDetalle.turnos[1].nochehtml);
			vDetalle.hide(vDetalle.turnos[0].tardehtml);
			vDetalle.hide(vDetalle.turnos[1].tardehtml);
	}
		vDetalle.modo.actual = "maniana";

	}	
	this.modo.tarde = function(){
	//	vDetalle.tl.play("tarde");
			vDetalle.getHtml().height(vDetalle.turnos[vDetalle.caraActual-1].tardehtml.height());
		vDetalle.hide(vDetalle.turnos[0].nochehtml);
			vDetalle.hide(vDetalle.turnos[1].nochehtml);
			vDetalle.hide(vDetalle.turnos[0].tardehtml);
			vDetalle.hide(vDetalle.turnos[1].tardehtml);
		//animaciones para cambio de estado
		if (vDetalle.modo.actual == "noche"){
			//vDetalle.manianahtml.hideDown();
			vDetalle.hideDown(vDetalle.turnos[0].nochehtml);
			vDetalle.hideDown(vDetalle.turnos[1].nochehtml);
			vDetalle.showUp(vDetalle.turnos[0].tardehtml);
			vDetalle.showUp(vDetalle.turnos[1].tardehtml);
		}else if(vDetalle.modo.actual == "maniana"){
			vDetalle.hideUp(vDetalle.turnos[0].manianahtml);
			vDetalle.hideUp(vDetalle.turnos[1].manianahtml);
			vDetalle.showDown(vDetalle.turnos[0].tardehtml);
			vDetalle.showDown(vDetalle.turnos[1].tardehtml);

		}
		vDetalle.modo.actual = "tarde";
	}	
	this.modo.noche = function(){
		//vDetalle.tl.play("noche");
				vDetalle.getHtml().height(vDetalle.turnos[vDetalle.caraActual-1].nochehtml.height());
			vDetalle.hide(vDetalle.turnos[0].nochehtml);
			vDetalle.hide(vDetalle.turnos[1].nochehtml);
			vDetalle.hide(vDetalle.turnos[0].tardehtml);
			vDetalle.hide(vDetalle.turnos[1].tardehtml);
		//animaciones para cambio de estado
		if (vDetalle.modo.actual == "tarde"){
			vDetalle.hideUp(vDetalle.turnos[0].tardehtml);
			vDetalle.hideUp(vDetalle.turnos[1].tardehtml);
			vDetalle.showDown(vDetalle.turnos[0].nochehtml);
			vDetalle.showDown(vDetalle.turnos[1].nochehtml);
		}
		else if(vDetalle.modo.actual == "maniana"){
			vDetalle.hideUp(vDetalle.turnos[0].manianahtml);
			vDetalle.hideUp(vDetalle.turnos[1].manianahtml);
			vDetalle.showDown(vDetalle.turnos[0].nochehtml);
			vDetalle.showDown(vDetalle.turnos[1].nochehtml);
		}
		vDetalle.modo.actual = "noche";
	}
	this.modo.recarga = function(){
			vDetalle.hide(vDetalle.turnos[0].manianahtml);
			vDetalle.hide(vDetalle.turnos[1].manianahtml);
			vDetalle.hide(vDetalle.turnos[0].nochehtml);
			vDetalle.hide(vDetalle.turnos[1].nochehtml);
			vDetalle.hide(vDetalle.turnos[0].tardehtml);
			vDetalle.hide(vDetalle.turnos[1].tardehtml);
		switch(vDetalle.modo.actual){

			case "maniana":
			vDetalle.getHtml().height(vDetalle.turnos[vDetalle.caraActual-1].manianahtml.height());
					vDetalle.show(vDetalle.turnos[0].manianahtml);
					vDetalle.show(vDetalle.turnos[1].manianahtml);
			break;
			case "tarde":
			vDetalle.getHtml().height(vDetalle.turnos[vDetalle.caraActual-1].tardehtml.height());
				vDetalle.show(vDetalle.turnos[0].tardehtml);
				vDetalle.show(vDetalle.turnos[1].tardehtml);
			
			break;
			case "noche":
			vDetalle.getHtml().height(vDetalle.turnos[vDetalle.caraActual-1].nochehtml.height());
				vDetalle.show(vDetalle.turnos[0].nochehtml);
				vDetalle.show(vDetalle.turnos[1].nochehtml);
	
			break;
		}
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
		TweenMax.fromTo(row.html,1.05,  {y:2500},{y:0,transformPerspective:row.perspectiva,transformOrigin:"0 0",ease:Sine.easeOut});	
	}	
	this.showUp = function(){
	
		TweenMax.fromTo(row.html,1.05,{y:-2500},{y:0,transformPerspective:row.perspectiva,transformOrigin:"0 100%" ,ease:Sine.easeOut});
	}	
	this.hideUp = function(){

		TweenMax.fromTo(row.html,1.05,{y:0}, {y:-2500,transformPerspective:row.perspectiva,transformOrigin:"0 100%", ease:Sine.easeOut});
	}	
	this.hideDown = function(){

		TweenMax.fromTo(row.html,1.05,{y:0}, {y:2500,transformPerspective:row.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
	}
	this.hide = function(){
		TweenMax.to(row.html, 0.25,{y:2500,transformPerspective:row.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
	}
}

ESTRUCTURA.Dia = function (params){
	var dia = this;
	this.turnoManiana = {};
	this.turnoTarde = {};
	this.turnoNoche = {};
	this.turno = {};//[this.turnoManiana,this.turnoTarde,this.turnoNoche];
	this.date = params.date ? params.date : "00/00/0000";
	this.numero = params.numero;
	this.diaSemana = params.diaSemana ? params.diaSemana : 0 ;  // 0  = lunes ; 6 = domingo
	this.cuadrante = params.cuadrante ? params.cuadrante : "pecis";
	this.footer = $("<div class='footer' ></div>");
	this.incidencias = {"Mañana":false,"Tarde":false,"Iluminación":false};
	this.calcularFooter= function(){
		dia.footer.empty();
		for (var turno in dia.turno){
			dia.footer.append(dia.turno[turno].getEstadisticas());
		}
		return dia.footer;
	}
	this.mostrarIndecencias = function(){
		console.log(dia.incidencias);
		if (dia.incidencias["Mañana"]){
			$("#modo_maniana").addClass("incidencia");
		}else{
			$("#modo_maniana").removeClass("incidencia");
		}
		if (dia.incidencias["Tarde"]){
			$("#modo_tarde").addClass("incidencia");
		}else{
			$("#modo_tarde").removeClass("incidencia");
		}
		if (dia.incidencias["Iluminación"]){
			$("#modo_noche").addClass("incidencia");
		}else{
			$("#modo_noche").removeClass("incidencia");
		}
	}


	this.comprobarIncidencias = function(){
		var incidencia = false;
		for (var tipo in dia.turno){
			var respuesta = dia.turno[tipo].comprobarIncidencias(dia.numero);
		//	console.log(respuesta);
			if (respuesta == true){
				incidencia = true;
				$($("#miniMapa").children()[dia.numero+1]).addClass(tipo);
				
				dia.incidencias[tipo]=true;
			}else{
				$($("#miniMapa").children()[dia.numero+1]).remove(tipo);
				dia.incidencias[tipo]=false;
			}
			
			
		}
		if (incidencia == false){
			$($("#miniMapa").children()[dia.numero+1]).removeClass("incidencia");
		}else{
			$($("#miniMapa").children()[dia.numero+1]).addClass("incidencia");
			dia.calcularFooter();
		}
		return incidencia;

	}

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
		dia.turno[tipo] = turno;

	}
	this.marcarTurno = function(){
		for (var tipo in dia.turno){
			dia.turno[tipo].html.addClass("selected");
		}
	}
	this.desmarcarTurno = function(){
		for (var tipo in dia.turno){
			dia.turno[tipo].html.removeClass("selected");
		}
	}


	

	this.getTurno = function(tipo){
		
		return dia.turno[tipo];
	}
}



ESTRUCTURA.Turno = function  (params) {
	var turno = this;
	this.tipo = params.tipo ? params.tipo : "maniana";
	this.date = params.date ? params.date : "00/00/0000";
	this.cuadrante = params.cuadrante ? params.cuadrante : "pecis"; // sobra
	this.visualizador = params.visualizador;
	this.estadisticas = new ESTRUCTURA.EstadisticasTurno();
	this.diaNum = params.diaNum;
	this.puestos = [];

	this.html = $("<div class='turno' id='"+params.date+"' ></div>");
	this.detalle =  $("<div class='turno turnoDetalle'></div>");

	this.instertPuestosFromObject = function(object){
	
		var nPuestos = object.length;
		for (var i = 0; i < nPuestos; i ++){
			turno.puestos.push(object[i]);
		}		
		
		turno.reinsertHtml();
	}
	this.getEstadisticas = function(){
		return turno.estadisticas.getHtml();
	}


	this.comprobarIncidencias = function(diaNum){
		var incidencia = false;
		for (var i in turno.puestos){
			var actual_puesto = turno.puestos[i];
			if (actual_puesto.comprobarIncidencias(diaNum) == true){
				incidencia = true;
			}
		}
		return incidencia;
	}

	this.asignarPersonal = function(personal,dia){
		 var personalDisponible = {};

		for (var grupo in personal){

			personalDisponible[grupo] = [];
			for (var j = personal[grupo].length - 1; j >= 0; j--) {
				console.log();
				if(personal[grupo][j].estado[turno.diaNum-1] == "T"){

					personalDisponible[grupo].push(personal[grupo][j]);
				}			
			};
		}
		//console.log(personalDisponible);

		var personalusado = 0;
		var numSlots = 0;
		var puestosReusables = [];
		if ( turno.puestos[0]){
		for (var grupoAptos in turno.puestos[0].gruposAptos){
				personalusado += personalDisponible[turno.puestos[0].gruposAptos[grupoAptos]].length;
			}
		}

		turno.estadisticas.setPersonal(personalusado);
		
		for (var j = turno.puestos.length - 1; j >= 0; j--) {

			var puesto  = turno.puestos[j];

			var personalApto = [];
			var gruposSizes = [];
			for (var grupoAptos in puesto.gruposAptos){
				gruposSizes.push(personalDisponible[puesto.gruposAptos[grupoAptos]].length);
				personalApto = personalApto.concat(personalDisponible[puesto.gruposAptos[grupoAptos]]);
			}

			puesto.reiniciar();
			//console.log(personalApto.length);
			for (var k = puesto.slots.length - 1; k >= 0; k--) {

				var slot =  puesto.slots[k];
				numSlots ++;
				personalusado--;

				if (personalApto.length == 0){
				//	console.log("personal apto not found",personalApto);
				
				}else{
					

					var Random = Math.floor((Math.random() * personalApto.length));
					slot.setLinkedElement(personalApto[Random]);
					personalApto.splice(Random, 1);
					for (var t = 0; t<gruposSizes.length;t++){
						if (Random >= gruposSizes[t]){
							Random -=  gruposSizes[t];
						}else{
							//console.log(personalDisponible[puesto.gruposAptos[t]]);
							personalDisponible[puesto.gruposAptos[t]].splice(Random,1);
							gruposSizes[t]--;
							t = 1000;
						}
					}
				}
			};
			//console.log(puesto);
			if (puesto.slotsLimitado == false){
				puestosReusables.push(puesto);
			}
		};
	
		turno.estadisticas.setSlots(numSlots);
		turno.estadisticas.setBalance(personalusado);
	
		while (personalusado > 0 && puestosReusables.length > 0){
			
		
			for (var j =puestosReusables.length - 1; j >= 0; j--) {
				if (personalusado > 0){
					var puesto = puestosReusables[j];

					var personalApto = [];
					var gruposSizes = [];
					for (var grupoAptos in puesto.gruposAptos){
						gruposSizes.push(personalDisponible[puesto.gruposAptos[grupoAptos]].length);
						personalApto = personalApto.concat(personalDisponible[puesto.gruposAptos[grupoAptos]]);
					}
					//console.log(personalApto.length,personalusado);
		
					var slot =  new ESTRUCTURA.Slot({puesto:puesto});
					puesto.addSlot(slot);
					
					

					if (personalApto.length == 0){
					//	console.log("personal apto not found",personalApto);
						personalusado--; // no es correcto que entre aqui y se reduzca el indice pero hay que gestionar que no haya puestos para la persona en concreto entra en bucle infinito
					}else{
						personalusado--;

						var Random = Math.floor((Math.random() * personalApto.length));
						slot.setLinkedElement(personalApto[Random]);
						personalApto.splice(Random, 1);
						for (var t = 0; t<gruposSizes.length;t++){
							if (Random >= gruposSizes[t]){
								Random -=  gruposSizes[t];
							}else{
								//console.log(personalDisponible[puesto.gruposAptos[t]]);
								personalDisponible[puesto.gruposAptos[t]].splice(Random,1);
								gruposSizes[t]--;
								t = 1000;
							}
						}
					}
				}
			}
		}
		turno.reinsertHtml();
	}

	this.reinsertHtml = function () {
		turno.html.empty();
		turno.detalle.empty();
		for (var i = 0; i < turno.puestos.length; i ++){
			turno.html.append(turno.puestos[i].getHtml());
			turno.detalle.append(turno.puestos[i].getDetalle());
		}

		turno.html.on("click",function(){
			console.log(GLOBAL.visualizadorActual);
			GLOBAL.visualizadorActual.gotoDay(turno.diaNum);

		});
	}

	this.getHtml= function () {
		
	//	turno.reinsertHtml();
		return turno.html;
	}

	this.show = function(){
		TweenMax.to(turno.html,0.5,{width:"240px",ease:Sine.easeOut});
		for (var i = 0; i < turno.puestos.length; i++){
			turno.puestos[i].show();
		}
		
	}
	this.hide = function(){
		TweenMax.to(turno.html,0.5,{width:"110px",ease:Sine.easeOut});
		for (var i = 0; i < turno.puestos.length; i++){
			turno.puestos[i].hide();
		}
	}
	this.getDetalle = function(){
		turno.reinsertHtml();
		return turno.detalle;
	}


	this.showDown = function(){
		TweenMax.fromTo(turno.html,1.05,  {y:2500},{y:0,transformPerspective:row.perspectiva,transformOrigin:"0 0",ease:Sine.easeOut});	
	}	
	this.showUp = function(){
	
		TweenMax.fromTo(turno.html,1.05,{y:-2500},{y:0,transformPerspective:row.perspectiva,transformOrigin:"0 100%" ,ease:Sine.easeOut});
	}	
	this.hideUp = function(){

		TweenMax.fromTo(turno.html,1.05,{y:0}, {y:-2500,transformPerspective:row.perspectiva,transformOrigin:"0 100%", ease:Sine.easeOut});
	}	
	this.hideDown = function(){

		TweenMax.fromTo(turno.html,1.05,{y:0}, {y:2500,transformPerspective:row.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
	}
	this.hide = function(){
		TweenMax.to(turno.html, 0.25,{y:2500,transformPerspective:row.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
	}



}

ESTRUCTURA.EstadisticasTurno = function(params){
	var estadisticas = this;
	this.html = $("<div class='estadisticasTurno'></div>");
	this.numIndividuos = $("<span class='spanStadisticas'>Personal</spa>");
	this.numBalance =  $("<span class='spanStadisticas'>Balance</span>");
	this.numSlots = $("<span class='spanStadisticas'>Puestos</span>");
	this.html
		.append(this.numIndividuos)
		.append(this.numBalance)
		.append(this.numSlots);

	this.setPersonal = function(numPersonal){
		estadisticas.numIndividuos.empty().append("Per: " + numPersonal+"<br>");

	}
	this.setBalance = function(numBalance){
		estadisticas.numBalance.empty()
		.append("Bal: " + numBalance+"<br>");

		estadisticas.numBalance.removeClass("red").removeClass("blue");		
		if (numBalance > 0){
			estadisticas.numBalance.addClass("red");
		}else if (numBalance < 0){
			estadisticas.numBalance.addClass("blue");
		}
	//	console.log("personal:",estadisticas.numIndividuos[0].innerHTML,"balance:",numBalance , "Slots:", estadisticas.numSlots);
	}
	this.setSlots = function(numSlots){
		estadisticas.numSlots.empty().append("Pue: " + numSlots);

	}

	this.getHtml = function(){
		return estadisticas.html;
	}
}


ESTRUCTURA.Puesto = function(params){
	var puesto = this;
	
	this.tipoPuesto = params.tipoPuesto;

	this.nombre = params.tipoPuesto.lugares[0];

	this.slotsMinimos = params.tipoPuesto.numeroSlot;
	//console.log("creando puesto",params.tipoPuesto.limitado);
	this.slotsLimitado =  params.tipoPuesto.limitado; //un -1 indica SIn LImite 
	this.slots = [];

	this.gruposAptos =  params.tipoPuesto.gruposAptos;

	this.html = $("<div class='puesto'></div>");
	this.htmlHeader = $("<div class='puestoHeader'>"+puesto.nombre+"</div>");
	this.htmlSlot = $("<div class='puestoSlotCompress'>"+this.slotsMinimos+"</div>");
	//this.htmlColapsed = $("<div class='puestoColapsed'>"+this.slotsMinimos+"</div>");

	this.detalle = $("<div class='puesto detalle'></div>");
	this.detalleHeader = $("<div class='puestoHeader detalle'>"+puesto.nombre+"</div>");
	this.detalleSlot = $("<div class='puestoSlotContainer detalle'></div>");
	
	this.html
		//.append(this.htmlSlot)
		.append(this.htmlSlot)
		.append(this.htmlHeader)
		.append("<div style='clear:both'></div>");

	this.detalle
		.append(this.detalleSlot)
		.append(this.detalleHeader)
		.append("<div style='clear:both'></div>");



	for (var i = 0 ; i < puesto.slotsMinimos; i ++){
		var slot = new ESTRUCTURA.Slot({puesto:puesto});
		puesto.detalleSlot.append(slot.getHtml());
		puesto.slots.push(slot);
	}

	this.reiniciar = function(){
		puesto.slots = [];
		puesto.detalleSlot.empty();
		for (var i = 0 ; i < puesto.slotsMinimos; i ++){
			var slot = new ESTRUCTURA.Slot({puesto:puesto});
			puesto.detalleSlot.append(slot.getHtml());
			puesto.slots.push(slot);
		}
	}


	this.comprobarIncidencias = function(diaNum){
		var incidencia = false;
		for (var i in puesto.slots){
			var respuesta = puesto.slots[i].comprobarIncidencias(diaNum);
			if (respuesta < 0){
				puesto.actualizeNumber();
				var cantidadSlots = 0;
				for (var slotindex in puesto.slots){
				//	console.log(slotindex,puesto.slots[slotindex].bussy);
					if (puesto.slots[slotindex].bussy){
						cantidadSlots++;
					}
				}
				if (puesto.slotsMinimos > cantidadSlots){
					incidencia = true;
				}else if (puesto.slotsMinimos < cantidadSlots){
					puesto.slots.splice(i,1);
				}
			}
		}
		return incidencia;
	}

	this.getHtml = function(){
		puesto.actualizeNumber();
		return puesto.html;
	}

	this.getDetalle = function(){
		puesto.actualizeNumber();
		puesto.refresh();
		return puesto.detalle;
	}

	this.refresh = function(){

		puesto.ajustarCantidadSlots();
		for (var i = puesto.slots.length - 1; i >= 0; i--) {
			puesto.slots[i].refresh();
		};

	}

	this.ajustarCantidadSlots = function(){
		var cantidadSlots = 0;
		for (var slotindex in puesto.slots){
		//	console.log(slotindex,puesto.slots[slotindex].bussy);
			if (puesto.slots[slotindex].bussy){
				cantidadSlots++;
			}
		}
		while (puesto.slots.length > puesto.slotsMinimos && puesto.slots.length > cantidadSlots){
			for (var slotindex in puesto.slots){
				if (!puesto.slots[slotindex].bussy){
					puesto.slots.splice(slotindex,1);
					break;
				}
			} 
		}


	}

	this.reinsertHtml = function() {
		puesto.refresh();
		puesto.html.empty()
			.append(puesto.htmlColapsed)
			//.append(puesto.htmlSlot)
			.append(puesto.htmlHeader)
			.append("<div style='clear:both'></div>");
		for (var i = 0 ; i < puesto.slots.length; i ++){
			puesto.htmlSlot.append(puesto.slots[i].getHtml());
		}
		puesto.actualizeNumber();
		
	}

	this.addSlot = function(newSlot){
		var slot = (newSlot != undefined) ? newSlot : new ESTRUCTURA.Slot({puesto:puesto});
		puesto.detalleSlot.append(slot.getHtml());
		puesto.slots.push(slot);
		puesto.actualizeNumber();
	}

	this.actualizeNumber = function(){
		var cantidadSlots = 0;
		//console.log(puesto.slots);
		for (var slotindex in puesto.slots){
		//	console.log(slotindex,puesto.slots[slotindex].bussy);
			if (puesto.slots[slotindex].bussy){
				cantidadSlots++;
			}
		}
	//	console.log("reestableciendo mininumero",cantidadSlots,puesto.slotsMinimos);
		if (cantidadSlots == puesto.slotsMinimos){
			puesto.htmlSlot.empty().append(cantidadSlots).removeClass("rojo").removeClass("azul");
		}else if (cantidadSlots < puesto.slotsMinimos){
			puesto.htmlSlot.empty().append((cantidadSlots)+" / "+puesto.slotsMinimos).removeClass("rojo").removeClass("azul").addClass("rojo");
		}else if  (cantidadSlots > puesto.slotsMinimos){
			puesto.htmlSlot.empty().append((cantidadSlots)+" / "+puesto.slotsMinimos).removeClass("rojo").removeClass("azul").addClass("azul");
		}

	}

	puesto.actualizeNumber();
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
	this.puesto = params.puesto;
	this.linkedElement = "";
	this.html = $("<div class='puestoSlot'></div>");
	this.htmlSetArea = $("<div class='puestoSlotArea'></div>");
	this.bussy = false;

	this.comprobarIncidencias = function(diaNum){
		if (slot.bussy){
			if (slot.linkedElement.estado[diaNum] != "T"){
				slot.emptyLinkedElement();
				return -1;
			}
		}
		else{
			return -1;
		}

		
		return 0 ; 
	}

	this.html
		.append(this.htmlSetArea);


	this.getHtml = function(){
		slot.html.on("contextmenu",function(event){
			event.preventDefault();
			VISUAL.menuContextual(
				{opciones:[
					{ Titulo: "Introducir Persona" , Operacion : function(){
				$("body > .menuContextual").remove();
				console.log("click en menu contextual");}}
					],
				event:event
				});
			
		});
		slot.setLinkeContextMenu();

		return slot.html;
	};
	this.refresh = function(){
		slot.setLinkeContextMenu();
	}
	this.setLinkedElement = function  (linkedElement) {
		slot.bussy = true;
		linkedElement.slot = slot;
		slot.linkedElement = linkedElement;
		slot.htmlSetArea.addClass("bussy");
		slot.htmlSetArea.empty().append(linkedElement.nombre);
		slot.puesto.actualizeNumber();
		slot.setLinkeContextMenu();
	};
	this.setLinkeContextMenu = function(){
		slot.htmlSetArea.on("contextmenu",function(event){
			event.preventDefault();
			VISUAL.menuContextual(
				{opciones:[
					{ Titulo: "Editar Ddisponibilidad" , Operacion : function(){
						console.log("editor de disponibilidad");
						var editor = slot.linkedElement.getEditor();
						$("body > .menuContextual").remove();
						VISUAL.popUp({body:editor});
					}},
					{ Titulo: "Quitar del puesto" , Operacion : function(){
						slot.emptyLinkedElement();
						console.log("click en menu contextual");
						$("body > .menuContextual").remove();
					}},
					{ Titulo: "Intercambiar " , Operacion : function(){console.log("click en menu contextual");
				$("body > .menuContextual").remove();}}
					],
				event:event
				});
			return false;
		});
	}

	

	this.emptyLinkedElement = function () {
		slot.linkedElement.slot = {};
		slot.linkedElement = "";
		//slot.htmlSetArea.empty();
		slot.htmlSetArea.removeClass("bussy");
		slot.bussy = false;
	}
}


ESTRUCTURA.Persona = function(params){
	var persona = this;
	this.nombre = params.nombre ? params.nombre : "John Doe";
	this.estado = params.estado;
	this.vacaciones = params.vacaciones ? params.vacaciones : 4;
	this.iluminaciones = params.iluminaciones ? params.iluminaciones : 0;
	this.editable = [];
	this.asignacion = new Array(this.estado.length);
	for (var i = this.estado.length - 1; i >= 0; i--) {
		if (this.estado[i] == "T"){
			this.asignacion[i] = 0;	
		}else{
			this.asignacion[i] = -1;	
		}
	};

	this.html = $("<div class='personaIcon'></div>");
	
	this.getResumen = function(){
		var resumen = $("<div class='resumenPersona'></div>");
		
		for (var i = persona.estado.length - 1; i >= 0; i--) {
			switch(persona.estado[i]){
				case "T":
					resumen.prepend("<div class='resumenPixel naranja'></div>");
				break;
				case "D":
					resumen.prepend("<div class='resumenPixel azul'></div>");
				break;
				default:
					resumen.prepend("<div class='resumenPixel rojo'></div>");
				break;
			}
		};
		resumen.prepend("<div class='resumenNombe'>"+persona.nombre+"<div>");

		resumen.on("click",function(){
			VISUAL.popUp({body:persona.getEditor()});
		})
		return resumen;
		
	}
	this.getEditor = function(){
		persona.editor = $("<div class= 'personaEditor'>"+persona.nombre+"</div>");
		persona.cabeceraEditor = $("<div class='cabeceraEditor'></div>");
		persona.cuerpoEditor = $("<div class='cuerpoEditor'></div>");
		persona.resumenGlobal = $("<div class='iconContainer' style='margin-top:5px'><img class= 'iconMenuDetalle' src='img/personas.png'></img></div>");
		persona.resumenGlobal.on("click",function(){
			var resumenCompleto = $("<div class='resumenCompletoPersonas'></div>");
			for (var grupo in personal){
					for (var j = personal[grupo].length - 1; j >= 0; j--) {
						var persona = personal[grupo][j];
						resumenCompleto.prepend(persona.getResumen());
					};
				}
			VISUAL.popUp({body:resumenCompleto});
		});

		persona.editor.append(persona.cabeceraEditor).append(persona.cuerpoEditor);
	//	var valor = function(input){return input.valueOf(dia:valor(i-1),estado:persona.estado[i-1],html:$("<div class='estadoEditorPersona '>"+persona.estado[i-1]+"</div>")});};
		for(var i= 1; i <= 31;i++){
			var estadoSimple = new ESTRUCTURA.EstadoSimple({dia:i-1,estado:persona.estado,persona:persona});
			persona.cabeceraEditor.append("<div class='diasEditorPersona'>"+i+"</div>");
			persona.cuerpoEditor.append(estadoSimple.getHtml());
		}
		persona.cuerpoEditor.append(persona.resumenGlobal);
		persona.cabeceraEditor.click(function(){
			console.log(persona.estado);
		});
		return persona.editor;
	}
	this.comprobarCambiosDisponibilidad = function(){

	}

	this.getHtml = function(){
		var newHtml = $("<div class='personaIcon'><img src=''></img></div>");

		return persona.html;
	}

}



ESTRUCTURA.TipoPuesto = function(params){
	var tipoPuesto = this;
	this.gruposAptos = params.gruposAptos ? params.gruposAptos : [];
	this.turnoAbstracto = params.turnoAbstracto ? params.turnoAbstracto : {};
	this.lugares = params.lugares ? params.lugares : [];
	this.numeroSlot = params.numSlots ? params.numSlots  : 1;
//	console.log("parametros tipopuesto",params.limitado,params);
	this.limitado = (params.limitado != null) ? params.limitado  : false;

}




ESTRUCTURA.EstadoSimple = function(params){
	var simple = this;
	this.html = $("<div class='estadoEditorPersona'>"+params.estado[params.dia]+"</div>");
	this.dia = params.dia;
	this.estado = params.estado;
	this.persona = params.persona;
	if (simple.estado[params.dia] == "T"){
		simple.html.addClass("naranja");
	}else if (simple.estado[params.dia] == "D"){
		simple.html.addClass("azul");
	}else{
		simple.html.addClass("rojo");
	}		

	this.changeEstado = function(){

		switch (simple.estado[params.dia]){
			case "T":
				simple.html.removeClass("naranja").addClass("azul")[0].innerHTML="D";
				simple.estado[params.dia] = "D";
				//return "D";
			break;
			case "D":
				simple.html.removeClass("azul").addClass("rojo")[0].innerHTML="B";
				simple.estado[params.dia] = "B";
				//return "B";
			break;
			default:
				simple.html.removeClass("rojo").addClass("naranja")[0].innerHTML="T";
				simple.estado[params.dia] = "T";
				//return "T";
			break;
		}
		console.log("comprobarIncidencias", simple.dia);
		dias[simple.dia].comprobarIncidencias();

		return simple.estado[params.dia];
		//simple.persona.comprobarCambiosDisponibilidad();
	}

	simple.html.click(function(){
		simple.changeEstado();
	});


	this.getHtml = function(){
		return simple.html;
	}		
}