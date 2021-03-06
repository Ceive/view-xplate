/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 02.03.2018.
 */

XPlate.Plate.Wrapper = (function(){

	var c, p;

	c = function(){
		XPlate.Plate.call(this);

		/**
		 *
		 * @type {XPlate.Plate}
		 */
		this.wrappedPlate = null;
	};

	p = c.prototype = Object.create(XPlate.Plate.prototype);


	/**
	 *
	 * @returns {Element}
	 */
	p._initializeDOM = function(){

		var e = this.wrappedPlate._initializeDOM();

		e.classList.add('Обернутый элемент');

		return e;
	};

	/**
	 *
	 * @param {XPlate.Plate|null} wrapped
	 * @returns {XPlate.Plate.Wrapper}
	 */
	p.setWrapped = function(wrapped){
		this.wrappedPlate = wrapped;
		this._dom = null;
		return this;
	};

	/**
	 *
	 * @returns {XPlate.Plate|null}
	 */
	p.getWrapped = function(){
		return this.wrappedPlate;
	};

	return c;
})();
