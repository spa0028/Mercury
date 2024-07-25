class sidebarItem extends HTMLElement {
    constructor() {
        super()
        if (this.hasAttribute("label"))
            {
                this.descendants = this.countAllDescendants()
                console.log(this, this.descendants)

                //add mainDiv to top of children list
                let mainDiv = (this.children.length==0) ? this.appendChild(document.createElement("div")) : this.insertBefore(document.createElement("div"), this.firstChild)

                let labelText = mainDiv.appendChild(document.createElement("h2"))
                labelText.textContent = this.attributes.label.value
                this.updateOffset()
            }
    }

    updateOffset() {
        if (this.nextElementSibling)
        {
            this.nextElementSibling.style.top = `calc(var(--sidebarHeight) * ${this.descendants})`
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