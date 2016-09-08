(function(angular) {

    'use strict';

    let mod = angular.module("kitsune", ["ngMaterial", "ui.router"]);

    let outOfDate;
    let checkDataSync;

    mod.run(($interval, $rootScope, kitsuneService) => {
        console.log("Hello Kitsune");

        checkDataSync = () => {
            console.log("Check Sync");

            let dataTimeP = kitsuneService.getDataTime();
            let syncTimeP = kitsuneService.getSyncTime();

            Promise.all([dataTimeP, syncTimeP]).then(([dataTime, syncTime]) => {
                let mDataTime = moment(dataTime, "x");
                let mSyncTime = moment(syncTime, "x");

                if(syncTime > dataTime)
                    outOfDate = null; // Up to date
                else
                    outOfDate = mSyncTime.from(mDataTime, true);

                $rootScope.$digest();
            });
        };
        checkDataSync();

        window.onfocus = checkDataSync;
    });

    mod.controller("kitsune", function($stateParams, $rootScope, kitsuneService) {

        this.node = $stateParams.id;

        this.getOutOfDate = () => outOfDate;

        this.log = (msg) => console.log(msg);
        this.save = () => kitsuneService.save().then(() => console.log("Saved!"));
        this.load = () => kitsuneService.load().then(() => {
            checkDataSync();
            $rootScope.$broadcast("refresh-node-details");
            console.log("Load")
        });
    });

    mod.component("nodeName", {
        template: "<span ng-class='vm.name ? \"name\" : \"\"'>{{ vm.name || vm.id }}</span>",
        controller: function(kitsuneService, $scope, $attrs) {
            let ctrl = this;
            let getName = function(value) {
                return kitsuneService.listNames(value).then(x => x[0]);
            };
            $scope.$watch(() => ctrl.node, function(val) {
                ctrl.id = _.truncate(val, {
                    length: 9,
                    omission: '*'
                });
                getName(val).then(_.mountP(ctrl, "name"));
            });
        },
        controllerAs: "vm",
        bindings: { node: "<" }
    });

    mod.component("nodeButton", {
        templateUrl: 'templates/node-button.html',
        controller: function(kitsuneService) {
            let ctrl = this;
            kitsuneService.describeNode(ctrl.node).then(_.mountP(ctrl, "desc"));
        },
        controllerAs: "vm",
        bindings: { node: "<" }
    });

    let showEdges = true;
    mod.component("nodeDetails", {
        templateUrl: "templates/node-details.html",
        controller: function(kitsuneService, $scope) {
            let ctrl = this;

            ctrl.showEdges = showEdges;
            $scope.$watch("vm.showEdges", (value) => {
                showEdges = value;
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

    mod.filter("desc", function() {
        return value => value ? _.map(value, v => "t"+v).join(" ") : null;
    });

    mod.filter("type", function() {
        return value => typeof value;
    });

    mod.filter("contains", function() {
        return (input, value) => input ? input.includes(value) : null;
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
