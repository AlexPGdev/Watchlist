import { login, signup, openLoginModal, closeLoginModal, logout, switchAuthTab } from "./auth.js";
import { getAIRecommendation } from "./AIRecommendation.js";
import { openModal, closeModal, searchMoviesForModal, addMovieToWatchlist, closeDuplicateModal, forceAddDuplicate } from "./addMovie.js";
import { loadPage, filterMovies, searchMovies } from "./loadPage.js";
import { toggleWatched, removeMovie, closeMovieDetailsModal } from "./movieActions.js";
import { searchUser } from "./searchUser.js";
import { changeTheme, getCurrentTheme } from "./themeManager.js";

document.addEventListener("DOMContentLoaded", () => {

    // Theme functionality
    changeTheme(getCurrentTheme());

    // Add click event listeners for profile dropdown

    const profileBtn = document.querySelector('.profile-btn');
    const dropdown = document.querySelector('.profile-dropdown');
    const themeItem = document.querySelector('.theme-item');
    const themeSubmenu = document.querySelector('.theme-submenu');
    const themeOptionDefault = document.querySelector('.theme-default');
    const themeOptionCyberpunk = document.querySelector('.theme-cyberpunk');

    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
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

    // View controls
    let currentView = 'grid';
    let currentGridSize = 3;

    document.getElementById('grid-view-btn').addEventListener('click', () => {
        currentView = 'grid';
        document.getElementById('grid-view-btn').classList.add('active');
        document.getElementById('list-view-btn').classList.remove('active');
        document.getElementById('movies-grid').classList.remove('list-view');
        document.getElementById('movies-grid').classList.add(`grid-size-${currentGridSize}`);
    });

    document.getElementById('list-view-btn').addEventListener('click', () => {
        currentView = 'list';
        document.getElementById('list-view-btn').classList.add('active');
        document.getElementById('grid-view-btn').classList.remove('active');
        document.getElementById('movies-grid').classList.add('list-view');
        document.getElementById('movies-grid').classList.remove(`grid-size-${currentGridSize}`);
    });

    document.getElementById('decrease-grid-btn').addEventListener('click', () => {
        if (currentGridSize > 2) {
            currentGridSize--;
            document.getElementById('grid-size-value').textContent = currentGridSize;
            if (currentView === 'grid') {
                document.getElementById('movies-grid').classList.remove(`grid-size-${currentGridSize + 1}`);
                document.getElementById('movies-grid').classList.add(`grid-size-${currentGridSize}`);

                updateCardSize(currentGridSize);
            }
        }
    });

    document.getElementById('increase-grid-btn').addEventListener('click', () => {
        if (currentGridSize < 5) {
            currentGridSize++;
            document.getElementById('grid-size-value').textContent = currentGridSize;
            if (currentView === 'grid') {
                document.getElementById('movies-grid').classList.remove(`grid-size-${currentGridSize - 1}`);
                document.getElementById('movies-grid').classList.add(`grid-size-${currentGridSize}`);

                updateCardSize(currentGridSize);
            }
        }
    });

    function updateCardSize(currentGridSize) {
        if(currentGridSize === 3){
            document.querySelectorAll('.movie-card').forEach(card => {
                card.style.height = '';
                card.style.minHeight = '';
            });

            document.querySelectorAll('.movie-header').forEach(header => {
                header.style.gap = '';
            });

            document.querySelectorAll('.watched-badge').forEach(badge => {
                badge.style.padding = '';
                badge.style.fontSize = '';
            });

            document.querySelectorAll('.movie-title').forEach(title => {
                title.style.fontSize = '';
                title.style.marginBottom = '';
            });

            document.querySelectorAll('.movie-year').forEach(year => {
                year.style.fontSize = '';
                year.style.marginBottom = "";
            });

            document.querySelectorAll('.genre-tag').forEach(genres => {
                genres.style.padding = '';
                genres.style.fontSize = '';
            });

            document.querySelectorAll('.movie-streaming-service').forEach(service => {
                service.style.top = "";
            });

            document.querySelectorAll('.movie-external-ratings').forEach(ratings => {
                ratings.style.marginLeft = '';
                ratings.style.display = '';
                ratings.style.gap = '';
                ratings.style.width = '';
                ratings.style.marginTop = "";
                ratings.style.marginLeft = "";
            });

            document.querySelectorAll('.movie-description').forEach(card => {
                card.style.webkitLineClamp = '';
                card.style.top = '';
            });

            document.querySelectorAll('.action-btn').forEach(btn => {
                btn.style.fontSize = '';
                btn.style.padding = "";
            });

            document.querySelectorAll('.movie-watch span').forEach(watchBtn => {
                watchBtn.style.marginLeft = '';
            });

            document.querySelectorAll('.movie-actions').forEach(actions => {
                actions.style.gap = '';
            });

            document.querySelectorAll('.movie-ratings').forEach(ratings => {
                ratings.style.display = '';
            });
        } else if(currentGridSize === 4){
            document.querySelectorAll('.movie-card').forEach(card => {
                card.style.height = '340px';
                card.style.minHeight = '340px';
            });

            document.querySelectorAll('.movie-header').forEach(header => {
                header.style.gap = '0.5rem';
            });

            document.querySelectorAll('.watched-badge').forEach(badge => {
                badge.style.padding = '0rem 0.3rem';
                badge.style.fontSize = '0.7rem';
            });

            document.querySelectorAll('.movie-title').forEach(title => {
                title.style.fontSize = '1rem';
                title.style.marginBottom = '0.2rem';
            });

            document.querySelectorAll('.movie-year').forEach(year => {
                year.style.fontSize = '0.9rem';
                year.style.marginBottom = "0.1rem";
            });

            document.querySelectorAll('.genre-tag').forEach(genres => {
                genres.style.padding = '0.1rem 0.2rem';
                genres.style.fontSize = '10px';
            });

            document.querySelectorAll('.movie-streaming-service').forEach(service => {
                service.style.top = "115px";
            });

            document.querySelectorAll('.movie-external-ratings').forEach(ratings => {
                ratings.style.marginLeft = '0';
                ratings.style.display = 'flex';
                ratings.style.gap = '8rem';
                ratings.style.width = '100%';
                ratings.style.marginTop = "5px";
                ratings.style.marginLeft = "1.5rem";
            });

            document.querySelectorAll('.movie-description').forEach(card => {
                card.style.webkitLineClamp = 4;
                card.style.top = '190px';
            });

            document.querySelectorAll('.action-btn').forEach(btn => {
                btn.style.fontSize = '13px';
                btn.style.padding = "0.4rem 0.4rem";
            });

            document.querySelectorAll('.movie-watch span').forEach(watchBtn => {
                watchBtn.style.marginLeft = '0px';
            });

            document.querySelectorAll('.movie-actions').forEach(actions => {
                actions.style.gap = '0.5rem';
            });

            document.querySelectorAll('.movie-ratings').forEach(ratings => {
                ratings.style.display = 'none';
            });
        }
    }

    // Initialize grid size
    document.getElementById('movies-grid').classList.add(`grid-size-${currentGridSize}`);

});