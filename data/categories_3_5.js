
const categorie_10_5 = require('./categories_10_5.js');

const categorie_3_5 = {
	"deco":{
		"name":"Déco",
		"compose":{
			"plat":{
				"name":" Plat",
				"compose": categorie_10_5.plat.compose
			},
			"linge_de_table" : {
				"name" : "Linge de table",
				"compose": categorie_10_5.linge_de_table.compose
			},
			"accessoire_de_table":{
				"name" : "Accessoire de table",
				"compose" : categorie_10_5.accessoire_de_table.compose
			}
		}
	},
	"vaiselle":{
		"name": "Vaiselle",
		"compose":{
			"assiette":{
				"name":"Assiette",
				"compose": categorie_10_5.assiette.compose
			},
			"couvert":{
				"name":"Couvert",
				"compose": categorie_10_5.couvert.compose
			},
			"petit_dejeuner":{
				"name": "Petit déjeuner",
				"compose": categorie_10_5.petit_dejeuner.compose
			},
			"vaiselle_nomade":{
				"name":"Vaiselle nomade",
				"compose": categorie_10_5.vaiselle_nomade.compose
			}
		}
	},
	"breuvage":{
		"name":"Breuvage",
		"compose":{
			"cafe_et_the":{
				"name": "Café et thé",
				"compose":categorie_10_5.cafe_et_the.compose
			},
			"bouteille":{
				"name": 'Bouteille',
				"compose": categorie_10_5.bouteille.compose
			},
			"verrerie":{
				"name": "Verrerie",
				"compose": categorie_10_5.verrerie.compose
			}
		}
	}
}



module.exports = categorie_3_5;