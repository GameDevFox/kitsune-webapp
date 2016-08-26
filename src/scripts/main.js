"use strict";

let serviceUrl = "http://localhost:8080/api";
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

	let data = JSON.stringify({ head: "7f82d45a6ffb5c345f84237a621de35dd8b7b0e3" });
	console.log("D", data);

	Promise.all([
		$.ajax(`${serviceUrl}/a1e815356dceab7fded042f3032925489407c93e`, {
			method: "POST",
			contentType: "text/plain",
			data: data
		}), //$.get(`${serviceUrl}/edges`),
		$.get(`${serviceUrl}/8b1f2122a8c08b5c1314b3f42a9f462e35db05f7`) //$.get(`${serviceUrl}/strings`)
	]).then(([edges, strings]) => {
		let ids = edges.map(v => v.id);
		let heads = edges.map(v => v.head);
		let tails = edges.map(v => v.tail);
		let nodes = _.uniq(_.concat(ids, heads, tails));

		console.log("EL", edges.length);

		var cNodes = _.map(nodes, (node) => {
			return {
				data: {
					id: node,
					label: node.substring(0, 7)
				}
			}
		});

		var cEdges = _(edges).map((edge) => {
			var head = {
				data: { id: "HEAD"+edge.id, source: edge.head, target: edge.id, color: "red" }
			};
			var tail = {
				data: { id: "tail"+edge.id, source: edge.id, target: edge.tail, color: "blue" }
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

			minZoom: 0.1,
			maxZoom: 3,
			wheelSensitivity: 0.1,

			hideEdgesOnViewport: false,
		});

		_.each(edges, function(edge) {
			cy.nodes("#"+edge.id).style("background-color", "#00ff00");
		});

		_.each(strings, function(string) {
			var node = cy.nodes("#"+string.id)
			node.style("background-color", "#ffff00").data({ label: _.trunc(string.string) });
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
