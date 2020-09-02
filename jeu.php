<?php 
	require_once("partial/header.php");
?>

		<div class="sectionJeu">
		
			<link rel="stylesheet" type="text/css" href="css/style.css" />
			<!--[if lt IE 9]><script type="text/javascript" src="js/excanvas.compiled.js"></script><![endif]-->
			
			<div class="carte" id="zoneJeu">
			<canvas id="canvas">jeu supporté avec chrome, mozilla, IE 9 et +	</canvas>
			<div id="fleche"></div>	
			<div id="flecheD"></div>	
			<div id="flecheG"></div>	
			</div>
			<input type="button" id="mute" OnClick="muteBackgroundSounds()" />
			<div class="menuJeu">
				<button type="button" id="bags" OnClick="bag()">bags</button>
				<button type="button" id="programon" OnClick="listeProgramon()">programon</button>
				<button type="button" id="lpouvoir" OnClick="lPouvoir()">ListAttaque</button>
				<button type="button" id="map" OnClick="carte()">map</button>
				<button type="button" id="retour" OnClick="retour()">Retour</button>
				<button type="button" id="attack" OnClick="combat.attaquer()">finTour</button>
				<button type="button" id="appliquer" OnClick="appliquers()">appliquer</button>
			</div>
			<!-- l'ordre d'appel des fichiers est importants, tooujours faire appel au fichier classe avant les fichiers qui les utilises -->
			<script type="text/javascript" src="js/jsonRequest.js"></script>
			<script type="text/javascript" src="js/json2.js"></script>
			<script type="text/javascript" src="js/jquery-1.10.2.js"></script>
			<script type="text/javascript" src="js/jWebAudio.js"></script>
			<script type="text/javascript" src="js/sounds.js"></script>
			<script type="text/javascript" src="js/imageInit.js"></script>
			<script type="text/javascript" src="js/classes/constante.js"></script>
			<script type="text/javascript" src="js/classes/Combat.js"></script>
			<script type="text/javascript" src="js/classes/Tileset.js"></script>
			<script type="text/javascript" src="js/classes/Npc.js"></script>
			<script type="text/javascript" src="js/classes/Pouvoir.js"></script>
			<script type="text/javascript" src="js/classes/Programon.js"></script>
			<script type="text/javascript" src="js/classes/Object.js"></script>
			<script type="text/javascript" src="js/classes/Sac.js"></script>
			<script type="text/javascript" src="js/classes/personnage.js"></script>
			<script type="text/javascript" src="js/classes/Map.js"></script>
			<script type="text/javascript" src="js/jeu.js"></script>
			<div class="zoneTexte">
				<textArea name="zoneTexte" class="zoneTexte" id="zoneTArea" disabled>
				</textArea>
			</div>

		</div>
			
			<?php require_once("partial/footer.php");?>

