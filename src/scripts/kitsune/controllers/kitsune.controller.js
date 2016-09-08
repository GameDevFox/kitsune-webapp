(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    let outOfDate;
    let checkDataSync;

    mod.run(($interval, $rootScope, kitsuneService) => {
        console.log("Hello Kitsune");

        checkDataSync = () => {
            console.log("Check Sync");

            let dataTimeP = kitsuneService.getDataTime();
            let syncTimeP = kitsuneService.getSyncTime();

            Promise.all([dataTimeP, syncTimeP]).then(([dataTime, syncTime]) => {
                let mDataTime = moment(dataTime, "x");
                let mSyncTime = moment(syncTime, "x");

                if(syncTime > dataTime)
                    outOfDate = null; // Up to date
                else
                    outOfDate = mSyncTime.from(mDataTime, true);

                $rootScope.$digest();
            });
        };
        checkDataSync();

        window.onfocus = checkDataSync;
    });

    mod.controller("kitsune", function($stateParams, $rootScope, $scope, kitsuneService) {

        let vm = this;

        vm.node = $stateParams.id;

        vm.showEdges = true;
        $rootScope.$broadcast("show-edges", vm.showEdges);
        $scope.$watch("vm.showEdges", (value) => {
            vm.showEdges = value;
            $rootScope.$broadcast("show-edges", vm.showEdges);
        });

        vm.showNames = true;
        $rootScope.$broadcast("show-names", vm.showNames);
        $scope.$watch("vm.showNames", (value) => {
            vm.showNames = value;
            $rootScope.$broadcast("show-names", vm.showNames);
        });

        vm.getOutOfDate = () => outOfDate;

        vm.log = (msg) => console.log(msg);
        vm.save = () => kitsuneService.save().then(() => console.log("Saved!"));
        vm.load = () => kitsuneService.load().then(() => {
            checkDataSync();
            $rootScope.$broadcast("refresh-node-details");
            console.log("Load")
        });
    });

})(angular);
