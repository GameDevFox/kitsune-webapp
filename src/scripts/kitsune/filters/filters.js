(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.filter("desc", function() {
        return value => value ? _.map(value, v => "t"+v).join(" ") : null;
    });

    mod.filter("type", function() {
        return value => typeof value;
    });

    mod.filter("contains", function() {
        return (input, value) => input ? input.includes(value) : null;
    });

})(angular);
