const typeList = {
  userAccess: {
    choose_1: {
      name: "Dashboard",
      path: "/dashboard",
      click: null,
      permission: "3",
      permission_email: null,
    },
    choose_2: {
      name: "Menu",
      path: "/menu",
      click: null,
      permission: "1",
      permission_email: null,
    },
    choose_3: {
      name: "Inserisci Ricetta",
      path: "/ricetta/inserisci",
      click: null,
      permission: "2",
      permission_email: null,
    },
    choose_4: {
      name: "Gallanz Scheduler",
      path: '/gallanzScheduler',
      click: null,
      permission: 999,
      permission_email: ['elisagalante06@gmail.com', 'boscolo.alessio1@gmail.com'],
    },
    choose_5: {
      name: "Logout",
      path: null,
      click: "handleLogout",
      permission: "1",
      permission_email: null,
    },

  },
};

export default typeList;
