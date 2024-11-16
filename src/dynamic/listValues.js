
const typeList = {
    category: {
        choose_1: {
            name: "Test",
            path : "/",
            click: null,
        },
        choose_2: {
            name: "Inserisci",
            path : "/home",
            click: null,
        }
    },
    userAccess: {
        choose_1: {
            name: "Dashboard",
            path: "/home",
            click: null,
        },
        choose_2: {
            name: "Logout",
            path: null,
            click: "handleLogout",
        }
    }
}

export default typeList;