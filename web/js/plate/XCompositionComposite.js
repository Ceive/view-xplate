/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 02.03.2018.
 */

/**
 * @Class
 * @Extends
 */
XPlate.Plate.XCompositionComposite = (function(){

	var c, p;
	c = function(config){
		XPlate.Collection.CompositionComposite.call(this, config.limit || 5, config.composition || null);
		XPlate.Plate.call(this, config);
	};

	p = c.prototype = XPlate.apply( Object.create(XPlate.Collection.CompositionComposite.prototype), XPlate.Plate.prototype, true);

	p._initializeDOM = function(){
		var dom = document.createElement('div');
		dom.id = this.getId();
		return dom;
	};

	/**
	 *
	 * @param added
	 * @private
	 */
	p._handleAddedItems = function(added){
		var container = this._dom, i, el;

		var maxIndex = 0;
		for(i=0;i < added.length;i++){
			var itemIndex = this.items.indexOf(added[i]);
			if(maxIndex <= itemIndex){
				maxIndex = itemIndex;
			}
		}

		var ahead = this.items[maxIndex + 1];
		if(ahead){
			for(i=0;i < added.length;i++){
				el = added[i].dom;
				container.insertBefore(el, ahead.dom);
				added[i].setParent(this);
			}
		}else{
			for(i=0;i < added.length;i++){
				el = added[i].dom;
				container.appendChild(el);
				added[i].setParent(this);
			}
		}
	};

	p._handleRemovedItems = function(removed){
		var container = this._dom;
		for(var i=0;i < removed.length;i++){
			var item = removed[i];
			container.removeChild(item.dom);
			item.setParent(null);
		}
	};

	p._handleSort = function(fn){
		var container = this._dom, i, item;
		for(i=0;i < this.items.length;i++){
			item = this.items[i];
			container.appendChild(item.dom);
		}
		/**
		 * C - el_A
		 * A - el_B
		 * B - el_C
		 *
		 * C - el_C
		 * A - el_A
		 * B - el_B
		 *
		 */
	};


	return c;

})();
