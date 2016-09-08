(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("nodeButton", {
        templateUrl: 'templates/node-button.html',
        controller: function(kitsuneService) {
            let ctrl = this;
            kitsuneService.describeNode(ctrl.node).then(_.mountP(ctrl, "desc"));
        },
        controllerAs: "vm",
        bindings: { node: "<" }
    });

})(angular);
