const updateButton = document.querySelector('.update-display-name');
console.log(updateButton);


updateButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    console.log("This worked")

    const newName = prompt('What should we call you?');
    const formInputs = {
        updated_name: newName,
        user_id: updateButton.id,
    };

    fetch('/update-display-name', {
        method: 'POST',
        body: JSON.stringify(formInputs),
        headers: {
            'Content-Type': 'application/json',
    },
})
    .then((response) => response.json())
    .then((responseJson) => {
        // alert(responseJson.status);
        // console.log(responseJson)
        if (responseJson["code"] == "Success") {
            document.querySelector('#new-name').innerHTML = responseJson['name'];
        }
    });
});