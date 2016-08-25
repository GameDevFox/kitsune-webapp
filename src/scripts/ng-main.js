console.log("Hello Kitsune");

let mod = angular.module("kitsune", ["ngMaterial", "ui.router"]);

mod.run(function(kitsuneService) {
    kitsuneService.describeNode("7f82d45a6ffb5c345f84237a621de35dd8b7b0e3").then(id => console.log("describeNode", id));
});

mod.constant("kitsuneUrl", "http://localhost:8080/");

mod.config(function($mdThemingProvider, $stateProvider) {
    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        .accentPalette('red');

    $stateProvider.state('node-view', {
        url: "/node/:id",
        template: '<node-details ng-if="vm.id" node-id="vm.id"></node-details>',
        controller: function($stateParams) {
            this.id = $stateParams.id;
        },
        controllerAs: "vm"
    });
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

mod.component("nodeButton", {
    template: '<md-button ui-sref="node-view({ id: \'{{ $ctrl.id }}\' })" class="name md-primary md-raised md-small">' +
        '<node-name node-id="$ctrl.id"></node-name>' +
        '</md-button>',
    bindings: {
        id: "<"
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
    controller: function(kitsuneService) {
        kitsuneService.describeNode(this.nodeId).then(desc => {
            this.nodeDesc = desc;
        });
    },
    controllerAs: "$ctrl",
    bindings: {
        nodeId: "<"
    }
});

mod.component("nodeGroup", {
    template: '<div>Group:</div>' +
        '<node-button ng-repeat="id in $gCtrl.group" id="id"></node-button>',
    controller: function(kitsuneService) {
        let ctrl = this;
        kitsuneService.listGroup(ctrl.id).then(group => ctrl.group = group);
    },
    controllerAs: "$gCtrl",
    bindings: {
        id: "<"
    }
});

mod.controller("yours", function(kitsuneService) {
    this.log = (msg) => console.log(msg);
    this.addName = (node, name) => kitsuneService.name(node, name).then(() => console.log("Named!"));
    this.removeName = (node, name) => kitsuneService.unname(node, name).then(() => console.log("Unnamed!"));
    this.save = () => kitsuneService.save().then(() => console.log("Saved!"));

    this.coreGroups = kitsuneService.listGroup("7f82d45a6ffb5c345f84237a621de35dd8b7b0e3").then((data) => {
        this.coreGroups = data;
    });
});

mod.filter("type", function() {
    return value => typeof value;
});

mod.filter("contains", function() {
    return (input, value) => input.includes(value);
});
