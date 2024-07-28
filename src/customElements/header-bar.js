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
        backButton.onclick = (()=>{hotSwap("mainSwap", "menu")})
    }
}