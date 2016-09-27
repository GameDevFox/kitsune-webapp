(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.factory("kitsuneService", function($http, kitsuneUrl) {

        let post = function(funcId, data) {
            let request = { method: "POST", url: kitsuneUrl+"api/"+ funcId, headers: {
                'Content-Type': 'text/plain'
            }};

            if(data)
                request.data = JSON.stringify(data);

            return $http(request);
        };

        let mkCall = function(funcId, data) {
            return post(funcId, data).then(res => res.data);
        };

        let service = {
            post: (funcId, data) => post(funcId, data).then(res => res.data),

            mkid: () => mkCall("bf565ae1309f425b0ab00efa2ba541ae03ad22cf"),
            readEdge: (edge) => mkCall("25cff8a2afcf560b5451d2482dbf9d9d69649f26", edge),
            assign: (args) => mkCall("7b5e1726ccc3a1c2ac69e441900ba002c26b2f74", args),
            factor: (args) => mkCall("c83cd0ab78a1d57609f9224f851bde6d230711d0", args),
            name: (node, name) => mkCall("2885e34819b8a2f043b139bd92b96e484efd6217", { node, name }),
            unname: (node, name) => mkCall("708f17af0e4f537757cf8817cbca4ed016b7bb8b", { node, name }),
            listGroup: (groupId) => mkCall("a8a338d08b0ef7e532cbc343ba1e4314608024b2", groupId),
            listNames: (nodeId) => mkCall("890b0b96d7d239e2f246ec03b00cb4e8e06ca2c3", nodeId),
            getStringValue: (nodeId) => mkCall("08f8db63b1843f7dea016e488bd547555f345c59", nodeId),
            describeNode: (nodeId) => mkCall("15b16d6f586760a181f017d264c4808dc0f8bd06", nodeId),

            readString: (node) => mkCall("08f8db63b1843f7dea016e488bd547555f345c59", node),

            getHeads: (node) => mkCall("a1e815356dceab7fded042f3032925489407c93e", { tail: node }),
            getTails: (node) => mkCall("a1e815356dceab7fded042f3032925489407c93e", { head: node }),

            addEdge: (head, tail) => mkCall("f7b073eb5ef5680e7ba308eaf289de185f0ec3f7", { head, tail }),
            removeEdge: (edge) => mkCall("c2d807f302ca499c3584a8ccf04fb7a76cf589ad", edge),

            getDataTime: () => mkCall("d5e195726a6a3650166a6591dc3d7619adaef98d"),
            getSyncTime: () => mkCall("9a3a7c56e96abc04bd92f63cdfc5f31d49f778cd"),

            load: () => mkCall("d575ab0a08a412215384e34ccbf363e960f3b392"),
            save: () => $http({ method: "GET", url: kitsuneUrl+"api/save" }),

            log: (msg) =>  { console.log(msg); }
        };
        return service;
    });

})(angular);
