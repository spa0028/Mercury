var globalIconCount = 0;

class pathIcon extends HTMLElement {
    constructor() {
        super()
        this.load()
    }

    load() {
        if (this.hasAttribute("src"))
            {
                fetch(this.attributes.src.value).then(e=>{return e.text()}).then(text=>{
                    let iconSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
                    iconSVG.classList.add("optionIcon", "centre")

                    iconSVG.setAttribute("viewBox", "0 0 1 1")

                    let path = document.createElementNS("http://www.w3.org/2000/svg","path")
                    path.attributes.setNamedItem(document.createAttribute("d"))
                    path.setAttribute("d", text)
                    path.setAttribute("transform", "scale(0.8, 0.8) translate(0.1, 0.1)")

                    globalIconCount++

                    if (this.hasAttribute("invertable"))
                    {
                        let colourRect = iconSVG.appendChild(document.createElementNS("http://www.w3.org/2000/svg","rect"))
                        colourRect.setAttribute("x", 0)
                        colourRect.setAttribute("y", 0)
                        colourRect.setAttribute("mask", `url(#iconMask${globalIconCount})`)
                        colourRect.style.fill = "var(--themeAccent)"
                        colourRect.style.height = colourRect.style.width = "1"
        
                        let mask = iconSVG.appendChild(document.createElementNS("http://www.w3.org/2000/svg","mask"))
                        mask.id = `iconMask${globalIconCount}`
        
                        let maskRect = mask.appendChild(document.createElementNS("http://www.w3.org/2000/svg","rect"))
                        maskRect.setAttribute("x", 0)
                        maskRect.setAttribute("y", 0)
                        maskRect.style.height = maskRect.style.width = "1"

                        mask.appendChild(path)
                    } else {
                        iconSVG.appendChild(path)
                    }
                    this.appendChild(iconSVG)
                })
            }
    }
}

customElements.define("path-icon", pathIcon)