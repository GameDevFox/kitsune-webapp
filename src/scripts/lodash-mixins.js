(function(_) {
    _.mixin({
        "isBlank": function(value) {
            return _.isString(value) ? _.isEmpty(value.trim()) : _.isEmpty(value);
        },

        "mount": function(obj, path, value) {
            if(_.isBlank(path))
                throw new Error("Empty mount path");

            let parts = path.split(".");

            let mountPoint = obj;
            while(parts.length > 1) {
                let part = parts.shift();
                if(!mountPoint[part])
                    mountPoint[part] = {};

                mountPoint = mountPoint[part];
            }

            let lastPart = parts[0];
            mountPoint[lastPart] = value;
            return value;
        },

        "mountP": function(obj, path) {
            return function(value) {
                _.mount(obj, path, value);
                return value;
            };
        },

        "logP": function(msg) {
            return (value) => {
                if(msg)
                    console.log(msg, value);
                else
                    console.log(value);
                return value;
            };
        }
    });
})(_);
