import React, { useState } from "react";

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setPreview(null);
      alert("Per favore seleziona un file immagine.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("immagine", file);

    try {
      const res = await fetch("https://www.incucinacondebora.it/uploads/upload.php", {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      alert(text);
    } catch (error) {
      alert("Errore durante l'upload");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <div>
          <p>Anteprima:</p>
          <img src={preview} alt="Anteprima" style={{ width: 200 }} />
        </div>
      )}
      <button type="button" onClick={handleUpload}>Carica immagine</button>
    </div>
  );
};

export default ImageUploader;