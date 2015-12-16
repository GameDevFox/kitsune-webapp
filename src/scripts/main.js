"use strict";

var ready = new Promise((res, rej) => {
	$(res);
});

ready.then(() => {
	console.log("Hello Kitsune Webapp");

	var container = $(".container");
	container.append("<pre>What up?</pre>");

	$.get("http://localhost:8081/nodes").then((nodes) => {
		_.each(nodes, (node) => {
			var el = $(`<div class="well well-sm">{{ node }}</div>`)
			var v = new Vue({
				el: el[0],
				data: {
					node: node
				}
			});
			container.append(v.$el);
		});
	});	
});

function createVue(viewName, data) {
	
}