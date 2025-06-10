export function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
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
            username: username,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            if(data){
                window.location.reload();
            }
        })
        .catch(error => {
            alert('Login failed. Please check your credentials.');
            console.error('Login error:', error);
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
    }, 300);
}

export function logout() {
    fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to logout');
        }
        localStorage.removeItem('remember-me')
        window.location.reload();
    });
}