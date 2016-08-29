console.log("Hello Kitsune");

let mod = angular.module("kitsune", ["ngMaterial", "ui.router"]);

mod.controller("kitsune", function($stateParams, kitsuneService) {

    this.node = $stateParams.id;

    this.log = (msg) => console.log(msg);
    this.save = () => kitsuneService.save().then(() => console.log("Saved!"));
    // let nodeId = "7f82d45a6ffb5c345f84237a621de35dd8b7b0e3";
});

mod.factory("kitsuneService", function($http, kitsuneUrl) {

    let post = function(funcId, data) {
        let request = { method: "POST", url: kitsuneUrl+"api/"+ funcId, headers: {
            'Content-Type': 'text/plain'
        }};

        if(data)
            request.data = data;

        return $http(request).then(function(result) {
            return result;
        });
    };

    let mkCall = function(funcId, data) {
        return post(funcId, JSON.stringify(data)).then(res => res.data);
    };

    let service = {
        mkid: () => mkCall("bf565ae1309f425b0ab00efa2ba541ae03ad22cf"),
        name: (node, name) => mkCall("2885e34819b8a2f043b139bd92b96e484efd6217", { node, name }),
        unname: (node, name) => mkCall("708f17af0e4f537757cf8817cbca4ed016b7bb8b", { node, name }),
        listGroup: (groupId) => mkCall("a8a338d08b0ef7e532cbc343ba1e4314608024b2", groupId),
        listNames: (nodeId) => mkCall("890b0b96d7d239e2f246ec03b00cb4e8e06ca2c3", nodeId),
        getStringValue: (nodeId) => mkCall("08f8db63b1843f7dea016e488bd547555f345c59", nodeId),
        describeNode: (nodeId) => mkCall("15b16d6f586760a181f017d264c4808dc0f8bd06", nodeId),
        save: () => $http({ method: "GET", url: "/api/save" }),

        log: (msg) =>  { console.log(msg); }
    };
    return service;
});

mod.controller("NodeCtrl", function($scope, $attrs) {
    let ctrl = this;
    $attrs.$observe("node", function(value) {
        ctrl.id = value;
    });
});

mod.component("nodeButton", {
    templateUrl: 'templates/node-button.html',
    controllerAs: "vm",
    bindings: { node: "<" }
});

mod.component("nodeName", {
    template: "{{ $ctrl.name }}",
    controller: function(kitsuneService, $scope) {
        let ctrl = this;
        let getName = function(value) {
            return kitsuneService.listNames(value).then(x => x[0]);
        };
        $scope.$watch(() => ctrl.node, function(val) {
            getName(val).then(name => {
                ctrl.name = name ? name : val;
            });
        });
    },
    bindings: { node: "<" }
});

mod.component("nodeDetails", {
    templateUrl: "templates/node-details.html",
    controller: function(kitsuneService, $scope) {
        let ctrl = this;

        ctrl.loadNames = () => {
            kitsuneService.listNames(ctrl.node).then(r => ctrl.nameList = r);
        };
        ctrl.addName = () => {
            kitsuneService.name(ctrl.node, ctrl.newName).then(ctrl.loadNames);
            ctrl.newName = null;
        };
        ctrl.removeName = name => {
            kitsuneService.unname(ctrl.node, name).then(ctrl.loadNames);
        };

        $scope.$watch(() => { ctrl.node }, () => {
            let node = ctrl.node;

            kitsuneService.describeNode(ctrl.node).then(nodeDesc => {
                ctrl.nodeDesc = nodeDesc;
                if(nodeDesc.includes('821f1f34a4998adf0f1efd9b772b57efef71a070'))
                    kitsuneService.getStringValue(ctrl.node).then(r => ctrl.stringValue = r);
            });
            kitsuneService.listGroup(ctrl.node).then(r => ctrl.groupList = r);
            ctrl.loadNames();
        });
    },
    controllerAs: "$ctrl",
    bindings: { node: "<" }
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
