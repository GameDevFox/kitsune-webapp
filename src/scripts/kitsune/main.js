(function(angular) {

    'use strict';

    let mod = angular.module("kitsune", ["ngMaterial", "ui.router"]);

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

                ctrl.loadNames();
                kitsuneService.getHeads(ctrl.node).then(_.mountP(ctrl, "heads"));
                kitsuneService.getTails(ctrl.node).then(_.mountP(ctrl, "tails"));
                kitsuneService.describeNode(ctrl.node).then(nodeDesc => {
                    ctrl.nodeDesc = nodeDesc;
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

    // CONFIG //
    mod.constant("kitsuneUrl", "http://localhost:8080/");

    mod.config(function($mdThemingProvider, $urlRouterProvider, $stateProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('blue')
            .accentPalette('red');

        $urlRouterProvider.otherwise('/node/7f82d45a6ffb5c345f84237a621de35dd8b7b0e3');

        $stateProvider.state('node-view', {
            url: "/node/:id",
            templateUrl: 'templates/main.html',
            controller: "kitsune as vm"
        });
    });

})(angular);
