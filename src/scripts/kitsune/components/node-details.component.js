(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("nodeDetails", {
        templateUrl: "templates/node-details.html",
        controller: function(kitsuneService, $state, $scope) {
            let vm = this;

            vm.showEdges = true;
            $scope.$on("show-edges", function(e, value) {
                vm.showEdges = value;
            });

            vm.nav = node => $state.go("node-view", { id: node });

            vm.loadNames = () => {
                kitsuneService.batch.listNames(vm.node)
                    .then(_.mountP(vm, "nameList"))
            };

            vm.addName = () => {
                kitsuneService.name(vm.node, vm.newName).then(vm.loadNames);
                vm.newName = null;
            };
            vm.removeName = name => {
                kitsuneService.unname(vm.node, name).then(vm.loadNames);
            };

            vm.addHead = () => {
                if(!vm.headType || vm.headType.trim().length == 0) {
                    kitsuneService.addEdge(vm.newHead, vm.node)
                        .then(vm.load);
                    vm.newHead = null;
                } else {
                    kitsuneService.assign({ head: vm.newHead, type: vm.headType, tail: vm.node })
                        .then(vm.load);
                    vm.newHead = null;
                    vm.headType = null;
                }
            };
            vm.addTail = () => {
                if(!vm.tailType || vm.tailType.trim().length == 0) {
                    kitsuneService.addEdge(vm.node, vm.newTail).then(vm.load);
                    vm.newTail = null;
                } else {
                    kitsuneService.assign({ head: vm.node, type: vm.tailType, tail: vm.newTail })
                        .then(vm.load);
                    vm.newTail = null;
                    vm.tailType = null;
                }
            };

            vm.updateEdge = () => {
                kitsuneService
                    .updateOrInsertEdge({
                        id: vm.node,
                        head: vm.edgeHead,
                        tail: vm.edgeTail
                    })
                    .then(kitsuneService.readEdge)
                    .then(_.mountP(vm, "edge"));
            };
            vm.removeEdge = edge => {
                kitsuneService.removeEdge(edge).then(vm.load);
            };
            vm.mkid = prop => {
                kitsuneService.mkid().then(_.mountP(vm, prop));
            };

            let readChain = function() {
                kitsuneService.traceChain(vm.node)
                    .then(_.mountP(vm, "traceChain"))
                    .then(traceChain => {
                        if(traceChain.length) {
                            let lastLink = traceChain[traceChain.length - 1];
                            vm.lastLink = lastLink.next;
                        } else
                            vm.lastLink = vm.node;
                    });
            };
            vm.appendLink = (link, value) => {
                kitsuneService.spliceChain(link, 0, [value])
                    .then(readChain)
                    .then(vm.linkValue = null);
            };
            vm.removeLink = (link) => {
                kitsuneService.spliceChain(link, 1)
                    .then(readChain);
            };

            function mergeEdgeTypes(edgeTypes) {
                return function(types) {
                     _(types)
                         .groupBy("id")
                         .mapValues(x => _.map(x, "type"))
                         .each((value, key) => {
                             let list = edgeTypes[key];
                             edgeTypes[key] = list ? _.assign(list, value) : value;
                         });
                };
            }

            vm.load = () => {
                vm.edgeTypes = {};

                vm.loadNames();

                kitsuneService.getHeads(vm.node).then(_.mountP(vm, "heads")).then(heads => {
                    heads.forEach(function(head) {
                        kitsuneService.factor({ head: head.head, tail: head.tail })
                            .then(mergeEdgeTypes(vm.edgeTypes));
                    });
                });

                kitsuneService.getTails(vm.node).then(_.mountP(vm, "tails")).then(tails => {
                    tails.forEach(tail => {
                        kitsuneService.factor({ head: tail.head, tail: tail.tail })
                            .then(mergeEdgeTypes(vm.edgeTypes));
                    });
                });

                readChain();

                kitsuneService.batch.describeNode(vm.node)
                    .then(_.mountP(vm, "nodeDesc"))
                    .then(types => {
                        kitsuneService.systemMap("7806cde5c1d31f49bfc6cd82ffa1ffac8a0c11df", types)
                            .then(_.mountP(vm, "typeLists"));
                        return types;
                    })
                    .then(nodeDesc => {
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
