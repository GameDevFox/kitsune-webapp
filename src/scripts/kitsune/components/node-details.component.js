(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("nodeDetails", {
        templateUrl: "templates/node-details.html",
        controller: function(kitsuneService, $scope) {
            let vm = this;

            vm.showEdges = true;
            $scope.$on("show-edges", function(e, value) {
                vm.showEdges = value;
            });

            vm.loadNames = () => {
                kitsuneService.batch.listNames(vm.node).then(_.mountP(vm, "nameList"));
            };

            vm.addName = () => {
                kitsuneService.name(vm.node, vm.newName).then(vm.loadNames);
                vm.newName = null;
            };
            vm.removeName = name => {
                kitsuneService.unname(vm.node, name).then(vm.loadNames);
            };

            vm.addHead = () => {
                kitsuneService.addEdge(vm.newHead, vm.node).then(vm.load);
                vm.newHead = null;
            };
            vm.addTail = () => {
                kitsuneService.addEdge(vm.node, vm.newTail).then(vm.load);
                vm.newTail = null;
            };

            vm.assignHead = () => {
                kitsuneService.assign({ head: vm.assignHeadHead, type: vm.assignHeadType, tail: vm.node })
                    .then(vm.load);
                vm.assignHeadHead = null;
                vm.assignHeadType = null;
            };
            vm.assignTail = () => {
                kitsuneService.assign({ head: vm.node, type: vm.assignTailType, tail: vm.assignTailTail })
                    .then(vm.load);
                vm.assignTailTail = null;
                vm.assignTailType = null;
            };

            vm.removeEdge = edge => {
                kitsuneService.removeEdge(edge).then(vm.load);
            };
            vm.mkid = prop => {
                kitsuneService.mkid().then(_.mountP(vm, prop));
            };

            vm.load = () => {
                let node = vm.node;

                vm.headTypes = {};
                vm.tailTypes = {};

                vm.loadNames();
                kitsuneService.getHeads(vm.node).then(_.mountP(vm, "heads")).then(heads => {
                    heads.forEach(function(head) {
                        kitsuneService.factor({ head: head.head, tail: head.tail }).then(function(types) {
                            var typeNodes = types.map(type => type.type);
                            vm.headTypes[head.head] = typeNodes;
                        });
                    });
                });
                kitsuneService.getTails(vm.node).then(_.mountP(vm, "tails")).then(tails => {
                    tails.forEach(tail => {
                        kitsuneService.factor({ head: tail.head, tail: tail.tail }).then(types => {
                            let typeNodes = types.map(type => type.type);
                            vm.tailTypes[tail.tail] = typeNodes;
                        });
                    });
                });
                kitsuneService.batch.describeNode(vm.node).then(_.mountP(vm, "nodeDesc")).then(nodeDesc => {
                    if(nodeDesc.includes("20bfa138672de625230eef7faebe0e10ba6a49d0")) // is-edge
                        kitsuneService.readEdge(vm.node).then(_.mountP(vm, "edge"));
                    if(nodeDesc.includes("821f1f34a4998adf0f1efd9b772b57efef71a070")) // is-string
                        kitsuneService.readString(vm.node).then(_.mountP(vm, "stringValue"));
                    if(nodeDesc.includes("bd07150e634d5b01eedbe44f28a5068b5a7c845d")) // is-list
                        kitsuneService.post(vm.node).then(_.mountP(vm, "list"));
                    if(nodeDesc.includes("c0c7f5b157c778783ce82f431f732f19d7cb3821")) // is-system-file
                        kitsuneService.post("e6ff3d78ebd8f80c8945afd3499195049609905d", vm.node).then(_.mountP(vm, "systemFileSource"));
                });
            };

            $scope.$watch(() => { vm.node }, vm.load);
            $scope.$on("refresh-node-details", vm.load);
        },
        controllerAs: "vm",
        bindings: { node: "<" }
    });

})(angular);
