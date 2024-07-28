//This code is for tree view dropdown menu sidebar
//It is just like the left sidebar in file explorer on windows
//It is used on settings page navigation sidebar

//To create one, create a div with the class "settingsSidebar"
//Then in its styles some variables must be declared to define the appearence

//--sidebarWidth
//Horizontal width of the sidebar

//--sidebarHeight
//Height of individual sidebar items (not the whole sidebar)

//--sidebarIndent
//The indentation amount between levels

//--sidebarTextInset
//How far to indent the label text of branch nodes

//--sidebarLeafTextInset
//How far to indent the label text of leaf nodes

//Then inside the div, put "sidebar-item" tags with the attribute "label" to define the text label
//The "sidebar-item" tags can be nested to make dropdowns
//The lowest level leaf nodes can have the attribute "action" containing code to be run when triggered


;class sidebarItem extends HTMLElement { //Sidebar option/item Element
    constructor() {
        super()
        if (this.hasAttribute("label")) //If the item has a label to display
            {
                //A leaf node is a node of a tree (which is a special type of graph) that has no children
                //This is official graph theory terminology because it branches like a tree and at the end of a branch is a leaf
                //For the context of the menu, it means that it is at the lowest level and does not expand to more options

                this.leaf = this.children.length==0 //If the element has no children then that means it is a leaf node
                
                this.descendants = this.countAllDescendants() //Count how many more items are beneath this item
                
                let contentDiv = this.appendChild(document.createElement("div")) //Create and add the div for storing child nodes
                
                while (this.firstChild!=contentDiv) //While there are child sidebar items
                {
                    contentDiv.appendChild(this.firstChild) //Move them into the content div for desendants to be stored
                }
                    
                
                //Add the mainDiv to top of children list
                //The main div is the bounding box of the item and contains the label and arrow icon
                let mainDiv = this.children.length==0 ? this.appendChild(document.createElement("div")) : this.insertBefore(document.createElement("div"), contentDiv)
                
                if (this.leaf)
                {
                    this.classList.add("leaf") //Add the leaf class to indent less due to the absence of the dropdown arrow
                }
                else
                {
                    let arrow = mainDiv.appendChild(document.createElement("path-icon")) //Create the arrow icon
                    arrow.setAttribute("src", "icons/dropdown.path") //Set the path to the arrow icon
                }

                let labelText = mainDiv.appendChild(document.createElement("h2")) //Create the label text element
                labelText.textContent = this.attributes.label.value //Set the text of the label to the label attribute

                if (!this.leaf)
                {
                    this.contentsVisible = true //The child elements start visible

                    this.clickAction() //But they should start hidden, so hide them
                }

                this.onclick = (e=>{this.clickAction(e)}) //Create the click action
            }
    }

    clickAction(event)
    {
        if (event) //If the function was triggered by a click event
        {
            //Tell the click event to not propogate
            //Propogating means that the click event also fires for all parent elements
            //This would be bad as it would mean that clicking a leaf node would also click the parent, collapsing it

            event.stopPropagation()
        }

        if (this.leaf) //If this is a leaf node then clicking should do some action
        {
            if (this.hasAttribute("action"))
            {
                eval(this.attributes.action.value) //Run the code action specified by the leaf node
            }
        }
        else 
        {
            this.contentsVisible = !this.contentsVisible
            let icon = this.querySelector("svg")
            if (icon)
            {
                icon.style.transform = this.contentsVisible ? "rotate(90deg)" : ""
            }
            this.children[1].style.display = this.contentsVisible ? "block" : "none"
            this.updateOffset()
        }
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