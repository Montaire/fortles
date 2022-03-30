class Fortles{
    static async go(event: MouseEvent){
        let source = event.target as HTMLAnchorElement;
        let response = await fetch(source.href, {
            headers: {
                "Fortles-Path": Fortles.getBlockPath(source)
            }
        });
        if(response.ok){
            let targetPath = response.headers.get("Fortles-Target");
            let targetElement = Fortles.getBlock(targetPath);
            targetElement.innerHTML = await response.text();
        }
        event.preventDefault();
    }

    /*
    static async do(event: MouseEvent){
        let source = event.target as HTMLAnchorElement;
        let response = await fetch(source.href, {
            headers: {
                "Fortles-Path": Fortles.getBlockPath(source)
            },
            method: "POST",
            body: ""
        });
    }*/

    static getBlock(path: string): HTMLElement|null{
        return document.getElementById("block-" + path);
    }

    static getBlockParent(element : HTMLElement): HTMLElement|null{
        while(!(element instanceof HTMLBodyElement)){
            element = element.parentElement;
        }
        return element;
    }

    static getBlockPath(element: HTMLElement): string{
        let block = Fortles.getBlockParent(element);
        if(!(block instanceof HTMLBodyElement)){
            return block.id.substring(5);
        }
        return "";
    }

    private static processResponse(){}
}