/**
 * @Creator Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Author: Alexey Kutuzov <lexus27.khv@gmai.com>
 * @Project: c4l-rebuild.local
 */
// TODO Не определенно поведение при клонировании, значения в cached placeholders_values не надежно если из вне ноды будут редактироваться
export class Template {

	/** Temporal HTML node element */
	protected tmp;
	/** Source template string  */
	protected sourceTemplate;
	/** Processed element line */
	protected processedElements = [];


	/** References to DOM elements */
	protected references 	= {};

  	/** DOM nested placeholders */
	protected holders 		= {};
	protected holdersOptions = {};

	/** Text placeholders */
	protected placeholders 			= {};
	protected placeholdersOptions 	= {};

	protected values = {};

	protected initializeListener;
	/** @type {Element}*/
	protected renderedTo: any;

	/**
	 *
	 * @param source
	 * @param initialize
	 */
	constructor(source?, initialize?: {(tpl:Template, tmpEl)} ){
		this.setSource(source,initialize);
	}

	/**
	 *
	 * @param source
	 * @param initialize
	 * @returns {Template}
	 */
	public setSource(source?, initialize?: {(tpl:Template, tmpEl)}){
		if(source)this.sourceTemplate = source instanceof Template?source.sourceTemplate:source;
		if(initialize)this.initializeListener = initialize;
		return this;
	}

	/**
	 *
	 * @returns {any}
	 */
	public clone(){
		let clone = Object.create(this);

		this.tmp = null;
		this.holders 	= {};
		this.references 		= {};
		this.placeholders 		= {};
		this.placeholdersOptions = {};

		let values = Object.create(this.values);

		for(let property of Object.getOwnPropertyNames(values)){
			let val = values[property];
			if(val instanceof Node){
				values[property] = val.cloneNode(true);
			}
		}

		clone.initializeTemplate();

		this.setProperties(values);

		return clone;
	}


	public setProperties(values){
		for(let property of Object.getOwnPropertyNames(values)){
			this.set(property, values[property]);
		}
		return this;
	}

	public set(placeholderName, value){

		if(this.holders.hasOwnProperty(placeholderName)){
			let element = this.holders[placeholderName];

			this.values[placeholderName] = value;

			this.setValueToElement(element, value);

			return;
		}


		if(this.placeholders.hasOwnProperty(placeholderName)){
			let node = this.placeholders[placeholderName];

			this.values[placeholderName] = value;

			this.setValueToNode(node, value);

			return;
		}

	}

	public get(placeholderName){
		return this.values[placeholderName];
	}

	/**
	 *
	 * @param reference
	 * if Function work as @see Template.eachProcessed
	 * if string work as in parent
	 * @param reversed
	 */
	public el(reference?: null | undefined | string | { (el) }, reversed = false) : any{

		if(reference instanceof Function){
			return this.eachProcessed(reference, reversed);
		}else if(reference === null || reference === undefined){
			return this.processedElements;
		}
		if(typeof reference === 'string'){
			if(this.holders.hasOwnProperty(reference)){
				return this.holders[reference];
			}

			if(this.references.hasOwnProperty(reference)){
				return this.references[reference];
			}
		}
		return null;
	}

	/**
	 *
	 * @param node
	 * @param value
	 */
	public setValueToNode(node, value){
		node.nodeValue = value.toString();
	}

	/**
	 *
	 * @param element
	 * @param value
	 */
	public setValueToElement(element, value){

		switch(true){
			case element instanceof HTMLTextAreaElement:
			case element instanceof HTMLInputElement:
			case element instanceof HTMLSelectElement:
				element.value = value.toString();
				break;

			case element instanceof HTMLImageElement:
				element.src = value.toString();
				break;

			default:

				if(value instanceof Node){
					element.innerHTML = '';
					element.appendChild(value);
				}else{
					element.innerHTML = value;
				}

				break;
		}
	}

	/**
	 *
	 * @returns {Template}
	 */
	initializeTemplate(){
		this.tmp = document.createElement('div');
		this.tmp.innerHTML = this.sourceTemplate;
		this.processedElements = this.processNodes(this.tmp.childNodes, this.tmp);

		if(this.initializeListener){
			this.initializeListener.call(this, this, this.tmp);
		}

		return this;
	}

	/**
	 *
	 * @param el
	 * @returns {Template}
	 */
	public renderTo(el){
		this.eachProcessed((itm) => {
			el.appendChild(itm);
		}).renderedTo = el;
		return this;
	}

	/**
	 *
	 * @param el
	 * @returns {Template}
	 */
	public appendTo(el){
		this.eachProcessed((itm) => {
			el.appendChild(itm);
		}).renderedTo = el;
		return this;
	}

	/**
	 *
	 * @param el
	 * @returns {Template}
	 */
	public prependTo(el){
		this.eachProcessed((itm) => {
			el.insertBefore(itm, el.firstChild);
		}).renderedTo = el;
		return this;
	}

	/**
	 *
	 * @param fn
	 * @param reverse
	 * @returns {Template}
	 */
	public eachProcessed(fn: { (el) }, reverse = false){
		if(!reverse){
			for(let itm of this.processedElements){
				fn(itm);
			}
		}else{
			for(let i = this.processedElements.length; i; i--){
				fn(this.processedElements[i]);
			}
		}

		return this;
	}

	/**
	 *
	 * @returns {Element}
	 */
	public firstProcessed(){
		return this.processedElements[0] || null;
	}

	/**
	 *
	 * @returns {Element}
	 */
	public lastProcessed(){
		return this.processedElements[this.processedElements.length-1] || null;
	}

	/**
	 *
	 * @param element
	 */
	process(element:Node|Element|HTMLElement|any){
		let attr = element.attributes;
		let placeholderName = attr.getNamedItem('tpl-ph');
		if(placeholderName && placeholderName.value){
			this.holders[placeholderName.value] = element;
			this.values[placeholderName.value] = null;
			attr.removeNamedItem('tpl-ph');
		}

		let referenceName = attr.getNamedItem('tpl-ref');
		if(referenceName && referenceName.value){
			this.references[referenceName.value] = element;
			attr.removeNamedItem('tpl-ref');
		}

		this.processNodes(element.childNodes, element);

	}

	/**
	 *
	 * @param nodes
	 * @param parent
	 * @returns {Array}
	 */
	processNodes(nodes, parent){
		let n = [];
		for(let node of nodes){
			switch(node.nodeType){
				case Node.ELEMENT_NODE:
					this.process(node);
					n.push(node);
					break;
				case Node.TEXT_NODE:
					let result = this.processText(node);
					if(result !== null){
						for(let itm of result){
							parent.insertBefore(itm, node);
							n.push(itm);
						}
						parent.removeChild(node);
					}else{
						n.push(node);
					}
					break;
			}
		}
		return n;
	}

	/**
	 *
	 * @param node
	 * @returns {NodeList|null}
	 */
	processText(node: Node){

		let left = '{';
		let right = '}';
		let placeholderPattern = '\\w+';

		left = this.escapeRegExp(left);
		right = this.escapeRegExp(right);

		// Я бы яблоко поел {count} штук
		let regExp = new RegExp('\\\\\\\\|\\\\'+left+'|'+left+'('+placeholderPattern+')'+right+'|([^'+left+']+)','gm');

		let result;

		let text = node.textContent;

		let expandNodes = [];
		let placeholders = [];
		while( (result = regExp.exec(text)) !== null){
			let start = result.index;

			if(result[0] === '\\\\'){
				expandNodes.push(document.createTextNode('\\'));
			}else if(result[0] === '\\'+left){
				expandNodes.push(document.createTextNode(left));
			}else if(result[2]){
				expandNodes.push(document.createTextNode(result[2]));
			}else{
				let phName = result[1];
				let phOpts = result[1];

				let phNode = document.createTextNode(result[1]);
				expandNodes.push(phNode);
				placeholders.push(phName);
				this.values[phName] = null;
				this.placeholders[phName] = phNode;
				this.placeholdersOptions[phName] = phOpts;
			}
		}

		if(placeholders){
			return expandNodes;
		}

		return null;
	}

	/**
	 *
	 * @param string
	 * @returns {string}
	 */
	public escapeRegExp(string){
		return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}


	/**
	 *
	 * @type {Array}
	 * @private
	 */
	protected _listeners = [];

	/**
	 *
	 * @param elKey
	 * @param eName
	 * @param fn
	 * @param useCapture
	 * @returns {Template}
	 */
	public addElListener(elKey, eName: string | { (el, e) }, fn: { (el, e) } | boolean, useCapture: boolean|undefined = true){

		if(eName instanceof Function){
			useCapture = fn !== false;
			let listener = (e: UIEvent) => {
				return eName(e.target, e);
			};

			this.el((element: HTMLElement) => {
				this._listeners.push([element, elKey, listener, useCapture]);
				element.addEventListener(elKey, listener, useCapture);
			});
		}else if(fn instanceof Function){
			let listener = (e: UIEvent) => {
				return fn(e.target, e);
			};

			let element: any = this.el(elKey);
			this._listeners.push([element, eName, listener, useCapture]);
			element.addEventListener(eName, listener, useCapture);
		}
		return this;
	}

	/**
	 *
	 * @returns {Template}
	 */
	public purgeElListeners(){
		for(let a of this._listeners){
			let el:HTMLElement = a[0];
			let eName = a[1];
			let listener:{ (e:UIEvent) } = a[2];
			let useCapture = a[3];
			el.removeEventListener(eName, listener, useCapture);
		}
		this._listeners = [];
		return this;
	}

}


