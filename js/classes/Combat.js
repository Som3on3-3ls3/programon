function Combat(joueur,ennemi,ctx) {
	this.joueur=joueur;
	this.ennemi=ennemi;
	this.enCombat=true;
	this.tour=true; //positif tour du joueur sinon tour de l'ennemi
	this.listAttack=false;
	this.gagner=false;
	this.perdu=false;
	this.unouPlusieur=false; // false = un programon a battre, true= un npc avec des programons
	//if(this.enCombat)
	if(this.ennemi.monsters != undefined)
		this.unouPlusieur=true;
	this.qtAfficherJoueur=this.joueur.monsters.length;
	if(this.qtAfficherJoueur>4)
		this.qtAfficherJoueur=4;

	document.getElementById("map").style.display="none";
	document.getElementById("retour").style.display="none";

	var url="pokerball.png";
	this.image = new Image();
	
    this.image.referenceDuPerso = this;
    this.image.onload = function() {
        if(!this.complete) 
            throw "Erreur de chargement du sprite nommé \"" + url + "\".";
         
        // Taille du Npc
        this.referenceDuPerso.largeur = this.width / 4;
        this.referenceDuPerso.hauteur = this.height / 4;
    }
    this.image.src = "images/" + url;

	var urlmort="pokerballmort.png";
    this.imagemort = new Image();
	
    this.imagemort.referenceDuPerso = this;
    this.image.onload = function() {
        if(!this.complete) 
            throw "Erreur de chargement du sprite nommé \"" + urlmort + "\".";
         
        // Taille du Npc
        this.referenceDuPerso.largeur = this.width / 4;
        this.referenceDuPerso.hauteur = this.height / 4;
    }
    this.imagemort.src = "images/" + urlmort;
}
Combat.prototype.tick = function() {
	if(combat.quequnVivant(joueur)){
		if(!this.unouPlusieur)
			this.affichagezone();
		else
			this.affichagezonePlusieurs();
		if(!this.unouPlusieur)
			this.combattreUnProgramon();
		else
			this.combattreNpc();
	}
	else
	{
		this.enCombat=false;
		this.joueur.combat=false;
		this.perdu=true;
		}
	}
Combat.prototype.affichagezone = function (){
	ctx.font = "16px Arial";
	ctx.fillStyle="#000";	
	ctx.fillRect(0,0,TAILLE_AFFICHER*32,TAILLE_AFFICHER*32);
	ctx.fillStyle="white";	
	ctx.fillRect(20,20,TAILLE_AFFICHER*29,TAILLE_AFFICHER*14);
	ctx.strokeStyle = "#000000";
	ctx.strokeRect(20,20,TAILLE_AFFICHER*29,TAILLE_AFFICHER*14);
	ctx.fillRect(20,TAILLE_AFFICHER*14+40,TAILLE_AFFICHER*29,TAILLE_AFFICHER*14);
	ctx.strokeStyle = "red";
	ctx.strokeRect(20,TAILLE_AFFICHER*14+40,TAILLE_AFFICHER*29,TAILLE_AFFICHER*14);

	//section affichage joueur
	ctx.strokeStyle = "blue";
	ctx.strokeText(this.joueur.monsters[this.joueur.select].nom,75,346);

	ctx.fillStyle = "black";
	ctx.fillText("vie",200,300);
	ctx.fillStyle = "red";
	ctx.fillRect(200,310,(this.joueur.monsters[this.joueur.select].vieActuel/this.joueur.monsters[this.joueur.select].vie)*100,10);
	ctx.strokeStyle = "black";
	ctx.strokeRect(200,310,100,10);
	ctx.fillStyle = "black";
	ctx.fillText(this.joueur.monsters[this.joueur.select].vieActuel+"/"+this.joueur.monsters[this.joueur.select].vie,320,320);
	
	var pouvoirSelect = this.joueur.monsters[this.joueur.select].pouvoirSelect;
	ctx.fillStyle = "black";
	ctx.fillText("prochaine attaque: "+this.joueur.monsters[this.joueur.select].listPouvoir[pouvoirSelect].nom,200,340);

	ctx.drawImage(
		this.joueur.monsters[this.joueur.select].image, 
    this.joueur.monsters[this.joueur.select].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
	DIRECTION.HAUT * this.joueur.monsters[this.joueur.select].hauteur, // Point d'origine du rectangle source à prendre dans notre image
    this.joueur.monsters[this.joueur.select].largeur, this.joueur.monsters[this.joueur.select].hauteur, // Taille du rectangle source (c'est la taille du personnage)
	55, 356,    // Point de destination sur la map
    this.joueur.monsters[this.joueur.select].largeur*2, this.joueur.monsters[this.joueur.select].hauteur*2 // Taille du rectangle destination (c'est la taille du personnage)
    );
    for(var i=0; i<this.qtAfficherJoueur;i++){
		if(this.joueur.monsters[i].vivant)
 			ctx.drawImage(this.image,240+30*i,270,25,25);
 		else
 			ctx.drawImage(this.imagemort,240+30*i,270,25,25);
 	}


	//section affichage ennemi
	ctx.strokeStyle = "red";
	ctx.strokeText(this.ennemi.nom,400,50);
	
	ctx.fillStyle = "black";
	ctx.fillText("vie",35,35);
	ctx.fillStyle = "red";
	ctx.fillRect(30,40,(this.ennemi.vieActuel/this.ennemi.vie)*100,10);
	ctx.strokeStyle = "black";
	ctx.strokeRect(30,40,100,10);
	ctx.fillStyle = "black";
	ctx.fillText(this.ennemi.vieActuel+"/"+this.ennemi.vie,150,50);
	
	ctx.fillStyle = "black";
	ctx.fillText("prochaine attaque: "+this.ennemi.listPouvoir[this.ennemi.pouvoirSelect].nom,30,70);
	//image programon
	//ctx.drawImage(this.monsters[i].image,200,50+110*i,32,32);
	ctx.drawImage(
		this.ennemi.image, 
    this.ennemi.largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
	DIRECTION.BAS * this.ennemi.hauteur, // Point d'origine du rectangle source à prendre dans notre image
    this.ennemi.largeur, this.ennemi.hauteur, // Taille du rectangle source (c'est la taille du personnage)
	385, 56,    // Point de destination sur la map
    this.ennemi.largeur*2, this.ennemi.hauteur*2 // Taille du rectangle destination (c'est la taille du personnage)
    );

	if(this.ennemi.vivant)
		ctx.drawImage(this.image,200+30,25,25,25);
	else
		ctx.drawImage(this.imagemort,200+30*i,25,25,25);
 	

}
Combat.prototype.affichagezonePlusieurs = function (){
	ctx.font = "16px Arial";
	ctx.fillStyle="#000";	
	ctx.fillRect(0,0,TAILLE_AFFICHER*32,TAILLE_AFFICHER*32);
	ctx.fillStyle="white";	
	ctx.fillRect(20,20,TAILLE_AFFICHER*29,TAILLE_AFFICHER*14);
	ctx.strokeStyle = "#000000";
	ctx.strokeRect(20,20,TAILLE_AFFICHER*29,TAILLE_AFFICHER*14);
	ctx.fillRect(20,TAILLE_AFFICHER*14+40,TAILLE_AFFICHER*29,TAILLE_AFFICHER*14);
	ctx.strokeStyle = "red";
	ctx.strokeRect(20,TAILLE_AFFICHER*14+40,TAILLE_AFFICHER*29,TAILLE_AFFICHER*14);

	//section affichage joueur
	ctx.strokeStyle = "blue";
	ctx.strokeText(this.joueur.monsters[this.joueur.select].nom,75,346);

	ctx.fillStyle = "black";
	ctx.fillText("vie",200,300);
	ctx.fillStyle = "red";
	ctx.fillRect(200,310,(this.joueur.monsters[this.joueur.select].vieActuel/this.joueur.monsters[this.joueur.select].vie)*100,10);
	ctx.strokeStyle = "black";
	ctx.strokeRect(200,310,100,10);
	ctx.fillStyle = "black";
	ctx.fillText(this.joueur.monsters[this.joueur.select].vieActuel+"/"+this.joueur.monsters[this.joueur.select].vie,320,320);
	var pouvoirSelect = this.joueur.monsters[this.joueur.select].pouvoirSelect;
	ctx.fillStyle = "black";
	ctx.fillText("prochaine attaque: "+this.joueur.monsters[this.joueur.select].listPouvoir[pouvoirSelect].nom,200,340);

	ctx.drawImage(
		this.joueur.monsters[this.joueur.select].image, 
    this.joueur.monsters[this.joueur.select].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
	DIRECTION.HAUT * this.joueur.monsters[this.joueur.select].hauteur, // Point d'origine du rectangle source à prendre dans notre image
    this.joueur.monsters[this.joueur.select].largeur, this.joueur.monsters[this.joueur.select].hauteur, // Taille du rectangle source (c'est la taille du personnage)
	55, 356,    // Point de destination sur la map
    this.joueur.monsters[this.joueur.select].largeur*2, this.joueur.monsters[this.joueur.select].hauteur*2 // Taille du rectangle destination (c'est la taille du personnage)
    );
	for(var i=0; i<this.qtAfficherJoueur;i++){
		if(this.joueur.monsters[i].vivant)
 			ctx.drawImage(this.image,240+30*i,270,25,25);
 		else
 			ctx.drawImage(this.imagemort,240+30*i,270,25,25);
 	}

	var pouvoirSelect = this.ennemi.monsters[this.ennemi.select].pouvoirSelect;
	
	//section affichage ennemi
	ctx.strokeStyle = "red";
	ctx.strokeText(this.ennemi.monsters[this.ennemi.select].nom,400,50);
	
	ctx.fillStyle = "black";
	ctx.fillText("vie",35,35);
	ctx.fillStyle = "red";
	ctx.fillRect(30,40,(this.ennemi.monsters[this.ennemi.select].vieActuel/this.ennemi.monsters[this.ennemi.select].vie)*100,10);
	ctx.fillStyle = "black";
	ctx.fillText(this.ennemi.monsters[this.ennemi.select].vieActuel+"/"+this.ennemi.monsters[this.ennemi.select].vie,150,50);
	ctx.strokeStyle = "black";
	ctx.strokeRect(30,40,100,10);
	
	ctx.fillStyle = "black";
	//ctx.fillText(this.ennemi.monsters[this.ennemi.select].vieActuel+"/"+this.ennemi.monsters[this.ennemi.select].vie,130,40);
	ctx.fillText("prochaine attaque: "+this.ennemi.monsters[this.ennemi.select].listPouvoir[pouvoirSelect].nom,30,70);
	//image programon
	//ctx.drawImage(this.monsters[i].image,200,50+110*i,32,32);
	ctx.drawImage(
	this.ennemi.monsters[this.ennemi.select].image, 
    this.ennemi.monsters[this.ennemi.select].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
	DIRECTION.BAS * this.ennemi.monsters[this.ennemi.select].hauteur, // Point d'origine du rectangle source à prendre dans notre image
    this.ennemi.monsters[this.ennemi.select].largeur, this.ennemi.monsters[this.ennemi.select].hauteur, // Taille du rectangle source (c'est la taille du personnage)
	385, 56,    // Point de destination sur la map
    this.ennemi.monsters[this.ennemi.select].largeur*2, this.ennemi.monsters[this.ennemi.select].hauteur*2 // Taille du rectangle destination (c'est la taille du personnage)
    );

	//image de pokerball
    /*ctx.drawImage(
	this.image, 
    this.largeur,//taille de l'image en fonction de l'etat de l'animation
	this.hauteur, // Point d'origine du rectangle source à prendre dans notre image
    this.largeur, this.hauteur // Taille du rectangle source (c'est la taille du personnage)
	300, 25,    // Point de destination sur la map
    this.largeur/2,this.hauteur/2 // Taille du rectangle destination (c'est la taille du personnage)
    );*/
	

	for(var i=0; i<this.ennemi.monsters.length;i++){
		if(this.ennemi.monsters[i].vivant)
 			ctx.drawImage(this.image,200+30*i,25,25,25);
 		else
 			ctx.drawImage(this.imagemort,200+30*i,25,25,25);
 	}
}
Combat.prototype.combattreUnProgramon = function(){
		var pouvoirSelect = this.joueur.monsters[this.joueur.select].pouvoirSelect;
		var rareter = this.joueur.monsters[this.joueur.select].rareter;
		//damage+(damage*rareter)
		var damageMoi = this.joueur.monsters[this.joueur.select].listPouvoir[pouvoirSelect].damage + (this.joueur.monsters[this.joueur.select].listPouvoir[pouvoirSelect].damage*rareter);	
		
		var rareterEnnemi = this.ennemi.rareter;

		this.ennemi.pouvoirSelect=Math.floor(this.ennemi.niveau / 5);
		if(this.ennemi.pouvoirSelect>this.ennemi.listPouvoir.length)
			this.ennemi.pouvoirSelect=this.ennemi.listPouvoir.length-1;
		var damageEnnemi = this.ennemi.listPouvoir[this.ennemi.pouvoirSelect].damage + (this.ennemi.listPouvoir[this.ennemi.pouvoirSelect].damage * rareterEnnemi);
		var msg="";
			//this.ennemi.vie -= this.damageMoi;
			//this.joueur.monsters[this.joueur.select].vie -= this.damageEnnemi;
			//document.getElementById('attack').style.display="none";
		if(this.tour){
			document.getElementById('attack').style.display="block";
		}
		else
		{
			//document.getElementById('attack').style.display="none";
			if(!this.quequnVivant(this.joueur)){
				
				this.enCombat=false;
				this.joueur.combat=false;
				this.perdu=true;
				msg+="tu as perdu le combat! ";
			}
			else if(this.joueur.monsters[this.joueur.select].vivant && this.ennemi.vieActuel - damageMoi > 0){

				if(damageMoi - this.ennemi.defense > 0)
					this.ennemi.vieActuel -= damageMoi - this.ennemi.defense;
				else
					this.ennemi.vieActuel--;
			}
			else if(!this.joueur.monsters[this.joueur.select].vivant){
				if(this.joueur.select<this.qtAfficherJoueur-1){
					this.joueur.select++;
				}else if(this.joueur.select==this.qtAfficherJoueur-1){
					this.joueur.select=0;
				}/*else{
					this.enCombat=false;
					this.joueur.combat=false;
					this.perdu=true;
			
				}*/
			}
			else{
				

				msg+="tu as gagné le combat! ";
				this.ennemi.vieActuel = 0;
				this.enCombat=false;
				this.joueur.combat=false;
				this.ennemi.vivant=false;
				this.gagner=true;
				this.joueur.monsters[this.joueur.select].exp += this.ennemi.niveau*20+(this.ennemi.rareter*5);
				this.joueur.argent += this.ennemi.niveau*5+(this.ennemi.rareter*2);
				msg+= " le programon ennemi "+this.ennemi.nom+" est mort au combat ";
				msg+= " ton programon "+this.joueur.monsters[this.joueur.select].nom+" gagne "+(this.ennemi.niveau*20+this.ennemi.rareter*5)+" xp ";
			}
			if(this.ennemi.vivant && this.joueur.monsters[this.joueur.select].vieActuel - damageEnnemi > 0 ){
				if(damageEnnemi - this.joueur.monsters[this.joueur.select].defense > 0)
					this.joueur.monsters[this.joueur.select].vieActuel -= damageEnnemi - this.joueur.monsters[this.joueur.select].defense;
				else
					this.joueur.monsters[this.joueur.select].vieActuel--;
			}
			else{
				if(this.ennemi.vivant){
				this.joueur.monsters[this.joueur.select].vieActuel =0;
				this.joueur.monsters[this.joueur.select].vivant=false;
				msg+= " ton programon "+this.joueur.monsters[this.joueur.select].nom+" est mort au combat ";
				}
			}

			this.tour=true;
			msg += this.joueur.monsters[this.joueur.select].nom+" damage faite " + damageMoi+ " --- " +this.ennemi.nom+" damage faite " + damageEnnemi;
			msgTextArea(msg);
		}
}

Combat.prototype.combattreNpc = function(){
			var msg="";
		if(this.tour){
			document.getElementById('attack').style.display="block";
		}
		else
		{
			var pouvoirSelect = this.joueur.monsters[this.joueur.select].pouvoirSelect;
			var rareter = this.joueur.monsters[this.joueur.select].rareter;
			var ennemipouvoirSelect = this.ennemi.monsters[this.ennemi.select].pouvoirSelect;

			this.ennemipouvoirSelect=Math.floor(this.ennemi.monsters[this.ennemi.select].niveau / 5);
			
			if(this.ennemipouvoirSelect>this.ennemi.monsters[this.ennemi.select].listPouvoir.length)
				this.ennemipouvoirSelect=this.ennemi.monsters[this.ennemi.select].listPouvoir.length-1;


			var damageMoi = this.joueur.monsters[this.joueur.select].listPouvoir[pouvoirSelect].damage + (this.joueur.monsters[this.joueur.select].listPouvoir[pouvoirSelect].damage*rareter);	
			var rareterEnnemi = this.ennemi.monsters[this.ennemi.select].rareter;
			var damageEnnemi = this.ennemi.monsters[this.ennemi.select].listPouvoir[pouvoirSelect].damage + (this.ennemi.monsters[this.ennemi.select].listPouvoir[ennemipouvoirSelect].damage * rareterEnnemi);
		
			
			
			if(!this.quequnVivant(this.joueur)){ //si pu de programon avec de la vie sur le joueur
				this.enCombat=false;
				this.joueur.combat=false;
				this.perdu=true;
				msg+="tu as perdu le combat! ";
			}
			else if(this.joueur.monsters[this.joueur.select].vivant && this.ennemi.monsters[this.ennemi.select].vieActuel - damageMoi > 0){//je fais du damage a l'ennemi
				if(damageMoi - this.ennemi.monsters[this.ennemi.select].defense > 0)
					this.ennemi.monsters[this.ennemi.select].vieActuel -= damageMoi - this.ennemi.monsters[this.ennemi.select].defense;
				else
					this.ennemi.monsters[this.ennemi.select].vieActuel--;
			}
			else if(!this.joueur.monsters[this.joueur.select].vivant){
				if(this.joueur.select<this.qtAfficherJoueur-1){
					this.joueur.select++;
				}else if(this.joueur.select==this.qtAfficherJoueur-1){
					this.joueur.select=0;
				}
			}
			else{
				this.ennemi.monsters[this.ennemi.select].vieActuel = 0;
				this.joueur.monsters[this.joueur.select].exp += this.ennemi.monsters[this.ennemi.select].niveau*20+(this.ennemi.monsters[this.ennemi.select].rareter*5);
				this.joueur.argent += this.ennemi.monsters[this.ennemi.select].niveau*5+(this.ennemi.monsters[this.ennemi.select].rareter*2);
				this.ennemi.monsters[this.ennemi.select].vivant=false;
				msg+="tu as gagné le combat! ";
				msg+= " le programon ennemi "+this.ennemi.monsters[this.ennemi.select].nom+" est mort au combat ";
				msg+= " ton programon "+this.joueur.monsters[this.joueur.select].nom+" gagne "+(this.ennemi.monsters[this.ennemi.select].niveau*20+this.ennemi.monsters[this.ennemi.select].rareter*5)+" xp ";
				if(!this.quequnVivant(this.ennemi)){
				this.enCombat=false;
				this.joueur.combat=false;
				this.ennemi.combater=false;
				this.gagner=true;

				}
				else if(!this.ennemi.monsters[this.ennemi.select].vivant){
					
					//if(this.ennemi.select<this.ennemi.monsters.length-1)
					if(this.ennemi.monsters[this.ennemi.select+1]!=undefined)
						this.ennemi.select++;

				}

			}
			//tour de l'ennemi de faire le damage
			if(this.ennemi.monsters[this.ennemi.select].vivant && this.joueur.monsters[this.joueur.select].vieActuel - damageEnnemi > 0 ){
				if(damageEnnemi - this.joueur.monsters[this.joueur.select].defense >0)
					this.joueur.monsters[this.joueur.select].vieActuel -= damageEnnemi - this.joueur.monsters[this.joueur.select].defense;
				else
					this.joueur.monsters[this.joueur.select].vieActuel--;
			}
			else{
				if(this.ennemi.monsters[this.ennemi.select].vivant){
				this.joueur.monsters[this.joueur.select].vieActuel =0;
				this.joueur.monsters[this.joueur.select].vivant=false;
				msg+= " ton programon "+this.joueur.monsters[this.joueur.select].nom+" est mort au combat ";
				}
			}

			this.tour=true;
			 msg += this.joueur.monsters[this.joueur.select].nom+" damage faite " + damageMoi+ " --- " +this.ennemi.monsters[this.ennemi.select].nom+" damage faite " + damageEnnemi;
			msgTextArea(msg);
		}
}
Combat.prototype.attaquer = function(){
	if(this.tour)
		this.tour=false;
	//else
		//this.tour=true;
		//playClickBouton();
		attakSound();
}
Combat.prototype.quequnVivant = function(joueur){
	var quequn=true;
	var mort=0;
	var compteur=joueur.monsters.length;
	if(joueur.monsters.length>4)
		compteur=4;
	for(var i=0;i<compteur;i++)
	{
		if(!joueur.monsters[i].vivant){
			mort++;
		}
	}
	if(mort==compteur)
		quequn=false;
	
	return quequn;
}
