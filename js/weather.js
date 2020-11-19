(function() {
	'use strict';
	/*global $, moment*/

	/*************************************************************************/
	/*****************************************************/
	/*********************************/
	// USER EDITABLE LINES - Change these to match your location and preferences!

	// Your Openweathermap city code
	// Find your id code at http://bulk.openweathermap.org/sample/
	var zip_code = '10023, US'; //NYC as an example. Country code needed for countries other than US.
	var api_key = 'YOUR API KEY HERE';

	// Your temperature unit measurement
	// This bit is simple, 'metric' for Celcius, and 'imperial' for Fahrenheit
	var metric = 'imperial';
	
	// Format for date and time
	var formatTime = 'h:mm:ss a'
	var formatDate = 'dddd, MMMM Do'

	// Yahoo! query interval (milliseconds)
	// Default is every 15 minutes. Be reasonable. Don't query Yahoo every 500ms.
	var waitBetweenWeatherQueriesMS = 900000;

	// You're done!
	/*********************************/
	/*****************************************************/
	/*************************************************************************/

	function resolveTemp(temp) {
		temp = Math.round(temp);
		temp += '&deg;'
		return temp;
	}

	function fillCurrently(currently) {
		var icon = $('#currently .icon');
		var desc = $('#currently .desc');
		var temp = $('#currently .temp');

		// Insert the current details. Icons may be changed by editing the icons array.
		if (icon.length) {
			icon.html(icons[currently.weather[0].id]);
		}
		if (desc.length) {
			desc.html(currently.weather[0].description);
		}
		if (temp.length) {
			temp.html(resolveTemp(currently.main.temp));
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
				day.html(new Date(forecast.dt*1000).toDateString());
			}
		}

		// Insert the forecast details. Icons may be changed by editing the icons array.
		if (icon.length) {
			icon.html(icons[forecast.weather[0].id]);
		}
		if (desc.length) {
			desc.html(forecast.weather[0].description);
		}
		if (high.length) {
			high.html(resolveTemp(forecast.main.temp_max));
		}
		if (low.length) {
			low.html(resolveTemp(forecast.main.temp_min));
		}
	}

	function queryOpenWeatherMap() {
		$.ajax({
			type: 'GET',
			url: 'https://api.openweathermap.org/data/2.5/weather?zip=' + zip_code + '&appid=' + api_key + '&units=' + metric,
			dataType: 'json'
		}).done(function (result) {
			// Drill down into the returned data to find the relevant weather information
			fillCurrently(result);
			fillForecast(0, result);
		});

		$.ajax({
			type: 'GET',
			url: 'https://api.openweathermap.org/data/2.5/forecast?zip=' + zip_code + '&appid=' + api_key + '&units=' + metric,
			dataType: 'json'
		}).done(function (result) {
			// Drill down into the returned data to find the relevant weather information
			result = result.list;
			var fill = 1;
			var count = 0;
			for( var res of result){
				// find tomorrow day
				if(res.dt_txt.indexOf('00:00:00') > 0){
					var low = 200.0;
					var high = -200.0;
					for(var i=0; i<8; i++){
						if(i+count >= result.length){
							continue;
						}
						if(result[count+i].main.temp_max > high){
							high = result[count+i].main.temp_max;
						}
						if(result[count+i].main.temp_min < low){
							low = result[count+i].main.temp_min;
						}
					}
					var res_copy = result[Math.min(count + 5, count)]; // 3pm or last possible
					res_copy.main.temp_max = (high>-200?high:res_copy.main.temp_max);
					res_copy.main.temp_min = (low<200?low:res_copy.main.temp_min);
					fillForecast(fill, res);
					fill++;
				}

				count++;
			}
		});
	}

	// Fallback icons - Do not edit. Icons should be edited in your current skin.
	// Fallback icons are from the weather icons pack on github at https://github.com/erikflowers/weather-icons
	// Position in array corresponds to Yahoo! Weather's condition code, which are commented below in plain English
	if (!icons) {
		$(document).ready(function() {
			$('head').append('<link rel="stylesheet" type="text/css" href="../../css/weather-icons.css" />');
		});
		var icons = {
			'01d': '<i class="wi wi-day-sunny"></i>',			//sunny,
			'01n': '<i class="wi wi-night-clear"></i>',		//clear (night)
			'02d': '<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
			'02n': '<i class="wi wi-night-cloudy"></i>',		//partly cloudy (night)
			'03d': '<i class="wi wi-day-cloudy"></i>',			//mostly cloudy (day)
			'03n': '<i class="wi wi-night-cloudy"></i>',		//mostly cloudy (night)
			'04d': '<i class="wi wi-day-cloudy"></i>',
			'04n': '<i class="wi wi-day-cloudy"></i>',
			'09d': '<i class="wi wi-showers"></i>',			//scattered showers
			'09n': '<i class="wi wi-showers"></i>',			//scattered showers
			'10d': '<i class="wi wi-rain"></i>',				//showers
			'10n': '<i class="wi wi-rain"></i>',				//showers
			'11d': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'11n': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'13d': '<i class="wi wi-snow"></i>',				//snow
			'13n': '<i class="wi wi-snow"></i>',				//snow
			'50d': '<i class="wi wi-day-haze"></i>',			//haze
			'50n': '<i class="wi wi-day-haze"></i>',			//haze
			'200': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'201': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'202': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'210': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'211': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'212': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'221': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'230': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'231': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'232': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
			'300': '<i class="wi wi-rain"></i>',				//showers
			'301': '<i class="wi wi-rain"></i>',				//showers
			'302': '<i class="wi wi-rain"></i>',				//showers
			'310': '<i class="wi wi-rain"></i>',				//showers
			'311': '<i class="wi wi-rain"></i>',				//showers
			'312': '<i class="wi wi-rain"></i>',				//showers
			'313': '<i class="wi wi-rain"></i>',				//showers
			'314': '<i class="wi wi-rain"></i>',				//showers
			'321': '<i class="wi wi-rain"></i>',				//showers
			'500': '<i class="wi wi-rain"></i>',				//showers
			'501': '<i class="wi wi-rain"></i>',				//showers
			'502': '<i class="wi wi-rain-wind"></i>',			//tropical storm
			'503': '<i class="wi wi-rain-wind"></i>',			//tropical storm
			'504': '<i class="wi wi-rain-wind"></i>',			//tropical storm
			'511': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
			'520': '<i class="wi wi-rain"></i>',				//showers
			'521': '<i class="wi wi-rain"></i>',				//showers
			'522': '<i class="wi wi-rain"></i>',				//showers
			'531': '<i class="wi wi-rain"></i>',				//showers
			'600': '<i class="wi wi-snow"></i>',				//snow showers
			'601': '<i class="wi wi-snow"></i>',				//snow showers
			'602': '<i class="wi wi-snow"></i>',				//snow showers
			'611': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
			'612': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
			'615': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
			'616': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
			'620': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
			'621': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
			'622': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
			'701': '<i class="wi wi-fog"></i>',				//foggy
			'711': '<i class="wi wi-smoke"></i>',				//smoky
			'721': '<i class="wi wi-fog"></i>',				//foggy
			'731': '<i class="wi wi-smoke"></i>',				//smoky
			'741': '<i class="wi wi-fog"></i>',				//foggy
			'751': '<i class="wi wi-dust"></i>',				//dust
			'761': '<i class="wi wi-dust"></i>',				//dust
			'762': '<i class="wi wi-dust"></i>',				//dust
			'771': '<i class="wi wi-snowflake-cold"></i>',		//cold
			'781': '<i class="wi wi-tornado"></i>',			//tornado
			'800': '<i class="wi wi-day-sunny"></i>',			//sunny,
			'801': '<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
			'802': '<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
			'803': '<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
			'804': '<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
		};
	}

	$(window).load(function() {
		// Fetch the weather data for right now
		queryOpenWeatherMap();

		// Query Yahoo! at the requested interval for new weather data
		setInterval(function() {
			queryOpenWeatherMap();
		}, waitBetweenWeatherQueriesMS);

		// Set the current time and date on the clock
		if ($('#time').length) {
			$('#time').html(moment().format(formatTime));
		}
		if ($('#date').length) {
			$('#date').html(moment().format(formatDate));
		}

		// Refresh the time and date every second
		setInterval(function(){
			if ($('#time').length) {
				$('#time').html(moment().format(formatTime));
			}
			if ($('#date').length) {
				$('#date').html(moment().format(formatDate));
			}
		}, 1000);
	});
}());
