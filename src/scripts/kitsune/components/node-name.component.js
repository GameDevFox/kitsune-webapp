(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("nodeName", {
        template: "<span ng-class='vm.name ? \"name\" : \"\"'>{{ vm.name && vm.showNames ? vm.name : vm.id }}</span>",
        controller: function(kitsuneService, $scope, $attrs) {
            let ctrl = this;

            ctrl.showNames = true;
            $scope.$on("show-names", function(e, value) {
                ctrl.showNames = value;
            });

            let getName = function(value) {
                return kitsuneService.batch.listNames(value).then(x => x[0]);
            };
            $scope.$watch(() => ctrl.node, function(val) {
                ctrl.id = _.truncate(val, {
                    length: 9,
                    omission: '*'
                });
                getName(val).then(_.mountP(ctrl, "name"));
            });
        },
        controllerAs: "vm",
        bindings: { node: "<" }
    });

})(angular);
