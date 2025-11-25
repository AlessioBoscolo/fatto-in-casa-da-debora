import React, { useState, useEffect } from 'react';
import { ChefHat, Calendar, Clock, Package } from 'lucide-react';

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer';

const { apiUrl } = require("../../config/apiConfig");


export default function MenuAnalysis() {
  const [menuAnalysis, setMenuAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState('ricetta'); // 'ricetta' o 'ingrediente'

  // Mappatura per giorni e momenti
  const giorniSettimana = {
    1: 'Lunedì', 2: 'Martedì', 3: 'Mercoledì', 
    4: 'Giovedì', 5: 'Venerdì', 6: 'Sabato', 7: 'Domenica'
  };

  const momentiGiornata = {
    1: 'Colazione', 2: 'Pranzo', 3: 'Cena', 4: 'Spuntino'
  };

  useEffect(() => {
    fetchMenuAnalysis();
  }, []);

  const fetchMenuAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}:3001/api/spesa/getMenuAnalysis`);
      
      if (!response.ok) {
        throw new Error('Errore nel caricamento dei dati');
      }
      
      const data = await response.json();
      setMenuAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Raggruppa ingredienti per totale
  const getIngredientiRaggruppati = () => {
    const ingredientiMap = new Map();

    menuAnalysis.forEach(item => {
      item.ingredienti.forEach(ing => {
        const key = `${ing.id_ingrediente}-${ing.unita_misura}`;
        
        if (ingredientiMap.has(key)) {
          const existing = ingredientiMap.get(key);
          existing.quantita_totale += ing.quantita_totale;
          existing.ricette.push(item.nome_ricetta);
        } else {
          ingredientiMap.set(key, {
            ...ing,
            ricette: [item.nome_ricetta]
          });
        }
      });
    });

    return Array.from(ingredientiMap.values()).sort((a, b) => 
      a.nome_ingrediente.localeCompare(b.nome_ingrediente)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Caricamento analisi menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md">
          <p className="text-red-600 font-semibold text-lg mb-2">Errore</p>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchMenuAnalysis}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-3 rounded-xl">
                        <ChefHat className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Analisi Menu</h1>
                        <p className="text-gray-600">Ingredienti calcolati per porzioni</p>
                    </div>
                    </div>

                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setGroupBy('ricetta')}
                        className={`px-4 py-2 rounded-md font-medium transition ${
                        groupBy === 'ricetta' 
                            ? 'bg-white text-orange-600 shadow' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Per Ricetta
                    </button>
                    <button
                        onClick={() => setGroupBy('ingrediente')}
                        className={`px-4 py-2 rounded-md font-medium transition ${
                        groupBy === 'ingrediente' 
                            ? 'bg-white text-orange-600 shadow' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Per Ingrediente
                    </button>
                    </div>
                </div>
                </div>

                {/* Vista per Ricetta */}
                {groupBy === 'ricetta' && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {menuAnalysis.map((item, index) => (
                    <div 
                        key={index}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                    >
                        {/* Header Card */}
                        <div className={`p-4 ${
                        item.tipo === 'personalizzata' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                            : 'bg-gradient-to-r from-orange-500 to-red-500'
                        }`}>
                        <h3 className="text-white font-bold text-lg mb-2">
                            {item.nome_ricetta}
                        </h3>
                        <div className="flex items-center gap-4 text-white text-sm">
                            <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{giorniSettimana[item.id_giorno_settimana]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{momentiGiornata[item.id_momento_giornata]}</span>
                            </div>
                        </div>
                        </div>

                        {/* Info Porzioni */}
                        {item.tipo === 'ricetta_db' && (
                        <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
                            <p className="text-sm text-gray-700">
                            <span className="font-semibold">Ricetta base:</span> {item.porzioni_ricetta} porzioni
                            </p>
                            <p className="text-sm text-gray-700">
                            <span className="font-semibold">Porzioni richieste:</span> {item.porzioni_richieste}
                            </p>
                            <p className="text-sm text-orange-600 font-medium">
                            Fattore: ×{item.porzioni_richieste / item.porzioni_ricetta}
                            </p>
                        </div>
                        )}

                        {/* Lista Ingredienti */}
                        <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Package className="w-4 h-4 text-gray-500" />
                            <h4 className="font-semibold text-gray-700">Ingredienti</h4>
                        </div>
                        <div className="space-y-2">
                            {item.ingredienti.map((ing, idx) => (
                            <div 
                                key={idx}
                                className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            >
                                <span className="text-gray-700 text-sm font-medium">
                                {ing.nome_ingrediente}
                                </span>
                                <div className="text-right">
                                <div className="text-orange-600 font-bold">
                                    {ing.quantita_totale.toFixed(1)} {ing.unita_misura}
                                </div>
                                {item.tipo === 'ricetta_db' && (
                                    <div className="text-xs text-gray-500">
                                    da {ing.quantita_originale} {ing.unita_misura}
                                    </div>
                                )}
                                {item.tipo === 'personalizzata' && (
                                    <div className="text-xs text-gray-500">
                                    {ing.quantita_originale} × {ing.porzioni}
                                    </div>
                                )}
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}

                {/* Vista per Ingrediente */}
                {groupBy === 'ingrediente' && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-green-500 to-teal-500">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Lista Spesa Totale
                    </h2>
                    <p className="text-green-50">
                        Ingredienti raggruppati per tutto il menu
                    </p>
                    </div>
                    
                    <div className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {getIngredientiRaggruppati().map((ing, idx) => (
                        <div 
                            key={idx}
                            className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-400 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800 text-lg">
                                {ing.nome_ingrediente}
                            </h4>
                            <div className="bg-green-100 px-3 py-1 rounded-full">
                                <span className="text-green-700 font-bold text-sm">
                                {ing.quantita_totale.toFixed(1)} {ing.unita_misura}
                                </span>
                            </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1 font-semibold">
                                Usato in:
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {ing.ricette.map((ricetta, ridx) => (
                                <span 
                                    key={ridx}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                >
                                    {ricetta}
                                </span>
                                ))}
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
                )}

                {menuAnalysis.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="text-gray-400 mb-4">
                    <ChefHat className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-gray-600 text-lg">
                    Nessun elemento nel menu da analizzare
                    </p>
                </div>
                )}
            </div>
        </div>
        <Footer />
    </>
  );
}