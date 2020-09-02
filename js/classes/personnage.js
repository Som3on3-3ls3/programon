  //----------//PERSONNAGE\\------------\\


//image,position X, position Y, positionnement 
function Personnage(url, x, y, direction,nom) {
    this.x = x; // (en cases)
    this.y = y; // (en cases)
    this.nom = nom;
    this.argent = 0;
    this.direction = direction;
    this.messageNpc = null;
    this.afficheMsg=false;
    this.checkboolean=false;
    this.qui=null;
    this.ouJeSuis="monde";
    this.choixAfaire=false;
    this.cBlah=false;
    this.cOrdi=false;
    this.menu=false;
    // Chargement de l'image dans l'attribut image
    this.image = new Image();
    this.porte = false;
    this.combat = false;
	//variable pour savoir le numero dans la liste de monstre
	this.mAdversaire=0;
	this.image.referenceDuPerso = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw "Erreur de chargement du sprite nommé \"" + url + "\".";

        // Taille du personnage
        this.referenceDuPerso.largeur = this.width / 4;
        this.referenceDuPerso.hauteur = this.height / 4;
    }
    this.image.src = "sprites/" + url;

    //liste d'objet dans le sac
    this.bags = new Array();
    this.selectObject=0;
	//liste de programon au perso
	this.monsters = new Array();
	this.select=0;

}
	//context est l'endroit où dessiner
	Personnage.prototype.dessinerPersonnage = function(context,largeurMap, hauteurMap) {

	//permet de déterminer où on est rendu dans la boucle d'animation
	//en fonction du nombre de frame passé
	var frame = 0; 
	var decalageX = 0, decalageY = 0; // Décalage à appliquer à la position du personnage
	
	if(this.etatAnimation >= DUREE_DEPLACEMENT) {
		// Si le déplacement a atteint ou dépassé le temps nécessaire pour s'effectuer, on le termine
		this.etatAnimation = -1;
	} else if(this.etatAnimation >= 0) {
		// On calcule l'image (frame) de l'animation à afficher
		frame = Math.floor(this.etatAnimation / DUREE_ANIMATION);
		if(frame > 3) {
			frame %= 4;
		}
		// Nombre de pixels restant à parcourir entre les deux cases
		//permet de faire une animation en direction
		var	pixelsAParcourir = 32-(32 * (this.etatAnimation / DUREE_DEPLACEMENT));
		if((this.x>(TAILLE_AFFICHER/2)&&this.x<largeurMap-10)||(this.y>(TAILLE_AFFICHER/2)&&this.y<hauteurMap-10))
			pixelsAParcourir = 0;
		

		// À partir de ce nombre, on définit le décalage en x et y.
		if(this.direction == DIRECTION.HAUT) {
			decalageY = pixelsAParcourir;
		} else if(this.direction == DIRECTION.BAS) {
			decalageY = -pixelsAParcourir;
		} else if(this.direction == DIRECTION.GAUCHE) {
			decalageX = pixelsAParcourir;
		} else if(this.direction == DIRECTION.DROITE) {
			decalageX = -pixelsAParcourir;
		}

		this.etatAnimation++;
	}
	
	var aX=this.x;
	var aY=this.y;
	var zone = TAILLE_AFFICHER/2;
	
	if(this.x>zone && this.x<largeurMap-zone)
		aX=zone;
	else if(this.x<largeurMap && this.x>zone)
		aX = TAILLE_AFFICHER - (largeurMap-this.x);

	if(this.y>zone && this.y<hauteurMap-zone)
		aY=zone;
	else if(this.y<hauteurMap && this.y>zone)
		aY = TAILLE_AFFICHER -(hauteurMap-this.y);
	
    // Ici se trouvera le code de dessin du personnage
    context.drawImage(
    	this.image, 
    this.largeur * frame,//taille de l'image en fonction de l'etat de l'animation
	this.direction * this.hauteur, // Point d'origine du rectangle source à prendre dans notre image
    this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du personnage)
	(aX * 32) - (this.largeur / 2) + 16 + decalageX, (aY * 32) - this.hauteur + 24 + decalageY,    // Point de destination sur la map
    this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
    );

}


Personnage.prototype.getCoordonneesAdjacentes = function(direction)  {
	var coord = {'x' : this.x, 'y' : this.y};
	switch(direction) {
		case DIRECTION.BAS : 
		coord.y++;
		break;
		case DIRECTION.GAUCHE : 
		coord.x--;
		break;
		case DIRECTION.DROITE :	
		coord.x++;
		break;
		case DIRECTION.HAUT : 
		coord.y--;
		break;
	}
	return coord;
}


Personnage.prototype.deplacer = function(direction, map,npclist,monstrelist,context) {
	//sert a identifier ou on est rendu dans l'animation
	//si negatif signifie qu'on est en position 0
	//si position signifie qu'on est en mouvement
	// On ne peut pas se déplacer si un mouvement est déjà en cours !
	if(this.etatAnimation >= 0) {
		return false;
	}

	this.direction = direction;

	var prochaineCase = this.getCoordonneesAdjacentes(direction);
	if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur() || this.trucDansleChemin(direction,map,prochaineCase,npclist,monstrelist,context)){
		console.log(map.getHauteur());
		return false;
	}

	console.log("x: "+this.x);
	console.log("y: "+this.y);
	this.etatAnimation = 1; 
	this.x = prochaineCase.x;
	this.y = prochaineCase.y;

	return true;
}
Personnage.prototype.trucDansleChemin = function(direction, map, prochaineCase, npclist,monstrelist,context){
	//var valeur = null;
	this.checkboolean=false;
	var boolean=false;
	//console.log("prochaineCase.y "+prochaineCase.y);
	//console.log("prochaineCase.x "+prochaineCase.x);
	//console.log("map.type "+map.typemap);

	if(map.TouteMap[1][prochaineCase.y][prochaineCase.x]!=0 )
		boolean = true;
	for(var i=0;i<npclist.length;i++){
		if(npclist[i].x == prochaineCase.x && npclist[i].y==prochaineCase.y){
				this.qui = i; //npclist[i].message(context);
				boolean = true;
				this.checkboolean = true;
				if(npclist[i].combater == true){
					this.combat = true;
					npclist[i].enCombat=true;
					this.mAdversaire = i;
					enemySounds();
					msg="tu entre en combat contre "+npclist[i].nom;
					msgTextArea(msg);
				}
			}
		}
		for(var i=0;i<monstrelist.length;i++){
			if(monstrelist[i].x==prochaineCase.x && monstrelist[i].y==prochaineCase.y){
				boolean=true;
				console.log("un programon!: "+ monstrelist[i].nom);
				this.combat = true;
				this.mAdversaire = i;
				enemySounds();
			}
		}
		//rentre dans la maison1
		if(map.typemap == "monde" && prochaineCase.y == 3 && prochaineCase.x ==4){
			this.porte=true;
			this.ouJeSuis = "maison1";
			doorSounds();
		}
		// code a modifier la renter et sortit des batisses, rendre code plus facile
		// peut-etre dire la rentrer et sortit dans le json serait surement
		// plus facile a gérer que tout harcoder
		//retourne a  la map monde
		else if(map.typemap != "monde" && map.typemap!="gym1" && (prochaineCase.y == 15 && prochaineCase.x >= 7 && prochaineCase.x<=9)){
				//condition a surveiller,peux rentrer en conflit avec les différentes map
				this.porte=false;
				this.ouJeSuis = "monde";
				doorSounds();
			}
		//sortir du gym
		else if(map.typemap != "monde" && (prochaineCase.y > 30 && (prochaineCase.x < 13 && prochaineCase.x > 9)))
		{
					//les conditions de sorti pas optimal, devrait avoir une variable type de batisse, avec des entrées
					//et sorti au meme posistion, simplifireais l'entré sorti de mon code
					this.porte = false;
					this.ouJeSuis = "monde";
					doorSounds();
				}
		//porte maison de soin
		else if(map.typemap == "monde" && (prochaineCase.y == 42 && prochaineCase.x == 7)){
			this.porte = true;
			this.ouJeSuis = "centreSoin";
			doorSounds();
		}
		else if(map.typemap == "monde" && (prochaineCase.y == 42 && prochaineCase.x == 11)){
			this.porte = true;
			this.ouJeSuis = "centreMagasin";
			doorSounds();
		}
		else if(map.typemap == "monde" && (prochaineCase.y == 43 && prochaineCase.x == 3)){
			this.porte = true;
			this.ouJeSuis = "gym1";
			doorSounds();
		}
		//évènement lié au différent centre
		else if(map.typemap == "centreSoin" && (prochaineCase.y == 6 && (prochaineCase.x == 7 || prochaineCase.x  == 8)))
  		{	
  			
  			this.menu=true;
  			this.cBlah=true;
  			chooseSound();
  			
  		}
  		else if(map.typemap == "centreSoin" && (prochaineCase.y == 5 && prochaineCase.x == 12))
  		{	
  			this.menu=true;
  			this.cOrdi=true;
  			
  		}
  		else if(map.typemap == "centreMagasin" && (prochaineCase.y == 7 && prochaineCase.x == 9))
  		{
  			this.menu=true;
  			this.cBlah=true;
  			
  		}
		/*if(this.afficheMsg){	
			console.log("j'affiche")
			if(this.qui != null)
				npclist[this.qui].message(context);
		}*/
		return boolean;
	}

	Personnage.prototype.porteCheck = function(){
		return this.porte;
	}

	Personnage.prototype.action = function(){
		if(this.checkboolean)
			this.afficheMsg=true;
		//console.log(this.checkboolean);
	}

	Personnage.prototype.combattre = function(){	
		return this.combat;
	}

	Personnage.prototype.addProgramon = function(monstre){
		this.monsters.push(monstre);
	}

	Personnage.prototype.addObject = function(object){
		this.bags.push(object);
	}

	Personnage.prototype.afficherProgramonlist=function(){
	
		ctx.fillStyle="#6880FF";	
		ctx.fillRect(0,0,TAILLE_AFFICHER*32,TAILLE_AFFICHER*32);
	//image du programon selectionné

	ctx.strokeStyle = "#FFF";
	ctx.strokeText("selectionned",15,110);

	ctx.fillStyle="rgba(0,0,200,0.5)";	
	ctx.fillRect(20,120,125,100);
	ctx.strokeStyle = "#FFFFFF";
	ctx.strokeRect(20,120,125,100);
	ctx.font = "25px Arial";
			//style nom
			ctx.strokeStyle = "#FFF";
			console.log(this.monsters[this.select].nom.length);
			if(this.monsters[this.select].nom.length>7)
				ctx.font = "14px Arial";
			ctx.strokeText(this.monsters[this.select].nom,40,140);
				ctx.font = "25px Arial";
			ctx.fillStyle = "#FFF";
			ctx.fillText("argent: "+this.argent+" $",25,250);
	//image programon
	//ctx.drawImage(this.monsters[i].image,200,50+110*i,32,32);
	ctx.drawImage(
		this.monsters[this.select].image, 
    this.monsters[this.select].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
	DIRECTION.BAS * this.monsters[this.select].hauteur, // Point d'origine du rectangle source à prendre dans notre image
    this.monsters[this.select].largeur, this.monsters[this.select].hauteur, // Taille du rectangle source (c'est la taille du personnage)
	65, 150,    // Point de destination sur la map
    this.monsters[this.select].largeur, this.monsters[this.select].hauteur // Taille du rectangle destination (c'est la taille du personnage)
    );

	var qtAfficher = this.monsters.length;

	if(qtAfficher>4)
		qtAfficher=4;

	for(var i=0;i<qtAfficher;i++){

		if(i == this.select){
			ctx.fillStyle="lime";	
			ctx.fillRect(196,6+110*i,308,108);
		}
		
		ctx.fillStyle="rgba(0,0,200,1)";	
		ctx.fillRect(200,10+110*i,300,100);
		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeRect(200,10+110*i,300,100);
		ctx.font = "25px Arial";
			//style nom
			var couleurNom = "COULEURRARE."+rareComment(this.monsters[i].rareter);
			
			ctx.strokeStyle = "white";
			if(this.monsters[i].nom.length>7)
				ctx.font = "14px Arial";
			ctx.strokeText(this.monsters[i].nom,200,30+110*i);
			ctx.fillStyle = eval(couleurNom);
			ctx.fillText(this.monsters[i].nom,200,30+110*i);

			ctx.font = "25px Arial";
			//info supplémentaire
			ctx.fillStyle="#093";	
			ctx.fillRect(345,15+110*i,(this.monsters[i].exp/this.monsters[i].lvlupMoment*100),12);
			ctx.strokeStyle = "#FFFFFF";
			ctx.strokeRect(345,15+110*i,100,12);
			ctx.fillStyle = "#FFF";
			ctx.fillText("exp:",300,30+110*i);
			ctx.fillText("niveau: "+this.monsters[i].niveau,300,50+110*i);
			ctx.fillText("def: "+this.monsters[i].defense,415,50+110*i);
			ctx.font = "12px Arial";
			ctx.fillText(this.monsters[i].exp+"/"+this.monsters[i].lvlupMoment,450,25+110*i);
			ctx.font = "25px Arial";
			if(this.monsters[i].vieActuel==0)
				ctx.fillStyle = "#F00";
			ctx.fillText("vie: "+this.monsters[i].vieActuel+"/"+this.monsters[i].vie,300,70+110*i);
			ctx.fillStyle = "#FFF";
			ctx.fillText("type: "+this.monsters[i].type,300,90+110*i);

			//image programon
			//ctx.drawImage(this.monsters[i].image,200,50+110*i,32,32);
			ctx.drawImage(
				this.monsters[i].image, 
			    this.monsters[i].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
				DIRECTION.BAS * this.monsters[i].hauteur, // Point d'origine du rectangle source à prendre dans notre image
			    this.monsters[i].largeur, this.monsters[i].hauteur, // Taille du rectangle source (c'est la taille du personnage)
				220, 40+110*i,    // Point de destination sur la map
			    this.monsters[i].largeur, this.monsters[i].hauteur // Taille du rectangle destination (c'est la taille du personnage)
			    );
		}

	}

	Personnage.prototype.afficherPouvoirProgramon=function(){
		
		ctx.fillStyle="#666";	
		ctx.fillRect(0,0,TAILLE_AFFICHER*32,TAILLE_AFFICHER*32);
	//image du programon selectionné

	ctx.fillStyle="rgba(0,0,200,0.5)";	
	ctx.fillRect(20,120,125,100);
	ctx.strokeStyle = "#FFFFFF";
	ctx.strokeRect(20,120,125,100);
	ctx.font = "25px Arial";
			//style nom
			console.log(this.monsters[this.select].nom.length);
			if(this.monsters[this.select].nom.length>7)
				ctx.font = "12px Arial";
			ctx.strokeStyle = "#FFF";
			ctx.strokeText(this.monsters[this.select].nom,20,140);
			ctx.font = "25px Arial";
			ctx.drawImage(
				this.monsters[this.select].image, 
    this.monsters[this.select].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
	DIRECTION.BAS * this.monsters[this.select].hauteur, // Point d'origine du rectangle source à prendre dans notre image
    this.monsters[this.select].largeur, this.monsters[this.select].hauteur, // Taille du rectangle source (c'est la taille du personnage)
	65, 150,    // Point de destination sur la map
    this.monsters[this.select].largeur, this.monsters[this.select].hauteur // Taille du rectangle destination (c'est la taille du personnage)
    )
			var pouvoirSelect = this.monsters[this.select].pouvoirSelect;
			var droitPouvoir =0;
			if(this.monsters[this.select].niveau>=5){
				droitPouvoir= 2 + Math.floor(this.monsters[this.select].niveau / 5);
				if(droitPouvoir>this.monsters[this.select].listPouvoir.length)
					droitPouvoir=this.monsters[this.select].listPouvoir.length-1;
			}
			//bloque a 4 pouvoir, pas plus que ça présentement
//plus a venir, mais dans cette phase c'est max lvl 20
			/*if(droitPouvoir>4)
				droitPouvoir=3;*/

			var debut=0;
			var max=2;
			if(this.monsters[this.select].niveau>=5)
				max=3;
			if(pouvoirSelect>3){
				debut = pouvoirSelect-3;
				if(pouvoirSelect<=droitPouvoir)
					max=pouvoirSelect;

			}

			//console.log("max"+max+" pouvoirSelect"+pouvoirSelect);

			for(var i=debut;i<=max;i++){
				var affichage=i-debut;
				if(this.monsters[this.select].listPouvoir[pouvoirSelect].nom  == this.monsters[this.select].listPouvoir[i].nom ){
					ctx.fillStyle="lime";	
					ctx.fillRect(196,6+110*affichage,308,108);
				}
				ctx.fillStyle="rgba(0,0,200,1)";	
				ctx.fillRect(200,10+110*affichage,300,100);
				ctx.strokeStyle = "#FFFFFF";
				ctx.strokeRect(200,10+110*affichage,300,100);
				ctx.font = "25px Arial";

			//style nom

			ctx.fillStyle = "#FFF";
			ctx.strokeStyle = "#FFF";
			ctx.strokeText(this.monsters[this.select].listPouvoir[i].nom,210,35+110*affichage);
			ctx.fillText("damage: "+(this.monsters[this.select].listPouvoir[i].damage+(this.monsters[this.select].listPouvoir[i].damage*this.monsters[this.select].rareter)),220,55+110*affichage);
			ctx.fillText("type: "+this.monsters[this.select].listPouvoir[i].type,220,75+110*affichage);
			ctx.font = "14px Arial";
			ctx.fillText((i+1)+".",470,100+110*affichage);
		}
	}
