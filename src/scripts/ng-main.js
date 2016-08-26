console.log("Hello Kitsune");

let mod = angular.module("kitsune", ["ngMaterial", "ui.router"]);

mod.run(function(kitsuneService, $state) {
    // $state.go("node-view", { id: '7f82d45a6ffb5c345f84237a621de35dd8b7b0e3' });
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
        describeNode: (nodeId) => mkCall("15b16d6f586760a181f017d264c4808dc0f8bd06", nodeId),
        save: () => $http({ method: "GET", url: "/api/save" }),

        log: (msg) =>  { console.log(msg); }
    };
    return service;
});

mod.controller("kitsune", function(kitsuneService) {
    this.log = (msg) => console.log(msg);
    this.addName = (node, name) => kitsuneService.name(node, name).then(() => console.log("Named!"));
    this.removeName = (node, name) => kitsuneService.unname(node, name).then(() => console.log("Unnamed!"));
    this.save = () => kitsuneService.save().then(() => console.log("Saved!"));
    // let nodeId = "7f82d45a6ffb5c345f84237a621de35dd8b7b0e3";
});

mod.component("nodeButton", {
    templateUrl: 'templates/node-button.html',
    bindings: {
        nodeId: "<"
    }
});

mod.component("nodeName", {
    template: "{{ $ctrl.name }}",
    controller: function(kitsuneService, $scope) {
        let ctrl = this;
        let getName = function(value) {
            return kitsuneService.listNames(value).then(x => x[0]);
        };
        $scope.$watch(function() {
            return ctrl.nodeId;
        }, function(val) {
            getName(val).then(name => {
                ctrl.name = name ? name : val;
            });
        });
    },
    bindings: {
        nodeId: "<"
    }
});

mod.component("nodeDetails", {
    templateUrl: "templates/node-details.html",
    controller: function(kitsuneService, $scope) {
        $scope.$watch(() => { this.nodeId }, () => {
            kitsuneService.describeNode(this.nodeId).then(r => {
                this.nodeDesc = r;
            });
            kitsuneService.listGroup(this.nodeId).then(r => {
                this.groupList = r;
            });
        });
    },
    controllerAs: "$ctrl",
    bindings: {
        nodeId: "<"
    }
});

mod.component("nodeGroup", {
    template: '<node-button ng-repeat="id in vm.group" node-id="id"></node-button>',
    controller: function(kitsuneService) {
        let ctrl = this;
        kitsuneService.listGroup(ctrl.nodeId).then(group => ctrl.group = group);
    },
    controllerAs: "vm",
    bindings: {
        nodeId: "<"
    }
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
        template: '<node-details ng-if="vm.id" node-id="vm.id"></node-details>',
        controller: function($stateParams) {
            this.id = $stateParams.id;
        },
        controllerAs: "vm"
    });
});
