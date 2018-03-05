/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 02.03.2018.
 */

/**
 * @Class
 * @Extends
 */
XPlate.Plate.XComposition = (function(){

	var c, p;
	c = function(config){
		XPlate.Collection.Composition.call(this, config);
		XPlate.Plate.call(this, this.config);
	};

	p = c.prototype = XPlate.apply( Object.create(XPlate.Collection.Composition.prototype), XPlate.Plate.prototype, true);


	p._makeComposite = function(){

		var composite = new XPlate.Plate.XCompositionComposite({
			composition: this,
			limit: this.config.compositeSize
		});
		var compositeEl = composite.dom;
		this.dom.appendChild(compositeEl);
		return composite;
	};

	p._initializeDOM = function(){
		var dom = document.createElement('div');
		dom.id = this.getId();
		return dom;
	};

	p._beforeCompositeDelete = function(composite){
		this.dom.removeChild(composite.dom);
	};

	return c;

})();
