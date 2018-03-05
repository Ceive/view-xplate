/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 02.03.2018.
 */

/**
 * @Class XPlate.XCollection
 */
XPlate.Collection = (function(){
	var c,p;

	c = function(){

		this.items = [];

	};
	p = c.prototype;

	/**
	 *
	 * @param offset
	 * @param length
	 * @param {Array|null} replacement
	 * @returns {Array.<*>}
	 */
	p.splice = function(offset, length, replacement){



		var i, item, removed;

		offset 		= (offset === null ? this.items.length : offset) || 0;
		length 		= length || 0;
		replacement = !replacement ? [] : replacement ;

		var _items = [];
		for(i=0;i<this.items.length;i++){
			item = this.items[i];
			_items.push(item);
		}
		removed = Array.prototype.splice.apply( _items, [offset , length].concat(replacement) );

		this._handleRemovedItems(removed);

		removed = Array.prototype.splice.apply( this.items, [offset , length].concat(replacement) );

		this._handleAddedItems(replacement);

		return removed;
	};

	/**
	 *
	 * @param {Function} fn
	 * @returns {XPlate.Collection}
	 */
	p.sort = function(fn){
		this.items.sort(fn);
		this._handleSort(fn);
		return this;
	};

	/**
	 *
	 * @param item
	 * @returns {number}
	 */
	p.indexOf = function(item){
		return this.items.indexOf(item);
	};

	/**
	 *
	 * @param item
	 * @returns {XPlate.Collection}
	 */
	p.append = function(item){
		this.splice(null, 0, [item] );
		return this;
	};

	/**
	 *
	 * @param item
	 * @returns {XPlate.Collection}
	 */
	p.prepend = function(item){
		this.splice(0, 0, [item] );
		return this;
	};

	/**
	 *
	 * @param index
	 * @param item
	 * @returns {XPlate.Collection}
	 */
	p.insert = function(index, item){
		this.splice(index, 0, [item] );
		return this;
	};

	/**
	 *
	 * @param a
	 * @param b
	 * @returns {XPlate.Collection}
	 */
	p.swap = function(a, b){
		var itemA, itemB;
		var indexA, indexB;

		indexA = typeof a === 'number'? a : this.items.indexOf(a);
		indexB = typeof b === 'number'? b : this.items.indexOf(b);

		if(this.items[indexA] && this.items[indexB]){
			itemA = this.items[indexA];
			itemB = this.items[indexB];

			this.items[indexA] = itemB;
			this.items[indexB] = itemA;
		}

		return this;
	};

	/**
	 *
	 * @returns {Number}
	 */
	p.count = function(){
		return this.items.length;
	};

	p._handleSort = function(fn){

	};

	p._handleRemovedItems = function(items){

	};

	p._handleAddedItems = function(items){

	};

	return c;
})();
