const {pool} = require("../../config/database");

const menuController = {
  getWeekDay: async (req, res) => {
    try {
      const query = "SELECT * FROM giorno_settimana";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching week's day:", error);
      res.status(500).json({
        message: "Error fetching week's day",
        error: error.message,
      });
    }
  },

  getDayMoment: async (req, res) => {
    try {
      const query = "SELECT * FROM momento_giornata";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching day moment:", error);
      res.status(500).json({
        message: "Error fetching day moment",
        error: error.message,
      });
    }
  },

  getAllRecipe: async (req, res) => {
    try {
      const query =
        "SELECT id_ricetta, nome_ricetta FROM ricetta ORDER BY nome_ricetta ASC";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching day moment:", error);
      res.status(500).json({
        message: "Error fetching day moment",
        error: error.message,
      });
    }
  },

  getPeople: async (req, res) => {
    try {
      const query = "SELECT * FROM persona";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching day moment:", error);
      res.status(500).json({
        message: "Error fetching day moment",
        error: error.message,
      });
    }
  },

  getMenu: async (req, res) => {
    try {
      const query =
        "SELECT m.*, r.nome_ricetta FROM menu m, ricetta r WHERE m.id_ricetta = r.id_ricetta";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching menu element:", error);
      res.status(500).json({
        message: "Error fetching menu element",
        error: error.message,
      });
    }
  },

  getDayConfiguration: async (req, res) => {
    try {
      const query = "SELECT * FROM giorno_settimana";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching day configuration:", error);
      res.status(500).json({
        message: "Error fetching day configuration",
        error: error.message,
      });
    }
  },

  getDaysElement: async (req, res) => {
    try {
      const { id_giorno, id_momento } = req.body;

      const query =
        "SELECT * FROM menu m, ricetta r, persona p, menu_spesa ms WHERE m.id_ricetta = r.id_ricetta AND m.id_persona = p.id_persona AND ms.id_menu = m.id_menu AND id_giorno_settimana = ? AND id_momento_giornata = ?";
      const [rows] = await pool.query(query, [id_giorno, id_momento]);
      
      const query2 =
      "SELECT * FROM menu m, ricetta r, persona p WHERE m.id_ricetta = r.id_ricetta AND m.id_persona = p.id_persona AND id_giorno_settimana = ? AND id_momento_giornata = ?";
      const [rows2] = await pool.query(query2, [id_giorno, id_momento]);

      /* Which element are in query 2 that are not present in query 1? */

      const onlyInRows2 = rows2.filter(b => 
        !rows.some(a => a.id_menu === b.id_menu)
      );      

      const sumTwoRows = [...rows, ...onlyInRows2];   
      
      const sorted = [...sumTwoRows].sort((a, b) => a.id_menu - b.id_menu);

      // Send all rows as response
      res.status(200).json(sorted);
    } catch (error) {
      console.error("Error fetching day configuration:", error);
      res.status(500).json({
        message: "Error fetching day configuration",
        error: error.message,
      });
    }
  },


  getElementsOfRecipe: async (req, res) => {
    try {
      const { idMenu } = req.body;

      const query =
        "SELECT si.id_spesa_ingredienti, i.id_ingrediente, i.nome_ingrediente, um.nome_unita_misura, si.quantita, si.id_unita_misura FROM menu m, menu_spesa ms, spesa_ingredienti si, ingrediente i, unita_misura um WHERE m.id_menu = ms.id_menu AND ms.id_menu_spesa = si.id_menu_spesa AND si.id_ingrediente = i.id_ingrediente AND si.id_unita_misura = um.id_unita_misura AND m.id_menu = ?";
      const [rows] = await pool.query(query, [idMenu]);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error getting info configuration:", error);
      res.status(500).json({
        message: "Error getting info configuration",
        error: error.message,
      });
    }
  },

  

  getMenuArchiviati: async (req, res) => {
    try {
      const query = "SELECT * FROM archivio_nome";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching menu name:", error);
      res.status(500).json({
        message: "Error fetching menu name",
        error: error.message,
      });
    }
  },

  getMenuName: async (req, res) => {
    try {
      const { id_archivied } = req.body;

      const query = "SELECT * FROM archivio_nome WHERE id_archivio_nome = ?";
      const [rows] = await pool.query(query, [id_archivied]);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching menu name:", error);
      res.status(500).json({
        message: "Error fetching menu name",
        error: error.message,
      });
    }
  },

  getArchiviedElement: async (req, res) => {
    try {
      const { id_archivied } = req.body;

      const query =
        "SELECT am.*, r.nome_ricetta FROM archivio_menu am, ricetta r WHERE am.id_ricetta = r.id_ricetta AND id_archivio_nome = ?";
      const [rows] = await pool.query(query, [id_archivied]);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching menu name:", error);
      res.status(500).json({
        message: "Error fetching menu name",
        error: error.message,
      });
    }
  },
  

  getColors: async (req, res) => {
    try {
      const query =
        "SELECT id_persona, codice_colore FROM colori";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching colors:", error);
      res.status(500).json({
        message: "Error fetching colors",
        error: error.message,
      });
    }
  },

  getLastMenu: async (req, res) => {
    try {
      const query =
        "SELECT id_menu FROM menu ORDER BY id_menu DESC LIMIT 1";
      const [rows] = await pool.query(query);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching last menu:", error);
      res.status(500).json({
        message: "Error fetching last menu",
        error: error.message,
      });
    }
  },

  
  getMenuArchiviato: async (req, res) => {
    try {
      const { idNomeMenu } = req.body;

      const query =
        "SELECT * FROM archivio_nome WHERE id_archivio_nome = ?";
      const [rows] = await pool.query(query, [idNomeMenu]);      

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching menu archived:", error);
      res.status(500).json({
        message: "Error fetching menu archived",
        error: error.message,
      });
    }
  },

  //Insert
  insertMenu: async (req, res) => {
    try {
      const {
        nome_personalizzato,
        id_ricetta,
        id_persona,
        id_giorno,
        id_momento,
        ingredientDetails,
        porzioni,
      } = req.body;
      

      // Insert ingredients for the recipe
      const query = "INSERT INTO menu(nome_ricetta_personalizzata, id_giorno_settimana, id_ricetta, id_persona, id_momento_giornata) VALUES(?, ?, ?, ?, ?)";
      const [rows] = await pool.query(query, [
        nome_personalizzato,
        id_giorno,
        id_ricetta,
        id_persona,
        id_momento,
      ]);

      const lastIdInsertedMenu = rows.insertId;
      
      const query2 = "INSERT INTO menu_spesa(id_menu, porzioni) VALUES(?, ?)";
      const [rows2] = await pool.query(query2, [
        lastIdInsertedMenu,
        porzioni,
      ]);

      const lastIdMenuSpesa = rows2.insertId;
      
      if (id_ricetta === 1){
        const query3 =
          "INSERT INTO spesa_ingredienti(id_menu_spesa, id_ingrediente, id_unita_misura, quantita) VALUES(?, ?, ?, ?)";
  
        // Insert each ingredient
        for (const ingredient of ingredientDetails) {
          await pool.query(query3, [
            lastIdMenuSpesa,
            ingredient.name,
            ingredient.unit,
            ingredient.quantity,
          ]);
        }
      }
      
      res.status(200).json({
        message: "New menu inserted successfully",
      });
    } catch (error) {
      console.error("Error inserting menu:", error);
      res.status(500).json({
        message: "Error inserting menu",
        error: error.message,
      });
    }
  },


  saveMenu: async (req, res) => {
    try {
      const { nome_menu } = req.body;
    
      // Insert into archivio_nome and get the ID
      const query = "INSERT INTO archivio_nome(nome_archivio_nome) VALUES(?)";
      const [rows] = await pool.query(query, [nome_menu]);
      const archivioId = rows.insertId;
    
      /* Copy of menu in archivio_menu */
      const query2 = "SELECT * FROM menu";
      const [rows2] = await pool.query(query2);
    
      // Mappa per tenere traccia: id_menu originale -> id_archivio_menu nuovo
      const menuIdMap = new Map();
    
      const query3 =
        "INSERT INTO archivio_menu(ricetta_personalizzata_archivio_menu, id_giorno_settimana, id_ricetta, id_persona, id_momento_giornata, id_archivio_nome) VALUES(?, ?, ?, ?, ?, ?)";
    
      for (const element of rows2) {
        const [result] = await pool.query(query3, [
          element.nome_ricetta_personalizzata,
          element.id_giorno_settimana,
          element.id_ricetta,
          element.id_persona,
          element.id_momento_giornata,
          archivioId,
        ]);
        
        // Salva la mappatura: id_menu originale -> nuovo id_archivio_menu
        menuIdMap.set(element.id_menu, result.insertId);
      }
    
      /* Copy of menu_spesa in archivio_menu_spesa */
      const query4 = "SELECT * FROM menu_spesa";
      const [rows4] = await pool.query(query4);
    
      // Mappa per menu_spesa: id_menu_spesa originale -> id_archivio_menu_spesa nuovo
      const menuSpesaIdMap = new Map();
    
      const query5 = "INSERT INTO archivio_menu_spesa(id_archivio_menu, porzioni) VALUES(?, ?)";
      
      for (const element of rows4) {
        // Usa la mappatura per trovare il nuovo id_archivio_menu
        const nuovoIdArchivioMenu = menuIdMap.get(element.id_menu);
        
        if (nuovoIdArchivioMenu) {
          const [result] = await pool.query(query5, [
            nuovoIdArchivioMenu,  // Usa il nuovo ID mappato
            element.porzioni,
          ]);
          
          // Salva la mappatura per la prossima tabella
          menuSpesaIdMap.set(element.id_menu_spesa, result.insertId);
        }
      }
    
      /* Copy of spesa_ingredienti in archivio_spesa_ingredienti */
      const query6 = "SELECT * FROM spesa_ingredienti";
      const [rows6] = await pool.query(query6);
    
      const query7 = "INSERT INTO archivio_spesa_ingredienti(id_archivio_menu_spesa, id_ingrediente, id_unita_misura, quantita) VALUES(?, ?, ?, ?)";
      
      for (const element of rows6) {
        // Usa la mappatura per trovare il nuovo id_archivio_menu_spesa
        const nuovoIdArchivioMenuSpesa = menuSpesaIdMap.get(element.id_menu_spesa);
        
        if (nuovoIdArchivioMenuSpesa) {
          await pool.query(query7, [
            nuovoIdArchivioMenuSpesa,  // Usa il nuovo ID mappato
            element.id_ingrediente,
            element.id_unita_misura,
            element.quantita,
          ]);
        }
      }
    
      res.status(200).json({
        message: "Menu saving goes successfully",
        archivioId: archivioId,
      });
    } catch (error) {
      console.error("Error saving menu:", error);
      res.status(500).json({
        message: "Error saving menu",
        error: error.message,
      });
    }
  },

  uploadMenuArchivied: async (req, res) => {
    try {
      const { id_archivied } = req.body;
  
      // ========================================
      // FASE 2: COPIARE IL MENU ARCHIVIATO
      // ========================================
  
      // 2.1 Recupera i dati archiviati del menu
      const queryMenu = `
        SELECT * FROM archivio_menu 
        WHERE id_archivio_nome = ?
      `;
      const [archiviedMenu] = await pool.query(queryMenu, [id_archivied]);

      console.log(archiviedMenu);
      
  
      // Mappa per tenere traccia: id_archivio_menu -> id_menu nuovo
      const menuIdMap = new Map();
  
      // 2.2 Inserisci nel menu attivo
      const insertMenuQuery = `
        INSERT INTO menu(nome_ricetta_personalizzata, id_giorno_settimana, id_ricetta, id_persona, id_momento_giornata) 
        VALUES(?, ?, ?, ?, ?)
      `;
  
      for (const element of archiviedMenu) {
        const [result] = await pool.query(insertMenuQuery, [
          element.ricetta_personalizzata_archivio_menu,
          element.id_giorno_settimana,
          element.id_ricetta,
          element.id_persona,
          element.id_momento_giornata
        ]);
        
        // Salva la mappatura: id_archivio_menu -> nuovo id_menu
        menuIdMap.set(element.id_archivio_menu, result.insertId);
      }
  
      // 2.3 Recupera i dati archiviati di menu_spesa
      const queryMenuSpesa = `
        SELECT * FROM archivio_menu_spesa 
        WHERE id_archivio_menu IN (
          SELECT id_archivio_menu 
          FROM archivio_menu 
          WHERE id_archivio_nome = ?
        )
      `;
      const [archiviedMenuSpesa] = await pool.query(queryMenuSpesa, [id_archivied]);
  
      // Mappa per menu_spesa: id_archivio_menu_spesa -> id_menu_spesa nuovo
      const menuSpesaIdMap = new Map();
  
      // 2.4 Inserisci in menu_spesa
      const insertMenuSpesaQuery = `
        INSERT INTO menu_spesa(id_menu, porzioni) 
        VALUES(?, ?)
      `;
  
      for (const element of archiviedMenuSpesa) {
        const nuovoIdMenu = menuIdMap.get(element.id_archivio_menu);
        
        if (nuovoIdMenu) {
          const [result] = await pool.query(insertMenuSpesaQuery, [
            nuovoIdMenu,
            element.porzioni
          ]);
          
          // Salva la mappatura: id_archivio_menu_spesa -> nuovo id_menu_spesa
          menuSpesaIdMap.set(element.id_archivio_menu_spesa, result.insertId);
        }
      }
  
      // 2.5 Recupera i dati archiviati di spesa_ingredienti
      const querySpesaIngredienti = `
        SELECT * FROM archivio_spesa_ingredienti 
        WHERE id_archivio_menu_spesa IN (
          SELECT id_archivio_menu_spesa 
          FROM archivio_menu_spesa 
          WHERE id_archivio_menu IN (
            SELECT id_archivio_menu 
            FROM archivio_menu 
            WHERE id_archivio_nome = ?
          )
        )
      `;
      const [archiviedSpesaIngredienti] = await pool.query(querySpesaIngredienti, [id_archivied]);
  
      // 2.6 Inserisci in spesa_ingredienti
      const insertSpesaIngredientiQuery = `
        INSERT INTO spesa_ingredienti(id_menu_spesa, id_ingrediente, id_unita_misura, quantita) 
        VALUES(?, ?, ?, ?)
      `;
  
      for (const element of archiviedSpesaIngredienti) {
        const nuovoIdMenuSpesa = menuSpesaIdMap.get(element.id_archivio_menu_spesa);
        
        if (nuovoIdMenuSpesa) {
          await pool.query(insertSpesaIngredientiQuery, [
            nuovoIdMenuSpesa,
            element.id_ingrediente,
            element.id_unita_misura,
            element.quantita
          ]);
        }
      }
  
      res.status(200).json({
        message: "Menu archived uploaded successfully",
        menuItems: archiviedMenu.length,
        spesaItems: archiviedMenuSpesa.length,
        ingredientiItems: archiviedSpesaIngredienti.length
      });
  
    } catch (error) {
      console.error("Error uploading archived menu:", error);
      res.status(500).json({
        message: "Error uploading archived menu",
        error: error.message,
      });
    }
  },

  //Update
  updateMenuElement: async (req, res) => {
    try {
      const { element, newIngredients, info } = req.body;

      const hasData = info.some(item => Object.keys(item).length > 0);
      var lastIdMenuSpesa = null;            

      if(!element.id_menu_spesa){ 
        /* No data inside, old method menu element */        
        const query = "INSERT INTO menu_spesa (id_menu, porzioni) VALUES(?, ?)";
        const [rows] = await pool.query(query, [
          element.id_menu,
          element.porzioni,
        ]);

        lastIdMenuSpesa = rows.insertId;

      }else{
        /* Update single ingredients of personalized recipe */
        if(element.id_ricetta === 1){
          const query = "UPDATE spesa_ingredienti SET id_ingrediente = ?, id_unita_misura = ?, quantita = ? WHERE id_spesa_ingredienti = ?";
    
          for (const singleElement of info) {
            await pool.query(query, [
              singleElement.id_ingrediente,
              singleElement.id_unita_misura,
              singleElement.quantita,
              singleElement.id_spesa_ingredienti,
            ]);
          }

          lastIdMenuSpesa = element.id_menu_spesa;
        }
      }

      const query = "INSERT INTO spesa_ingredienti(id_menu_spesa, id_ingrediente, id_unita_misura, quantita) VALUES(?, ?, ?, ?)";
      for (const ingredient of newIngredients) {
        if(ingredient.name !== ''){
          await pool.query(query, [
            lastIdMenuSpesa,
            ingredient.name,
            ingredient.unit,
            ingredient.quantity,
          ]);
        }
      }


      const query2 = "UPDATE menu_spesa SET porzioni = ? WHERE id_menu_spesa = ?";
      await pool.query(query2, [
        element.porzioni,
        lastIdMenuSpesa,
      ]);

      const query3 = "UPDATE menu SET nome_ricetta_personalizzata = ?, id_ricetta = ?, id_persona = ? WHERE id_menu = ?";
      await pool.query(query3, [
        element.nome_ricetta_personalizzata,
        element.id_ricetta,
        element.id_persona,
        element.id_menu,
      ]);
     

      // Send all rows as response
      res.status(200).json({
        message: "Operation completed"
      }); 
    } catch (error) {
      console.error("Error updating menu element:", error);
      res.status(500).json({
        message: "Error updating menu element",
        error: error.message,
      });
    }
  },

  updateDayConfiguration: async (req, res) => {
    try {
      const configuration = req.body;

      for (const element of configuration) {
        const query =
          "UPDATE giorno_settimana SET numero_giorno_settimana = ? WHERE id_giorno_settimana = ?";
        await pool.query(query, [
          element.numero_giorno_settimana,
          element.id_giorno_settimana,
        ]);
      }

      // // Send all rows as response
      res.status(200).json({ message: "Configuration updated successfully" });
    } catch (error) {
      console.error("Error updating menu configuration:", error);
      res.status(500).json({
        message: "Error updating menu configuration",
        error: error.message,
      });
    }
  },

  updateMenuArchiviatoNome: async (req, res) => {
    try {
      const { idNomeMenu, nomeArchivioNome } = req.body;

      const query = "UPDATE archivio_nome SET nome_archivio_nome = ? WHERE id_archivio_nome = ?";
      await pool.query(query, [
        nomeArchivioNome,
        idNomeMenu,
      ]);
      
      // Send all rows as response
      res.status(200).json({ message: "Name updated successfully" });
    } catch (error) {
      console.error("Error updating name archived menu:", error);
      res.status(500).json({
        message: "Error updating name archived menu",
        error: error.message,
      });
    }
  },


  //Delete

  clearMenu: async (req, res) => {
    try {

      // ========================================
      // FASE 1: CANCELLARE IL MENU ATTIVO
      // ========================================
  
      // 1.1 Cancella spesa_ingredienti
      await pool.query("DELETE FROM spesa_ingredienti");
  
      // 1.2 Cancella menu_spesa
      await pool.query("DELETE FROM menu_spesa");
  
      // 1.3 Cancella menu
      await pool.query("DELETE FROM menu");      // Send all rows as response

      res.status(200).json({
        message: "Done",
      });
    } catch (error) {
      console.error("Error deleting menu element:", error);
      res.status(500).json({
        message: "Error deleteing menu element",
        error: error.message,
      });
    }
  },

  deleteMenuElement: async (req, res) => {
    try {
      const { id_menu, element } = req.body;

      if(element.id_ricetta === 1){
        const query = "DELETE FROM spesa_ingredienti WHERE id_menu_spesa = ?";
        await pool.query(query, [element.id_menu_spesa]);
      }

      const query = "DELETE FROM menu_spesa WHERE id_menu = ?";
      await pool.query(query, [id_menu]);
    
      
      const query2 = "DELETE FROM menu WHERE id_menu = ?";
      const [rows] = await pool.query(query2, [id_menu]);

      // Send all rows as response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error deleteing menu element:", error);
      res.status(500).json({
        message: "Error deleteing menu element",
        error: error.message,
      });
    }
  },

  clearMenuArchivied: async (req, res) => {
    try {
      const { id_archivied } = req.body;
  
      // IMPORTANTE: Cancellare nell'ordine inverso rispetto alle foreign key
      // (dalle tabelle "figlie" alle tabelle "genitori")
  
      // 1. Prima cancella archivio_spesa_ingredienti
      //    (dipende da archivio_menu_spesa)
      const query1 = `
        DELETE FROM archivio_spesa_ingredienti 
        WHERE id_archivio_menu_spesa IN (
          SELECT id_archivio_menu_spesa 
          FROM archivio_menu_spesa 
          WHERE id_archivio_menu IN (
            SELECT id_archivio_menu 
            FROM archivio_menu 
            WHERE id_archivio_nome = ?
          )
        )
      `;
      await pool.query(query1, [id_archivied]);
  
      // 2. Poi cancella archivio_menu_spesa
      //    (dipende da archivio_menu)
      const query2 = `
        DELETE FROM archivio_menu_spesa 
        WHERE id_archivio_menu IN (
          SELECT id_archivio_menu 
          FROM archivio_menu 
          WHERE id_archivio_nome = ?
        )
      `;
      await pool.query(query2, [id_archivied]);
  
      // 3. Poi cancella archivio_menu
      //    (dipende da archivio_nome)
      const query3 = "DELETE FROM archivio_menu WHERE id_archivio_nome = ?";
      await pool.query(query3, [id_archivied]);
  
      // 4. Infine cancella archivio_nome
      const query4 = "DELETE FROM archivio_nome WHERE id_archivio_nome = ?";
      const [result] = await pool.query(query4, [id_archivied]);
  
      res.status(200).json({
        message: "Menu archived deleted successfully",
        deletedId: id_archivied,
        affectedRows: result.affectedRows
      });
    } catch (error) {
      console.error("Error deleting menu archived:", error);
      res.status(500).json({
        message: "Error deleting menu archived",
        error: error.message,
      });
    }
  }
};

module.exports = menuController;
