//A simple header bar for pages

//Just provide a label attribute to set the header text
//The back button or pressing escape swaps to the main menu

document.addEventListener("keydown", e => {
    if (e.key=="Escape")
    {
        hotSwap("mainSwap", "menu")
    }
})

;class headerBar extends HTMLElement {
    constructor() {
        super()
        let mainDiv = document.createElement("div")
        this.appendChild(mainDiv)
        let headerText = mainDiv.appendChild(document.createElement("h1"))
        if (this.hasAttribute("heading"))
        {
            headerText.textContent = this.attributes.heading.value
        }
        let backButton = mainDiv.appendChild(document.createElement("path-icon"))
        backButton.setAttribute("src", "icons/back.path")
        if (backButton.load){backButton.load()} //Load icon
        backButton.onclick = (()=>{hotSwap("mainSwap", "menu")})
    }
}