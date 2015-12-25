"use strict";

let serviceUrl = "http://localhost:8081";
let views;

let ready = new Promise((res, rej) => {
	$(res);
});

let loadViewData = $.get("/data/views.json").then((data) => {
	views = data;
});

let cy;

Promise.all([ready, loadViewData]).then(() => {
	console.log("Hello Kitsune Webapp");

	let container = $(".container");
	let graphBox = container.find(".graph")[0];
	let listBox = container.find(".list");

	Promise.all([
		$.get(`${serviceUrl}/nodes`),
		$.get(`${serviceUrl}/rels`),
		$.get(`${serviceUrl}/strings`)
	]).then(([nodes, rels, strings]) => {
		var cNodes = _.map(nodes, (node) => {
			return {
				data: {
					id: node,
					label: node.substring(0, 4)
				}
			}
		});

		var cEdges = _(rels).map((rel) => {
			var head = {
				data: { id: "HEAD"+rel.id, source: rel.head, target: rel.id, color: "red" }
			};
			var tail = {
				data: { id: "tail"+rel.id, source: rel.id, target: rel.tail, color: "blue" }
			};
			var cEdge = [head, tail];
			return cEdge;
		}).flatten().value();

		cy = cytoscape({
			container: graphBox,
			elements: {
				nodes: cNodes,
				edges: cEdges
			},
			style: [
				{
					selector: "node",
					style: {
						"label": "data(label)"
					}
				},
				{
					selector: "edge",
					style: {
						"width": "10px",
						"target-arrow-shape": "triangle",
						"target-arrow-color": "data(color)",
						"line-color": "data(color)"
					}
				}
			],
			layout: {
				name: "cose"
			},
			hideEdgesOnViewport: false,
		});

		_.each(rels, function(rel) {
			cy.nodes("#"+rel.id).style("background-color", "#00ff00");
		});

		_.each(strings, function(string) {
			var node = cy.nodes("#"+string.id)
			node.style("background-color", "#ffff00").data({ label: string.string });
		});
	});

	renderNodes(listBox);
});

function renderNodes(container) {
	$.get(`${serviceUrl}/points`).then((nodes) => {
		_.each(nodes, (node) => {
			let v = createVue("nodeView", {
				node: node,
				names: null,
				types: null,
				heads: null,
				tails: null,
				string: null
			});
			container.append(v.$el);

			$.get(`${serviceUrl}/nodes/${node}/types`).then((types) => { v.types = types; });
			$.get(`${serviceUrl}/nodes/${node}/names`).then((names) => { v.names = names; });
			$.get(`${serviceUrl}/nodes/${node}/heads`).then((heads) => { v.heads = heads; });
			$.get(`${serviceUrl}/nodes/${node}/tails`).then((tails) => { v.tails = tails; });
			$.get(`${serviceUrl}/strings/${node}`).then((string) => { v.string = string; });
		});
	});
}

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
