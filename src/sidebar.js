class sidebarItem extends HTMLElement {
    constructor() {
        super()
        if (this.hasAttribute("label"))
            {
                this.leaf = this.children.length==0
                
                this.descendants = this.countAllDescendants()
                
                let contentDiv = document.createElement("div")
                
                this.appendChild(contentDiv)
                
                while (this.firstChild!=contentDiv)
                {
                    contentDiv.appendChild(this.firstChild)
                }
                    
                
                //add mainDiv to top of children list
                let mainDiv = this.children.length==0 ? this.appendChild(document.createElement("div")) : this.insertBefore(document.createElement("div"), contentDiv)
                
                if (!this.leaf)
                    {
                        let arrow = mainDiv.appendChild(document.createElement("path-icon"))
                        arrow.setAttribute("src", "icons/dropdown.path")
                        arrow.load()
                    }

                let labelText = mainDiv.appendChild(document.createElement("h2"))
                labelText.textContent = this.attributes.label.value

                // if (this.leaf)
                // {
                //     labelText.style.color = "#f0f"
                // }

                this.updateOffset()

                this.contentsVisible = true

                this.toggleVisibility()

                this.onclick = (e=>{this.toggleVisibility(e)})
            }
    }

    toggleVisibility(event)
    {
        if (event)
        {
            event.stopPropagation()
        }
        this.contentsVisible = !this.contentsVisible
        // console.log(this.querySelector("svg"))
        let icon = this.querySelector("svg")
        if (icon)
            {
                icon.style.transform = this.contentsVisible ? "rotate(90deg)" : ""
            }
        this.children[1].style.display = this.contentsVisible ? "block" : "none"
        this.updateOffset()
    }

    updateOffset() {
        if (this.nextElementSibling)
        {
            this.nextElementSibling.style.top = (this.contentsVisible) ? `calc(var(--sidebarHeight) * ${this.descendants})` : "0"
        }
    }

    countAllDescendants() {
        function recursiveCount(node) {
            let count = 0
            for (let i = 0; i < node.children.length; i++)
            {
                count++
                count+=recursiveCount(node.children[i])
            }
            return count
        }

        return recursiveCount(this);
      }
      
}

customElements.define("sidebar-item", sidebarItem)