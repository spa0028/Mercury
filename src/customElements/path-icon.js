//This code defines the icon element which is used for displaying SVG paths
//Icons can be created with the "path-icon" tag
//The icon then needs the attribute "src" with the value being a file path to the SVG path file
//The file with the .path extension is a custom file format
//Path files contain contain the raw commands found inside the d attribute of a path element inside an SVG

var globalIconCount = 0;
var pathCache = {}
var waitingFor = {}

;class pathIcon extends HTMLElement {
    constructor() {
        super()
        this.load()
    }

    load() {
        if (this.hasAttribute("src"))
            {
                let source = this.attributes.src.value
                if (pathCache.hasOwnProperty(source)) {
                    this.applyPath(pathCache[source])
                } else {
                    if (waitingFor.hasOwnProperty(source))
                    {
                        waitingFor[source].push(this)
                    }
                    else {
                        waitingFor[source] = []
                        fetch(source).then(e=>{return e.text()}).then(pathText=>{
                            pathCache[source] = pathText
                            this.applyPath(pathText)
                            waitingFor[source].forEach(waiting => {
                                waiting.applyPath(pathText)
                            });
                        })
                    }
                }
            }
    }

    applyPath(pathText) {
        let iconSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
                    
        iconSVG.setAttribute("viewBox", "0 0 1 1")

        let path = document.createElementNS("http://www.w3.org/2000/svg","path")
        path.attributes.setNamedItem(document.createAttribute("d"))
        path.setAttribute("d", pathText)
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
            path.style.fill = "var(--themeAccent)"

            iconSVG.appendChild(path)
        }
        this.appendChild(iconSVG)
    }
}