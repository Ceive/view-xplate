/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 02.03.2018.
 */

/**
 * @Class 	XPlate.Collection.Composition
 * @Extends XPlate.Collection
 */
XPlate.Collection.Composition = (function(){
	var c,p;

	c = function(config){
		XPlate.Collection.call(this);

		/**
		 *
		 * @type {XPlate.Collection.CompositionComposite[]}
		 */
		this.composites = [];

		/**
		 * @type {*}
		 */
		this.config = XPlate.apply({
			compositeSize: 5
		}, config);


		this._emptyComposites = [];
	};


	p = c.prototype = Object.create(XPlate.Collection.prototype);




	/**
	 *
	 * @param a
	 * @param b
	 * @returns {XPlate.Collection}
	 */
	p.swap = function(a, b){
		var itemA, itemB;
		var indexA, indexB;
		var coordsA, coordsB;

		indexA = typeof a === 'number'? a : this.items.indexOf(a);
		indexB = typeof b === 'number'? b : this.items.indexOf(b);

		if(this.items[indexA] && this.items[indexB]){

			itemA = this.items[indexA];
			itemB = this.items[indexB];

			coordsA = this._findCompositeBy(itemA, true);
			coordsB = this._findCompositeBy(itemB, true);

			if(coordsA && coordsB){
				coordsA[0].splice(cordsA[2], 1, [ itemB ]);
				coordsB[0].splice(cordsB[2], 1, [ itemA ]);
			}

			this.items[indexA] = itemB;
			this.items[indexB] = itemA;
		}

		return this;


		//return XPlate.XCollection.prototype.swap.call(this, a, b);
	};

	/**
	 *
	 * @param index
	 * @returns {XPlate.Collection.CompositionComposite}
	 */
	p.requireComposite = function(index){
		if(!this.composites[index]){
			if(this._emptyComposites.length){
				this.composites[index] = this._emptyComposites.shift();
				this.composites[index].composition = this;
			}else{
				this.composites[index] = this._makeComposite();
			}
		}
		return this.composites[index];
	};
	/**
	 *
	 * @param compositeIndex
	 * @returns {XPlate.Collection.CompositionComposite}
	 */
	p.deleteComposite = function(compositeIndex){
		compositeIndex = typeof compositeIndex === 'number'? compositeIndex : this.items.indexOf(compositeIndex);
		var composite = this.composites[compositeIndex];
		if(composite && this._beforeCompositeDelete(composite)!==false){
			this._emptyComposites.push(composite);
			Array.prototype.splice.apply( this.composites , [compositeIndex, 1] );
		}
		return this;
	};

	p._beforeCompositeDelete = function(composite){


	};

	/**
	 * @param {CompositionComposite} composite
	 * @returns {number}
	 */
	p.searchComposite = function(composite){
		return this.composites.indexOf(composite);
	};

	/**
	 * @returns {Number}
	 */
	p.getCompositesCount = function(){
		return this.composites.length;
	};

	/**
	 * @returns {CompositionComposite}
	 * @private
	 */
	p._makeComposite = function(){
		return new XPlate.Collection.CompositionComposite( this.config.compositeSize , this );
	};

	/**
	 * @returns {CompositionComposite}
	 * @private
	 */
	p._makeComposite = function(){
		return new XPlate.Collection.CompositionComposite( this.config.compositeSize , this );
	};

	/**
	 * @returns {CompositionComposite}
	 * @private
	 */
	p._handleSort = function(fn){
		for(var i=0;i<this.composites.length;i++){
			this.composites[i].sort(fn);
		}
	};

	/**
	 *
	 * @param items
	 * @private
	 */
	p._handleAddedItems = function(items){
		var item,i;
		for(i=0;i<items.length;i++){
			item = items[i];
			this._onItemAdd(item);
		}
	};

	/**
	 *
	 * @param items
	 * @private
	 */
	p._handleRemovedItems = function(items){
		var item,i;
		for(i=0;i < items.length;i++){
			item = items[i];
			this._onItemRemoved(item);
		}
	};

	/**
	 *
	 * @param item
	 * @private
	 */
	p._onItemRemoved = function(item){
		var composite,
			compositeIndex,
			indexInComposite,
			coords;

		coords = this._findCompositeBy(item);

		if(coords){
			compositeIndex 	 = coords[0];
			indexInComposite = coords[1];
			composite = this.composites[compositeIndex]
		}

		if(composite){
			composite.splice(indexInComposite, 1);
		}else{
			//throw new Error("Item not found in any of the composites");
		}

	};

	/**
	 *
	 * @param item
	 * @private
	 */
	p._onItemAdd = function(item){

		var composite,
			compositeIndex,
			indexInComposite,
			coords;

		coords = this._calculateCompositeCoordinates(item);

		if(coords){
			compositeIndex 	 = coords[0];
			indexInComposite = coords[1];
			composite = this.requireComposite(compositeIndex);
		}

		composite.splice(indexInComposite, 0, [ item ]);
	};

	/**
	 *
	 * @param value
	 * @returns {*}
	 * @private
	 */
	p._calculateCompositeCoordinates = function(value){
		var index;

		if(typeof value === "number"){
			index = value;
		}else{
			index = this.items.indexOf(value);
		}

		if(index < 0){
			return null;
		}

		var composite,
			compositeIndex,
			indexInComposite;

		var found = false,
			limitMax = 0;

		for(compositeIndex = 0;compositeIndex < this.composites.length; compositeIndex++){
			composite = this.composites[compositeIndex];

			if((limitMax + composite.limit) > index){
				if(!limitMax){
					indexInComposite = index;
				}else{
					indexInComposite = index % limitMax; // 1
				}
				found = true;
				break;
			}

			limitMax+= composite.limit;
		}

		if(!found){
			//composite = this.requireComposite(compositeIndex);
			indexInComposite = index - limitMax; // 1
		}

		return [compositeIndex, indexInComposite];
	};

	/**
	 *
	 * @param item
	 * @param returnComposite
	 * @returns {*}
	 * @private
	 */
	p._findCompositeBy = function(item, returnComposite){
		returnComposite = returnComposite === true;

		if(typeof item === "number"){
			item = this.items[item];
		}

		if(!item){
			return null;
		}

		var composite,
			compositeIndex,
			indexInComposite;

		var found = false;

		for(compositeIndex = 0;compositeIndex < this.composites.length; compositeIndex++){
			composite = this.composites[compositeIndex];
			indexInComposite = composite.indexOf(item);
			if(indexInComposite >= 0){
				found = true;
				break;
			}
		}

		if(!found){
			return null;
		}else{

			if(returnComposite){
				return [composite, compositeIndex, indexInComposite];
			}

			return [compositeIndex, indexInComposite];
		}
	};

	return c;
})();
