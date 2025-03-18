import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";

const { apiUrl } = require('../../config/apiConfig');


function Home_Scheduler() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [dbEvents, setDbEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Funzione per caricare gli eventi dal database
    const loadEventsFromDB = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${apiUrl}:3001/api/gallanzscheduler/getEvents`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Data ricevuta dal server:", data);
                
                // Assicurati che data sia sempre un array, anche vuoto
                const eventsArray = Array.isArray(data) ? data : [];
                
                // Aggiorna lo state con il nuovo array di eventi
                setDbEvents(eventsArray);
                
                // Forza il re-render anche se non ci sono eventi
                setEvents({}); // Reset degli eventi formattati
                
                // Crea i nuovi eventi formattati
                if (eventsArray.length > 0) {
                    const formattedEvents = {};
                    eventsArray.forEach(event => {
                        const dayId = event.giorno_evento_calendario;
                        const momentId = event.momento_evento_calendario;
                        const period = momentId.startsWith('morning') ? 'mattina' : 'pomeriggio';
                        const dateStr = dayId.replace('day-', '');
                        const eventKey = `${dateStr}-${period}`;
                        
                        if (!formattedEvents[eventKey]) {
                            formattedEvents[eventKey] = [];
                        }
                        formattedEvents[eventKey].push(event.descrizione_evento_calendario);
                    });
                    
                    setEvents(formattedEvents);
                }
            } else {
                console.error("Errore nella risposta del server");
            }
        } catch (error) {
            console.error("Errore nel caricamento degli eventi:", error);
            Swal.fire(
                'Errore!',
                'Si è verificato un errore nel caricamento degli eventi.',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect per il caricamento iniziale
    useEffect(() => {
        loadEventsFromDB();
    }, []);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Formatta la data in formato IT
    const formatDate = (date) => {
        return date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric' })
            .replace(/^\w/, (c) => c.toUpperCase());
    };

    // Genera array di date tra start e end
    const getDatesInRange = (start, end) => {
        const dates = [];
        const currentDate = new Date(start);
        const lastDate = new Date(end);

        while (currentDate <= lastDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    // Modifica la funzione handleCellClick per salvare nel DB
    const handleCellClick = async (date, period) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayId = `day-${dateStr}`;
        const momentId = period === 'mattina' ? `morning-${dateStr}` : `afternoon-${dateStr}`;

        const { value: eventText } = await Swal.fire({
            title: `Inserisci un evento per ${formatDate(date)} ${period}`,
            input: 'text',
            inputPlaceholder: 'Descrizione evento...',
            showCancelButton: true,
            confirmButtonText: 'Salva',
            cancelButtonText: 'Annulla',
            inputValidator: (value) => {
                if (!value) {
                    return 'Devi inserire un testo!';
                }
            }
        });

        if (eventText) {
            try {
                const response = await fetch(`${apiUrl}:3001/api/gallanzscheduler/saveEvent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        giorno_evento_calendario: dayId,
                        momento_evento_calendario: momentId,
                        descrizione_evento_calendario: eventText
                    }),
                });

                if (response.ok) {
                    await loadEventsFromDB();
                    Swal.fire(
                        'Salvato!',
                        'L\'evento è stato salvato con successo.',
                        'success'
                    );
                } else {
                    throw new Error('Errore nel salvataggio dell\'evento');
                }
            } catch (error) {
                console.error('Errore:', error);
                Swal.fire(
                    'Errore!',
                    'Si è verificato un errore nel salvataggio dell\'evento.',
                    'error'
                );
            }
        }
    };

    // Aggiungi questa funzione per gestire la stampa
    const handlePrint = (monthName) => {
        const tableId = `calendar-table-${monthName}`;
        const tableToprint = document.getElementById(tableId);
        
        if (!tableToprint) {
            console.error(`Tabella non trovata con ID: ${tableId}`);
            return;
        }

        const printWindow = window.open('', '_blank');
        const tableContent = tableToprint.outerHTML;
        
        // Ottieni il contenuto del file CSS di Tailwind
        const tailwindStyles = document.querySelector('style[data-href*="tailwind"]')?.textContent || '';
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Calendario ${monthName}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        ${tailwindStyles}
                        
                        /* Stili aggiuntivi specifici per la stampa */
                        @media print {
                            body { 
                                margin: 0; 
                                padding: 20px; 
                            }
                            table {
                                page-break-inside: avoid;
                            }
                            .delete-btn, 
                            button[title="Stampa tabella"] {
                                display: none !important;
                            }
                            /* Mantieni i colori di sfondo e i bordi durante la stampa */
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        
                        /* Replica degli stili principali */
                        .morning-events, .afternoon-events {
                            margin: 4px 0;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        td {
                            vertical-align: top;
                            border: 1px solid #e2e8f0;
                        }
                        th {
                            background-color: #f8fafc;
                            border: 1px solid #e2e8f0;
                        }
                    </style>
                </head>
                <body class="bg-white">
                    <div class="container mx-auto p-4">
                        <h2 class="text-2xl font-bold mb-4">Calendario ${monthName}</h2>
                        <div class="overflow-x-auto">
                            ${tableContent}
                        </div>
                    </div>
                    <script>
                        // Rimuovi i pulsanti di eliminazione e altri elementi non necessari
                        document.querySelectorAll('.delete-btn, button[title="Stampa tabella"]').forEach(el => el.remove());
                    </script>
                </body>
            </html>
        `);
        
        printWindow.document.close();
        
        // Aspetta che Tailwind CSS sia caricato prima di stampare
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
            }, 1000); // Attendi 1 secondo per assicurarti che gli stili siano applicati
        };
    };

    // Renderizza la tabella
    const renderSchedule = () => {
        if (!startDate || !endDate) return null;
        const dates = getDatesInRange(startDate, endDate);
        let currentMonth = null;
        let currentNewMonth = null;
        const result = [];
        let currentWeek = [];

        const renderMonthHeader = (date) => (
            <tr key={`month-${date.getTime()}`}>
                <td colSpan="7" className="text-center py-8">
                    <div className="flex justify-between items-center p-4 bg-gray-50">
                        <h2 className="text-2xl font-bold">{date.toLocaleString('it-IT', { month: 'long', year: 'numeric' })
                            .replace(/^\w/, (c) => c.toUpperCase())}</h2>
                        <button
                            onClick={() => handlePrint(date.toLocaleString('it-IT', { month: 'long'}))}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                            title="Stampa tabella"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
                                />
                            </svg>
                            Stampa
                        </button>
                    </div>
                </td>
            </tr>
        );

        const renderDay = (date) => {
            const dayId = `day-${date.toISOString().split('T')[0]}`;
            const morningId = `morning-${date.toISOString().split('T')[0]}`;
            const afternoonId = `afternoon-${date.toISOString().split('T')[0]}`;

            const morningEvents = dbEvents.filter(event =>
                event.giorno_evento_calendario === dayId &&
                event.momento_evento_calendario === morningId
            );

            const afternoonEvents = dbEvents.filter(event =>
                event.giorno_evento_calendario === dayId &&
                event.momento_evento_calendario === afternoonId
            );

            return (
                <td
                    key={date.getTime()}
                    id={dayId}
                    className="border border-gray-200 p-2 md:p-4 min-w-[250px] md:w-[14.28%] align-top"
                >
                    <div className="flex flex-col h-full space-y-2">
                        <div className="font-bold text-lg">
                            {formatDate(date)}
                        </div>
                        {/* Sezione Mattina */}
                        <div
                            id={morningId}
                            onClick={() => handleCellClick(date, 'mattina')}
                            className="bg-blue-50 p-3 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                        >
                            <div className="font-semibold text-sm mb-2">Mattina</div>
                            <div className="space-y-2">
                                {morningEvents.map((event) => (
                                    <div
                                        key={event.id_evento_calendario}
                                        className="text-sm bg-white p-2 rounded flex justify-between items-center group"
                                    >
                                        <span>{event.descrizione_evento_calendario}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteEvent(event.id_evento_calendario);
                                            }}
                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Sezione Pomeriggio */}
                        <div
                            id={afternoonId}
                            onClick={() => handleCellClick(date, 'pomeriggio')}
                            className="bg-yellow-50 p-3 rounded cursor-pointer hover:bg-yellow-100 transition-colors"
                        >
                            <div className="font-semibold text-sm mb-2">Pomeriggio</div>
                            <div className="space-y-2">
                                {afternoonEvents.map((event) => (
                                    <div
                                        key={event.id_evento_calendario}
                                        className="text-sm bg-white p-2 rounded flex justify-between items-center group"
                                    >
                                        <span>{event.descrizione_evento_calendario}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteEvent(event.id_evento_calendario);
                                            }}
                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </td>
            );
        };

        dates.forEach((date, index) => {
            const month = date.getMonth();
            const newMonth = date.toLocaleDateString('it-IT', {month: 'long'});
            
            
            // const newMonth = date.toLocaleString('it-IT', { month: 'long'});


            // Controlla se è l'inizio di un nuovo mese
            if (currentMonth !== month) {
                // Se c'è una settimana incompleta, completala con celle vuote
                if (currentWeek.length > 0) {
                    while (currentWeek.length < 7) {
                        currentWeek.push(
                            <td key={`empty-${currentWeek.length}`} className="border border-gray-200 p-2 md:p-4 min-w-[250px] md:w-[14.28%]"></td>
                        );
                    }
                    result.push(<tr key={`week-${result.length}`}>{currentWeek}</tr>);
                }

                // Aggiungi l'header del nuovo mese come riga della tabella
                result.push(renderMonthHeader(date));
                currentMonth = month;
                currentNewMonth = newMonth
                currentWeek = [];
            }

            // Aggiungi il giorno alla settimana corrente
            currentWeek.push(renderDay(date));

            // Se la settimana è completa o è l'ultimo giorno
            if (currentWeek.length === 7 || index === dates.length - 1) {
                // Se è l'ultimo giorno e la settimana non è completa, aggiungi celle vuote
                if (index === dates.length - 1 && currentWeek.length < 7) {
                    while (currentWeek.length < 7) {
                        currentWeek.push(
                            <td key={`empty-${currentWeek.length}`} className="border border-gray-200 p-2 md:p-4 min-w-[250px] md:w-[14.28%]"></td>
                        );
                    }
                }
                result.push(<tr key={`week-${result.length}`}>{currentWeek}</tr>);
                currentWeek = [];
            }
        });
        return (
            <div className="mt-8">
                <div className="overflow-x-auto md:overflow-x-visible">
                    <table 
                        id={`calendar-table-${currentNewMonth}`} 
                        className="w-full border-collapse md:table-fixed"
                    >
                        <tbody>
                            {result}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Aggiungi la funzione per eliminare un evento
    const handleDeleteEvent = async (eventId) => {
        const result = await Swal.fire({
            title: 'Sei sicuro?',
            text: "Non potrai recuperare questo evento!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sì, elimina!',
            cancelButtonText: 'Annulla'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(
                    `${apiUrl}:3001/api/gallanzscheduler/deleteEvent`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id_evento_calendario: eventId
                        })
                    }
                );

                if (response.ok) {
                    // Prima rimuoviamo l'evento dallo state locale
                    setDbEvents(prevEvents => prevEvents.filter(event => event.id_evento_calendario !== eventId));
                    
                    // Ricarica tutti gli eventi dal server
                    await loadEventsFromDB();
                    
                    // Forza un re-render completo
                    setStartDate(prev => new Date(prev.getTime()));
                    setEndDate(prev => new Date(prev.getTime()));
                    
                    // Mostra conferma
                    await Swal.fire(
                        'Eliminato!',
                        'L\'evento è stato eliminato.',
                        'success'
                    );
                } else {
                    throw new Error('Errore nell\'eliminazione dell\'evento');
                }
            } catch (error) {
                console.error("Errore nell'eliminazione dell'evento:", error);
                Swal.fire(
                    'Errore!',
                    'Si è verificato un errore durante l\'eliminazione dell\'evento.',
                    'error'
                );
            }
        }
    };

    // Opzionalmente, mostra un indicatore di caricamento
    if (isLoading) {
        return <div>Caricamento eventi in corso...</div>;
    }

        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
                    <h1 className="text-4xl font-bold text-center mb-8">Scheduler</h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <label className="font-semibold">Da:</label>
                            <input
                                type="date"
                                value={startDate.toISOString().split('T')[0]}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto"
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <label className="font-semibold">A:</label>
                            <input
                                type="date"
                                value={endDate.toISOString().split('T')[0]}
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto"
                            />
                        </div>
                    </div>

                    {renderSchedule()}
                </div>
                <Footer />
            </>
        );
    }

    export default Home_Scheduler;