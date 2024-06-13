const toggleSender = document.getElementById('toggle-sender');
const toggleReceiver = document.getElementById('toggle-receiver');
const senderBox = document.getElementById('sender-box');
const receiverBox = document.getElementById('receiver-box');
const previousMessages = document.getElementById('previous-messages');

toggleSender.addEventListener('click', () => {
    senderBox.style.display = 'block';
    receiverBox.style.display = 'none';
    displayPreviousMessages();
});

toggleReceiver.addEventListener('click', () => {
    senderBox.style.display = 'none';
    receiverBox.style.display = 'block';
});

document.getElementById('send-message').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (message.trim() === "" && !file) {
        alert("Please enter a message or select a file.");
        return;
    }

    const uniqueCode = generateUniqueCode();
    const data = {
        message: message,
        file: file ? file.name : null,
        fileData: file ? URL.createObjectURL(file) : null,
        timestamp: Date.now()
    };

    localStorage.setItem(uniqueCode, JSON.stringify(data));
    document.getElementById('unique-code').innerText = uniqueCode;
    document.getElementById('message').value = "";
    fileInput.value = "";

    setTimeout(() => {
        localStorage.removeItem(uniqueCode);
        displayPreviousMessages();
    }, 2 * 60 * 60 * 1000); // 2 hours

    displayPreviousMessages();
});

document.getElementById('get-message').addEventListener('click', () => {
    const code = document.getElementById('code-input').value.trim();
    const data = JSON.parse(localStorage.getItem(code));

    if (data) {
        const now = Date.now();
        if (now - data.timestamp > 2 * 60 * 60 * 1000) {
            alert("The session has expired.");
            localStorage.removeItem(code);
            displayPreviousMessages();
            return;
        }

        document.getElementById('retrieved-message').innerText = data.message;
        if (data.file) {
            const downloadLink = document.getElementById('download-link');
            downloadLink.href = data.fileData;
            downloadLink.innerText = `Download ${data.file}`;
            downloadLink.style.display = 'inline';
        }
        document.getElementById('display-message').style.display = 'block';

        document.getElementById('download-link').addEventListener('click', () => {
            setTimeout(() => {
                localStorage.removeItem(code);
                displayPreviousMessages();
            }, 5 * 60 * 1000); // Extend session for 5 more minutes if file download is in progress
        });
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

function displayPreviousMessages() {
    previousMessages.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const data = JSON.parse(localStorage.getItem(key));
        const now = Date.now();
        if (now - data.timestamp < 2 * 60 * 60 * 1000) {
            const li = document.createElement('li');
            li.innerText = `${key}: ${data.message.substring(0, 20)}...`;
            li.addEventListener('click', () => {
                alert(`Code: ${key}\nMessage: ${data.message}\nFile: ${data.file ? data.file : 'No file'}`);
            });
            previousMessages.appendChild(li);
        }
    }
}

// Initial display
displayPreviousMessages();
