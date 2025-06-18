<?php
// Consenti richieste da qualsiasi origine (per testing - in produzione restringi il dominio!)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$uploadDir = "uploads/"; // cartella dove salvare i file (deve esistere e avere permessi di scrittura)

// Crea la cartella se non esiste
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES["immagine"])) {
    $file = $_FILES["immagine"];
    $fileName = basename($file["name"]);
    $targetFile = $uploadDir . $fileName;

    $fileType = mime_content_type($file["tmp_name"]);
    $allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!in_array($fileType, $allowedTypes)) {
        http_response_code(400);
        echo "Tipo di file non supportato.";
        exit;
    }

    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Immagine caricata con successo',
            'filePath' => $targetFile
        ]);
    } else {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Errore durante il caricamento'
        ]);
    }
} else {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Nessun file ricevuto'
    ]);
}