"use strict";

let serviceUrl = "http://localhost:8080/api";
let views;

let loadViewData = $.get("/data/views.json")
	.then((data) => { views = data; })
	.then(init);

function init() {
	console.log("Hello Kitsune Webapp");

	let container = $(".g");
	let graphBox = container.find(".graph")[0];
	let listBox = container.find(".list");

	// graphFind
	post("a1e815356dceab7fded042f3032925489407c93e", {
		tail: "d2cd5a6f99428baaa05394cf1fe3afa17fb59aff"
	}).then(edges => {
		let nodes = getNodes(edges);
		let cNodes = buildCyNodes(nodes);
		let cEdges = buildCyEdges(edges);

		cytoConfig.container = graphBox;
		cytoConfig.elements = { nodes: cNodes, edges: cEdges };

		let cy = cytoscape(cytoConfig);

		_.each(edges, function(edge) {
			cy.nodes("#"+edge.id).style("background-color", "#00ff00");
		});

		$.get(`${serviceUrl}/8b1f2122a8c08b5c1314b3f42a9f462e35db05f7`).then(strings => { // stringFind
			_.each(strings, function(string) {
				var node = cy.nodes("#"+string.id);
				node.style("background-color", "#ffff00").data({ label: _.truncate(string.string) });
			});
		});

		renderNodes(listBox, nodes);
	});
}

function renderNodes(container, nodes) {

	_.each(nodes, (node) => {
		let v = createVue("nodeView", {
			node: node,
			names: null,
			types: [],
			heads: null,
			tails: null,
			string: null
		});
		container.append(v.$el);

		post("890b0b96d7d239e2f246ec03b00cb4e8e06ca2c3", node)
			.then(data => v.names = data); // getNames
		post("15b16d6f586760a181f017d264c4808dc0f8bd06", node)
			.then(data => { v.types = data }); // getTypes
		post("a1e815356dceab7fded042f3032925489407c93e", { tail: node })
			.then(data => v.heads = _.map(data, node => node.head)); // getHeads
		post("a1e815356dceab7fded042f3032925489407c93e", { head: node })
			.then(data => v.tails = _.map(data, node => node.tail)); // getTails
		post("8b1f2122a8c08b5c1314b3f42a9f462e35db05f7", { id: node })
			.then(data => { v.string = data.length == 1 ? data[0].string : null; }) // getStrings
	});
}

function getNodes(edges) {
	let ids = edges.map(v => v.id);
	let heads = edges.map(v => v.head);
	let tails = edges.map(v => v.tail);

	let nodes = _.uniq(_.concat(ids, heads, tails));
	return nodes;
}

function buildCyNodes(nodes) {
	var cNodes = _.map(nodes, (node) => {
		return { data: { id: node, label: node.substring(0, 7) } };
	});
	return cNodes;
}

function buildCyEdges(edges) {
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

	return cEdges;
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

function post(path, data) {
	let url = `${serviceUrl}/${path}`;
	let options = {
		method: "POST",
		contentType: "text/plain"
	};

	if(data)
		options.data = JSON.stringify(data);

	return $.ajax(url, options);
};

let cytoConfig = {
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

	hideEdgesOnViewport: false
};
