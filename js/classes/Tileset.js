function Tileset(url) {
	// Chargement de l'image dans l'attribut image
	this.image = new Image();
	this.image.referenceDuTileset = this;
	//a surveiller referenceDuTileset
	//console.log(this.image.referenceDuTileset);
	
	this.image.onload = function() {
		if(!this.complete) 
			throw new Error("Erreur de chargement du tileset nommé \"" + url + "\".");
		
		// Largeur du tileset en tiles
		this.referenceDuTileset.largeur = this.width / 32;

	}
	this.image.src = "tilesets/" + url;
}

// Méthode de dessin du tile numéro "numero" dans le contexte 2D "context" aux coordonnées xDestination et yDestination
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
	
	//la position du tile -1 * la taille désiré
	var xSource = (xSourceEnTiles - 1) * 32;
	var ySource = (ySourceEnTiles - 1) * 32;
	
	//context.drawImage(image, endroit ou se trouve la zone X , endroit ou se trouve la zone Y , 32 (taille a découpé X), 32(taille a découpé Y), xDestination (sur la map), yDestination (sur la map), 32(taille a affiché), 32(taille a affiché));
	context.drawImage(this.image, xSource, ySource, 32, 32, xDestination, yDestination, 32, 32);

}

