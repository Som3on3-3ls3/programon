function Sac(joueur,ctx){
	this.joueur=joueur;
	this.ctx=ctx;
}

Sac.prototype.tick = function(){
	this.afficherSac();

}

Sac.prototype.afficherSac = function(){
	this.ctx.fillStyle="#6880FF";	
	this.ctx.fillRect(0,0,TAILLE_AFFICHER*32,TAILLE_AFFICHER*32);

	ctx.strokeStyle = "#FFF";
	ctx.strokeText("selectionned",15,110);

	ctx.fillStyle="rgba(0,0,200,0.5)";	
	ctx.fillRect(20,120,125,100);
	ctx.strokeStyle = "#FFFFFF";
	ctx.strokeRect(20,120,125,100);
	ctx.font = "25px Arial";
			//style nom
			ctx.strokeStyle = "#FFF";
			ctx.strokeText(this.joueur.monsters[this.joueur.select].nom,20,140);

	//image programon
	//ctx.drawImage(this.monsters[i].image,200,50+110*i,32,32);
	ctx.drawImage(
		this.joueur.monsters[this.joueur.select].image, 
    this.joueur.monsters[this.joueur.select].largeur * DIRECTION.BAS,//taille de l'image en fonction de l'etat de l'animation
	DIRECTION.BAS * this.joueur.monsters[this.joueur.select].hauteur, // Point d'origine du rectangle source à prendre dans notre image
    this.joueur.monsters[this.joueur.select].largeur, this.joueur.monsters[this.joueur.select].hauteur, // Taille du rectangle source (c'est la taille du personnage)
	65, 150,    // Point de destination sur la map
    this.joueur.monsters[this.joueur.select].largeur, this.joueur.monsters[this.joueur.select].hauteur // Taille du rectangle destination (c'est la taille du personnage)
    );

	ctx.strokeStyle = "black";
	ctx.strokeRect(160,5,345, 440);
	ctx.fillStyle="rgba(255,255,255,0.5)";
	ctx.fillRect(160,5,345, 440);

	for(var i=0;i<this.joueur.bags.length;i++){

		if(this.joueur.bags[i].nom == this.joueur.bags[this.joueur.selectObject].nom ){
			ctx.fillStyle="lime";	
			ctx.fillRect(166,8+40*i,338,38);
		}
		ctx.fillStyle="rgba(0,0,200,1)";	
		ctx.fillRect(170,12+40*i,330,30);
		ctx.strokeStyle = "#FFFFFF";
		ctx.strokeRect(170,12+40*i,330,30);
		ctx.font = "16px Arial";

		ctx.strokeStyle = "white";
		ctx.strokeText(this.joueur.bags[i].nom,175,32+40*i);
		ctx.fillStyle = "white";
		ctx.fillText(this.joueur.bags[i].nom,175,32+40*i);

		if(this.joueur.bags[i].soin){
			ctx.font = "25px Arial";
			ctx.strokeStyle = "white";
			ctx.strokeText("+",265,35+40*i);
			ctx.fillStyle = "lime";
			ctx.fillText("+",265,35+40*i);
		}
		else if(this.joueur.bags[i].buff){
			ctx.strokeStyle = "white";
			ctx.strokeText("buff",260,32+40*i);
			ctx.fillStyle = "yellow";
			ctx.fillText("buff",260,32+40*i);
		}
		ctx.font = "16px Arial";

		ctx.fillStyle = "white";
		ctx.fillText("impact:"+this.joueur.bags[i].qt,290,32+40*i);
		ctx.fillText("Stock: "+this.joueur.bags[i].nombre,380,32+40*i);
		ctx.fillText(this.joueur.bags[i].valeur+ " $",450,32+40*i);
	}
}