const loginBtn = document.querySelector('#login-btn');

const userLogin = () => {
    let loginUserName = document.querySelector('#login-user-name').value.trim();
    let loginPassword = document.querySelector('#login-password').value.trim();

    const validUsername = "admin";
    const validPassword = "admin123";

    if (loginUserName === validUsername && loginPassword === validPassword) {
        localStorage.setItem('isLoggedIn', 'true');

        alert('Login Successful!');

        window.location.replace('home.html');
    } else {
        alert('Login Failed!');

        return;
    }
};

loginBtn.addEventListener('click', userLogin);
