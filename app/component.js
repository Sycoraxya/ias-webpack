/**
 * Created by Stefan on 26/09/2016.
 */
module.exports = function () {
	var element = document.createElement('h1');

	element.className = 'pure-button';
	element.innerHTML = 'Hello world!';

	return element;
};