(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.component("nodeName", {
        template:
            "<span ng-class='vm.name && vm.showNames ? \"name\" : \"\"'>" +
                "<span class='id'>{{ vm.id }}</span>" +
                "<span class='name'>{{ vm.name }}</span>" +
            "</span>",
        controller: function(kitsuneService, $scope, $attrs) {
            let vm = this;

            vm.showNames = true;
            $scope.$on("show-names", function(e, value) {
                vm.showNames = value;
            });

            let getName = function(value) {
                return kitsuneService.batch.listNames(value).then(x => x[0]);
            };
            $scope.$watch(() => vm.node, function(val) {
                vm.id = _.truncate(val, {
                    length: 9,
                    omission: '*'
                });
                getName(val)
                    .then(_.logP("name"))
                    .then(_.mountP(vm, "name"));
            });
        },
        controllerAs: "vm",
        bindings: { node: "<" }
    });

})(angular);
