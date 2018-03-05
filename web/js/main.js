/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 26.02.2018.
 */

var collection = new XPlate.Plate.XComposition({
	compositeSize: 5
});

collection.append( new XPlate.Plate() );
collection.append( new XPlate.Plate() );
collection.append( new XPlate.Plate() );
collection.append( new XPlate.Plate() );
collection.append( new XPlate.Plate() );
collection.append( new XPlate.Plate() );
collection.append( new XPlate.Plate() );
collection.append( new XPlate.Plate() );
collection.append( new XPlate.Plate() );


document.body.appendChild(collection.dom);
