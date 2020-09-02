function Map(nom) {
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
	
	/*permet de mettre tout les images dans un meme tableau*/
	this.image2=Array();
	this.tileset2=Array();
	var i=0;
	while(mapData.tilesets[i]!=undefined)
	{
		this.image2.push(mapData.tilesets[i]);
		this.tileset2.push(new Tileset(mapData.tilesets[i].image));
		console.log(this.tileset2[i].image);
		i++;
	}
	
	/*for(var i=0;i<this.image2.length;i++){
		this.tileset2.push(new Tileset(this.image2[i].image));
		console.log(this.tileset2[i].image);
	}*/
	
	/*fin de zone test*/
	this.image = mapData.tilesets[0];
	this.imagedecor = mapData.tilesets[1];
	this.imageitem = mapData.tilesets[2];
	this.imagePokemon = mapData.tilesets[3];
	
	this.tileset = new Tileset(this.image.image);
	this.tilesetdecor = new Tileset(this.imagedecor.image);
	this.tilesetitem = new Tileset(this.imageitem.image);
	this.tilesetPokemon = new Tileset(this.imagePokemon.image);
	
	//data est la section de la map dans le fichier json 
	this.hauteur = mapData.height;
	this.largeur = mapData.width;
	this.aMinX = TAILLE_AFFICHER;
	this.aMinY = TAILLE_AFFICHER;
	this.ancienX=0;
	this.ancienY=0;
	
	this.data = mapData.layers[0].data;
	this.decor = mapData.layers[1].data;
	this.item = mapData.layers[2].data;
	var compteur=0;
	
	this.data2 = Array();
	var i=0;
	while(mapData.layers[i]!=undefined)
	{
		this.data2.push(mapData.layers[i].data);
		i++;
	}
	//console.log(this.data2.length);
	
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
	
	this.Map2Ddecor = new Array();
	for(var i=0;i<mapData.height;i++){
		this.Map2Ddecor[i] = new Array();
		for(var j=0;j<mapData.width;j++){
			
			this.Map2Ddecor[i][j] = this.decor[i * mapData.width + j] ;
		}
	}
	this.Map2Ditem = new Array();
	for(var i=0;i<mapData.height;i++){
		this.Map2Ditem[i] = new Array();
		for(var j=0;j<mapData.width;j++){
		
			this.Map2Ditem[i][j] = this.item[i * mapData.width + j] ;
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
			
				var l=0;
				
				while(l<this.TouteMap.length)
				{
					//console.log(this.TouteMap[l][cy][cx]);
					var t=0;
					while(this.TouteMap[l][cy][cx]>this.image2[t].firstgid){
						//console.log("premier while");
						/*if(this.TouteMap[l][cy][cx]==0){
						}else if(this.TouteMap[l][cy][cx]<this.image2[t].firstgid){
							this.tileset2[t].dessinerTile(this.TouteMap[l][cy][cx]-this.image2[t].firstgid+1,context,x,y);
						}else{
							//this.tileset2[t].dessinerTile(this.TouteMap[l][cy][cx]-this.image2[t].firstgid+1,context,x,y);
						}*/
						t++;
						//console.log(this.TouteMap[l][cy][cx] +">"+this.image2[t].firstgid);
					}
					//console.log(t);
					if(this.TouteMap[l][cy][cx]!=0){
						this.tileset2[t].dessinerTile(this.TouteMap[l][cy][cx]-this.image2[t].firstgid+1,context,x,y);
						//console.log(this.tileset2[t].image);
						}
					
					l++;
				}
				//console.log("fin affichage");
			/*
			this.tileset.dessinerTile(this.Map2D[cy][cx]-this.image.firstgid+1, context, x, y);
			
			//affichage des murs et decor
			if(this.Map2Ddecor[cy][cx]==0){
			}else if(this.Map2Ddecor[cy][cx]<this.imagedecor.firstgid){
				this.tileset.dessinerTile(this.Map2Ddecor[cy][cx]-this.image.firstgid+1, context, x, y);
			}else if (this.Map2Ddecor[cy][cx]<this.imageitem.firstgid) {
				this.tilesetdecor.dessinerTile(this.Map2Ddecor[cy][cx]-this.imagedecor.firstgid+1, context, x, y);
			}else if(this.Map2Ddecor[cy][cx]<this.imagePokemon.firstgid){
				this.tilesetitem.dessinerTile(this.Map2Ddecor[cy][cx]-this.tilesetitem.firstgid+1, context, x, y)
			}else{
				this.tilesetPokemon.dessinerTile(this.Map2Ddecor[cy][cx]-this.imageitem.firstgid+1, context, x, y);
			}

			//affichage des petits items, porte fenetre ...etc.
			if(this.Map2Ditem[cy][cx]==0){
			}else if(this.Map2Ditem[cy][cx]<this.imagedecor.firstgid){
				this.tileset.dessinerTile(this.Map2Ditem[cy][cx]-this.image.firstgid+1, context, x, y);
			}else if (this.Map2Ditem[cy][cx]<this.imageitem.firstgid) {
				this.tilesetdecor.dessinerTile(this.Map2Ditem[cy][cx]-this.imagedecor.firstgid+1, context, x, y);
			}else if(this.Map2Ditem[cy][cx]<this.imagePokemon.firstgid){
				this.tilesetitem.dessinerTile(this.Map2Ditem[cy][cx]-this.imageitem.firstgid+1, context, x, y)
			}else{
				this.tilesetPokemon.dessinerTile(this.Map2Ditem[cy][cx]-this.imagePokemon.firstgid+1, context, x, y);
			}*/
			
			}
			catch(S){
				//console.log(S);
			}
			if(cx<this.largeur)
					cx++;
			}
			if(cy<this.hauteur)
				cy++;
	}
	
	// Dessin des npcs
	for(var i = 0, l = this.npcs.length ; i < l ; i++) {
		//if((this.personnages[0].x-this.npcs[i].x)<10 && (this.personnages[0].y-this.npcs[i].y)<10)
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














