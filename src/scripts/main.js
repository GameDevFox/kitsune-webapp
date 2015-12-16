"use strict";

let serviceUrl = "http://localhost:8081";
let views;

let ready = new Promise((res, rej) => {
	$(res);
});

let loadViewData = $.get("/data/views.json").then((data) => {
	views = data;
});

Promise.all([ready, loadViewData]).then(() => {
	console.log("Hello Kitsune Webapp");

	let container = $(".container");

	$.get(`${serviceUrl}/nodes`).then((nodes) => {
		_.each(nodes, (node) => {
			let v = createVue("nodeView", {
				node: node,
				names: null,
				heads: null,
				tails: null
			});
			container.append(v.$el);
			
			$.get(`${serviceUrl}/nodes/${node}/names`).then((names) => { v.names = names; });
			$.get(`${serviceUrl}/nodes/${node}/heads`).then((heads) => { v.heads = heads; });
			$.get(`${serviceUrl}/nodes/${node}/tails`).then((tails) => { v.tails = tails; });
		});
	});	
});

function createVue(viewName, data) {
	let viewMarkup = views[viewName];
	let el = $(viewMarkup);
	el.addClass("ki-"+viewName);
	let v = new Vue({
		el: el[0],
		data: data
	});
	return v;
}
