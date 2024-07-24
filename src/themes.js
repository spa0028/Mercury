//Initialize themes
var theme = {"current": void(0),
    "themes": {
        "Dart": {"Background": "#06141f", "Accent": "#b3ff00", "Border": "#3a3a3a", "Panel": "#a4d5fd1a"},
        "Ion": {"Background": "#103337", "Accent": "#53e8d5", "Border": "#5a6473", "Panel": "#21212159"},
        "Quicksilver": {"Background": "#7d8390", "Accent": "#f1f6ff", "Border": "#373c47", "Panel": "#4c4f5759"},
        "Test": {"Background": "linear-gradient(218deg, #f00, #00f)", "Accent": "#fff", "Border": "#888", "Panel": "#aaa8"}
}}

function setTheme(newTheme) { //Set the active theme
    theme.current = newTheme
    for (let key in theme.themes[newTheme]) //For every property to change
    {
        document.documentElement.style.setProperty(`--theme${key}`, theme.themes[newTheme][key]) //Change that property
    }
}

setTheme("Dart")