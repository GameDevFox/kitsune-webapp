(function(angular) {

    'use strict';

    let mod = angular.module("kitsune", ["ngMaterial", "ui.router"]);

    // CONFIG //
    mod.constant("kitsuneUrl", "http://localhost:8080/");

    mod.config(function($mdThemingProvider, $urlRouterProvider, $stateProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('blue')
            .accentPalette('red');

        $urlRouterProvider.otherwise('/node/7f82d45a6ffb5c345f84237a621de35dd8b7b0e3');

        $stateProvider.state('node-view', {
            url: "/node/:id",
            templateUrl: 'templates/main.html',
            controller: "kitsune as vm"
        });
    });

    mod.run(function(kitsuneService) {
        kitsuneService.batch.listNames([
            '68d3fb9d10ae2b0455a33f2bfb80543c4f137d51',
            '6c877bef62bc8f57eb55265c62e75b36515ef458',
            '7087272f7205fdac70e1f29d3d4b9e170d99a431',
            '78e787d70cc0f1c1dfdf6a406250dbe5243631ff',
            '81e0ef7e2fae9ccc6e0e3f79ebf0c9e14d88d266',
            '878c8ef64d31a194159765945fc460cb6b3f486f',
            '8f8b523b9a05a55bfdffbf14187ecae2bf7fe87f',
            '90184a3d0c84658aac411637f7442f80b3fe0040',
            'a0089c410302c18427b4cbdc4c3a55de6a69eb8b',
            'a3cb3210c4688aabf0772e5a7dec9c9922247194',
            'a3fd8e7c0d51f13671ebbb6f9758833ff6120b42',
            'ab54a0a1abd5f849fcc04c809e5db0ebb1f1cc29',
            'ad95b67eca3c4044cb78a730a9368c3e54a56c5f',
            'b69aeff3eb1a14156b1a9c52652544bcf89761e2',
            'b7916f86301a6bc2af32f402f6515809bac75b03',
            'b8aea374925bfcd5884054aa23fed2ccce3c1174',
            'c1020aea14a46b72c6f8a4b7fa57acc14a73a64e',
            'c2ea0ae0bca74d50be301049b8ff6e3a5b7d10ae',
            'c4863daa27736a3fb94fa536fcf17bab5fce25bf',
            'c7d575b7fa646fae5fe64881aa98704a3df523b2'
        ])
            .then(_.logP("two"));
        kitsuneService.batch.listNames("d2875fcaa91079d5c4065d7d887e747b7e170f66")
            .then(_.logP("one"));
        kitsuneService.batch.listNames([
            '91ad9a39b3968af9f4418c3066963ce41ee38804',
            '971a9f4b9f8e841b4519d96fa8733311c8b58fe2',
            'c83cd0ab78a1d57609f9224f851bde6d230711d0',
            '890b0b96d7d239e2f246ec03b00cb4e8e06ca2c3',
            '08f8db63b1843f7dea016e488bd547555f345c59',
            '187757b06fee5a804c312e55d834d06025762605',
            '5ce1af19973262a2c69aebb10c6c4aeceee96149',
            '383103bd68460b5ff1d48e629720533dc3e3a1e4',
            'e73694a13d302e910ee51a1f326cf08e1bce0c12',
            'debb03595c98dabf804339d4b4e8510bb14b56f9',
            '4c2699dc1fec0111f46c758489a210eb7f58e4df',
            'c62d4ef1e0a3e7cf289dfb455e52ed540ac06b79',
            '34808982614a55b16897427d36e8ce37c6d68277',
            '43cd34ab8105d158f421eecce9ed22948ec34893',
            '05ef7fa49f431784fccc98f676c171e86c300449',
            '5658516f9274e7fcdeb87aa20d0b69a35ec335c3',
            '3528d88fb3d5a3dc22f2ffbd40690ec71edd3819',
            '5d134bcf95eb55efa7807da43e11e4fc37e269b9',
        ])
            .then(_.logP("three"))

        let nodes = [
            'd30dc37c36dd88e12dab2311ad7b1e9ef1038118',
            'f7b073eb5ef5680e7ba308eaf289de185f0ec3f7',
            '8c7d214678ce851d39ebb4a774c9f168bfffe43d',
            'd1d3e1c9b3a0bf5cb07df6ee9a75f741d3cfdd78',
            '647b87f6c165824714c48ffa8bf224d1bcf11709',
            'cf2331e774de09eee361e94199546123913a2773',
            '1b12f086f8555c4d13e6c98a8cece7ce4e198d43',
            'a5145963a941491432e65b37cbf6d4f6160cc543',
            'da697bd0863212526208d79e3e65019377b07670',
            'de9803674df491c66c99dcb85d14402f3339c645',
            '88bd34b2a7aa6c5c14127f6d3d11b82125597f61',
            'bd7d5695726fa6fe5eb35bed1e009f8784b29c98',
            '248743603215c126461a7e4debdee6d18c3686cb',
            '4f22989e5edf2634371133db2720b09fc441a141',
            '8d15cc103c5f3453e8b5ad8cdada2e5d2dde8039',
            '58f4149870fd4f99bcbf8083eedfee6fbc1199b0',
            'c5cfe7d5154188daaa2a5cdf5d27a18fce4c2345',
            '0abebb208d96e3aa8a17890a5606734e03fa2539',
            '30381757ef98651b92e54ce11a4fb839e76aa847',
            '6e52da614fc7779bd2aed50b06e753ee09cc346b',
            '0d4085c107c1e9fab3fcb0cd49a8372003f00484',
            '253cd1812a32a6a81f1365e1eca19cc1549f6002',
            '12d8b6e0e03d5c6e5d5ddb86bda423d50d172ec8',
            '5277dc011cbc9800046edeb4460f7138e060a935',
            'd744dc750675113a5914be50bf3fbd3f9bd4319f',
            '9c9a7115ab807d4f97b9f29031f5dbfc35ae0cf7',
            '6a96bb7f6144af37ffe81fca6dd31546890fbfb5',
            '3990d47251b3e9a52f311241bf65368ac66989c4',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
            '6bfea805fec330b875b15744fd8bff3ae34635c3',
            '2e898c3acd767449308279ae99645244dc248b08',
        ];
        nodes.forEach(node => {
            kitsuneService.batch.listNames(node)
                .then(_.logP("multi"))
        });
    });

})(angular);
