const typeList = {
  category: {
    choose_1: {
      name: "Test",
      path: "/",
      click: null,
    },
    choose_2: {
      name: "Inserisci",
      path: "/home",
      click: null,
    },
  },
  userAccess: {
    choose_1: {
      name: "Dashboard",
      path: "/home",
      click: null,
      permission: "3",
    },
    choose_2: {
      name: "Inserisci Ricetta",
      path: "/home",
      click: null,
      permission: "2",
    },
    choose_3: {
      name: "Logout",
      path: null,
      click: "handleLogout",
      permission: "1",
    },
  },
  followUs: {
    choose_1: {
        name: "Instagram",
        permission: "1",
    },
    choose_2: {
        name: "Facebook",
        permission: "1",
    },

  },
};

export default typeList;
