
// Update Display Name AJAX Call
updateButton = document.querySelector('form');
profileID = document.querySelector('.update-display-name');

updateButton.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formInputs = {
    newName: document.querySelector('.desired_name').value,
    }

    fetch(`/update-display-name/${profileID}`, {
        method: 'POST',
        body: JSON.stringify(formInputs),
        headers: {
            'Content-Type': 'application/json'
          }
    })
    .then((response) => response.json())
    .then((serverData)=> {
        if (serverData.success) {
            alert("Success!");
        }
    });
});
    // we want to check if newName exists in our DB.
    // if it does NOT, replace crud...user_display_name
    // if it does exist, let the user know that's not a thing