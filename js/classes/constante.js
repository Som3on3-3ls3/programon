/*direction en fonction de l'ordre placé sur l'image des sprites*/
var DIRECTION = {
    "BAS"    : 0,
    "GAUCHE" : 1,
    "DROITE" : 2,
    "HAUT"   : 3
}

//duréé animation du deplacement personnage
var DUREE_ANIMATION = 4;
var DUREE_DEPLACEMENT = 5;
var TAILLE_AFFICHER = 16;

//page a afficher
var PAGE = {
	"JEU"      : 0,
	"BAGS"     : 1,
	"PROGRAMON": 2,
	"CARTE"    : 3,
	"COMBAT"   : 4,
	"LPOUVOIR" : 5
}

var RARE = {
	"COMMON"  	: 0,
	"UNCOMMON"	: 1,
	"RARE"    	: 2,
	"EPIC"    	: 3,
	"LEGENDAIRE": 4
}
var COULEURRARE = {
	"COMMON"  	: "#fff",
	"UNCOMMON"  : "#180",
	"RARE"		: "#00f",
	"EPIC"		: "#50f",
	"LEGENDAIRE": "#E67E30"
}