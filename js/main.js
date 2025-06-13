import { login, signup, openLoginModal, closeLoginModal, logout, switchAuthTab } from "./auth.js";
import { getAIRecommendation } from "./AIRecommendation.js";
import { openModal, closeModal, searchMoviesForModal, addMovieToWatchlist, closeDuplicateModal, forceAddDuplicate } from "./addMovie.js";
import { loadPage, filterMovies, searchMovies, getMovies, renderMovies, getFilter } from "./loadPage.js";
import { toggleWatched, removeMovie, closeMovieDetailsModal } from "./movieActions.js";
import { searchUser } from "./searchUser.js";
import { changeTheme, getCurrentTheme } from "./themeManager.js";

document.addEventListener("DOMContentLoaded", () => {

    // Add click event listeners for profile dropdown

    const profileBtn = document.querySelector('.profile-btn');
    const dropdown = document.querySelector('.profile-dropdown');
    const themeItem = document.querySelector('.theme-item');
    const themeSubmenu = document.querySelector('.theme-submenu');
    const themeOptionDefault = document.querySelector('.theme-default');
    const themeOptionCyberpunk = document.querySelector('.theme-cyberpunk');

    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('aaaaa')
        dropdown.classList.toggle('show');
    });

    themeItem.addEventListener('click', function(e) {
        e.stopPropagation();
        themeSubmenu.classList.toggle('show');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target) && !profileBtn.contains(e.target)) {
            dropdown.classList.remove('show');
            themeSubmenu.classList.remove('show');
        }
    });

    // Prevent dropdowns from closing when clicking inside them
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    themeOptionDefault.addEventListener('click', function(e) {
        e.stopPropagation();
        changeTheme('default');
    });

    themeOptionCyberpunk.addEventListener('click', function(e) {
        e.stopPropagation();
        changeTheme('cyberpunk');
    });


    // Auth functionality
    const loginBtn = document.getElementById("login");
    const signupBtn = document.getElementById("signup");
    const loginModalCancel = document.getElementById("login-modal-cancel");
    const signupModalCancel = document.getElementById("signup-modal-cancel");
    const loginModalBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const authTabs = document.querySelectorAll('.auth-tab');

    loginBtn.addEventListener("click", login);
    signupBtn.addEventListener("click", signup);
    loginModalCancel.addEventListener("click", closeLoginModal);
    signupModalCancel.addEventListener("click", closeLoginModal);
    loginModalBtn.addEventListener("click", openLoginModal);
    logoutBtn.addEventListener("click", logout);

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchAuthTab(tab.dataset.tab);
        });
    });

    // AI recommendation functionality
    const aiRecommendationBtn = document.getElementById("ai-recommendation-btn");
    aiRecommendationBtn.addEventListener("click", getAIRecommendation);

    // Add movie functionality
    const addMovieBtn = document.getElementById("add-btn");
    const addMovieModal = document.getElementById("add-movie-modal");
    const cancelAddBtn = document.getElementById("cancel-add-btn");
    const modalSearchInput = document.getElementById("modalSearchInput");
    const modalSearchResults = document.getElementById("modalSearchResults");
    const duplicateModal = document.getElementById("duplicate-modal");

    addMovieBtn.addEventListener("click", openModal);
    cancelAddBtn.addEventListener("click", closeModal);

    let movieSearchResultItems = document.querySelectorAll('.search-result-item');

    modalSearchInput.addEventListener("input", () => {
        searchMoviesForModal(modalSearchInput.value)
    });

    let currentIndex = -1;
    modalSearchInput.addEventListener('keydown', (e) => {
        movieSearchResultItems = document.querySelectorAll('.search-result-item');
        const visibleItems = Array.from(movieSearchResultItems).filter(item => 
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
            console.log('enter')
        } else if (e.key === 'Escape') {
            autocompleteList.classList.remove('show');
            currentIndex = -1;
        }
    });

    function updateActiveItem(visibleItems) {
        movieSearchResultItems.forEach(item => item.classList.remove('active'));
        if (currentIndex >= 0 && visibleItems[currentIndex]) {
            const activeItem = visibleItems[currentIndex];
            activeItem.classList.add('active');

            const container = document.getElementById('modalSearchResults');
            const itemTop = activeItem.offsetTop;
            const itemBottom = itemTop + activeItem.offsetHeight;
            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.clientHeight;
            
            // Scroll down if item is below visible area
            if (itemBottom > containerBottom) {
                container.scrollTop = itemBottom - container.clientHeight;
            }
            // Scroll up if item is above visible area
            else if (itemTop < containerTop) {
                container.scrollTop = itemTop;
            }
        }
    }

    modalSearchResults.addEventListener("click", closeModal);

    const loginModal = document.getElementById("login-modal");
    
    loginModal.addEventListener("keydown", (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeLoginModal();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if(document.activeElement.id === 'login-modal-cancel' || document.activeElement.id === 'signup-modal-cancel') {
                closeLoginModal();
                return;
            }
            if(document.activeElement.id === 'login-username' || document.activeElement.id === 'signup-username') {
                if(document.activeElement.value === '') {
                    document.activeElement.focus();
                } else {
                    document.getElementById(document.activeElement.id === 'login-username' ? 'login-password' : 'signup-password').focus();
                }
            } else if(document.activeElement.id === 'login-password' || document.activeElement.id === 'signup-password') {
                if(document.activeElement.value === '') {
                    document.activeElement.focus();
                } else if(document.activeElement.id === 'signup-password') {
                    document.getElementById('signup-confirm-password').focus();
                } else {
                    login();
                }
            } else if(document.activeElement.id === 'signup-confirm-password') {
                if(document.activeElement.value === '') {
                    document.activeElement.focus();
                } else {
                    document.getElementById('signup').focus();
                }
            } else if(document.activeElement.id === 'login') {
                login();
            } else if(document.activeElement.id === 'signup') {
                signup();
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const activeForm = document.querySelector('.auth-form[style="display: block;"]');
            const inputs = activeForm.querySelectorAll('input, button');
            const currentIndex = Array.from(inputs).indexOf(document.activeElement);
            
            if (currentIndex === -1 || currentIndex === inputs.length - 1) {
                inputs[0].focus();
            } else {
                inputs[currentIndex + 1].focus();
            }
        }
    });


    window.addEventListener('click', function (event) {
        if (event.target.id === "login-modal") {
            closeLoginModal();
        }
    });

    window.addEventListener('click', function (event) {
        if (event.target.id === "add-movie-modal") {
            console.log("close")
            closeModal();
        }
    });

    document.addEventListener('click', function (e) {
        const popup = document.getElementById('streaming-popup');
        if (!popup.contains(e.target) && !e.target.closest('.movie-watch')) {
            popup.style.display = 'none';
        }
    });

    window.addEventListener('click', function(event) {
        const modal = document.getElementById('movie-details-modal');
        if (event.target === modal) {
            closeMovieDetailsModal();
        }
    });

    duplicateModal.addEventListener("click", closeDuplicateModal);
    document.getElementById("force-add-btn").addEventListener("click", forceAddDuplicate);

    // Filter movies
    document.getElementById('filter-tab-all').addEventListener('click', (event) => {
        filterMovies('all');
    });

    document.getElementById('filter-tab-to-watch').addEventListener('click', (event) => {
        filterMovies('to-watch');
    });

    document.getElementById('filter-tab-watched').addEventListener('click', (event) => {
        filterMovies('watched');
    });

    document.getElementById('search-input').addEventListener('input', searchMovies);

    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    let currentSort = 'addeddate-asc';

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        sortMovies();
    });

    function sortMovies() {
        const [field, direction] = currentSort.split('-');
        const isAsc = direction === 'asc';

        let movies = getMovies()
        
        movies.sort((a, b) => {
            let valueA, valueB;
            
            switch(field) {
                case 'title':
                    valueA = a.title.toLowerCase();
                    valueB = b.title.toLowerCase();
                    break;
                case 'year':
                    valueA = parseInt(a.year) || 0;
                    valueB = parseInt(b.year) || 0;
                    break;
                case 'rating':
                    valueA = parseFloat(a.imdbRating) || 0;
                    valueB = parseFloat(b.imdbRating) || 0;
                    break;
                case 'watchdate':
                    valueA = a.watchDate ? new Date(a.watchDate).getTime() : 0;
                    valueB = b.watchDate ? new Date(b.watchDate).getTime() : 0;
                    break;
                case 'addeddate':
                    valueA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
                    valueB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
                    break;
                default:
                    return 0;
            }
            
            if (valueA < valueB) return isAsc ? -1 : 1;
            if (valueA > valueB) return isAsc ? 1 : -1;
            return 0;
        });

        // Re-apply current filter
        let filteredMovies = movies;
        if (getFilter() === 'watched') {
            filteredMovies = movies.filter(m => m.watched);
        } else if (getFilter() === 'to-watch') {
            filteredMovies = movies.filter(m => !m.watched);
        }

        renderMovies(filteredMovies);
    }

    // View controls
    let currentView;
    let currentGridSize;

    fetch(`http://localhost:8080/api/settings`, {
        method: 'GET',
        credentials: 'include'
    }).then(response => {
        if (!response.ok) {
            currentView = localStorage.getItem('view') || 'grid';
            currentGridSize = localStorage.getItem('gridSize') || 3;
            changeSettings();

            return;
        }
        return response.json();
    })
    .then(data => {
        if(data){
            currentView = data.view;
            currentGridSize = data.gridSize;
        }
        
        changeSettings();

    })

    function changeSettings() {

        if(parseInt(currentView) === 0){
            viewList();
        } else {
            viewGrid();
        }

        document.getElementById('movies-grid').classList.add(`grid-size-${currentGridSize}`);
        document.getElementById('grid-size-value').textContent = currentGridSize;

        updateCardSize(currentGridSize);

    }

    document.getElementById('decrease-grid-btn').addEventListener('click', () => {
        decreaseGrid();
    });
    
    document.getElementById('increase-grid-btn').addEventListener('click', () => {
        increaseGrid();
    });

    let settingsChangeDebounceTimeout;

    function decreaseGrid() {
        if (currentGridSize > 2) {
            currentGridSize--;
            document.getElementById('grid-size-value').textContent = currentGridSize;
            if (parseInt(currentView) === 1) {
                document.getElementById('movies-grid').classList.remove(`grid-size-${currentGridSize + 1}`);
                document.getElementById('movies-grid').classList.add(`grid-size-${currentGridSize}`);
                    
                updateCardSize(currentGridSize);

                localStorage.setItem('gridSize', currentGridSize);

                if(settingsChangeDebounceTimeout) clearTimeout(settingsChangeDebounceTimeout);
                settingsChangeDebounceTimeout = setTimeout(() => {
                    fetch(`http://localhost:8080/api/settings`, {
                        method: 'PATCH',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            gridSize: currentGridSize
                        })
                    }).then(response => {
                        if (!response.ok) {
                            console.error('Failed to update grid size');
                        }
                    });
                }, 300);
            }
        }
    }

    function increaseGrid() {
        if (currentGridSize < 5) {
            currentGridSize++;
            document.getElementById('grid-size-value').textContent = currentGridSize;
            if (parseInt(currentView) === 1) {
                document.getElementById('movies-grid').classList.remove(`grid-size-${currentGridSize - 1}`);
                document.getElementById('movies-grid').classList.add(`grid-size-${currentGridSize}`);

                console.log(currentGridSize)

                updateCardSize(currentGridSize);

                localStorage.setItem('gridSize', currentGridSize);

                if(settingsChangeDebounceTimeout) clearTimeout(settingsChangeDebounceTimeout);
                settingsChangeDebounceTimeout = setTimeout(() => {
                    fetch(`http://localhost:8080/api/settings`, {
                        method: 'PATCH',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            gridSize: currentGridSize
                        })
                    })
                }, 300);
            }
        }
    }

    function updateCardSize(currentGridSize) {
        const container = document.getElementById('movies-grid');
        container.classList.remove(`grid-size-3`, `grid-size-4`);
        container.classList.add(`grid-size-${currentGridSize}`);
    }

    let viewChangeDebounceTimeout;

    function viewGrid(){
        document.getElementById('grid-view-btn').classList.add('active');
        document.getElementById('list-view-btn').classList.remove('active');
        document.getElementById('movies-grid').classList.remove('list-view');
        document.getElementById('movies-grid').classList.add(`grid-size-${currentGridSize}`);
    
        localStorage.setItem('view', 1);
    
        if(viewChangeDebounceTimeout) clearTimeout(viewChangeDebounceTimeout);
        viewChangeDebounceTimeout = setTimeout(() => {
    
            fetch(`http://localhost:8080/api/settings`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    view: 1
                })
            })
        }, 300);
    }

    function viewList(){
        document.getElementById('list-view-btn').classList.add('active');
        document.getElementById('grid-view-btn').classList.remove('active');
        document.getElementById('movies-grid').classList.add('list-view');
        document.getElementById('movies-grid').classList.remove(`grid-size-${currentGridSize}`);
        
        localStorage.setItem('view', 0);
        
        if(viewChangeDebounceTimeout) clearTimeout(viewChangeDebounceTimeout);
        viewChangeDebounceTimeout = setTimeout(() => {
            fetch(`http://localhost:8080/api/settings`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    view: 0
                })
            })
        }, 300);
    }

    document.getElementById('grid-view-btn').addEventListener('click', () => {
        viewGrid();
    });

    document.getElementById('list-view-btn').addEventListener('click', () => {
        viewList();
    });


    // Initialize grid size
    document.getElementById('movies-grid').classList.add(`grid-size-${currentGridSize}`);

});