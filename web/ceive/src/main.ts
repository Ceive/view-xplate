import { DOM } from "./util/DOM";
import { Template } from "./util/Template";

let tpl = new Template("" +
	"<div class='myclass'>" +
	"<i>{name}</i>" +
	"<p tpl-ph='paragraph'>Что здесь</p> " +
	"" +
	"</div>" +
	""
);

tpl.initializeTemplate();
tpl.appendTo(document.body);


window['tpl'] = tpl;

document.body.appendChild(DOM.create({
	tag: 'div',
	class: 'simple',
	text: 'Hello rebyata',
	listeners: {
		click: (e) => {
			alert('Меня кликнули');
		}
	}
}));