(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("typeIcons", {
        templateUrl: 'templates/type-icons.html',
        controllerAs: "vm",
        bindings: { types: "<" }
    });

})(angular);
