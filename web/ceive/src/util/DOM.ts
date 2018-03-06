
export interface ElementConfig{

	[key: string]: any;

	tag: string;


	id?: string | null;

	name?: string | null;

	class?: any | string[] | string | null;

	style?: any | {[key: string]: string} | string | null;


	attributes?: {[key: string]: string};

	data?: {[key: string]: string};

	listeners?: {
		[eventName: string]: { (event: UIEvent) }
			| [ {(event: UIEvent)}, boolean]
			| Array <
				{ (event: UIEvent) } | [ {(event: UIEvent)}, boolean]
			>
	};

	text?: string | null;
	html?: string | null;
	children?: string | ElementConfig[]

}

/**
 *
 *	 DOM.create({
 *		tag: 'div',
 *		style: {
 *			background: 'gray'
 *		},
 *		attributes: {
 *			id: 'have',
 *			class: 'item'
 *		},
 *		listeners: {
 *			click: (e) => {
 *
 *			}
 *		}
 *	});
 *	*/
export class DOM {

	protected static _tmp;

	static create(config: any, append: any[] = null, configure:ElementConfig = null){
		if(typeof config === 'string'){
			return DOM.createFromString(config)
		}else if(typeof config === 'object'){
			if(config instanceof Node){
				if(configure){
					config = DOM.configureEl(config, configure);
				}
				if(append){

					for(let o of append){
						config.appendChild(this.create(o));
					}
				}

				return config;
			}
			return DOM.createFromConfig(config)
		}
		return config;
	}

	static get tmp(){
		if(!DOM._tmp){
			DOM._tmp = document.createElement('div');
		}
		return DOM._tmp;
	}

	static createFromString(string){
		DOM.tmp.innerHTML
	}

	/**
	 *
	 * @param object
	 * @returns
	 */
	static createFromConfig(object: ElementConfig): Element{


		let el:any = document.createElement(object.tag || 'div');

		return DOM.configureEl(el, object);

	}

	static configureEl(el, object: ElementConfig){

		if(object.id){
			el.setAttribute('id', object.id);
		}
		if(object.name){
			el.setAttribute('name', object.name);
		}
		if(object.data){
			for(let dataKey of Object.getOwnPropertyNames(object.data)){
				el.setAttribute('data-'+DOM.uncamelize(dataKey, '-'), object.data[dataKey]);
			}
		}

		if(object.class){

			if(object.class instanceof Array){
				for(let cls of object.class){
					el.classList.add(cls);
				}
			}else{
				el.setAttribute('class', object.class);
			}
		}

		if(object.style){
			if(typeof object.style === 'string'){
				el.setAttribute('style', object.style);
			}
			if(object.style instanceof Object){
				for(let styleName of Object.getOwnPropertyNames(object.style)){
					el.style[styleName] = object.style[styleName];
				}
			}
		}

		if(object.attributes){
			if(typeof object.attributes === 'string'){

			}
			if(object.attributes instanceof Object){
				for(let attributeName of Object.getOwnPropertyNames(object.attributes)){
					el.setAttribute(DOM.uncamelize(attributeName, '-'), object.attributes[attributeName]);
				}
			}
		}

		if(object.listeners){
			if(object.listeners instanceof Object){
				for(let eventKey of Object.getOwnPropertyNames(object.listeners)){
					let listener = object.listeners[eventKey];
					if(listener instanceof Array){
						if(listener[0]){
							el.addEventListener(eventKey, listener[0], listener[1] || true);
						}
					}else if(listener){
						el.addEventListener(eventKey, listener);
					}
				}
			}
		}

		if(object.children){

			if(typeof object.children === 'string'){
				el.innerHTML = object.children;
			}else{
				for(let child of object.children){
					child = DOM.create(child);
					if(child){
						el.appendChild(child);
					}
				}
			}

		}else if(object.html){
			el.innerHTML = object.html;
		}else if(object.text){
			el.innerText = object.text;
		}

		return el;
	}

	/**
	 * Decamelizes a string with/without a custom separator (underscore by default).
	 *
	 * @param str String in camelcase
	 * @param separator Separator for the new decamelized string.
	 */
	static uncamelize(str, separator){
		separator = typeof separator === 'undefined' ? '_' : separator;

		return str
			.replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
			.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
			.toLowerCase();
	}

	/**
	 * Camelize a string, cutting the string by multiple separators like
	 * hyphens, underscores and spaces.
	 *
	 * @param {string} text to camelize
	 * @return string Camelized text
	 */
	static camelize(text) {
		return text.replace(/^([A-Z])|[\s\-_]+(\w)/g, function(match, p1, p2, offset) {
			if (p2) return p2.toUpperCase();
			return p1.toLowerCase();
		});
	}
}