'use strict';

/**
 * coco-timer
 *
 * @author Laurelien <https://www.github.com/Laurelien/coco-timer>
 * @description Application Electron pour ajouter des horaires entre eux
 */

/**
 * Initialisation
 *
 * @description Appel de la fonction d'initialisation
 */

window.addEventListener('load', init);

/**
 * Variables constantes
 *
 * @description Variables pointant les élements du DOM
 */
 
 
const divForm = document.getElementById('form');
const inputH = document.getElementById('heures');
const inputM = document.getElementById('minutes');
const btn = document.getElementById('btn');
const divHistory = document.querySelector('#history .horaires');
const divResult = document.querySelector('#result p');
const lienReset = document.querySelector('footer a');

/**
 * Remise à zéro
 *
 * @description Appel de la fonction remettant à zéro l'app
 */

lienReset.addEventListener('click', resetAll);

/**
 * Ajout d'un temps de travail
 *
 * @description Appel de la fonction addTime au clique sur le bouton +
 */
 

btn.addEventListener('click', function() {
	addTime(inputH.value, inputM.value)
});

/**
 * init
 *
 * @description Initialisation de l'app en nettoyant le localstorage
 */

function init() {
	localStorage.setItem('totalTemps', '0'); // On initialise à l'ouverture le nombre total à 0
	localStorage.setItem('history', '[]'); // On initialise à l'ouverture l'historique à 0
}

/**
 * addTime
 *
 * @description Ajoute le temps entré par l'utilisateur
 * @param {Number} Nombre d'heures
 * @param {Number} Nombre de minutes
 * @return {null | Boolean} Rien sauf si un des paramètre n'est pas conforme
 */

function addTime(hours, minutes) {
	if(hours.length === 0) hours = 0;
	if(hours < 0 || hours > 23) {
		inputH.style.color = '#d0451b';
		return false;
	} else {
		inputH.style.color = 'inherit';
	}
	if(minutes.length === 0) minutes = 0;
	if(minutes < 0 || minutes > 59) {
		inputM.style.color = '#d0451b';
		return false;
	} else {
		inputM.style.color = 'inherit';
	}
	hours = parseInt(hours);
	minutes = parseInt(minutes);
	let allTime = hours * 60 + minutes;
	
	totalTime(allTime);
	historique(allTime);
}

/**
 * totalTime
 *
 * @description Ajoute le temps entré par l'utilisateur aux autres temps déja entré, le formate et l'affiche
 * @param {Number} Temps envoyé
 */

function totalTime(newTime) {
	let old = parseInt(localStorage.getItem('totalTemps'));
	let fin = old + newTime;
	
	localStorage.setItem('totalTemps', fin.toString());
	
	divResult.innerHTML = transformTime(fin);
}

/**
 * transformTime
 *
 * @description Transforme un temps en minute en heures + minutes
 * @param {Number} Temps en minutes
 * @return {String} Temps formaté
 */

function transformTime(value) {
	let hours = Math.floor(value / 60);
	let minutes = Math.floor(value - hours*60);
	
	return hours + (hours > 1 ? ' heures ' : ' heure ') + (minutes < 10 ? '0' + minutes : minutes) + (minutes > 1 ? ' minutes' : ' minute');
}

/**
 * historique
 * 
 * @description Enregistre l'historique des temps ajouté (limité à 5 éléments)
 * @param {Number} Temps en minute
 */

function historique(value) {
	let lastAdded = JSON.parse(localStorage.getItem('history'));
		lastAdded.push(value);
	if(lastAdded.length === 6) lastAdded.shift();
	
	localStorage.setItem('history', JSON.stringify(lastAdded));
	refreshHistory();
}

/**
 * refreshHistory
 *
 * @description Actualise le DOM de l'historique en ajoutant les derniers ajouts
 */

function refreshHistory() {
	divHistory.innerHTML = '';
	
	let histoire = JSON.parse(localStorage.getItem('history'));
	let histoireLen = histoire.length;
	
	for(let i=0; i<histoireLen; i++) {
		let divHoraire = document.createElement('div');
			divHoraire.className = 'horaire';
		let span = document.createElement('span');
			span.innerHTML = transformTime(histoire[i]);
		let close = document.createElement('a');
			close.href = '#';
			close.className = 'remove';
			close.innerHTML = '&times;';
			close.addEventListener('click', function(e) {
				substract(i);
			});
		divHoraire.appendChild(span);
		divHoraire.appendChild(close);
		divHistory.appendChild(divHoraire);
	}
}

/**
 * substract
 *
 * @description Retire des minutes au total provenant de l'historique
 * @param {Number} Clé du tableau pointant les minutes à retirer
 */

function substract(id) {
	let histoire = JSON.parse(localStorage.getItem('history'));
	let time = histoire.splice(id, 1);
	let toRemove = -parseInt(time[0]);
	
	totalTime(toRemove);
	
	localStorage.setItem('history', JSON.stringify(histoire));
	refreshHistory();
}

/**
 * resetAll
 *
 * @description Réinitialise l'app à zéro
 */

function resetAll() {
	init();
	refreshHistory();
	divResult.innerHTML = ' - ';
	inputH.value = '';
	inputM.value = '';	
}