/// reference
class XPlate{

	public parent;

	public renderTo;

	public el;

	public items = [];

	public getParent(){
		return this.parent;
	}


	public getEl(){

		if(!this._dom){
			this._dom = this._processEl();
		}
		return this._dom;
	}

	public _processEl(){
		return document.createElement('section');
	}

	/**
	 *
	 * @returns {any}
	 */
	public render(){
		if(!this._dom){
			let el, parentEl;

			el = this.processElement();

			if(!this.parent){
				parentEl = this.renderTo;
			}else{
				this.parent.render();
				parentEl = this.parent.getDOM();
			}

			this._dom = el;

			parentEl.appendChild(el);
		}
		return this._dom;
	}

	/**
	 *
	 * @param parent
	 * @param appliedInNew
	 * @param appliedInOld
	 * @returns {XPlate}
	 */
	public setParent(parent = null, appliedInNew = false, appliedInOld = false){
		let old = this.parent;
		if(old !== parent){

			this.parent = parent;

			if(!appliedInOld && old){
				old.remove(this, true);
			}

			if(!appliedInNew && parent){
				parent.add(this);
			}
		}
		return this;
	}

	/**
	 *
	 * @param item
	 * @param appliedIn
	 */
	public remove(item, appliedIn = false){
		let index = this.items.indexOf(item);
		if(index>=0){
			this.items.splice(index,1);
		}
		if(!appliedIn){
			item.setParent(null, true);
		}
		return this;
	}

	/**
	 *
	 * @param item
	 * @param appliedIn
	 * @returns {XPlate}
	 */
	public append(item, appliedIn = false){
		this.splice(null,null, item, false, appliedIn);
		return this;
	}

	/**
	 *
	 * @param item
	 * @param appliedIn
	 * @returns {XPlate}
	 */
	public prepend(item, appliedIn = false){
		this.splice(0,null, item, false, appliedIn);
		return this;
	}

	/**
	 *
	 * @param start
	 * @param len
	 * @param items
	 * @param appliedInOld
	 * @param appliedInNew
	 */
	public splice(start = null, len = null, items = null, appliedInOld = false, appliedInNew = false){

		let removedItems = this.items.splice(start?start:this.items.length, len?len:0 , items?items:[]);
		if(!appliedInOld){
			for(let i =0;i < removedItems.length;i++){
				removedItems[i].setParent(null, true, true);
				this._onItemRemove(removedItems[i]);
			}
		}
		if(!appliedInNew){
			for(let i =0;i < items.length;i++){
				items[i].setParent(this, true, false);
				this._onItemAdd(items[i]);
			}
		}
		return removedItems;
	}


	public _onItemRemove(removedItem: XPlate) {




	}

	public _onItemAdd(item: XPlate) {

	}

}