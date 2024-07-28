//My manager for automatically and dynamically importing custom elements
//A bit over the top when I can just import the scripts with script tags
//But it saves me from having to have a big block of many script tags
//And only loads scripts once so if two pages use the same element it caches its code

var registeredElements = [] //Custom elements that have been marked as either imported or currently importing

function importCustomElement(node) { //Import the script associated with a custom element
    if (node.tagName.includes('-')) { //If it is a custom element
        let customTag = node.tagName.toLowerCase()
        // console.log(customTag)
        if (!registeredElements.includes(customTag)) //Check to make sure the element hasn't already been imported or is being imported
        {
            registeredElements.push(customTag) //Add to list of already registered element tags
            fetch(`customElements/${customTag}.js`).then(e=>{return e.text()}).then(text=>{ //Fetch the script
                // console.log(text)
                let split = text.split(";class") //Split the script on "class" to seperate the initalising code from the actual class
                eval(split[0]) //Run initalizer code
                // console.log(split)
                try {
                customClass = eval(`(class${split[1]})`) //Get the class
                } catch (e) {
                    console.warn(split)
                }
                customElements.define(customTag, customClass) //Define the custom element
                console.log(`Imported ${customTag} Element`)
            })
        }
    }

    //Rescan
    node.querySelectorAll('*').forEach(importCustomElement);
}

//Scan all elements already on the page and import scripts as neede
document.querySelectorAll('*').forEach(importCustomElement);

const observer = new MutationObserver(mutations => { //Detect changes and new element
    mutations.forEach(mutation => { //For each new change
        mutation.addedNodes.forEach(node => { //For the new nodes
            if (node.nodeType === Node.ELEMENT_NODE) { //Make sure it is an actual tag and not just text or something
                importCustomElement(node); //Import the new element
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true }); //Initalize the observer