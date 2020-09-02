*-PROGRAMON-*
Auteur:Jonathan Bolvari Begeron
Date:2013-11-28

/****SOMMAIRE****/
	0. INTRO
	1. REQUIS
	2. UTILISATION
	3. NOTES TECHNIQUES
	4. BUGS CONNUES
/****************/

0.Introduction
	Dans un monde ou la langue commune est le Lorem Ipsum,
	le jeune aventurier du nom de (*votre nom*), aura la 
	chance de faire face au plus grand champion Programon 
	et d'être admis à la grande école de codeur l'ETS. Cet
	univers qui ne ressemble en rien au notre, où le gazon
	est constitué de fibre optique et que les arbres font 
	pousser des ordinateurs, vie une race d'animaux qui se 
	nourri de tout ce savoir, qui se nomme des programons. 
	Ces animaux apprivoisés par l'homme les accompagnent dans 
	toute leur aventure et les aides à vaincre le monde sans 
	pitié qu'est « Dolor sit amet ».

1.Requis
	- pour utilisation enligne
		- Explorateur Web:
			- Chrome ou Mozilla FireFox
			
	- pour utilisation local
		- serveur php
		- Explorateur Web:
			- Chrome ou Mozilla FireFox
	- des écouteurs sinon chrome risque de planter.

2.Utilisation
	- Se rendre sur la page web index du site
		-aller sur la section jeu
		-jouer avec le joueur
	
3. Notes Techniques
	- les maps sont faite en json, tout l'affichage et basé sur des images de sprites
	- pour ajouter des npcs, il y a un fichier json data.json
	- pour ajouter des pouvoirs, aller dans la classe programon.js et ajouter des 
	  pouvoir dans la fonction pouvoir.
	- pour l'ajout de map, le logiciel Tiled est nécessaire
	  et enregistrer les maps en format json aussi, idéalement faire
	  des maps carrés

4.Bugs connues
	- Pas de sauvegarde encore faite, donc lors d'un refresh de 
	  l'explorateur la partie en cours n'est pas sauvegardé