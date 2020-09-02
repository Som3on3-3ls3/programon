function Tileset(url) {
	// Chargement de l'image dans l'attribut image
	this.image = new Image();
	this.image.referenceDuTileset = this;
	//a surveiller referenceDuTileset
	//console.log(this.image.referenceDuTileset);
	
	this.image.onload = function() {
		if(!this.complete) 
			throw new Error("Erreur de chargement du tileset nomm� \"" + url + "\".");
		
		// Largeur du tileset en tiles
		this.referenceDuTileset.largeur = this.width / 32;

	}
	this.image.src = "tilesets/" + url;
}

// M�thode de dessin du tile num�ro "numero" dans le contexte 2D "context" aux coordonn�es xDestination et yDestination
//dessinerTile est un objet de la classe Tileset
Tileset.prototype.dessinerTile = function(numero, context, xDestination, yDestination) {
	
	//pour X
	//pour savoir ou se situe l'image qu'on aimerait parmi les images
	var xSourceEnTiles = numero % this.largeur;
	//si ==0 signifie qu'on est tout a droite du tile 
	if(xSourceEnTiles == 0) 
		xSourceEnTiles = this.largeur;
	//pour Y   ceil coupe vers la valeur la plus proche
	var ySourceEnTiles = Math.ceil(numero / this.largeur);
	
	//la position du tile -1 * la taille d�sir�
	var xSource = (xSourceEnTiles - 1) * 32;
	var ySource = (ySourceEnTiles - 1) * 32;
	
	//context.drawImage(image, endroit ou se trouve la zone X , endroit ou se trouve la zone Y , 32 (taille a d�coup� X), 32(taille a d�coup� Y), xDestination (sur la map), yDestination (sur la map), 32(taille a affich�), 32(taille a affich�));
	context.drawImage(this.image, xSource, ySource, 32, 32, xDestination, yDestination, 32, 32);

}

