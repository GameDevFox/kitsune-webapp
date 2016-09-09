(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("nodeDetails", {
        templateUrl: "templates/node-details.html",
        controller: function(kitsuneService, $scope) {
            let ctrl = this;

            ctrl.showEdges = true;
            $scope.$on("show-edges", function(e, value) {
                console.log("Hello");
                ctrl.showEdges = value;
            });

            ctrl.loadNames = () => {
                kitsuneService.listNames(ctrl.node).then(_.mountP(ctrl, "nameList"));
            };

            ctrl.addName = () => {
                kitsuneService.name(ctrl.node, ctrl.newName).then(ctrl.loadNames);
                ctrl.newName = null;
            };
            ctrl.removeName = name => {
                kitsuneService.unname(ctrl.node, name).then(ctrl.loadNames);
            };

            ctrl.addHead = () => {
                kitsuneService.addEdge(ctrl.newHead, ctrl.node).then(ctrl.load);
                ctrl.newHead = null;
            };
            ctrl.addTail = () => {
                kitsuneService.addEdge(ctrl.node, ctrl.newTail).then(ctrl.load);
                ctrl.newTail = null;
            };
            ctrl.removeEdge = edge => {
                kitsuneService.removeEdge(edge).then(ctrl.load);
            };
            ctrl.mkid = prop => {
                kitsuneService.mkid().then(_.mountP(ctrl, prop));
            };

            ctrl.load = () => {
                let node = ctrl.node;

                ctrl.tailTypes = {};

                ctrl.loadNames();
                kitsuneService.getHeads(ctrl.node).then(_.mountP(ctrl, "heads"));
                kitsuneService.getTails(ctrl.node).then(_.mountP(ctrl, "tails")).then(tails => {
                    tails.forEach(tail => {
                        kitsuneService.factor({ head: tail.head, tail: tail.tail }).then(types => {
                            let typeNodes = types.map(type => type.type);
                            ctrl.tailTypes[tail.tail] = typeNodes;
                        });
                    });
                });
                kitsuneService.describeNode(ctrl.node).then(_.mountP(ctrl, "nodeDesc")).then(nodeDesc => {
                    if(nodeDesc.includes('20bfa138672de625230eef7faebe0e10ba6a49d0')) // is-edge
                        kitsuneService.readEdge(ctrl.node).then(_.mountP(ctrl, "edge"));
                    if(nodeDesc.includes('821f1f34a4998adf0f1efd9b772b57efef71a070')) // is-string
                        kitsuneService.getStringValue(ctrl.node).then(_.mountP(ctrl, "stringValue"));
                });
            };

            $scope.$watch(() => { ctrl.node }, ctrl.load);
            $scope.$on("refresh-node-details", ctrl.load);
        },
        controllerAs: "vm",
        bindings: { node: "<" }
    });

})(angular);
