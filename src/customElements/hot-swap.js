window.hotSwap = (swapper, target) => {
    document.getElementById(swapper).swap(target)
}
;class hotSwapper extends HTMLElement {
    constructor() {
        super();
        this.current = this.querySelector(`sub-page[default]`)
    }

    swap(targetName) { //Do a hotswap
        let target = this.querySelector(`[target="${targetName}"]`)
        this.current.hide()
        target.show()
        this.current = target;
    }
}