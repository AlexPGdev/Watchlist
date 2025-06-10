    const searchInput = document.getElementById('search-user-input');
    const autocompleteList = document.getElementById('autocomplete-list');
    let autocompleteItems = document.querySelectorAll('.autocomplete-item');

    let debounceTimeout;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query.length < 2) {
            autocompleteList.classList.remove('show');
            autocompleteList.innerHTML = '';
            return;
        }

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(query)}`, {
                credentials: 'include'
            })
            .then(response => response.json())
            .then(usernames => {
                autocompleteList.innerHTML = '';
                if (!usernames.length) {
                    autocompleteList.classList.remove('show');
                }
                usernames.forEach(username => {
                    const li = document.createElement('li');
                    li.textContent = username;
                    li.classList.add('autocomplete-item');
                    li.onclick = () => {
                        //searchInput.value = username;
                        autocompleteList.innerHTML = '';
                        // Optional: redirect to user's profile
                        window.location.href = `/${username}`;
                    };
                    autocompleteList.appendChild(li);
                    autocompleteList.classList.add('show');
                });
            })
            .catch(error => {
                console.error('Search error:', error);
            });
        }, 300);

    });

    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length > 0) {
            autocompleteList.classList.add('show');
        }
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            autocompleteList.classList.remove('show');
        }, 200);
    });

    let currentIndex = -1;
    searchInput.addEventListener('keydown', (e) => {
        autocompleteItems = document.querySelectorAll('.autocomplete-item');
        const visibleItems = Array.from(autocompleteItems).filter(item => 
            item.style.display !== 'none'
        );
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, visibleItems.length - 1);
            updateActiveItem(visibleItems);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, -1);
            updateActiveItem(visibleItems);
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            visibleItems[currentIndex].click();
        } else if (e.key === 'Escape') {
            autocompleteList.classList.remove('show');
            currentIndex = -1;
        }
    });

    function updateActiveItem(visibleItems) {
        autocompleteItems.forEach(item => item.classList.remove('active'));
        if (currentIndex >= 0 && visibleItems[currentIndex]) {
            visibleItems[currentIndex].classList.add('active');
        }
    }

    export function searchUser() {

    }