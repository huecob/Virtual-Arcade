updateButton = document.querySelector('.update-display-name');

updateButton.addEventListener('click', () => {
    const newName = document.querySelector('.desired_name')

    fetch('/update-display-name')
    .then((response) => response.json())
    .then((serverData)=> {
        
    })
    // we want to check if newName exists in our DB.
    // if it does NOT, replace crud...user_display_name
    // if it does exist, let the user know that's not a thing
})