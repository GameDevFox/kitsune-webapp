(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("nodeButton", {
        templateUrl: 'templates/node-button.html',
        controller: function(kitsuneService) {
            let vm = this;
            kitsuneService.describeNode(vm.node)
                .then(_.mountP(vm, "desc"))
                .then(desc => {
                    let isString = desc.includes("821f1f34a4998adf0f1efd9b772b57efef71a070");
                    if(isString) {
                        kitsuneService.readString(vm.node)
                            .then(_.mountP(vm, "string"));
                    }
                });
        },
        controllerAs: "vm",
        bindings: { node: "<" }
    });

})(angular);
