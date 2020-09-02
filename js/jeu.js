
window.onload = initialize; //lors du démarrage de js va appeler initialized 

//var global
var ctx = null;
var canvas=null;
var npclist = new Array(); 
var monsterlist = new Array();
var combat;

//creation d'une premiere map
//on passe en parametre le nom de la map en json
var mapArray = new Array();
var magasin = new Array();
var msg;
//var boutonClick = null;
var enCombatAvecQui=null;
var compteTick=1;
var map;
var map2;
var joueur;
var sac;
var monstre;
var mapActiver=0;
var message = new  Message("un message pas important");
var ancienX=0;
var ancienY=0;
var posX = null;
var posY = null;
var imageTriangle = new Image();
var pathTriangle="images/triangle.png";
var imageFleche = new Image();
var pathFleche="images/fleche_200.gif";
var imageFlecheD = new Image();
var pathFlecheD="images/glowingarrowright.gif";
var imageFlecheG = new Image();
var pathFlecheG="images/glowingarrowleft.gif";
var choixMenuOrdiDroite=0;
var choixMenuOrdiGauche=0;
var choixMagasin=0;
var valeurAfficher=0;
var zoneAfficherMagasin=0;
var zoneAffichageOrdi=0;
var listeitem=0;
//quelle page afficher
this.page;
//savoir les infos du dernier boss vaincue pour le regénérer
this.ancienMonstre;
function initialize(){
	/*sounds*/
	//http://01org.github.io/jWebAudio/index.html#demo
	initSound();
	initImage();


	// Création de l'objet XmlHttpRequest du AJAX
	var xhr = getXMLHttpRequest();

	// Chargement du fichier
	xhr.open("GET", 'Data/data.json', false);
	xhr.send(null);
	if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
		throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");

	//recupère la réponse du retour du json
	var npcJsonData = xhr.responseText;
	var npcData = JSON.parse(npcJsonData);

	//assigne la page de depart au jeu
	this.page = PAGE.JEU;

	//recupere le fichier data.json qui comporte les npcs et si ils ont des programons
	for(var i=0;i<npcData.taille;i++)
	{	
		
		var nom=npcData.npc[i].nom;
		var url=npcData.npc[i].url ;
		var x=npcData.npc[i].x;
		var y=npcData.npc[i].y;
		var direction=npcData.npc[i].direction;
		var texte=npcData.npc[i].texte[0];
		var endroit=npcData.npc[i].endroit;
		var combatter = npcData.npc[i].combat;
		
		npclist.push( new Npc(nom,url, x, y, direction, texte,endroit,combatter));

		if(npcData.npc[i].programonL!=undefined){

			
			for(var j=0;j<npcData.npc[i].programonL.length;j++){
				var programons=npcData.npc[i].programonL[j];

				npclist[i].addProgramon(new Programon(programons.nom,programons.url,programons.maxX,programons.minX,programons.maxY,programons.minY,programons.endroit,programons.type,programons.rareter, ctx));
		
			}
		}
	}
	//nomProgramon,urlImage,maxX,minX,maxY,minY,endroit
	monsterlist.push(new Programon("DanielMath","eliwood.png",17,12,8,3,"monde","C++",RARE.COMMON, ctx));
	monsterlist.push(new Programon("BernardMath","npc2.png",17,12,8,3,"monde","Android",RARE.COMMON, ctx));
	//
	
	//création du joueur et de ses programons starter
	joueur = new Personnage("exemple.png", 10, 10, DIRECTION.BAS,"unJoueur");
	//joueur.addProgramon(new Programon("arnaud","46.png",5,5,5,5,"listprogramon","Java",RARE.COMMON, ctx));
	//joueur.addProgramon(new Programon("Raph","xpchar39.png",5,5,5,5,"listprogramon", "Web",RARE.UNCOMMON, ctx));
	joueur.addProgramon(new Programon("Alexis","woot.png",5,5,5,5,"listprogramon", "Java",RARE.UNCOMMON, ctx));
	//joueur.addProgramon(new Programon("BernardMath","npc2.png",17,12,8,3,"monde","Android",RARE.COMMON, ctx));
	
	//joueur.addProgramon(new Programon("Yannick","random.png",5,5,5,5,"listprogramon", "C++",RARE.EPIC, ctx));

								//nom,valeur,soin(true/false),buff(true/false),qt
	joueur.addObject(new Object("potionSoin",2,true,null,0,30,2));
	joueur.addObject(new Object("def",5,null,true,0,5,1));
	joueur.addObject(new Object("revive",250,true,null,0,0,1));
	joueur.addObject(new Object("usb1ko",250,null,null,0,0,1));
	joueur.argent=100;
	magasin.push(new Object("potionSoin",10,true,null,0,30,20));
	magasin.push(new Object("cafe",20,true,null,1,60,20));
	magasin.push(new Object("monster",50,true,null,2,100,10));
	magasin.push(new Object("def",100,null,true,0,5,10));
	magasin.push(new Object("def2",300,null,true,1,15,5));
	magasin.push(new Object("def3",900,null,true,2,45,3));
	magasin.push(new Object("def4",2700,null,true,3,135,2));
	magasin.push(new Object("def5",8100,null,true,4,405,1));
	magasin.push(new Object("revive",500,true,null,0,0,10));
	magasin.push(new Object("reviveall",3000,true,null,2,0,1));
	magasin.push(new Object("usb1ko",500,null,null,0,0,5));
	magasin.push(new Object("usb2mo",750,null,null,1,0,1));
	magasin.push(new Object("usb3go",2000,null,null,2,0,1));
	magasin.push(new Object("usb4to",4000,null,null,3,0,1));
	magasin.push(new Object("usb5po",8000,null,null,4,0,1));

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext("2d"); //creation de la zone de dessin

	//besoin init les map avant de leur assigner n'importe quoi
	mapArray.push(new Map("grandeur_2","monde"));
	mapArray.push(new Map("testChangementMap","centreSoin"));
	mapArray.push(new Map("maison1","maison1"));
	mapArray.push(new Map("gym1","gym1"));
	mapArray.push(new Map("centreMagasin","centreMagasin"));
	//mapArray.push(new Map("Combat","Combat"));
	
	//ancienne facon d'assigner les map, mais ne fonctionne pas pour le déplacement du perso
	// celui-ci utilise map et non map2 pour délimiter ses déplacements
	//map = new Map("grandeur_2","monde");
	//map2 = new Map("testChangementMap","centreSoin");
	
	for(var i =0;i<npclist.length;i++)
	{
		var j=0;
		while(npclist[i].endroit != mapArray[j].typemap){
			j++;
		}

		mapArray[j].addNpc(npclist[i]);

	}

	for(var i =0;i<monsterlist.length;i++)
	{
		var j=0;
		while(npclist[i].endroit != mapArray[j].typemap){
			j++;
		}
		mapArray[j].addProgramon(monsterlist[i]);

	}		

	//assigne le personnage a la première map
	
	mapArray[0].addPersonnage(joueur);

	// permet de configurer la grandeur de la map en fonction de la constante du fichier constante.js
	canvas.height = mapArray[mapActiver].aMinX * 32;
	canvas.width  = mapArray[mapActiver].aMinY * 32;

	//Action lié au touche en fonction de l'écran affiché
	window.onkeydown = function(event) {
		var e = event || window.event; // action de 
		var key = e.which || e.keyCode;

		if(joueur.afficheMsg==true) {
			//a chaque fois qu'un message et afficher le compteur de conversation du npc est incrémenté
			//donc puisqu'il est incrémenté il a le choix de deux nouveaux message à afficher.
			var result=Math.random()*100;
			if(mapArray[mapActiver].npcs[joueur.qui].conversation>0){
			//this.mesg
			//mapArray[mapActiver].npcs[joueur.qui].conversation=1;
				if(result < 50)
					mapArray[mapActiver].npcs[joueur.qui].mesg = mapArray[mapActiver].npcs[joueur.qui].msg.m2;
				else
					mapArray[mapActiver].npcs[joueur.qui].mesg = mapArray[mapActiver].npcs[joueur.qui].msg.m3;
			
			}


		}
		joueur.afficheMsg = false;

		var droitPouvoir = 2;
		if(joueur.monsters[joueur.select].niveau>=5){
			droitPouvoir =2 + Math.floor(joueur.monsters[joueur.select].niveau / 5);
				if(droitPouvoir>joueur.monsters[joueur.select].listPouvoir.length)
					droitPouvoir=joueur.monsters[joueur.select].listPouvoir.length-1;
		}
	
		//console.log("droitPouvoir "+droitPouvoir);

		//monstre.deplacement();

	switch(key) {
		case 38 : case 122 : case 119 : case 87 : // Flèche haut, z, w, Z, W
		if(!joueur.menu)
			joueur.cBlah=false;
		if(this.page == PAGE.JEU && !joueur.menu)
			joueur.deplacer(DIRECTION.HAUT, mapArray[mapActiver],mapArray[mapActiver].npcs,mapArray[mapActiver].monsters,ctx);
		else if(this.page == PAGE.PROGRAMON && joueur.select>0){
			joueur.select --;	
			playclickversBas();
		}
		else if(this.page == PAGE.LPOUVOIR && joueur.monsters[joueur.select].pouvoirSelect>0){
			joueur.monsters[joueur.select].pouvoirSelect --;
			console.log(joueur.monsters[joueur.select].pouvoirSelect);
			playclickversBas();
		}
		else if(this.page == PAGE.BAGS && joueur.selectObject>0){
			joueur.selectObject --;
			playclickversBas();
		}
		else if(joueur.menu){
			 if(joueur.cOrdi && choixMenuOrdiGauche>0){
				choixMenuOrdiGauche--;
				playclickversBas();
			}
			else if(joueur.ouJeSuis=="centreMagasin" && joueur.cBlah){
				if(choixMagasin>0){
					choixMagasin--;
					if(choixMagasin>0 && zoneAfficherMagasin>0)
						zoneAfficherMagasin--;
					playclickversBas();
				}
			}
		}
		
		break;
		case 40 : case 115 : case 83 : // Flèche bas, s, S
		/*if(!joueur.cOrdi)
			joueur.menu=false;
			joueur.cBlah=false;	*/
		if(this.page == PAGE.JEU && !joueur.menu)
			joueur.deplacer(DIRECTION.BAS, mapArray[mapActiver],mapArray[mapActiver].npcs,mapArray[mapActiver].monsters,ctx);
		else if(this.page == PAGE.PROGRAMON && joueur.select<joueur.monsters.length-1 && joueur.select<3)
			{
				joueur.select ++;	playclickversBas();
			}
		else if(this.page == PAGE.LPOUVOIR && joueur.monsters[joueur.select].pouvoirSelect < droitPouvoir){
				joueur.monsters[joueur.select].pouvoirSelect ++; 
				console.log(joueur.monsters[joueur.select].pouvoirSelect);
				playclickversBas();
			
		}
		else if(this.page == PAGE.BAGS && joueur.selectObject < joueur.bags.length-1){
			joueur.selectObject ++;
			playclickversBas();
		}
		else if(joueur.menu){
			 if(joueur.cOrdi){
				if(choixMenuOrdiGauche<3 && choixMenuOrdiGauche<joueur.monsters.length-1)
					{choixMenuOrdiGauche ++;
						playclickversBas();}
				
			}
			else if(joueur.ouJeSuis=="centreMagasin" && joueur.cBlah){
				if(choixMagasin<magasin.length-1){
					choixMagasin++;
					if(choixMagasin>9 && zoneAfficherMagasin<magasin.length-1)
						zoneAfficherMagasin++;
					playclickversBas();
				}
			}
		}
		break;
		case 37 : case 113 : case 97 : case 65 : // Flèche gauche, q, a, Q, A
		if(this.page == PAGE.JEU && !joueur.menu){
				joueur.deplacer(DIRECTION.GAUCHE, mapArray[mapActiver],mapArray[mapActiver].npcs,mapArray[mapActiver].monsters,ctx);
			}
		else if(joueur.menu){
				joueur.choixAfaire=true;
				playclickversBas();
		 	if(joueur.cOrdi && choixMenuOrdiDroite>0){
				choixMenuOrdiDroite--;
				//if(choixMenuOrdiDroite%4==0 && zoneAffichageOrdi>0)
				//	zoneAffichageOrdi--;
				playclickversBas();
			}
			else if(joueur.cBlah){
				joueur.choixAfaire=true;
				playclickversBas();
			}
		}
		
		break;
		case 39 : case 100 : case 68 : // Flèche droite, d, D
		if(this.page == PAGE.JEU && !joueur.menu){
				joueur.deplacer(DIRECTION.DROITE, mapArray[mapActiver],mapArray[mapActiver].npcs,mapArray[mapActiver].monsters,ctx);
			}
		else if(joueur.menu){
			 if(joueur.cOrdi){
				if(choixMenuOrdiDroite<joueur.monsters.length-1)
					{
						choixMenuOrdiDroite ++;
						//if(Math.floor(choixMenuOrdiDroite/4)==0)
						//if(choixMenuOrdiDroite%4==0 && choixMenuOrdiDroite<(joueur.monsters.length-1)/4)
						//	zoneAffichageOrdi++;
						playclickversBas();
					}
			}
			else if(joueur.cBlah){
				joueur.choixAfaire=false;
				playclickversBas();
			}
		}
		break;
		case 69: //e E sert a u action
			joueur.action();
			if(joueur.cOrdi)
				{
					switchProgramon();
				}
			else if(joueur.ouJeSuis=="centreMagasin" && joueur.cBlah)
			{
				console.log("jachete!");
				achete(magasin[choixMagasin]);
			}
		break;
		case 82: //appuyer r
			if(joueur.menu){		
				if(joueur.ouJeSuis=="centreMagasin" && joueur.cBlah)
				{
					console.log("vend!");
					vend();
				}
			}
		break;
		case 13: //appuyer enter sert a confirmer les choix
			if(joueur.menu){
				if(joueur.choixAfaire){
					if(joueur.cBlah && joueur.ouJeSuis=="centreSoin"){
						soigneProgramon();
						medicSound();
					}
				}				
				if(joueur.cOrdi)
				{
					joueur.cOrdi=false;
				}
				else if(joueur.ouJeSuis=="centreMagasin" && joueur.cBlah)
				{
					joueur.cBlah=false;
				}
				joueur.menu=false;
			}
		break;
		default : 
			//alert(key);
			// Si la touche ne nous sert pas, nous n'avons aucune raison de bloquer son comportement normal.
			return true;
		}

	}
	//init du sac
	sac = new Sac(joueur,ctx);



	//backgroundSounds();
	background1.load(function() {
		background1.sound.play();
	});

	//fait débuter le tick
	tick();
}

	//boucle de rendering
	function tick(){
		//permet de savoir dans quelle map on est rendu
		this.mapActive();
	ctx.clearRect(0,0,canvas.width,canvas.height); // zone de dessin nettoyé
	
	//dessine map
	switch(page) {
		case PAGE.JEU : 
		document.getElementById("attack").style.display="none";
				//dessine map
				if(!joueur.porteCheck()){
					mapArray[0].dessinerMap(ctx);
					ancienX=joueur.x;
					ancienY=joueur.y;
				}

				else if(joueur.porteCheck())
				{	
					var j=0;
					if(joueur.ouJeSuis == mapArray[j].typemap )
						j = mapActiver;
					else{
						while(joueur.ouJeSuis != mapArray[j].typemap)
						{
							j++;
							//console.log(j);
						}
					}
					mapArray[j].addPersonnage(joueur);
					mapArray[j].dessinerMap(ctx);
				}
				/*ici si un programon ou un dompteur de programon*/
				if(joueur.combat)
					this.page = PAGE.COMBAT;
				if(joueur.afficheMsg){
					if(joueur.qui != null)
						mapArray[mapActiver].npcs[joueur.qui].message(ctx);
						//bug connue si tu te trouve sur la case et tu veux activer une discussion
						//echec assuré, tu dois arriver a ta destination
						//bug a ajuster
					}
				else if(joueur.menu){
						if(joueur.ouJeSuis=="centreSoin"){
							if(joueur.cBlah)
								confirmation();
							else if(joueur.cOrdi)
								{
									menuOrdi();
								}
						}
						else if(joueur.ouJeSuis=="centreMagasin"){
							if(joueur.cBlah)
								{
								
									menuMagasin();
								}
						}

				}

			break;
		case PAGE.BAGS : 
		//dessine sac
			sac.tick();

			break;
		case PAGE.COMBAT:
			encombat();
				if(combat == undefined ){

					if(joueur.qui!=null && mapArray[mapActiver].npcs[joueur.qui].enCombat){
						
						this.ancienMonstre=null;
						combat = new Combat(joueur,mapArray[mapActiver].npcs[joueur.qui],ctx);
						enCombatAvecQui=true;
					//this.ancienMonstre = mapArray[mapActiver].monsters[joueur.mAdversaire];
					}else{
						this.ancienMonstre=null;
						
						enCombatAvecQui=false;
						combat = new Combat(joueur,mapArray[mapActiver].monsters[joueur.mAdversaire],ctx);
						this.ancienMonstre = mapArray[mapActiver].monsters[joueur.mAdversaire];
					}
				}
				combat.perdu=false;
				combat.gagner=false;
				combat.tick();
				if(combat.perdu || combat.gagner){

				
					//remet la defense des monstres du joueur a 0
					for(var i=0;i<joueur.monsters.length;i++){
						joueur.monsters[i].defense = 0;
					}

					this.page = PAGE.JEU;
					if(!enCombatAvecQui){	
						mapArray[mapActiver].monsters.splice(joueur.mAdversaire,1);
						monsterlist.splice(joueur.mAdversaire,1);

						// function randomXY() se trouve dans programon.js
						this.ancienMonstre.vivant=true;
						this.ancienMonstre.x = randomXY(this.ancienMonstre.maxX,this.ancienMonstre.minX);
						this.ancienMonstre.y = randomXY(this.ancienMonstre.maxY,this.ancienMonstre.minY);
						this.ancienMonstre.vieActuel = this.ancienMonstre.vie;
						monsterlist.push(this.ancienMonstre);
						mapArray[mapActiver].addProgramon(monsterlist[monsterlist.length-1]);

					}
					else{
						if(combat.perdu){
							youlooseSound();	
							for(var i=0;i<mapArray[mapActiver].npcs[joueur.qui].monsters.length;i++){
								mapArray[mapActiver].npcs[joueur.qui].select=0;
								mapArray[mapActiver].npcs[joueur.qui].monsters[i].vivant=true;
								mapArray[mapActiver].npcs[joueur.qui].monsters[i].vieActuel = mapArray[mapActiver].npcs[joueur.qui].monsters[i].vie;
							}
						}
					
						joueur.qui=null;
					}
					document.getElementById("map").style.display="block";
					document.getElementById("retour").style.display="none";
					combat=null;
				}
			break;
		case PAGE.PROGRAMON :	
				//dessine liste programon
				joueur.afficherProgramonlist();
				
			break;
		case PAGE.LPOUVOIR :
				joueur.afficherPouvoirProgramon();
			break;
		case PAGE.CARTE :
				//dessine carte du monde
				document.getElementById("canvas").style.backgroundImage="url(images/grandeur_2.png)";
				document.getElementById("canvas").style.backgroundSize="100% 100%";
			break;
			}

	if(compteTick%600==0)
		remplirMagasin();
	compteTick++;
	//coeur de la boucle
	//update 
	//vérifie si le programon peux lvl up
	for(var i=0;i<this.joueur.monsters.length;i++){
		this.joueur.monsters[i].lvlup();
	}
	setTimeout(tick, 40);
}	
function ouEstJoueur () {
	
	var j=0;
	while(joueur.ouJeSuis != mapArray[j].typemap)
	{
		j++;
	}

	return j;	
}
function mapActive(){
	if(joueur.porteCheck()){
		if(mapActiver!=this.ouEstJoueur()){
			if(joueur.ouJeSuis == "gym1")
			{
				joueur.x=11;
				joueur.y=30;
			}
			else{
				joueur.x=7;
				joueur.y=14;
			}
		}

		mapActiver=this.ouEstJoueur();
	}
	else{
		if(mapActiver!=0){
			joueur.x=ancienX;
			joueur.y=ancienY;
		}
		mapActiver=0;
	}
}
function Message(msg){
	this.posX=0;
	this.posY=0;
	this.message=msg;

	this.tick = function(){
		ctx.font = "25px Arial";
		ctx.fillStyle = "#FFF";
		ctx.fillText(msg,5,30);
		
		return true;
	}
}

function msgConsole (text) {
	if (typeof console !== 'undefined') {
		console.log(text);    
	}
	else {
		alert(text);    
	}
}

function bag(){
	this.page = PAGE.BAGS;
	document.getElementById('retour').style.display = "block";
	document.getElementById('appliquer').style.display = "block";
	document.getElementById('attack').style.display="none";
	playClickBouton();
}

function retour(){
	if(!joueur.combat){
		this.page = PAGE.JEU;
		document.getElementById('retour').style.display="none";
		document.getElementById('lpouvoir').style.display="none";
		document.getElementById('appliquer').style.display = "none";
		/*si on pese sur retourne va enlever le monstre de la liste*/
	}
	else if(this.page == PAGE.COMBAT){
		if(combat.listAttack)
			combat.listAttack=false;
	}
	else if(this.page == PAGE.PROGRAMON || this.page == PAGE.LPOUVOIR ||this.page == PAGE.BAGS){
		if(joueur.combat)
			this.page = PAGE.COMBAT;
		document.getElementById('appliquer').style.display="none";
		document.getElementById('lpouvoir').style.display="none";
	}
	else if(this.page == PAGE.BAGS){
		document.getElementById('retour').style.display = "none";
	}
	playClickBouton();

}

function listeProgramon(){
	this.page = PAGE.PROGRAMON;
	document.getElementById('retour').style.display="block";
	document.getElementById('lpouvoir').style.display="block";
	document.getElementById('attack').style.display="none";
	document.getElementById('appliquer').style.display = "none";
	playClickBouton();

}
function carte(){
	this.page = PAGE.CARTE;
	document.getElementById('retour').style.display="block";
	document.getElementById('appliquer').style.display = "none";
	playClickBouton();
}
function encombat(){

	document.getElementById('retour').style.display="block";
}


function lPouvoir(){
	this.page = PAGE.LPOUVOIR;
	document.getElementById('appliquer').style.display = "none";
	playClickBouton();
}

function confirmation(){

		ctx.fillStyle="rgba(0,0,200,1)";	
		ctx.fillRect(150,220,200,100);
		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeRect(150,220,200,100);
		ctx.font = "20px Arial";

		ctx.fillStyle = "white";
		ctx.fillText("Voulez-vous soigner",160,240);
		ctx.fillText("vos programons?",175,260);
		
		ctx.font = "12px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("appuyer entrer une fois choisis",160,310);

		ctx.font = "20px Arial";
		//section choix
		if(joueur.choixAfaire){
			ctx.fillStyle="lime";
			ctx.fillRect(175,270,25,25);
		}
		else{
			ctx.fillStyle="lime";
			ctx.fillRect(250,270,25,25);
		}

		ctx.fillStyle="black";
		ctx.fillRect(180,275,15,15);
		ctx.fillRect(255,275,15,15);
		ctx.fillStyle = "white";
		ctx.fillText("OUI",205,295);
		ctx.fillStyle = "white";
		ctx.fillText("NON",285,295);

}

function menuOrdi(){
		ctx.fillStyle="#6880FF";	
		ctx.fillRect(0,0,TAILLE_AFFICHER*32,TAILLE_AFFICHER*32);

		ctx.fillStyle="rgba(255,255,255,0.5)";	
		ctx.fillRect(20,20,100,TAILLE_AFFICHER*32-40);
		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeRect(20,20,100,TAILLE_AFFICHER*32-40);

		ctx.fillStyle="rgba(255,255,255,0.5)";	
		ctx.fillRect(180,20,300,100);
		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeRect(180,20,300,100);

		var qtAfficher = joueur.monsters.length;

		if(qtAfficher>4)
			qtAfficher=4;

		ctx.drawImage(imageTriangle,85,75+100*choixMenuOrdiGauche,25,25);

		for(var i=0;i<qtAfficher;i++){
			ctx.font = "20px Arial";
			var couleurNom = "COULEURRARE."+rareComment(joueur.monsters[i].rareter);
			
			ctx.strokeStyle = "white";
			ctx.strokeText(joueur.monsters[i].nom,40,35+100*i);
			ctx.fillStyle = eval(couleurNom);
			ctx.fillText(joueur.monsters[i].nom,40,35+100*i);

			ctx.drawImage(
				joueur.monsters[i].image, 
			    joueur.monsters[i].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
				DIRECTION.BAS * joueur.monsters[i].hauteur, // Point d'origine du rectangle source à prendre dans notre image
			    joueur.monsters[i].largeur, joueur.monsters[i].hauteur, // Taille du rectangle source (c'est la taille du personnage)
				50, 40+100*i,    // Point de destination sur la map
			    joueur.monsters[i].largeur, joueur.monsters[i].hauteur // Taille du rectangle destination (c'est la taille du personnage)
			    );
			ctx.fillStyle = "white";
			ctx.fillText(i+1+".",90,95+100*i);
		}

		var compteurProgramon = Math.floor((choixMenuOrdiDroite)/4)*4;

		var affichageMax=1; //= joueur.monsters.length/4;
		/*if(joueur.monsters.length>4)
			affichageMax=1;//Math.floor((20+choixMenuOrdiDroite)/4);*/

			//console.log(affichageMax+"affichageMax   "+choixMenuOrdiDroite+"choixMenuOrdiDroite " +zoneAffichageOrdi+"zoneAffichageOrdi "+joueur.monsters.length+"joueur.monsters");
		for(var i=zoneAffichageOrdi;i<affichageMax;i++){
 
			var valeurAfficher=i-zoneAffichageOrdi;
					var posX=0;
					var posY=0;
			for(var j=0;j<4;j++){
				if(compteurProgramon<joueur.monsters.length){
					ctx.font = "16px Arial";
				var couleurNom = "COULEURRARE."+rareComment(joueur.monsters[compteurProgramon].rareter);
					posX=60*j;
					posY=80*valeurAfficher;

					ctx.strokeStyle = "white";
					ctx.strokeText(joueur.monsters[compteurProgramon].nom,210+posX,35+posY);
					ctx.fillStyle = eval(couleurNom);
					ctx.fillText(joueur.monsters[compteurProgramon].nom,210+posX,35+posY);

					ctx.drawImage(
						joueur.monsters[compteurProgramon].image, 
					    joueur.monsters[compteurProgramon].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
						DIRECTION.BAS * joueur.monsters[compteurProgramon].hauteur, // Point d'origine du rectangle source à prendre dans notre image
					    joueur.monsters[compteurProgramon].largeur, joueur.monsters[compteurProgramon].hauteur, // Taille du rectangle source (c'est la taille du personnage)
						210+posX, 35+posY,    // Point de destination sur la map
					    joueur.monsters[compteurProgramon].largeur, joueur.monsters[compteurProgramon].hauteur // Taille du rectangle destination (c'est la taille du personnage)
					    );
						
						if(compteurProgramon == choixMenuOrdiDroite)
							ctx.drawImage(imageTriangle,180+posX,55+posY,25,25);
						ctx.fillStyle = "red";
						ctx.fillText(compteurProgramon+1+".",190+posX,75+posY);
					}
					if(compteurProgramon<joueur.monsters.length)
						compteurProgramon++;
				}
			}
		ctx.font = "14px Arial";
		ctx.fillStyle = "blue";
		ctx.fillText("appuyer e pour faire le changement",220,490);
		ctx.font = "12px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("appuyer entrer une fois fini",220,510);


		ctx.fillStyle="rgba(255,255,255,0.5)";	
		ctx.fillRect(140,140,160,300);
		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeRect(140,140,160,300);

		ctx.fillStyle="rgba(255,255,255,0.5)";	
		ctx.fillRect(340,140,160,300);
		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeRect(340,140,160,300);
		
		ctx.drawImage(imageFlecheD,302,200,35,35);
		ctx.drawImage(imageFlecheG,302,300,35,35);


		//zoneSacJoueur choixMenuOrdiGauche
		ctx.drawImage(
				joueur.monsters[choixMenuOrdiGauche].image, 
			    joueur.monsters[choixMenuOrdiGauche].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
				DIRECTION.BAS * joueur.monsters[choixMenuOrdiGauche].hauteur, // Point d'origine du rectangle source à prendre dans notre image
			    joueur.monsters[choixMenuOrdiGauche].largeur, joueur.monsters[choixMenuOrdiGauche].hauteur, // Taille du rectangle source (c'est la taille du personnage)
				200, 160,    // Point de destination sur la map
			    joueur.monsters[choixMenuOrdiGauche].largeur, joueur.monsters[choixMenuOrdiGauche].hauteur // Taille du rectangle destination (c'est la taille du personnage)
			    );
		ctx.font = "18px Arial";
		var couleurNom = "COULEURRARE."+rareComment(joueur.monsters[choixMenuOrdiGauche].rareter);
		ctx.fillStyle = eval(couleurNom);
		ctx.fillText(joueur.monsters[choixMenuOrdiGauche].nom,200,280);
		ctx.fillStyle = "white";
		ctx.fillText("nom: ",160,280);
		ctx.fillText("type: "+joueur.monsters[choixMenuOrdiGauche].type,160,310);
		ctx.fillText("niveau: "+joueur.monsters[choixMenuOrdiGauche].niveau,160,340);
		ctx.fillText("vie: "+joueur.monsters[choixMenuOrdiGauche].vie,160,370);

		//zoneListeProgramon choixMenuOrdiDroite
		ctx.drawImage(
				joueur.monsters[choixMenuOrdiDroite].image, 
			    joueur.monsters[choixMenuOrdiDroite].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
				DIRECTION.BAS * joueur.monsters[choixMenuOrdiDroite].hauteur, // Point d'origine du rectangle source à prendre dans notre image
			    joueur.monsters[choixMenuOrdiDroite].largeur, joueur.monsters[choixMenuOrdiDroite].hauteur, // Taille du rectangle source (c'est la taille du personnage)
				400, 160,    // Point de destination sur la map
			    joueur.monsters[choixMenuOrdiDroite].largeur, joueur.monsters[choixMenuOrdiDroite].hauteur // Taille du rectangle destination (c'est la taille du personnage)
			    );

		ctx.font = "18px Arial";
		var couleurNom = "COULEURRARE."+rareComment(joueur.monsters[choixMenuOrdiDroite].rareter);
		ctx.fillStyle = eval(couleurNom);
		ctx.fillText(joueur.monsters[choixMenuOrdiDroite].nom,400,280);

		ctx.fillStyle = "white";
		ctx.fillText("nom: ",360,280);
		ctx.fillText("type: "+joueur.monsters[choixMenuOrdiDroite].type,360,310);
		ctx.fillText("niveau: "+joueur.monsters[choixMenuOrdiDroite].niveau,360,340);
		ctx.fillText("vie: "+joueur.monsters[choixMenuOrdiDroite].vie,360,370);



	}

function menuMagasin(){
		ctx.fillStyle="#1880CC";	
		ctx.fillRect(0,0,TAILLE_AFFICHER*32,TAILLE_AFFICHER*32);

		ctx.fillStyle="rgba(255,255,255,0.5)";	
		ctx.fillRect(20,20,TAILLE_AFFICHER*32-40,TAILLE_AFFICHER*32-40);
		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeRect(20,20,TAILLE_AFFICHER*32-40,TAILLE_AFFICHER*32-40);
		ctx.font = "16px Arial";
		ctx.fillStyle = "blue";
		ctx.fillText("NOM         IMPACT   COUT     STOCK   |   JOUEURSTOCK",60,40);
		ctx.font = "14px Arial";
		var afficherItem=10+zoneAfficherMagasin;
		if(afficherItem>magasin.length)
			afficherItem=magasin.length;

		for(var i=zoneAfficherMagasin;i<afficherItem;i++){
			
			valeurAfficher=i-zoneAfficherMagasin;
			
				//valeurAfficher=valeurAfficher-zoneAfficherMagasin;
			
			var couleurNom = "COULEURRARE."+rareComment(magasin[i].rare);
			ctx.fillStyle = eval(couleurNom);
			ctx.fillText(magasin[i].nom,60,60+25*valeurAfficher);
			ctx.fillStyle = "blue";
			ctx.fillText(magasin[i].qt,130,60+25*valeurAfficher);
			ctx.fillText(magasin[i].valeur+" $",200,60+25*valeurAfficher);
			ctx.fillText(magasin[i].nombre,280,60+25*valeurAfficher);
			var oui=sacJoueur(magasin[i].nom);
			
			if(oui!=undefined){
				ctx.fillText(joueur.bags[oui].nombre,400,60+25*valeurAfficher);
			}
			else
				ctx.fillText("0",400,60+25*valeurAfficher);
				
			if(i == choixMagasin)
				ctx.drawImage(imageFleche,40,45+25*valeurAfficher,20,20);
			 ctx.beginPath();
		      ctx.moveTo(35, 63+25*valeurAfficher);
		      ctx.lineTo(TAILLE_AFFICHER*32-40,63+25*valeurAfficher);
		      ctx.stroke();
		}

		ctx.font = "16px Arial";
		if(magasin[choixMagasin].valeur <= joueur.argent)
			ctx.fillStyle = "white";
		else
			ctx.fillStyle = "red";
		ctx.fillText(joueur.argent+"$",135,TAILLE_AFFICHER*32-60);

		ctx.fillStyle = "white";
		ctx.fillText("argent Joueur: ",35,TAILLE_AFFICHER*32-60);
		
		ctx.fillStyle = "#150626";
		ctx.fillRect(TAILLE_AFFICHER*32-170,TAILLE_AFFICHER*32-125,140,100);
		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeRect(TAILLE_AFFICHER*32-170,TAILLE_AFFICHER*32-125,140,100);
		ctx.fillStyle = "white";
		ctx.font = "20px Arial";
		ctx.fillText("COMMANDE",TAILLE_AFFICHER*32-160,TAILLE_AFFICHER*32-100);
		ctx.font = "16px Arial";
		ctx.fillText("Quitter = enter",TAILLE_AFFICHER*32-160,TAILLE_AFFICHER*32-80);
		ctx.fillText("Acheter = e",TAILLE_AFFICHER*32-160,TAILLE_AFFICHER*32-60);
		ctx.fillText("Vendre = r",TAILLE_AFFICHER*32-160,TAILLE_AFFICHER*32-40);

}

function appliquers(){
	var faite=false;
	if(joueur.bags[joueur.selectObject].nom == "revive"){
		if(!joueur.monsters[joueur.select].vivant){
			joueur.monsters[joueur.select].vivant=true;
			joueur.monsters[joueur.select].vieActuel = joueur.monsters[joueur.select].vie;
			faite=true;
		}
	}
	else if(joueur.bags[joueur.selectObject].nom == "reviveall"){
		for(var i=0;i<joueur.monsters.length;i++){
			if(!joueur.monsters[i].vivant){
				joueur.monsters[i].vivant=true;
				joueur.monsters[i].vieActuel = joueur.monsters[joueur.select].vie;
				faite=true;
				}
		}
	}
	else if(joueur.bags[joueur.selectObject].soin == true && joueur.monsters[joueur.select].vivant ){
		if(joueur.monsters[joueur.select].vieActuel<joueur.monsters[joueur.select].vie){
			var soin =0;
			//ici selon le nom de la potion on va récupéré la qt de guérison
			if(joueur.bags[joueur.selectObject].nom == "potionSoin"){
				soin = joueur.bags[joueur.selectObject].qt;
			}

			if(joueur.monsters[joueur.select].vieActuel + soin > joueur.monsters[joueur.select].vie)
				joueur.monsters[joueur.select].vieActuel = joueur.monsters[joueur.select].vie;
			else
				joueur.monsters[joueur.select].vieActuel += soin;
			faite=true;
			potionSounds();
		}
	}
	else if(joueur.bags[joueur.selectObject].buff == true){
		if(joueur.bags[joueur.selectObject].nom == 'def'){
			joueur.monsters[joueur.select].defense += joueur.bags[joueur.selectObject].qt;
			faite=true;
		}
	}
	else if(joueur.bags[joueur.selectObject].nom.match(/usb/gi)){
			//pour utiliser l'item, il doit respecter le regex usb
			if(joueur.combat && !enCombatAvecQui){
				var chance = 5;
				if(joueur.bags[joueur.selectObject].rare >0)
					chance = 20*joueur.bags[joueur.selectObject].rare;

				var monstreRareter = 5 + this.ancienMonstre.rareter * 10;

				var resultat = Math.random()*100;
				console.log(100-chance-monstreRareter +">"+ resultat);
				if(100-monstreRareter-chance > resultat){
						
					joueur.addProgramon(new Programon(this.ancienMonstre.nom,this.ancienMonstre.url,5,5,5,5,"listprogramon",this.ancienMonstre.type,this.ancienMonstre.rareter, ctx));
					combat.enCombat=false;
					combat.joueur.combat=false;
					combat.ennemi.combater=false;
					combat.gagner=true;
					document.getElementById("map").style.display="block";
					combat=null;
				}

				faite=true;
			}
	}

	if(faite){
		joueur.bags[joueur.selectObject].nombre--;
		if(joueur.bags[joueur.selectObject].nombre<=0){
			joueur.bags.splice(joueur.selectObject,1);
			joueur.selectObject=0;
		}
	}
}
function soigneProgramon(){
	for(var i=0;i<joueur.monsters.length;i++)
	{
		joueur.monsters[i].vieActuel=joueur.monsters[i].vie;
		joueur.monsters[i].vivant=true;
	}
}
function switchProgramon(){
	var temp = joueur.monsters[choixMenuOrdiGauche];
	joueur.monsters[choixMenuOrdiGauche]=joueur.monsters[choixMenuOrdiDroite];
	joueur.monsters[choixMenuOrdiDroite]=temp;
}
function achete(item){
	if(item.valeur<=joueur.argent && item.nombre>0){
		joueur.argent -= item.valeur;
		var oui=sacJoueur(item.nom);
		if(oui!=undefined)
			joueur.bags[oui].nombre++;
		else
			joueur.addObject(new Object(item.nom,Math.floor(item.valeur/2),item.soin,item.buff,item.rare,item.qt,1));

		item.nombre--;
	}
}
function vend(){
	var numero=sacJoueur(magasin[choixMagasin].nom);
	if(numero!=undefined){
		if(joueur.bags[numero].nombre>0){
			joueur.argent+=joueur.bags[numero].valeur;
			joueur.bags[numero].nombre--;
		}
	}
}	
function remplirMagasin(){
	for(var i=0; i<magasin.length;i++){
		if((magasin[i].rare==0 && magasin[i].nombre<30)||
			(magasin[i].rare==1 && magasin[i].nombre<20)||
			(magasin[i].rare==2 && magasin[i].nombre<10)||
			(magasin[i].rare==3 && magasin[i].nombre<5)||
			(magasin[i].rare==4 && magasin[i].nombre<1))
			magasin[i].nombre++;
	}
}
function sacJoueur(nomItem){
	var numero;
	for(var j=0;j<joueur.bags.length;j++){
				if(joueur.bags[j].nom===nomItem)
					numero=j;
			}
	return numero;
}
function rareComment(int){
	var string;

	if(int == RARE.COMMON)
		string="COMMON";
	else if(int == RARE.UNCOMMON)
		string="UNCOMMON";
	else if(int == RARE.RARE)
		string="RARE";
	else if(int == RARE.EPIC)
		string="EPIC";
	else if(int == RARE.LEGENDAIRE)
		string="LEGENDAIRE";


	return string;
}

function msgTextArea(msg){

	document.getElementById("zoneTArea").innerHTML=msg;

}