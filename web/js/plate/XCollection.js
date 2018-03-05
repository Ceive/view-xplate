/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 02.03.2018.
 */

/**
 * @Class
 * @Extends
 */
XPlate.Plate.XCollection = (function(){
	var c, p;
	c = function(config){
		XPlate.Collection.Composition.call(this, config);
		XPlate.Plate.call(this, config);
	};

	p = c.prototype = XPlate.apply( Object.create(XPlate.Collection.Composition.prototype), XPlate.Plate.prototype, true);

	p._initializeDOM = function(){
		return document.createElement('div');
	};

	return c;
})();