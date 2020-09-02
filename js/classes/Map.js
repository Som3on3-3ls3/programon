function Map(nom, typeMap) {
	// Création de l'objet XmlHttpRequest du AJAX
	var xhr = getXMLHttpRequest();
		
	// Chargement du fichier
	xhr.open("GET", './maps/' + nom + '.json', false);
	xhr.send(null);
	if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
		throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");
	
	var mapJsonData = xhr.responseText;
	//console.log(mapJsonData);
	// Analyse des données
	var mapData = JSON.parse(mapJsonData);
	this.typemap=typeMap;
	/*permet de mettre tout les images dans un meme tableau*/
	this.image2=Array();
	this.tileset2=Array();
	var i=0;
	while(mapData.tilesets[i]!=undefined)
	{
		this.image2.push(mapData.tilesets[i]);
		
		this.image = mapData.tilesets[i];
		this.tileset2.push(new Tileset(this.image.image));
		i++;
	}
	/*for(var i=0;i<this.image2.length;i++){
		this.tileset2.push(new Tileset(this.image2[i].image));
		console.log(this.tileset2[i].image);
	}*/
	
	/*fin de zone test*/
	
	//data est la section de la map dans le fichier json 
	this.hauteur = mapData.height;
	this.largeur = mapData.width;
	this.aMinX = TAILLE_AFFICHER;
	this.aMinY = TAILLE_AFFICHER;
	this.ancienX=0;
	this.ancienY=0;
	
	var compteur=0;
	
	this.data2 = Array();
	var i=0;
	while(mapData.layers[i]!=undefined)
	{
		this.data2.push(mapData.layers[i].data);
		i++;
	}

	this.TouteMap=new Array();
	for(var l=0;l<this.data2.length;l++){
		this.TouteMap[l] =new Array();
		//this.Map2D = Array();
		for(var i=0;i<mapData.height;i++){
			//this.Map2D[i] = new Array();
			this.TouteMap[l][i] = new Array();
			for(var j=0;j<mapData.width;j++){
				//this.Map2D[i][j] = this.data[i * mapData.width + j] ;
				this.TouteMap[l][i][j] = this.data2[l][i * mapData.width + j] ;
		
			}
		}

	}
	

	// Liste des personnages présents sur le terrain.
	this.personnages = new Array();
	this.npcs = new Array();
	this.monsters = new Array();
}

// Pour récupérer la taille (en tiles) de la carte
Map.prototype.getHauteur = function() {
	return this.hauteur;
}
Map.prototype.getLargeur = function() {
	return this.largeur;
}

// Pour ajouter un personnage
Map.prototype.addPersonnage = function(perso) {
	this.personnages.push(perso);
}

Map.prototype.addNpc = function(unNpc){
	this.npcs.push(unNpc);
}
Map.prototype.addProgramon = function(monstre){
	this.monsters.push(monstre);
}

Map.prototype.dessinerMap = function(context) {

	var cy = this.personnages[0].y-(this.aMinY/2);
	
	if(cy<0)
		cy = 0;
	else if((cy+this.aMinY)>this.hauteur)
		cy = this.hauteur-this.aMinY;
	
	this.ancienY = cy;
	

	for(var i = 0; i< this.aMinY; i++) {
		var y = i * 32;
		var cx=this.personnages[0].x-(this.aMinX/2);
		if(cx<0)
			cx=0;
		else if((cx+this.aMinX)>this.largeur)
			cx = this.largeur-this.aMinX;
			
		this.ancienX = cx;
		for(var j = 0; j < this.aMinX ; j++) {
			var x = j * 32;

			//gestion d'affichage
			try {
				//affichage de layers de fond
				for(k=0;k<this.TouteMap.length;k++)
				{
					var t=0;
					
					if(t<this.image2.length-1 && this.TouteMap[k][cy][cx] <= this.image2[t+1].firstgid){
					}
					else{
						while(t<this.image2.length-1 && this.TouteMap[k][cy][cx] > this.image2[t+1].firstgid){
								t++;
						}
					}
					if(this.TouteMap[k][cy][cx] > 0){
						this.tileset2[t].dessinerTile(this.TouteMap[k][cy][cx]-this.image2[t].firstgid+1,context,x,y);
					}
				}
			}
			catch(S){
				console.log("Error: "+S.message);
				exit;
			}
			if(cx<this.largeur)
				cx++;
			}
			if(cy<this.hauteur)
				cy++;
	}
	
	// Dessin des npcs
	for(var i = 0, l = this.npcs.length ; i < l ; i++) {
			this.npcs[i].dessinerNpc(context,this.ancienY,this.ancienX);
	}
	for(var i = 0, l = this.monsters.length ; i < l ; i++) {
		this.monsters[i].dessinerProgramon(context,this.ancienY,this.ancienX);
	}
	// Dessin des personnages
	for(var i = 0, l = this.personnages.length ; i < l ; i++) {
		this.personnages[i].dessinerPersonnage(context,this.largeur,this.hauteur);
	}
}