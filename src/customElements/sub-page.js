;class subPage extends HTMLElement {
    constructor() {
        super(); //Initalize the html element
        this.loaded = false;
        if (this.parentElement.tagName.toLowerCase()=="hot-swap" && !this.hasAttribute("default"))
        {
            this.hide() //Hide if inside a hot swapper but not default
        } else if (this.hasAttribute("default") || this.hasAttribute("instant")) {
            this.load() //Load if instant or default
        }
    }

    load() {
        if (!this.loaded)
        {
            const src = this.getAttribute('src');
            console.log(src)
            if (src) {
                fetch(src)
                    .then(response => response.text())
                    .then(text => {
                        console.log(text)
                        this.innerHTML = text;
                        this.runScripts()
                        this.loaded = true;
                    });
            }
        }
    }

    runScripts() //Start the scripts of the sub page
    {
        this.querySelectorAll("script").forEach(originalScript => {
            let newScript = document.createElement("script")
            if (originalScript.hasAttribute("src")) {
                fetch(originalScript.attributes.src.value).then(e=>{return e.text()}).then(text => {
                    newScript.textContent = text
                })
            } else {
                newScript.textContent = originalScript.textContent
            }
            originalScript.parentNode.replaceChild(newScript, originalScript)
        })
    }

    hide() { //Hide the hotswappable page
        this.style.display = "none";
    }

    show() { //Reveal the page
        this.load()
        this.style.display = "block";
    }
}