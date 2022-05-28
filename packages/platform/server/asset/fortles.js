var Fortles = {
    go: async function (event) {
        let source = event.target;
        let response = await fetch(source.href, {
            headers: {
                "Fortles-Source": Fortles.getBlockPath(source)
            }
        });
        if (response.ok) {
            let targetPath = response.headers.get("Fortles-Target");
            let targetElement = Fortles.getBlock(targetPath);
            targetElement.innerHTML = await response.text();
        }
        event.preventDefault();
    },
    loadPage: async function (target) {
    },
    loadBlock: async function (target) {
        let response = await fetch(location.href, {
            headers: { "Fortles-Target": target }
        });
        if (response.ok) {
            let targetPath = response.headers.get("Fortles-Target");
            let targetElement;
            if (targetPath) {
                targetElement = Fortles.getBlock(targetPath);
            }
            else {
                targetElement = document.body;
            }
            targetElement.innerHTML = await response.text();
        }
    },
    getBlock: function (path) {
        return document.getElementById("block-" + path);
    },
    getBlockParent: function (element) {
        while (!(element instanceof HTMLBodyElement)) {
            element = element.parentElement;
        }
        return element;
    },
    getBlockPath: function (element) {
        let block = Fortles.getBlockParent(element);
        if (!(block instanceof HTMLBodyElement)) {
            return block.id.substring(5);
        }
        return "";
    }
};
//# sourceMappingURL=fortles.js.map