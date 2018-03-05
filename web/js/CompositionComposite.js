/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 02.03.2018.
 */

/**
 * @Class 	XPlate.Collection.CompositionComposite
 * @Extends XPlate.Collection
 */
XPlate.Collection.CompositionComposite = (function(){

	var c, p;
	c = function(limit, composition){
		XPlate.Collection.call(this);

		/**
		 * @type {Composition}
		 */
		this.composition = composition;

		/**
		 *
		 * @type {number}
		 */
		this.limit = limit || 4;

	};

	p = c.prototype = Object.create(XPlate.Collection.prototype);

	/**
	 *
	 * @param offset
	 * @param length
	 * @param replacement
	 * @returns {Array.<*>}
	 */
	p.splice = function(offset, length, replacement){
		var oldLength = this.items.length;

		var result = XPlate.Collection.prototype.splice.call(this, offset, length, replacement);

		if(this.items.length > this.composition.config.compositeSize){
			this._dissolve();
		}else if(oldLength === this.limit && this.limit > this.items.length){
			this._saturate();
		}

		if(!this.items.length){
			this.composition.deleteComposite(this);
		}
		return result;

	};

	/**
	 *
	 * @returns {XPlate.Collection.CompositionComposite|null}
	 */
	p.nextCompositeNeighbor = function(require){
		var cIndex = this.composition.searchComposite(this);
		if(require){
			return this.composition.requireComposite(cIndex + 1);
		}
		return this.composition.composites[cIndex + 1] || null;
	};

	/**
	 *
	 * @returns {XPlate.Collection.CompositionComposite|null}
	 */
	p.prevCompositeNeighbor = function(){
		var cIndex = this.composition.searchComposite(this);
		return this.composition.composites[cIndex - 1] || null;
	};

	/**
	 *
	 * @private
	 */
	p._dissolve = function(){
		var nextComposite = this.nextCompositeNeighbor(true);
		nextComposite.splice(0,0, XPlate.Collection.prototype.splice.call(this, this.composition.config.compositeSize - 1, null) );
	};

	/**
	 *
	 * @private
	 */
	p._saturate = function(){
		var nextComposite = this.nextCompositeNeighbor();
		while(nextComposite && this.limit > this.items.length){
			var difference = this.limit - this.items.length;

			var items = nextComposite.splice(0, difference);
			XPlate.Collection.prototype.splice.call(this, null, null, items);

			nextComposite = this.composition[cIndex + 1];
		}
	};


	return c;

})();
