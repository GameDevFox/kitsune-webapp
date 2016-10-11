(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("nodeInput", {
        templateUrl: 'templates/node-input.html',
        controller: function(kitsuneService, $scope) {
            let vm = this;

            vm.search = (text) => {
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
                    .then(nodes => {
                        return _.map(nodes, node => {
                            return { node }
                        });
                    })
                    .then(loadDesc)
                    .then(loadNames);
            };

            function loadDesc(results) {
                results.forEach(result => {
                    kitsuneService.batch.describeNode(result.node)
                        .then(desc => result.desc = desc);
                });
                return results;
            }

            function loadNames(results) {
                results.forEach(result => {
                    kitsuneService.batch.listNames(result.node)
                        .then(names => result.names = names);
                })
                return results;
            }

            $scope.$watch(
                () => vm.model,
                _.debounce(model => {
                    if(model && !model.trim().length == 0) {
                        vm.names = null;
                        kitsuneService.batch.listNames(model)
                            .then(_.mountP(vm, "names"));
                    }
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
