(function(angular) {

    'use strict';

    let mod = angular.module("kitsune", ["ui.router", "ui.bootstrap"]);

    // CONFIG //
    mod.constant("kitsuneUrl", "http://localhost:8080/");

    mod.config(function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/node/7f82d45a6ffb5c345f84237a621de35dd8b7b0e3');

        $stateProvider.state('node-view', {
            url: "/node/:id",
            templateUrl: 'templates/main.html',
            controller: "kitsune as vm"
        });
    });

})(angular);
