const {Router} = require("express");
const router = Router();
const { 
    renderdocente,  
    renderestudiante,
    renderword,
    renderviewdocente,
    renderform
   
} = require("../controllers/guias.controller");

const { isAuthenticated } = require("../helpers/auth");
// Ruta para docente
router.get("/guias/docente", renderdocente);
//Ver guias subidas por estudiantes
router.get("/guias/viewdocente", renderviewdocente);
//
router.get("/guias/form", renderform);

// Ruta para estudiante
router.get("/guias/estudiante", renderestudiante);

// Ruta para estudiante
router.get("/guias/verword/:id", renderword);






module.exports = router;
