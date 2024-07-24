class subPage extends HTMLElement {
    constructor() {
        super(); //Initalize the html element
        this.loaded = false;
        if (this.parentElement.tagName=="hot-swap")
        {
            this.hide() //Hide if inside a hot swapper
        }
    }

    load() {
        if (!this.loaded)
        {
            const src = this.getAttribute('src');
            if (src) {
                fetch(src)
                    .then(response => response.text())
                    .then(text => {
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

class hotSwapper extends HTMLElement {
    constructor() {
        super();
        this.current = this.querySelector(`sub-page[default]`)
        if (this.current)
        {  
            this.current.show() //Show the default page
        }
    }

    swap(targetName) { //Do a hotswap
        let target = this.querySelector(`[name="${targetName}"]`)
        this.current.hide()
        target.show()
        this.current = target;
    }
}

customElements.define('sub-page', subPage);
customElements.define('hot-swap', hotSwapper);

function hotSwap(swapper, target) {
    document.getElementById(swapper).swap(target)
}