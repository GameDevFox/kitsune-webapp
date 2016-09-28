(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("nodeInput", {
        templateUrl: 'templates/node-input.html',
        controller: function(kitsuneService, $scope) {
            let vm = this;

            vm.search = (text) => {
                vm.desc = {};
                vm.names = {};
                return kitsuneService.listNodes(text)
                    .then(_.mountP(vm, "nodes"))
                    .then(nodes => {
                        nodes.forEach(node => {
                            kitsuneService.describeNode(node)
                                .then(descNodes => {
                                    descNodes.forEach(descNode => {
                                        console.log("DN", descNode)
                                        kitsuneService.listNames(descNode)
                                            .then(_.logP("listNames"))
                                            .then(names => vm.names[descNode] = names);
                                    });
                                    return descNodes;
                                })
                                .then(desc => vm.desc[node] = desc);
                        });
                        return nodes;
                    });
            };

            $scope.$watch(
                () => vm.model,
                _.debounce(model => {

                    vm.names = null;
                    kitsuneService.listNames(model)
                        .then(_.mountP(vm, "names"));
                }, 500)
            );
        },
        controllerAs: "vm",
        bindings: {
            model: "=",
            placeholder: "@"
        }
    });

})(angular);
