(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("nodeInput", {
        templateUrl: 'templates/node-input.html',
        controller: function(kitsuneService, $scope) {
            let vm = this;

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
