  //----------//Npc\\------------\\


					//image,position X, position Y, positionnement 
function Npc(nom,url, x, y, direction, message,endroit, combat) {
	this.nom=nom;
	this.quoi="npc";
    this.x = x; // (en cases)
    this.y = y; // (en cases)
    this.direction = eval(direction);
	this.msg = message;
	this.endroit=endroit;
    this.combater=eval(combat);
    this.enCombat=false;
    // Chargement de l'image dans l'attribut image
    this.image = new Image();
    this.conversation=0;
	this.mesg = this.msg.m1;
    this.image.referenceDuPerso = this;
    this.image.onload = function() {
        if(!this.complete) 
            throw "Erreur de chargement du sprite nommé \"" + url + "\".";
         
        // Taille du Npc
        this.referenceDuPerso.largeur = this.width / 4;
        this.referenceDuPerso.hauteur = this.height / 4;
    }
    this.image.src = "sprites/" + url;

    this.select=0;
    //liste de programon au perso
	this.monsters = new Array();
	
	//console.log(this.image.src);
}

Npc.prototype.addProgramon = function(monstre){
		this.monsters.push(monstre);
}

												//context est l'endroit où dessiner
Npc.prototype.dessinerNpc = function(context,mapY,mapX) {
	
	//permet de déterminer où on est rendu dans la boucle d'animation
	//en fonction du nombre de frame passé
	var frame = 0; 
	var decalageX = 0, decalageY = 0; // Décalage à appliquer à la position du Npc
	
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
		 
		this.etatAnimation++;
	}
	
	var cx = this.x - mapX;
	var cy = this.y - mapY;
	
	if(this.y-mapY<0){
		cy = -5; //mapY-TAILLE_AFFICHER;
		//console.log(mapY);
	}

	if(this.x-mapX<0){
			cx = -5;//mapX-TAILLE_AFFICHER;
			//console.log(mapX);
		}
	if(!this.image.complete)
		console.log("Erreur de load de l'image");
	else {
	context.drawImage(
    this.image, 
    this.largeur * frame,//taille de l'image en fonction de l'etat de l'animation
	this.direction * this.hauteur, // Point d'origine du rectangle source à prendre dans notre image
    this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du Npc)
	(cx * 32) - (this.largeur / 2) + 16, (cy * 32) - this.hauteur + 24,    // Point de destination sur la map
    this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du Npc)
	);
	}
}
Npc.prototype.message = function(context){
		this.conversation++;
		var posX=130;
		var posY=400;
		this.affichageM(posX,posY,context);
}
Npc.prototype.affichageM = function(x,y,context){
		this.posX=x;
		this.posY=y;
		var ctx=context;
		
		ctx.fillStyle="rgba(0,0,200,0.5)";	
		ctx.fillRect(65,350,400,130);
		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeRect(65,350,400,130);
		
			ctx.font = "16px Arial";
			ctx.fillStyle = "#FFF";
			ctx.fillText(this.nom+" dit:",75,370);
			
			//taille maximale de caratere est 250
			// les messages se trouve dans le fichier de data, en dessous de texte
			if(this.mesg.length<50)
				ctx.fillText(this.mesg,85,390);
			else{
				var compteur = 0;
				while(compteur<this.mesg.length){
					var partiMsg = this.mesg.substr(compteur,50);
					ctx.fillText(partiMsg,85,390+20*(compteur/50));
					compteur+=50;
				}
			}
			
}

//fonctionne en fonction des touches
Npc.prototype.getCoordonneesAdjacentes = function(direction)  {
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

//     
Npc.prototype.deplacer = function(map,caseX,caseY) {
	//sert a identifier ou on est rendu dans l'animation
	//si negatif signifie qu'on est en position 0
	//si position signifie qu'on est en mouvement
	// On ne peut pas se déplacer si un mouvement est déjà en cours !
	if(this.etatAnimation >= 0) {
		return false;
	}

    // On change la direction du Npc
    this.direction = DIRECTION.BAS;
         
    // On vérifie que la case demandée est bien située dans la carte
    var prochaineCase = this.getCoordonneesAdjacentes(this.direction);
    if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur()) {
		
		if(prochaineCase.x<caseX){
			this.x++;
		}
		else{
			this.x--;
		}
		if(prochaineCase.y<caseY){
			this.y++;
		}
		else{
			this.y--;
		}
		return false;
	
    }
    	
	// On commence l'animation, donc valeur de etat doit etre positif
	this.etatAnimation = 1;     
	
    // On effectue le déplacement
    this.x = prochaineCase.x;
    this.y = prochaineCase.y;
         
    return true;
}