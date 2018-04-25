/*
   Returns property value, where property name is given as path.

   Example:

       getPropertyValue("x.y.z", { x: { y: { z: 123 } } }); // returns 123
*/

this.getPropertyValue = function(propertyName, obj) {
	var props = propertyName.split(".");
	var res = obj;
	for(var i = 0; i < props.length; i++) {
		res = res[props[i]];
		if(typeof res == "undefined") {
			return res;
		}
	}
	return res;
};


/* 
   converts properties in format { "x.y": "z" } to { x: { y: "z" } }
*/

this.deepen = function(o) {
	var oo = {}, t, parts, part;
	for (var k in o) {
		t = oo;
		parts = k.split('.');
		var key = parts.pop();
		while (parts.length) {
			part = parts.shift();
			t = t[part] = t[part] || {};
		}
		t[key] = o[k];
	}
	return oo;
};

/*
	Function converts array of objects to csv, tsv or json string

	exportFields: list of object keys to export (array of strings)
	fileType: can be "json", "csv", "tsv" (string)
*/

this.exportArrayOfObjects = function(data, exportFields, fileType) {
	data = data || [];
	fileType = fileType || "csv";
	exportFields = exportFields || [];

	var str = "";
	// export to JSON
	if(fileType == "json") {

		var tmp = [];
		_.each(data, function(doc) {
			var obj = {};
			_.each(exportFields, function(field) {
				obj[field] = doc[field];
			});
			tmp.push(obj);
		});

		str = JSON.stringify(tmp);
	}

	// export to CSV or TSV
	if(fileType == "csv" || fileType == "tsv") {
		var columnSeparator = "";
		if(fileType == "csv") {
			columnSeparator = ",";
		}
		if(fileType == "tsv") {
			// "\t" object literal does not transpile correctly to coffeesctipt
			columnSeparator = String.fromCharCode(9);
		}

		_.each(exportFields, function(field, i) {
			if(i > 0) {
				str = str + columnSeparator;
			}
			str = str + "\"" + field + "\"";
		});
		//\r does not transpile correctly to coffeescript
		str = str + String.fromCharCode(13) + "\n";

		_.each(data, function(doc) {
			_.each(exportFields, function(field, i) {
				if(i > 0) {
					str = str + columnSeparator;
				}

				var value = getPropertyValue(field, doc) + "";
				value = value.replace(/"/g, '""');
				if(typeof(value) == "undefined")
					str = str + "\"\"";
				else
					str = str + "\"" + value + "\"";
			});
			//\r does not transpile correctly to coffeescript
			str = str + String.fromCharCode(13) + "\n";
		});
	}

	return str;
};


this.mergeObjects = function(target, source) {

	/* Merges two (or more) objects,
	giving the last one precedence */

	if(typeof target !== "object") {
		target = {};
	}

	for(var property in source) {

		if(source.hasOwnProperty(property)) {

			var sourceProperty = source[ property ];

			if(typeof sourceProperty === 'object') {
				target[property] = mergeObjects(target[property], sourceProperty);
				continue;
			}

			target[property] = sourceProperty;
		}
	}

	for(var a = 2, l = arguments.length; a < l; a++) {
		mergeObjects(target, arguments[a]);
	}

	return target;
};
