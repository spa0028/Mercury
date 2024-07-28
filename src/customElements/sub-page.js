//This element acts as a link to another HTML document
//It is different to an iframe because the child document merges with the parent
//In an iframe the child document is more sandboxed and the css doesn't normally leak from the parent to child
//But for a sub-page it embeds directly and shouldn't even contain <html> or <body>

//The target attribute defines what page it points to
//For example "test" points to "pages/test.html"

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

    load() { //Load in the target HTML document
        if (!this.loaded && this.hasAttribute("target"))
        {
            let target = this.getAttribute('target');
            fetch(`pages/${target}.html`)
                .then(response => response.text())
                .then(text => {
                    this.innerHTML = text;
                    this.runScripts()
                    this.loaded = true;
                });
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