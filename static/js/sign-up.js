const errorMessages = document.getElementsByClassName("error-message");
const successfulMessage = document.getElementById("successfulRegistration");
const submitButton = document.getElementById("submitButton");
const loader = document.getElementById("loader")


submitButton.addEventListener('click', () => {
    setTimeout( function () {
        for (let i = 0; i < errorMessages.length; i++) {
            errorMessages[i].innerHTML = '';
        }
        successfulMessage.innerText = 'Successful registration! Please wait a second!';
        loader.style.display = 'block';
    }, 1000
)
})