(function() {
	'use strict';
	/*global $, moment*/

	/*************************************************************************/
	/*****************************************************/
	/*********************************/
	// USER EDITABLE LINES - Change these to match your location and preferences!

	// Your Yahoo WOEID code
	// Find your WOEID code at http://zourbuth.com/tools/woeid/
	var woeid = 23416998;
	
	// Your temperature unit measurement
	// This bit is simple, 'c' for Celcius, and 'f' for Fahrenheit
	var unit = 'c';

	// Yahoo! query interval (milliseconds)
	// Default is every 15 minutes. Be reasonable. Don't query Yahoo every 500ms.
	var waitBetweenWeatherQueriesMS = 900000;

	// You're done!
	/*********************************/
	/*****************************************************/
	/*************************************************************************/

	function resolveTemp(temp) {
		if (unit === 'c' || unit === 'C') {
			temp = '' + Math.round((parseInt(temp) - 32) / 1.8);
		}
		return temp;
	}

	function fillCurrently(currently) {
		var icon = $('#currently .icon');
		var desc = $('#currently .desc');
		var temp = $('#currently .temp');

		// Insert the current details. Icons may be changed by editing the icons array.
		if (icon.length) {
			icon.html(icons[currently.code]);
		}
		if (desc.length) {
			desc.html(currently.text);
		}
		if (temp.length) {
			temp.html(resolveTemp(currently.temp));
		}
	}

	function fillForecast(day, forecast) {
		// Choose one of the five forecast cells to fill
		var forecastCell = '#forecast' + day + ' ';
		var day = $(forecastCell + '.day');
		var icon = $(forecastCell + '.icon');
		var desc = $(forecastCell + '.desc');
		var high = $(forecastCell + '.high');
		var low = $(forecastCell + '.low');

		// If this is the first cell, call it "Today" instead of the day of the week
		if (day.length) {
			if (day === 1) {
				day.html('Today');
			} else {
				day.html(forecast.day);
			}
		}

		// Insert the forecast details. Icons may be changed by editing the icons array.
		if (icon.length) {
			icon.html(icons[forecast.code]);
		}
		if (desc.length) {
			desc.html(forecast.text);
		}
		if (high.length) {
			high.html(resolveTemp(forecast.high));
		}
		if (low.length) {
			low.html(resolveTemp(forecast.low));
		}
	}

	function fillLinks(link) {
		// Linking is required attribution when using Yahoo! APIs
		if ($('.yahooLink').length) {
			$('.yahooLink').attr('href', link);
		}
	}

	function queryYahoo() {
		$.ajax({
			type: 'GET',
			url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D' + woeid + '&format=json',
			dataType: 'json'
		}).done(function (result) {
			// Drill down into the returned data to find the relevant weather information
			result = result.query.results.channel.item;

			fillCurrently(result.condition);
			fillForecast(1, result.forecast[0]);
			fillForecast(2, result.forecast[1]);
			fillForecast(3, result.forecast[2]);
			fillForecast(4, result.forecast[3]);
			fillForecast(5, result.forecast[4]);
			fillLinks(result.link);
		});
	}

	// Fallback icons - Do not edit. Icons should be edited in your current skin.
	// Fallback icons are from the weather icons pack on github at https://github.com/erikflowers/weather-icons
	// Position in array corresponds to Yahoo! Weather's condition code, which are commented below in plain English
	if (!icons) {
		$(document).ready(function() {
			$('head').append('<link rel="stylesheet" type="text/css" href="../../css/weather-icons.css" />');
		});
		var icons = [
			'<i class="wi wi-tornado"></i>',			//tornado
			'<i class="wi wi-rain-wind"></i>',			//tropical storm
			'<i class="wi wi-tornado"></i>',			//hurricane
			'<i class="wi wi-thunderstorm"></i>',		//severe thunderstorms
			'<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
			'<i class="wi wi-rain-mix"></i>',			//mixed rain and sleet
			'<i class="wi wi-rain-mix"></i>',			//mixed snow and sleet
			'<i class="wi wi-rain-mix"></i>',			//freezing drizzle
			'<i class="wi wi-cloudy"></i>',				//drizzle
			'<i class="wi wi-rain"></i>',				//freezing rain
			'<i class="wi wi-rain"></i>',				//showers
			'<i class="wi wi-rain"></i>',				//showers
			'<i class="wi wi-snow"></i>',				//snow flurries
			'<i class="wi wi-snow"></i>',				//light snow showers
			'<i class="wi wi-showers"></i>',			//blowing snow
			'<i class="wi wi-snow"></i>',				//snow
			'<i class="wi wi-hail"></i>',				//hail
			'<i class="wi wi-rain-mix"></i>',			//sleet
			'<i class="wi wi-dust"></i>',				//dust
			'<i class="wi wi-fog"></i>',				//foggy
			'<i class="wi wi-day-haze"></i>',			//haze
			'<i class="wi wi-smoke"></i>',				//smoky
			'<i class="wi wi-strong-wind"></i>',		//blustery
			'<i class="wi wi-strong-wind"></i>',		//windy
			'<i class="wi wi-snowflake-cold"></i>',		//cold
			'<i class="wi wi-cloudy"></i>',				//cloudy
			'<i class="wi wi-night-cloudy"></i>',		//mostly cloudy (night)
			'<i class="wi wi-day-cloudy"></i>',			//mostly cloudy (day)
			'<i class="wi wi-night-cloudy"></i>',		//partly cloudy (night)
			'<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
			'<i class="wi wi-night-clear"></i>',		//clear (night)
			'<i class="wi wi-day-sunny"></i>',			//sunny
			'<i class="wi wi-night-clear"></i>',		//fair (night)
			'<i class="wi wi-day-sunny"></i>',			//fair (day)
			'<i class="wi wi-hail"></i>',				//mixed rain and hail
			'<i class="wi wi-hot"></i>',				//hot
			'<i class="wi wi-storm-showers"></i>',		//isolated thunderstorms
			'<i class="wi wi-storm-showers"></i>',		//scattered thunderstorms
			'<i class="wi wi-storm-showers"></i>',		//scattered thunderstorms
			'<i class="wi wi-showers"></i>',			//scattered showers
			'<i class="wi wi-sleet"></i>',				//heavy snow
			'<i class="wi wi-snow"></i>',				//scattered snow showers
			'<i class="wi wi-sleet"></i>',				//heavy snow
			'<i class="wi wi-cloudy"></i>',				//partly cloudy
			'<i class="wi wi-storm-showers"></i>',		//thundershowers
			'<i class="wi wi-snow"></i>',				//snow showers
			'<i class="wi wi-storm-showers"></i>'		//isolated thundershowers
		];
	}

	$(window).load(function() {
		// Fetch the weather data for right now
		queryYahoo();

		// Query Yahoo! at the requested interval for new weather data
		setInterval(function() {
			queryYahoo();
		}, waitBetweenWeatherQueriesMS);

		// Set the current time and date on the clock
		if ($('#time').length) {
			$('#time').html(moment().format('h:mm:ss a'));
		}
		if ($('#date').length) {
			$('#date').html(moment().format('dddd, MMMM Do'));
		}

		// Refresh the time and date every second
		setInterval(function(){
			if ($('#time').length) {
				$('#time').html(moment().format('h:mm:ss a'));
			}
			if ($('#date').length) {
				$('#date').html(moment().format('dddd, MMMM Do'));
			}
		}, 1000);
	});
}());


/////////// Example return data from Yahoo! Weather ///////////////////////////
/*
	"title": "Conditions for Rolla, MO at 2:52 pm CST",
	"lat": "37.95",
	"long": "-91.76",
	"link": "http:\/\/us.rd.yahoo.com\/dailynews\/rss\/weather\/Rolla__MO\/*http:\/\/weather.yahoo.com\/forecast\/USMO0768_f.html",
	"pubDate": "Wed, 11 Feb 2015 2:52 pm CST",
	"condition": {
		"code": "26",
		"date": "Wed, 11 Feb 2015 2:52 pm CST",
		"temp": "37",
		"text": "Cloudy"
	},
	"description": "\n<img src=\"http:\/\/l.yimg.com\/a\/i\/us\/we\/52\/26.gif\"\/><br \/>\n<b>Current Conditions:<\/b><br \/>\nCloudy, 37 F<BR \/>\n<BR \/><b>Forecast:<\/b><BR \/>\nWed - Partly Cloudy. High: 41 Low: 17<br \/>\nThu - Sunny. High: 29 Low: 19<br \/>\nFri - Partly Cloudy. High: 47 Low: 28<br \/>\nSat - Partly Cloudy. High: 36 Low: 9<br \/>\nSun - AM Clouds\/PM Sun. High: 29 Low: 20<br \/>\n<br \/>\n<a href=\"http:\/\/us.rd.yahoo.com\/dailynews\/rss\/weather\/Rolla__MO\/*http:\/\/weather.yahoo.com\/forecast\/USMO0768_f.html\">Full Forecast at Yahoo! Weather<\/a><BR\/><BR\/>\n(provided by <a href=\"http:\/\/www.weather.com\" >The Weather Channel<\/a>)<br\/>\n",
	"forecast": [
		{
			"code": "29",
			"date": "11 Feb 2015",
			"day": "Wed",
			"high": "41",
			"low": "17",
			"text": "Partly Cloudy"
		},
		{
			"code": "32",
			"date": "12 Feb 2015",
			"day": "Thu",
			"high": "29",
			"low": "19",
			"text": "Sunny"
		},
		{
			"code": "30",
			"date": "13 Feb 2015",
			"day": "Fri",
			"high": "47",
			"low": "28",
			"text": "Partly Cloudy"
		},
		{
			"code": "30",
			"date": "14 Feb 2015",
			"day": "Sat",
			"high": "36",
			"low": "9",
			"text": "Partly Cloudy"
		},
		{
			"code": "30",
			"date": "15 Feb 2015",
			"day": "Sun",
			"high": "29",
			"low": "20",
			"text": "AM Clouds\/PM Sun"
		}
	],
	"guid": {
	"isPermaLink": "false",
	"content": "USMO0768_2015_02_15_7_00_CST"
*/
