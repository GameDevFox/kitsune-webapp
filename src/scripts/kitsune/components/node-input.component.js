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
                let listP = kitsuneService.listNodes(text);
                let strIdP = kitsuneService.makeString(text);

                return Promise.all([listP, strIdP])
                    .then(([list, strId]) => {
                        list.push(strId);
                        return list;
                    })
                    .then(_.mountP(vm, "nodes"))
                    .then(loadNodeInfo);
            };

            $scope.$watch(
                () => vm.model,
                _.debounce(model => {

                    vm.names = null;
                    kitsuneService.listNames(model)
                        .then(_.mountP(vm, "names"));
                }, 500)
            );

            function loadNodeInfo(nodes) {
                nodes.forEach(node => {
                    kitsuneService.describeNode(node)
                        .then(descNodes => vm.desc[node] = descNodes)
                        .then(descNodes => descNodes.forEach(loadNames));
                });
                return nodes;
            }

            function loadNames(node) {
                kitsuneService.listNames(node)
                    .then(_.logP("listNames"))
                    .then(names => vm.names[node] = names);
            }
        },
        controllerAs: "vm",
        bindings: {
            model: "=",
            placeholder: "@"
        }
    });
})(angular);
