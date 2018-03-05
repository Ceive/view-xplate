/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 02.03.2018.
 */
/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 27.02.2018.
 */
window.XPlate = window.XPlate || {

	apply: function(a,b, safeDescriptors){
		if(safeDescriptors){
			for(var p in b){
				if(b.hasOwnProperty(p)){
					var descriptor = Object.getOwnPropertyDescriptor(b, p);
					Object.defineProperty(a, p, descriptor);
				}
			}
			return a;
		}else{
			for(var p in b){
				if(b.hasOwnProperty(p)){
					a[p] = b[p];
				}
			}
			return a;
		}
	},

	applyIf: function(a,b){
		for(var p in b){
			if(b.hasOwnProperty(p) && typeof a[p] === 'undefined'){
				a[p] = b[p];
			}
		}
		return a;
	},


};