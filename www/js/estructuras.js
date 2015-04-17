var ESTRUCTURA = {};

var GLOBAL = {};

ESTRUCTURA.CabeceraDias = function(params){
	var cabecera = this;
	this.dias = params.dias ? params.dias : [];
	this.anchoColumna = params.anchoColumna ? params.anchoColumna : 52;
	this.offset = params.offset ? params.offset : 190;
	this.html = $("<div class='cabeceraDiasContainer' ></div>");

	this.html.width(this.dias.length * this.anchoColumna );
	
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


ESTRUCTURA.Visualizador = function (params) {
	var visualizador = this;
	this.dias = params.dias ? params.dias : [];
	this.numDias = this.dias.length;
	this.rowManiana = {};
	this.rowTarde	= {};
	this.rowNoche	= {};
	this.offset = 190;
	this.anchoColumna = 52;
	this.cabeceraDias = new ESTRUCTURA.CabeceraDias({dias:this.dias,ancho:this.anchoColumna,offset:this.offset});
	this.footerTurnos = new ESTRUCTURA.FooterTurnos();
	this.visualizadorDetalle = params.detalle;

	console.log(this);

	this.html = $("<div class = 'visualizador'></div>");
	this.html.width(this.numDias * this.anchoColumna);
	this.currentDay  = 1;
	//this.dias[this.currentDay-1].show();
	this.cabeceraDias.dias[0].cabecera.addClass("selected");
	Draggable.create(visualizador.html, {
			bounds:$("#central"),
			type:"y,x",
			//edgeResistance :0,
			throwProps:true,
			zIndexBoost:false,
			onDrag:function() {
	         var xPos = Math.floor((this.x)/((-1)*visualizador.anchoColumna)) +1;
	      

	       	 if (visualizador.currentDay != xPos){
	       	 	visualizador.gotoDay(xPos);
	       	 
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
	        	var xPos = Math.min(0,Math.floor(((this.x-1)/visualizador.anchoColumna)+1)*visualizador.anchoColumna);
				
			
				TweenMax.to(visualizador.html, 0.25, {x:xPos, ease:Sine.easeOut});
	        },
	        onPress:function(){
	       
	        	
	        }



		});

	this.gotoDay = function(diaNum){
	//	visualizador.dias[visualizador.currentDay-1].hide();

		visualizador.dias[visualizador.currentDay-1].cabecera.removeClass("selected");
	
		visualizador.currentDay = diaNum;
	//   visualizador.dias[diaNum-1].show();
		visualizador.visualizadorDetalle.cambioDia(visualizador.dias[diaNum-1]);
		visualizador.dias[diaNum-1].cabecera.addClass("selected");
	
		//visualizador.cabeceraDias.marcarDia(diaNum-1);
		TweenMax.to(visualizador.html, 0.75, {x:"-"+(((diaNum-1)*visualizador.anchoColumna)), ease:Sine.easeOut});
		TweenMax.to(visualizador.cabeceraDias.html, 0.75, {x:"-"+(((diaNum-1)*visualizador.anchoColumna)), ease:Sine.easeOut});
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
		console.log(visualizador.rowManiana.getHtml().height(),visualizador.getHtml().height());
		//animaciones para cambio de estado
		if (visualizador.modo.actual == "noche"){
			visualizador.rowManiana.showUp();
			//visualizador.rowTarde.hideDown();
			visualizador.rowNoche.hideDown();
			visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));
		}
		else if (visualizador.modo.actual == "tarde"){
			visualizador.rowManiana.showUp();
			visualizador.rowTarde.hideDown();
			//visualizador.rowNoche.hideDown();
			visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));

		}else{
			//visualizador.rowManiana.showUp();
			console.log("hiddingall");
				TweenMax.fromTo(visualizador.rowManiana, 0.5,  {rotationX:0,y:0},{rotationX:0,y:0,transformOrigin:"100% 0",ease:Sine.easeOut});	
		visualizador.rowTarde.hide();
			visualizador.rowNoche.hide();
			visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));
		}
		visualizador.modo.actual = "maniana";

	}	
	this.modo.tarde = function(){
		
		//animaciones para cambio de estado
		if (visualizador.modo.actual == "noche"){
			//visualizador.rowManiana.hideDown();
			visualizador.rowTarde.showUp();
			visualizador.rowNoche.hideDown();
			visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));
		}else if(visualizador.modo.actual == "maniana"){
			visualizador.rowManiana.hideUp();
			visualizador.rowTarde.showDown();
			//visualizador.rowNoche.hideDown();
			visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));

		}
		visualizador.modo.actual = "tarde";
	}	
	this.modo.noche = function(){

		//animaciones para cambio de estado
		if (visualizador.modo.actual == "tarde"){
			//visualizador.rowManiana.hideUp();
			visualizador.rowTarde.hideUp();
			visualizador.rowNoche.showDown();
			visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));
		}
		else if(visualizador.modo.actual == "maniana"){
			visualizador.rowManiana.hideUp();
			visualizador.rowNoche.showDown();
			visualizador.html.css("height",Math.max(600,visualizador.rowManiana.getHtml().height()));
		}
				visualizador.modo.actual = "noche";
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
	this.caraActual = 1;
	this.primeraCara =  $("<div class = 'CaraDetalle'></div>");
	this.segundaCara =  $("<div class = 'CaraDetalle'></div>");



	vDetalle.primeraCara
			.append(vDetalle.turnos[0].manianahtml)
			.append(vDetalle.turnos[0].tardehtml)
			.append(vDetalle.turnos[0].nochehtml);

	vDetalle.html
			.append(vDetalle.primeraCara)
			.append(vDetalle.segundaCara);

	




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

		vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml = maniana.getDetalle();
		vDetalle.turnos[(vDetalle.caraActual-1)].tardehtml = tarde.getDetalle();
		vDetalle.turnos[(vDetalle.caraActual-1)].nochehtml = noche.getDetalle();


		if (vDetalle.caraActual == 1){
			vDetalle.caraActual = 2;
			vDetalle.segundaCara.empty()
			.append(vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml)
			.append(vDetalle.turnos[(vDetalle.caraActual-1)].tardehtml)
			.append(vDetalle.turnos[(vDetalle.caraActual-1)].nochehtml);


			TweenMax.fromTo(vDetalle.segundaCara, 0.5,  {rotationY:60,x:vDetalle.html.width()},{rotationY:0,x:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"0 0",ease:Sine.easeOut});	
			TweenMax.fromTo(vDetalle.primeraCara, 0.5,{rotationY:0,x:0}, {rotationY:-60,x:vDetalle.html.width()*(-1),transformPerspective:vDetalle.perspectiva, transformOrigin:"100% 0",ease:Sine.easeOut});
	

		}else{
			vDetalle.caraActual = 1;
			vDetalle.primeraCara.empty()
			.append(vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml)
			.append(vDetalle.turnos[(vDetalle.caraActual-1)].tardehtml)
			.append(vDetalle.turnos[(vDetalle.caraActual-1)].nochehtml);

			TweenMax.fromTo(vDetalle.primeraCara, 0.5,  {rotationY:60,x:vDetalle.html.width()},{rotationY:0,x:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"0 0",ease:Sine.easeOut});	
			TweenMax.fromTo(vDetalle.segundaCara, 0.5,{rotationY:0,x:0}, {rotationY:-60,x:vDetalle.html.width()*(-1),transformPerspective:vDetalle.perspectiva, transformOrigin:"100% 0",ease:Sine.easeOut});
	
		}
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
			.append(vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml)
			.append(vDetalle.turnos[(vDetalle.caraActual-1)].tardehtml)
			.append(vDetalle.turnos[(vDetalle.caraActual-1)].nochehtml);

		vDetalle.html.empty()
			.append(vDetalle.primeraCara)
			.append(vDetalle.segundaCara);

	
		vDetalle.modo.maniana();

	};

	this.modo.maniana = function(){
		//animaciones para cambio de estado
	//	vDetalle.tl.play("maniana");
		if (vDetalle.modo.actual == "noche"){
			TweenMax.fromTo(vDetalle.turnos[0].manianahtml, 1.25,  {rotationX:30,y:(-1)*Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%",ease:Sine.easeOut});	
			TweenMax.fromTo(vDetalle.turnos[0].nochehtml, 1.25,{rotationX:0,y:0}, {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height()),transformPerspective:vDetalle.perspectiva, transformOrigin:"100% 0",ease:Sine.easeOut});
			
			TweenMax.fromTo(vDetalle.turnos[1].manianahtml, 1.25,  {rotationX:30,y:(-1)*Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%",ease:Sine.easeOut});	
			TweenMax.fromTo(vDetalle.turnos[1].nochehtml, 1.25,{rotationX:0,y:0}, {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height()),transformPerspective:vDetalle.perspectiva, transformOrigin:"100% 0",ease:Sine.easeOut});
	

			vDetalle.html.css("height",Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height()));
		}
		else if (vDetalle.modo.actual == "tarde"){
			TweenMax.fromTo(vDetalle.turnos[0].manianahtml, 1.25,{rotationX:30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())*-1},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%" ,ease:Sine.easeOut});
			TweenMax.fromTo(vDetalle.turnos[0].tardehtml, 1.25,{rotationX:0,y:0}, {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height()),transformPerspective:vDetalle.perspectiva, transformOrigin:"100% 0",ease:Sine.easeOut});
		
			TweenMax.fromTo(vDetalle.turnos[1].manianahtml, 1.25,{rotationX:30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())*-1},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%" ,ease:Sine.easeOut});
			TweenMax.fromTo(vDetalle.turnos[1].tardehtml, 1.25,{rotationX:0,y:0}, {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height()),transformPerspective:vDetalle.perspectiva, transformOrigin:"100% 0",ease:Sine.easeOut});
		

		vDetalle.html.css("height",Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height()));

		}else{
			TweenMax.fromTo(vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml, 1.25,  {rotationX:0,y:0},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 0",ease:Sine.easeOut});	
			TweenMax.to(vDetalle.turnos[0].tardehtml, 0.25,{y:1000,transformPerspective:vDetalle.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
			TweenMax.to(vDetalle.turnos[0].nochehtml, 0.25,{y:1000,transformPerspective:vDetalle.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
		
			TweenMax.fromTo(vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml, 1.25,  {rotationX:0,y:0},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 0",ease:Sine.easeOut});	
			TweenMax.to(vDetalle.turnos[1].tardehtml, 0.25,{y:1000,transformPerspective:vDetalle.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
			TweenMax.to(vDetalle.turnos[1].nochehtml, 0.25,{y:1000,transformPerspective:vDetalle.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
		

			vDetalle.html.css("height",Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height()));
		}
		vDetalle.modo.actual = "maniana";

	}	
	this.modo.tarde = function(){
	//	vDetalle.tl.play("tarde");

		//animaciones para cambio de estado
		if (vDetalle.modo.actual == "noche"){
			//vDetalle.manianahtml.hideDown();
			
			TweenMax.fromTo(vDetalle.turnos[0].tardehtml, 1.25,{rotationX:30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())*-1},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%" ,ease:Sine.easeOut});
			TweenMax.fromTo(vDetalle.turnos[0].nochehtml, 1.25,{rotationX:0,y:0}, {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height()),transformPerspective:vDetalle.perspectiva, transformOrigin:"100% 0",ease:Sine.easeOut});
	
			TweenMax.fromTo(vDetalle.turnos[1].tardehtml, 1.25,{rotationX:30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())*-1},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%" ,ease:Sine.easeOut});
			TweenMax.fromTo(vDetalle.turnos[1].nochehtml, 1.25,{rotationX:0,y:0}, {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height()),transformPerspective:vDetalle.perspectiva, transformOrigin:"100% 0",ease:Sine.easeOut});

			vDetalle.html.css("height",Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].tardehtml.height()));
		}else if(vDetalle.modo.actual == "maniana"){
			TweenMax.fromTo(vDetalle.turnos[0].manianahtml, 1.25,{rotationX:0,y:0}, {rotationX:30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())*-1,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%", ease:Sine.easeOut});	
			TweenMax.fromTo(vDetalle.turnos[0].tardehtml, 1.25,  {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 0",ease:Sine.easeOut});	

			TweenMax.fromTo(vDetalle.turnos[1].manianahtml, 1.25,{rotationX:0,y:0}, {rotationX:30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())*-1,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%", ease:Sine.easeOut});	
			TweenMax.fromTo(vDetalle.turnos[1].tardehtml, 1.25,  {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 0",ease:Sine.easeOut});	


			//vDetalle.nochehtml.hideDown();
			vDetalle.html.css("height",Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].tardehtml.height()));

		}
		vDetalle.modo.actual = "tarde";
	}	
	this.modo.noche = function(){
		//vDetalle.tl.play("noche");
		
		//animaciones para cambio de estado
		if (vDetalle.modo.actual == "tarde"){
			//vDetalle.manianahtml.hideUp();
			TweenMax.fromTo(vDetalle.turnos[0].tardehtml, 1.25,{rotationX:0,y:0}, {rotationX:30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())*-1,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%", ease:Sine.easeOut});		
			TweenMax.fromTo(vDetalle.turnos[0].nochehtml, 1.25,  {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 0",ease:Sine.easeOut});	
			

			TweenMax.fromTo(vDetalle.turnos[1].tardehtml, 1.25,{rotationX:0,y:0}, {rotationX:30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())*-1,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%", ease:Sine.easeOut});		
			TweenMax.fromTo(vDetalle.turnos[1].nochehtml, 1.25,  {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 0",ease:Sine.easeOut});	
			

			vDetalle.html.css("height",Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].nochehtml.height()));
		}
		else if(vDetalle.modo.actual == "maniana"){
			TweenMax.fromTo(vDetalle.turnos[0].manianahtml, 1.25,{rotationX:0,y:0}, {rotationX:30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())*-1,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%", ease:Sine.easeOut});
			TweenMax.fromTo(vDetalle.turnos[0].nochehtml, 1.25,  {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 0",ease:Sine.easeOut});	
			
			TweenMax.fromTo(vDetalle.turnos[1].manianahtml, 1.25,{rotationX:0,y:0}, {rotationX:30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())*-1,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 100%", ease:Sine.easeOut});
			TweenMax.fromTo(vDetalle.turnos[1].nochehtml, 1.25,  {rotationX:-30,y:Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].manianahtml.height())},{rotationX:0,y:0,transformPerspective:vDetalle.perspectiva,transformOrigin:"100% 0",ease:Sine.easeOut});	
			
			vDetalle.html.css("height",Math.max(600,vDetalle.turnos[(vDetalle.caraActual-1)].nochehtml.height()));
		}
		vDetalle.modo.actual = "noche";
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
		TweenMax.fromTo(row.html, 1.25,  {rotationX:-30,y:Math.max(600,row.html.height())},{rotationX:0,y:0,transformPerspective:row.perspectiva,transformOrigin:"0 0",ease:Sine.easeOut});	
	//	TweenMax.fromTo(row.listaTurnosHtml, 1.25,  {rotationX:-30,y:Math.max(600,row.html.height())},{rotationX:0,y:0,transformPerspective:row.perspectiva,transformOrigin:"0 0",ease:Sine.easeOut});
	}	
	this.showUp = function(){
	
		TweenMax.fromTo(row.html, 1.25,{rotationX:30,y:Math.max(600,row.html.height())*-1},{rotationX:0,y:0,transformPerspective:row.perspectiva,transformOrigin:"0 100%" ,ease:Sine.easeOut});
	//	TweenMax.fromTo(row.listaTurnosHtml, 1.25,{rotationX:30,y:Math.max(600,row.html.height())*-1},{rotationX:0,y:0,transformPerspective:row.perspectiva,transformOrigin:"0 100%" ,ease:Sine.easeOut});
	}	
	this.hideUp = function(){

		TweenMax.fromTo(row.html, 1.25,{rotationX:0,y:0}, {rotationX:30,y:Math.max(600,row.html.height())*-1,transformPerspective:row.perspectiva,transformOrigin:"0 100%", ease:Sine.easeOut});
	//	TweenMax.fromTo(row.listaTurnosHtml, 1.25,{rotationX:0,y:0}, {rotationX:30,y:Math.max(600,row.html.height())*-1,transformPerspective:row.perspectiva,transformOrigin:"0 100%", ease:Sine.easeOut});
	}	
	this.hideDown = function(){

		TweenMax.fromTo(row.html, 1.25,{rotationX:0,y:0}, {rotationX:-30,y:Math.max(600,row.html.height()),transformPerspective:row.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
	//	TweenMax.fromTo(row.listaTurnosHtml, 1.25,{rotationX:0,y:0}, {rotationX:-30,y:Math.max(600,row.html.height()),transformPerspective:row.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
		
	}
	this.hide = function(){
		TweenMax.to(row.html, 0.25,{y:1000,transformPerspective:row.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
	//	TweenMax.to(row.listaTurnosHtml, 0.25,{y:1000,transformPerspective:row.perspectiva, transformOrigin:"0 0",ease:Sine.easeOut});
	
	}
}

ESTRUCTURA.Dia = function (params){
	var dia = this;
	this.turnoManiana = {};
	this.turnoTarde = {};
	this.turnoNoche = {};
	this.turno = {};//[this.turnoManiana,this.turnoTarde,this.turnoNoche];
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
		dia.turno[tipo] = turno;

	}

	this.comprobarIncidencias = function(){
		// TODO comprobar si no se cumplen todos los requisitos en los turnos.
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

	this.asignarPersonal = function(personalDisponible){
		
		var personalusado = 0;
		var numSlots = 0;
		for (var grupoAptos in turno.puestos[0].gruposAptos){
				personalusado += personalDisponible[turno.puestos[0].gruposAptos[grupoAptos]].length;
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
		};
	
		turno.estadisticas.setSlots(numSlots);
			turno.estadisticas.setBalance(personalusado);
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
	this.getDetalle = function(){
		return turno.detalle;
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
		estadisticas.numIndividuos.empty().append("Personal: " + numPersonal);
	}
	this.setBalance = function(numBalance){
		estadisticas.numBalance.empty().append("Balance: " + numBalance);
	//	console.log("personal:",estadisticas.numIndividuos[0].innerHTML,"balance:",numBalance , "Slots:", estadisticas.numSlots);
	}
	this.setSlots = function(numSlots){
		estadisticas.numSlots = numSlots;
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
		var slot = new ESTRUCTURA.Slot();
		puesto.detalleSlot.append(slot.getHtml());
		
		puesto.slots.push(slot);
	}

	this.getHtml = function(){
		return puesto.html;
	}

	this.getDetalle = function(){
		return puesto.detalle;
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
		slot.htmlSetArea.empty().append(linkedElement.nombre);

	}
	this.emptyLinkedElement = function () {
		slot.linkedElement = {};
		slot.htmlSetArea.empty();
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
	this.limitado = params.limitado ? params.limitado  : true;

}