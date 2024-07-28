//Vertical bar menu element with icons
//Used for the main menu

//Put divs inside with label attributes and icon attributes to create options

;class barMenu extends HTMLElement {
    constructor() {
        super()
        let options = this.querySelectorAll("div")

        for (let i=0; i<options.length; i++) //For each option
        {
            // document.documentElement.style.setProperty("--optionCount", i+1)
            this.style.setProperty("--optionCount", i+1)
            this.style.setProperty("--optionHeight", "calc((100vh - var(--borderThickness)) / var(--optionCount))")
            this.style.setProperty("--optionContent", "calc((100vh - (var(--borderThickness) * (var(--optionCount) + 1))) / var(--optionCount))")
            let option = options[i]
            let content = "calc(var(--optionContent) + 1px)"
            option.style.top = i==0 ? "0px" : `calc((var(--optionHeight) * ${i}) + (var(--borderThickness) / 2))`

            let optionIconDiv = option.appendChild(document.createElement("div"))
            optionIconDiv.classList.add("optionIconDiv")
            
            let optionTextDiv = option.appendChild(document.createElement("div"))
            optionTextDiv.classList.add("optionTextDiv")

            //Menu text label
            let textSVG = optionTextDiv.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
            textSVG.classList.add("optionText")

            let colourRect = textSVG.appendChild(document.createElementNS("http://www.w3.org/2000/svg","rect"))
            colourRect.setAttribute("x", 0)
            colourRect.setAttribute("y", 0)
            colourRect.setAttribute("width", "100%")
            colourRect.style.height = content
            colourRect.setAttribute("mask", `url(#textMask${i})`)
            colourRect.style.fill = "var(--themeAccent)"

            let mask = textSVG.appendChild(document.createElementNS("http://www.w3.org/2000/svg","mask"))
            mask.id = `textMask${i}`

            let maskRect = mask.appendChild(document.createElementNS("http://www.w3.org/2000/svg","rect"))
            maskRect.setAttribute("x", 0)
            maskRect.setAttribute("y", 0)
            maskRect.setAttribute("width", "100%")
            maskRect.style.height = content
            
            let text = mask.appendChild(document.createElementNS("http://www.w3.org/2000/svg","text"))
            text.setAttribute("x", "3%")
            text.setAttribute("y", "50%")
            text.setAttribute("dominant-baseline", "middle")
            text.classList.add("optionText")
            text.innerHTML = option.attributes.label.value


            //Menu Icon
            let icon = optionIconDiv.appendChild(document.createElement("path-icon"))
            icon.setAttribute("src", option.attributes.icon.value)
            icon.attributes.setNamedItem(document.createAttribute("invertable"))
            if (icon.load){icon.load()} //Load icon
        }
    }
}