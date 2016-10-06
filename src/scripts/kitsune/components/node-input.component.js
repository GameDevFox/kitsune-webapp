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

                // let listP = kitsuneService.listNodes(text);
                let listP = kitsuneService.searchStrings(text)
                    .then(stringIds => {
                        return kitsuneService.factor({
                            head: stringIds,
                            type: "f1830ba2c84e3c6806d95e74cc2b04d99cd269e0"
                        })
                            .then(factors => _.map(factors, "tail"));
                    });

                let strIdP = kitsuneService.hashString(text);

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
                    if(!model.trim().length == 0) {
                        vm.names = null;
                        kitsuneService.batch.listNames(model)
                            .then(_.mountP(vm, "names"));
                    }
                }, 500)
            );

            function loadNodeInfo(nodes) {
                nodes.forEach(node => {
                    loadNames(node);
                    kitsuneService.batch.describeNode(node)
                        .then(descNodes => vm.desc[node] = descNodes)
                        .then(descNodes => descNodes.forEach(loadNames));
                });
                return nodes;
            }

            function loadNames(node) {
                kitsuneService.batch.listNames(node)
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
