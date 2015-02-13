// Redirect the loaded page to the selected skin's index

(function() {
	var href = window.location.href;
	var index = href.indexOf('index.html');
	href = href.slice(0, index);

	window.location = href + 'skins/' + skinName + '/index.html';
}());