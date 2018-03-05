/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 02.03.2018.
 */

XPlate.Plate = (function(){

	var c, p;

	var plateIndex = 0;

	c = function(config){
		this.config = XPlate.apply({

			id: null,

			container: null

		},config);

		/**
		 *
		 * @type {number}
		 * @private
		 */
		this._plateIndex = plateIndex;
		c.plates.push(this);


		/**
		 *
		 * @type {int|null|string}
		 */
		this.id = this.config.id || this._plateIndex;

		/**
		 * @type {XPlate.Plate|null}
		 */
		this.parent = null;

		/**
		 * @type {HTMLElement|null}
		 */
		this._dom = null;


		plateIndex++;
	};

	c.plates = [];

	p = c.prototype = {

		/**
		 *
		 * @returns {int|null|string}
		 */
		getId: function(){
			return this.id;
		},


		/**
		 *
		 * @param parent
		 * @returns {XPlate.Plate}
		 */
		setParent: function(parent){
			var old = this.parent;
			this.parent = parent;

			this._onParentChange(old);
			return this;
		},

		/**
		 *
		 * @returns {*|XPlate.Plate|null}
		 */
		getParent: function(){
			return this.parent;
		},

		/**
		 *
		 * @returns {XPlate.Plate}
		 */
		render: function(){

			if(!this._dom){
				// render stage 1
				this._dom = this._initializeDOM();
			}

			return this;
		},

		/**
		 *
		 * @returns {*|Element|HTMLElement|null}
		 */
		getDOM: function(){
			return this.render()._dom;
		},

		/**
		 *
		 * @returns {*|HTMLElement|null|Element}
		 */
		get dom(){
			return this.render()._dom;
		},

		/**
		 *
		 * @returns {Element}
		 * @private
		 */
		_initializeDOM: function(){
			var dom = document.createElement('div');
			dom.innerHTML = '<i>Plate</i>';
			dom.id = this.getId();
			return dom;
		},
		/**
		 *
		 * @param old
		 * @private
		 */
		_onParentChange: function(old){

		}
	};

	return c;
})();