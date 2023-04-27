const button = document.querySelector('.submit-button')
const profileColor = document.querySelector('profile-color').value;

button.addEventListener('click', () => {
    const placement = document.querySelector('.place-color');
    placement.insertAdjacentElement = profileColor;

})

