var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var moment = require('moment');
var jq = require('json-query');
var app = express();
var data = require('../db/fishData.json');



/*var geo = require('../services/geofinder')

var geocoderProvider = 'openstreetmap';
var httpAdapter = 'http';

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);*/



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Lets Go Fish' });
});



router.post('/location', function(req, res) {
	console.log(req.body.name)
	var latitude = jq('collection[name='+req.body.name+'].latitude', {data: data}).value
	console.log(latitude)
	var longitude = jq('collection[name='+req.body.name+'].longitude', {data: data}).value
	console.log(longitude)
	var water = jq('collection[name='+req.body.name+'].location', {data:data}).value
	console.log('http://api.aerisapi.com/batch/'+latitude+','+longitude+'?requests=/observations,/forecasts,/tides?filter=highlow&client_id=iTdIAjhd3NDNxOaEiuWoO&client_secret=uvoj4tMptzPqHxQZ2AcrokrlLaOnby7ZQQWjuJ0V')

	fetch('http://api.aerisapi.com/batch/'+latitude+','+longitude+'?requests=/observations,/forecasts,/tides?filter=highlow&client_id=iTdIAjhd3NDNxOaEiuWoO&client_secret=uvoj4tMptzPqHxQZ2AcrokrlLaOnby7ZQQWjuJ0V')
	.then(function(res) {
		return res.json();
	}).then(function(json) {
		var loc = json.response.responses[0].response.place.name;
		var ob = json.response.responses[0].response.ob;
		var low_o = moment(json.response.responses[2].response[0].periods[0].dateTimeISO).format('h:mm a');
		var low_t = moment(json.response.responses[2].response[0].periods[2].dateTimeISO).format('h:mm a');
		var high_o = moment(json.response.responses[2].response[0].periods[1].dateTimeISO).format('h:mm a');
		var title = req.body.name;
		var loca = loc.toUpperCase();
		var icon = 'http://www.shermanctweather.org/meteo1/icons/aeris/'+ob.icon;

		if (json.response.responses[2].response[0].periods[3]) {

			var high_t = moment(json.response.responses[2].response[0].periods[3].dateTimeISO).format('h:mm a');
			console.log(high_t);

		} else { 

			var high_t = "No Data Available"

		}


		//var date = new Date(json.response.responses[2].response[0].periods[0].dateTimeISO).toString()

		console.log(low_o, low_t, high_o, high_t, loc, icon)
		res.render('location', {low_one: low_o, low_two: low_t, high_one: high_o, high_two: high_t, title: title, water: water, location: loca, temp: ob.tempF, weather: ob.weather, icon: icon})
	})





});



module.exports = router;
