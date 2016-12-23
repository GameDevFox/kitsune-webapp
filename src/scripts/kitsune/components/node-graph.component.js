(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    function getNodes(edges) {
        let ids = edges.map(v => v.id);
        let heads = edges.map(v => v.head);
        let tails = edges.map(v => v.tail);

        let nodes = _.uniq(_.concat(ids, heads, tails));
        return nodes;
    }

    function buildCyNodes(nodes) {
        var cNodes = _.map(nodes, (node) => ({ data: { id: node, label: node.substring(0, 7) } }) );
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

    mod.component("nodeGraph", {
        templateUrl: 'templates/node-graph.html',
        controller: function($scope, kitsuneService) {
            $scope.showGraph = true;

            let cytoConfig = {
                style: [
                    { selector: "node",
                        style: {"label": "data(label)"}},
                    { selector: "edge",
                        style: {
                            "width": "10px",
                            "target-arrow-shape": "triangle",
                            "target-arrow-color": "data(color)",
                            "line-color": "data(color)"
                        }
                    }
                ],
                layout: { name: "cose" },

                minZoom: 0.1,
                maxZoom: 3,
                wheelSensitivity: 0.1,

                hideEdgesOnViewport: false
            };
            let graphContainer = $(".g .graph")[0];
            cytoConfig.container = graphContainer;

            let cy;
            kitsuneService
                .getTails("7f82d45a6ffb5c345f84237a621de35dd8b7b0e3")
                .then(edges => {
                    let nodes = getNodes(edges);
                    let cNodes = buildCyNodes(nodes);
                    let cEdges = buildCyEdges(edges);
                    cytoConfig.elements = { nodes: cNodes, edges: cEdges };

                    cy = cytoscape(cytoConfig);

                    _.each(edges, function(edge) {
                        cy.nodes("#"+edge.id).style("background-color", "#00ff00");
                    });
                })
                .then(() => kitsuneService.listStrings())
                .then(strings => { // stringFind
                    _.each(strings, function(string) {
                        var node = cy.nodes("#"+string.id);
                        node.style("background-color", "#ffff00").data({ label: _.truncate(string.string) });
                    });
                });
        },
        controllerAs: "vm",
        bindings: { node: "<" }
    });

})(angular);
