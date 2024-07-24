class headerBar extends HTMLElement {
    constructor() {
        super()
        let mainDiv = document.createElement("div")
        this.appendChild(mainDiv)
        let headerText = document.createElement("h1")
        mainDiv.appendChild(headerText)
        headerText.classList.add("headerText")
        if (this.hasAttribute("heading"))
        {
            headerText.textContent = this.attributes.heading.value
        }
    }
}

customElements.define("header-bar", headerBar)