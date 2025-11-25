const {pool} = require("../../config/database");

const spesaController = {

    // Nel tuo controller
    getMenuAnalysis: async (req, res) => {
        try {
          // 1. Recupera tutti gli elementi del menu
          const queryMenu = `
            SELECT m.*, r.nome_ricetta, r.porzioni_ricetta
            FROM menu m
            LEFT JOIN ricetta r ON m.id_ricetta = r.id_ricetta
          `;
          const [menuItems] = await pool.query(queryMenu);
      
          const analysis = [];
      
          for (const menuItem of menuItems) {
            if (menuItem.id_ricetta === 1) {
              // CASO 1: Ricetta personalizzata (id_ricetta = 1)
              
              const querySpesa = `
                SELECT ms.porzioni, ms.id_menu_spesa,
                       si.id_ingrediente, si.quantita, si.id_unita_misura,
                       i.nome_ingrediente,
                       um.nome_unita_misura
                FROM menu_spesa ms
                INNER JOIN spesa_ingredienti si ON ms.id_menu_spesa = si.id_menu_spesa
                INNER JOIN ingrediente i ON si.id_ingrediente = i.id_ingrediente
                INNER JOIN unita_misura um ON si.id_unita_misura = um.id_unita_misura
                WHERE ms.id_menu = ?
              `;
              const [spesaIngredienti] = await pool.query(querySpesa, [menuItem.id_menu]);
      
              // Calcola quantità totale per ogni ingrediente moltiplicato per porzioni
              const ingredientiCalcolati = spesaIngredienti.map(item => ({
                id_ingrediente: item.id_ingrediente,
                nome_ingrediente: item.nome_ingrediente,
                quantita_originale: item.quantita,
                porzioni: item.porzioni,
                quantita_totale: item.quantita * item.porzioni,
                unita_misura: item.nome_unita_misura
              }));
      
              analysis.push({
                id_menu: menuItem.id_menu,
                nome_ricetta: menuItem.nome_ricetta_personalizzata || "Ricetta personalizzata",
                tipo: "personalizzata",
                id_giorno_settimana: menuItem.id_giorno_settimana,
                id_momento_giornata: menuItem.id_momento_giornata,
                ingredienti: ingredientiCalcolati
              });
      
            } else {
              // CASO 2: Ricetta dal database (id_ricetta != 1)
              
              const queryMenuSpesa = `
                SELECT porzioni 
                FROM menu_spesa 
                WHERE id_menu = ?
              `;
              const [menuSpesa] = await pool.query(queryMenuSpesa, [menuItem.id_menu]);
              const porzioniRichieste = menuSpesa[0]?.porzioni || 1;
      
              const queryRicettaIngredienti = `
                SELECT ir.quantita_ingrediente, ir.id_ingrediente, ir.id_unita_misura,
                       i.nome_ingrediente,
                       um.nome_unita_misura
                FROM ingrediente_ricetta ir
                INNER JOIN ingrediente i ON ir.id_ingrediente = i.id_ingrediente
                INNER JOIN unita_misura um ON ir.id_unita_misura = um.id_unita_misura
                WHERE ir.id_ricetta = ?
              `;
              const [ricettaIngredienti] = await pool.query(queryRicettaIngredienti, [menuItem.id_ricetta]);
      
              // Calcola proporzione: (quantità_ricetta / porzioni_ricetta) * porzioni_richieste
              const porzioniRicetta = menuItem.porzioni_ricetta || 1;
              const fattoreProporzione = porzioniRichieste / porzioniRicetta;
      
              const ingredientiCalcolati = ricettaIngredienti.map(item => ({
                id_ingrediente: item.id_ingrediente,
                nome_ingrediente: item.nome_ingrediente,
                quantita_originale: item.quantita_ingrediente,
                porzioni_ricetta: porzioniRicetta,
                porzioni_richieste: porzioniRichieste,
                fattore_proporzione: fattoreProporzione,
                quantita_totale: item.quantita_ingrediente * fattoreProporzione,
                unita_misura: item.nome_unita_misura
              }));
      
              analysis.push({
                id_menu: menuItem.id_menu,
                nome_ricetta: menuItem.nome_ricetta,
                tipo: "ricetta_db",
                id_giorno_settimana: menuItem.id_giorno_settimana,
                id_momento_giornata: menuItem.id_momento_giornata,
                porzioni_ricetta: porzioniRicetta,
                porzioni_richieste: porzioniRichieste,
                ingredienti: ingredientiCalcolati
              });
            }
          }
      
          res.status(200).json(analysis);
      
        } catch (error) {
          console.error("Error analyzing menu:", error);
          res.status(500).json({
            message: "Error analyzing menu",
            error: error.message,
          });
        }
    }
};

module.exports = spesaController;