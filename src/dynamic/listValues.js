const typeList = {
  userAccess: {
    choose_1: {
      name: "Dashboard",
      path: "/home",
      click: null,
      permission: "3",
    },
    choose_2: {
      name: "Inserisci Ricetta",
      path: "/ricetta/inserisci",
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
};

export default typeList;
