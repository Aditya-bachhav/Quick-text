document.getElementById('send-message').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    if (message.trim() === "") {
        alert("Please enter a message.");
        return;
    }

    const uniqueCode = generateUniqueCode();
    localStorage.setItem(uniqueCode, message);
    document.getElementById('unique-code').innerText = uniqueCode;
    document.getElementById('message').value = "";
});

document.getElementById('get-message').addEventListener('click', () => {
    const code = document.getElementById('code-input').value.trim();
    const message = localStorage.getItem(code);
    if (message) {
        document.getElementById('retrieved-message').innerText = message;
        document.getElementById('display-message').style.display = 'block';
    } else {
        alert("Invalid code. Please try again.");
    }
});

function generateUniqueCode() {
    let code = "";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}
