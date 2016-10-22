(function(angular) {

    'use strict';

    var mod = angular.module("kitsune");

    mod.factory("kitsuneService", function($http, $timeout, $q, kitsuneUrl) {

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

        let systemMap = (system, data) => mkCall("187757b06fee5a804c312e55d834d06025762605", { system, data });

        let batchService = function(system, interval=0) {
            let running = false;

            let nextCallData = [];
            let nextCall;

            let getNextCall = function() {
                if(!running) {
                    nextCall = new $q((resolve) => {
                        $timeout(() => {
                            let data = _.uniq(nextCallData);
                            nextCallData = [];

                            systemMap(system, data)
                                .then(resolve);

                            running = false;
                        }, interval);
                    });
                    running = true;
                }

                return nextCall;
            };

            return function(data) {
                let result;
                if(_.isArray(data)) {
                    nextCallData = nextCallData.concat(data);
                    result = getNextCall().then(res => _.pick(res, data));
                } else {
                    nextCallData.push(data);
                    result = getNextCall().then(res => res[data]);
                }
                return result;
            };
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
            listNames: (node) => mkCall("890b0b96d7d239e2f246ec03b00cb4e8e06ca2c3", node),
            listNodes: (name) => mkCall("91aad58f3f5cf73d7edfadb6b83c2a0e556c15e2", name),

            describeNode: (nodeId) => mkCall("15b16d6f586760a181f017d264c4808dc0f8bd06", nodeId),

            hashString: (string) => mkCall("c2ea0ae0bca74d50be301049b8ff6e3a5b7d10ae", string),
            makeString: (string) => mkCall("4e63843a9bee61351b80fac49f4182bd582907b4", string),
            searchStrings: (like) => mkCall("debb03595c98dabf804339d4b4e8510bb14b56f9", like),
            readString: (node) => mkCall("08f8db63b1843f7dea016e488bd547555f345c59", node),

            getHeads: (node) => mkCall("a1e815356dceab7fded042f3032925489407c93e", { tail: node }),
            getTails: (node) => mkCall("a1e815356dceab7fded042f3032925489407c93e", { head: node }),

            addEdge: (head, tail) => mkCall("f7b073eb5ef5680e7ba308eaf289de185f0ec3f7", { head, tail }),
            removeEdge: (edge) => mkCall("c2d807f302ca499c3584a8ccf04fb7a76cf589ad", edge),

            traceChain: (node) => mkCall("b1565419b484bc440da1a81316cec147aec4e1dc", { away: true, node }),
            spliceChain: (node, deleteCount, insert) => mkCall("f3106f372a55b1e33b3b666d5df0c9e96f06cba1", { away: true, node, deleteCount, insert }),

            getDataTime: () => mkCall("d5e195726a6a3650166a6591dc3d7619adaef98d"),
            getSyncTime: () => mkCall("9a3a7c56e96abc04bd92f63cdfc5f31d49f778cd"),

            load: () => mkCall("d575ab0a08a412215384e34ccbf363e960f3b392"),
            save: () => mkCall("c2ff24899966a19f0615519692679bff2c2b8b26", true),

            log: (msg) =>  { console.log(msg); },

            systemMap: systemMap,

            batch: {
                listNames: batchService("890b0b96d7d239e2f246ec03b00cb4e8e06ca2c3", 100),
                describeNode: batchService("15b16d6f586760a181f017d264c4808dc0f8bd06", 100),
            }
        };
        return service;
    });

})(angular);
