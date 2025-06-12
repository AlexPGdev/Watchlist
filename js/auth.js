let initialUsername;
let initialPassword;

export function login() {
    if(!initialUsername || initialUsername === null) initialUsername = document.getElementById('login-username').value;
    if(!initialPassword || initialPassword === null) initialPassword = document.getElementById('login-password').value;

    if (!initialUsername || !initialPassword) {
        alert('Please enter both username and password');
        return;
    }

    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: initialUsername,
            password: initialPassword
        })
    })
        .then(response => {
            if (!response.ok) {
                initialUsername = null;
                initialPassword = null;
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            if(data){
                window.location.reload();
            }
        })
        .catch(error => {
            initialUsername = null;
            initialPassword = null;
            alert('Login failed. Please check your credentials.');
            console.error('Login error:', error);
        });
}

export function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (!username || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Signup failed');
            }
        })
        .then(data => {
            console.log(data)
            initialUsername = username
            initialPassword = password
            login();
            return;
        })
        .catch(error => {
            alert('Signup failed.');
            console.error('Signup error:', error.message);
        });
}

export function openLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
    const modalContent = document.getElementById('login-modal').querySelector('.modal-content');
    setTimeout(() => {
        modalContent.classList.add('active');
        document.getElementById('login-username').focus();
    }, 10);
}

export function closeLoginModal() {
    const modalContent = document.getElementById('login-modal').querySelector('.modal-content');
    modalContent.classList.remove('active');
    setTimeout(() => {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('signup-confirm-password').value = '';
    }, 300);
}

export function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(t => {
        if (t.dataset.tab === tab) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });

    forms.forEach(f => {
        if (f.id === `${tab}-form`) {
            f.style.display = 'block';
        } else {
            f.style.display = 'none';
        }
    });
}

export function logout() {
    fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(() => {
        window.location.reload();
    })
    .catch(error => {
        console.error('Logout error:', error);
    });
}