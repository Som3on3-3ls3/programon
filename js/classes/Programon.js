  //----------//Programon\\------------\\


//image,position X, position Y, positionnement 
function Programon(nom, url, maxX, minX, maxY,minY,endroit, type,rareter, ctx) {
	this.nom = nom;
    this.x = randomXY(maxX,minX); // (en cases)
    this.y = randomXY(maxY,minY); // (en cases)
    this.quoi="programon";
    this.maxX=maxX;
    this.minX=minX;
    this.maxY=maxY;
    this.minY=minY;
    this.url=url;
    this.rareter=eval(rareter);
    this.endroit=endroit;
    this.niveau = 1;
    this.defense=0;
    this.exp=0;
    this.lvlupMoment=this.niveau*100;
    this.nouveauSkill=5;
    this.vie = 10+(10*this.niveau)+(this.rareter*10);
    this.vieActuel = this.vie;
    this.type = type;
    this.vivant=true;
    this.image = new Image();
    this.pouvoirSelect=0;
    this.listPouvoir = Array();
    this.image.referenceDuPerso = this;
    this.image.onload = function() {
    	if(!this.complete) 
    		throw "Erreur de chargement du sprite nommé \"" + url + "\".";

        // Taille du Programon
        this.referenceDuPerso.largeur = this.width / 4;
        this.referenceDuPerso.hauteur = this.height / 4;
    }
    this.image.src = "sprites/" + url;

    var xhr = getXMLHttpRequest();

	// Chargement du fichier
	xhr.open("GET", 'Data/dataPouvoir.json', false);
	xhr.send(null);
	if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
		throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");

	//recupère la réponse du retour du json
	var pouvoirData = xhr.responseText;
	var pData = JSON.parse(pouvoirData);

	for(var i=0;i<pData.taille;i++)
	{	
		var type=pData.pouvoir[i].type;
		var nom=pData.pouvoir[i].nom;
		var damage=pData.pouvoir[i].damage;
		var buff=pData.pouvoir[i].buff;
		var effect=pData.pouvoir[i].effect;
		if(this.type === type){

			this.listPouvoir.push( new Pouvoir(type,nom, damage, buff, effect));
		}
	}
}
	//context est l'endroit où dessiner
	Programon.prototype.dessinerProgramon = function(context,mapY,mapX) {

	//permet de déterminer où on est rendu dans la boucle d'animation
	//en fonction du nombre de frame passé
	var frame = 0; 
	
	var cx = this.x - mapX;
	var cy = this.y - mapY;
	
	if(this.y-mapY<0){
		cy = -5; //mapY-TAILLE_AFFICHER;
	}

	if(this.x-mapX<0){
			cx = -5;//mapX-TAILLE_AFFICHER;
		}

	}
	Programon.prototype.ajouterPouvoir = function(){
		this.listPouvoir.push(perso);
	}
	Programon.prototype.lvlup = function(){
		if(this.lvlupMoment <= this.exp){
			this.niveau++;
			this.exp=0;
			this.lvlupMoment=this.niveau*100;
			this.vie = 10+(10*this.niveau)+(this.rareter*10);
			this.vieActuel = this.vie;
			lvlupSound();
			msg=this.nom+" est maintenant niveau "+ this.niveau;
			msgTextArea(msg);
		}
	}
	function randomXY(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}
