const userAccess = {
    name: {
        type: "text",
        value: "Inserisci il nome",
        placeholder: "nome",
        isRequired: true,
        isOnlyRegistration: true,
    },
    surname: {
        type: "text",
        value: "Inserisci il cognome",
        placeholder: "cognome",
        isRequired: true,
        isOnlyRegistration: true,
    },
    email: {
        type: "email",
        value: "Inserisci l'email",
        placeholder: "name@gmail.com",
        isRequired: true,
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