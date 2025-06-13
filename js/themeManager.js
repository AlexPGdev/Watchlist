    let currentTheme;

    fetch(`http://localhost:8080/api/settings`, {
        method: 'GET',
        credentials: 'include'
    }).then(response => {
        if (!response.ok) {
            currentTheme = localStorage.getItem('theme') || 'default';
            changeTheme(currentTheme);
            throw new Error('Failed to fetch theme');
        }
        return response.json();
    })
    .then(data => {
        if(data.theme){
            currentTheme = data.theme;
            changeTheme(currentTheme);
        }
    })
    .catch(error => {
        console.error('Error fetching theme:', error);
    });


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

        if(theme !== currentTheme){
            setCurrentTheme(theme);
        }
    }

    export function getCurrentTheme() {
        return theme;
    }

    export function setCurrentTheme(theme) {
        currentTheme = theme;

        localStorage.setItem('theme', theme);

        fetch(`http://localhost:8080/api/settings`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                theme: theme
            })
        }).then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error('Error updating theme:', error);
        });
    }