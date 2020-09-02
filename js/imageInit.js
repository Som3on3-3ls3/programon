function initImage(){

	imageTriangle.referenceDuPerso = this;
	imageTriangle.onload = function() {
		if(!this.complete) 
			throw "Erreur de chargement de l'image nommé \"" + pathTriangle + "\".";

        // Taille du personnage
        this.referenceDuPerso.largeur = this.width;
        this.referenceDuPerso.hauteur = this.height;
    }
    imageTriangle.src = pathTriangle;
    console.log("image loader");

    imageFleche.referenceDuPerso = this;
    imageTriangle.onload = function() {
        if(!this.complete) 
            throw "Erreur de chargement de l'image nommé \"" + pathTriangle + "\".";

        // Taille du personnage
        this.referenceDuPerso.largeur = this.width;
        this.referenceDuPerso.hauteur = this.height;
    }
    imageFleche.src = pathFleche;
    console.log("image loader");


    imageFlecheD.referenceDuPerso = this;
    imageTriangle.onload = function() {
        if(!this.complete) 
            throw "Erreur de chargement de l'image nommé \"" + pathTriangle + "\".";

        // Taille du personnage
        this.referenceDuPerso.largeur = this.width;
        this.referenceDuPerso.hauteur = this.height;
    }
    imageFlecheD.src = pathFlecheD;
    console.log("image loader");

    imageFlecheG.referenceDuPerso = this;
    imageTriangle.onload = function() {
        if(!this.complete) 
            throw "Erreur de chargement de l'image nommé \"" + pathTriangle + "\".";

        // Taille du personnage
        this.referenceDuPerso.largeur = this.width;
        this.referenceDuPerso.hauteur = this.height;
    }
    imageFlecheG.src = pathFlecheG;
    console.log("image loader");
}