    let theme = 'cyberpunk';

    export function changeTheme(theme) {
        const stylesheets = document.styleSheets;
        
        // Disable all stylesheets first
        for (let i = 0; i < stylesheets.length; i++) {
            stylesheets[i].disabled = true;
        }
        
        // Enable the selected theme
        switch(theme) {
            case 'cyberpunk':
                stylesheets[0].disabled = false; // cyberpunk.css
                break;
            case 'default':
                stylesheets[1].disabled = false; // watchlist.css
                break;
        }
        
        setCurrentTheme(theme);
    }

    export function getCurrentTheme() {
        return theme;
    }

    export function setCurrentTheme(theme) {
        theme = theme;
    }