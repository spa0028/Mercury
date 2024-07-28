//This element acts as a container that can contain HTML documents
//Only one document displays at a time, the current document can be changed with the swap method

//A hotswap element should be filled with "sub-page" tags

window.hotSwap = (swapper, target) => { //Global hotswapper control function
    document.getElementById(swapper).swap(target)
}

;class hotSwapper extends HTMLElement {
    constructor() {
        super();
        this.current = this.querySelector(`sub-page[default]`) //Set the currently active sub-page
    }

    swap(targetName) { //Do a hotswap
        let target = this.querySelector(`[target="${targetName}"]`) //Get the referenced sub-page
        this.current.hide() //Hide the old page
        target.show() //Show the new page
        this.current = target; //Update to the new target
    }
}