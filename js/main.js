import { login, openLoginModal, closeLoginModal, logout } from "./auth.js";
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


    // Login functionality
    const loginBtn = document.getElementById("login");
    const loginModalCancel = document.getElementById("login-modal-cancel");
    const loginModalBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");

    loginBtn.addEventListener("click", login);
    loginModalCancel.addEventListener("click", closeLoginModal);
    loginModalBtn.addEventListener("click", openLoginModal);
    logoutBtn.addEventListener("click", logout);

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
            if(document.activeElement.id === 'login-modal-cancel') {
                closeLoginModal();
                return;
            }
            if(document.getElementById('login-username').value === '') {
                document.getElementById('login-username').focus();
            } else if(document.getElementById('login-password').value === '') {
                document.getElementById('login-password').focus();
            } else {
                login();
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if(document.activeElement.id === 'login-username') {
                document.getElementById('login-password').focus();
            } else if(document.activeElement.id === 'login-password') {
                if(document.getElementById('login-username').value === '') {
                    document.getElementById('login-username').focus();
                } else {
                    document.getElementById('login-modal-cancel').focus();
                }
            } else if(document.activeElement.id === 'login-modal-cancel') {
                document.getElementById('login').focus();
            } else if(document.activeElement.id === 'login') {
                document.getElementById('login-username').focus();
            } else {
                document.getElementById('login-username').focus();
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

});