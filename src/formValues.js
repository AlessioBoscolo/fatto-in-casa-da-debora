const userAccess = {
    email: {
        type: "text",
        value: "Inserisci l'email",
        placeholder: "name@gmail.com",
        isRequired: false,
        isOnlyRegistration: false,
    },
    password: {
        type: "password",
        value: "Inserisci la password",
        placeholder: "****************",
        isRequired: true,
        isOnlyRegistration: false,
    },
    confirm_password: {
        type: "password",
        value: "Conferma la password",
        placeholder: "****************",
        isRequired: true,
        isOnlyRegistration: true,
    },

}

export default userAccess;