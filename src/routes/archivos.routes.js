const express = require("express");
const router = express.Router();
const multer = require("multer");
const archivoController = require("../controllers/archivos.controller");


// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Carpeta donde se almacenarán los archivos subidos
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // Nombre del archivo
    }
  });

  const fileFilter = (req, file, cb) => {
    // Validar tipos de archivos permitidos (solo documentos de Word)
    if (
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido"), false);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 4 * 1024 * 1024 // Limite de tamaño de 4 MB (en bytes)
    }
  });

  // Ruta para subir un archivo
router.post("/subir", upload.single("archivo"), archivoController.subirArchivo);

  // Ruta para subir un archivo
router.post("/subirestu", upload.single("archivo"), archivoController.subirestuArchivo);



// Ruta para consultar archivos docuentes
router.get("/archivos", archivoController.consultarArchivos);
// Ruta para consultar archivos estudiantes
router.get("/archivosestudiantes", archivoController.consultarArchivosestudiantes);


// Ruta para borrar una guía
router.delete("/guias/:id", archivoController.deleteGuia);

// Ruta para descargar un archivo
router.get("/descargar/:id", archivoController.descargarArchivo);



//consulatar guias entregadas por los estuidantes
router.get("/guiasestudiantes", archivoController.consultarGuiasestudiantes);
// //descragar guias entregadas por los estudiantes
router.get("/descargarguia/:id", archivoController.descargarGuiaestudiantes);







  module.exports = router;

