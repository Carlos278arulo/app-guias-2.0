const archivosController = {};
const fs = require("fs");
const Archivo = require("../models/Archivos");
const nodemailer = require("nodemailer");
const Guia = require("../models/guiasestu");


/// Subir guias
archivosController.subirArchivo = async (req, res) => {
  try {
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).send("No se ha proporcionado ningún archivo");
    }

    // Crear un nuevo documento Archivo con los datos del archivo subido
    const nuevoArchivo = new Archivo({
      archivo: {
        data: fs.readFileSync(archivo.path),
        contentType: archivo.mimetype,
      },
      carrera: req.body.carrera, // Obtener la carrera desde la solicitud (req.body)
      asignatura: req.body.asignatura, // Obtener la asignatura desde la solicitud (req.body)
      grupo: req.body.grupo, // Obtener el grupo desde la solicitud (req.body)
      num_estudiantes: req.body.num_estudiantes, // Obtener el número de estudiantes desde la solicitud (req.body)
    });

    await nuevoArchivo.save(); // Guardar el nuevo archivo en la base de datos

    // Eliminar el archivo temporal después de guardarlo en la base de datos
    fs.unlinkSync(archivo.path);

    req.flash("success_msg", "Archivo subido");
    res.redirect("/guias/docente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al subir el archivo");
  }
};

//subirguias estudiantes

archivosController.subirestuArchivo = async (req, res) => {
  try {
    const guia = req.file;

    if (!guia) {
      return res.status(400).send("No se ha proporcionado ningún archivo");
    }

    // Crear un nuevo documento Archivo con los datos del archivo subido
    const nuevaGuia = new Guia({
      guia: {
        data: fs.readFileSync(guia.path),
        contentType: guia.mimetype,
      },
      nombre: req.body.nombre,
      carrera: req.body.carrera,
      asignatura: req.body.asignatura,
      grupo: req.body.grupo,
    });

    await nuevaGuia.save(); // Guardar el nuevo archivo en la base de datos

    // Enviar el correo de notificación
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "carlosjoseariaslopez@gmail.com", // Tu dirección de correo electrónico
        pass: "mqtdukqzaewjzece", // Tu contraseña de correo electrónico
      },
    });

    const mailOptions = {
      from: "carlosjoseariaslopez@gmail.com", // Tu dirección de correo electrónico
      to: "cl5343940@gmail.com", // Dirección de correo del destinatario
      subject: "Nuevo formulario enviado",
      text: `Se ha recibido un nuevo formulario con los siguientes datos:
        Nombre: ${req.body.nombre}
        Carrera: ${req.body.carrera}
        Asignatura: ${req.body.asignatura}
        Grupo: ${req.body.grupo}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        // Manejar el error, si corresponde
      } else {
        console.log("Correo enviado: " + info.response);
        // Manejar la notificación de éxito, si corresponde
      }
    });

    // Eliminar el archivo temporal después de guardarlo en la base de datos
    fs.unlinkSync(guia.path);

    req.flash("success_msg", "Archivo subido");
    res.redirect("/guias/verword/:id");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al subir el archivo");
  }
};

//conusltar guias generadas docente
archivosController.consultarArchivos = async (req, res) => {
  try {
    // Realiza la consulta a la base de datos
    const consulta = await Archivo.find({}, 'id carrera asignatura grupo num_estudiantes');

    // Renderiza la plantilla 'datos' y pasa los datos como contexto
    res.render('users/pdocente', { consulta });
  } catch (error) {
    // Manejo de errores en caso de que la consulta falle
    console.error(error);
    res.status(500).json({ error: 'Error al consultar las guías en la base de datos' });
  }
};

//conusltar guias generadas estudiantes
archivosController.consultarArchivosestudiantes = async (req, res) => {
  try {
    // Realiza la consulta a la base de datos
    const consulta = await Archivo.find({}, 'id carrera asignatura grupo num_estudiantes');

    // Renderiza la plantilla 'datos' y pasa los datos como contexto
    res.render('users/pestudiante', { consulta });
  } catch (error) {
    // Manejo de errores en caso de que la consulta falle
    console.error(error);
    res.status(500).json({ error: 'Error al consultar las guías en la base de datos' });
  }
};


//eliminar guias
archivosController.deleteGuia = async (req, res) => {
  try {
    const { id } = req.params;
    await Archivo.findByIdAndRemove(id);
    req.flash("success_msg", "Guía borrada exitosamente");
    res.redirect('/archivos'); // Redirige a la página de datos después de borrar la guía
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al borrar la guía");
  }
};

//descargar guias
archivosController.descargarArchivo = async (req, res) => {
  try {
    // Obtener el ID del archivo de la URL
    const archivoId = req.params.id;

    // Buscar el archivo en la base de datos por su ID
    const archivo = await Archivo.findById(archivoId);

    if (!archivo) {
      return res.status(404).send("No se encontró ningún archivo en la base de datos");
    }

    // Establecer el tipo de contenido adecuado para el archivo (ejemplo: application/msword para Word)
    res.setHeader("Content-Type", "application/msword");
    const nombreArchivo = `${archivo.carrera}--${archivo.asignatura}-${archivo.grupo}.doc`;
    // Establecer el nombre del archivo al descargarlo
  res.attachment(nombreArchivo);

    // Enviar el archivo como respuesta
    res.send(archivo.archivo.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al descargar el archivo");
  }
};

//consulatar guias entregadas por los estuidantes
archivosController.consultarGuiasestudiantes = async (req, res) => {
  try {
    // Realiza la consulta a la base de datos
    const consultaguiasestu = await Guia.find({}, 'id nombre carrera asignatura grupo');

    // Renderiza la plantilla 'datos' y pasa los datos como contexto
    res.render('users/guiasdocen', { consultaguiasestu });
  } catch (error) {
    // Manejo de errores en caso de que la consulta falle
    console.error(error);
    res.status(500).json({ error: 'Error al consultar las guías en la base de datos' });
  }
};

//descargarguias entregadas por los estuidantes
archivosController.descargarGuiaestudiantes = async (req, res) => {
  try {
    // Obtener el ID del archivo de la URL
    const guiaId = req.params.id;

    // Buscar el archivo en la base de datos por su ID
    const guia = await Guia.findById(guiaId);

    if (!guia) {
      return res.status(404).send("No se encontró ningún archivo en la base de datos");
    }

    // Establecer el tipo de contenido adecuado para el archivo (ejemplo: application/msword para Word)
    res.setHeader("Content-Type", "application/msword");
     // Construir el nombre del archivo incluyendo la carrera, asignatura y grupo
     const nombreArchivo = `${guia.nombre}-${guia.carrera}-${guia.asignatura}-${guia.grupo}.doc`;
      // Establecer el nombre del archivo al descargarlo
    res.attachment(nombreArchivo);

    // Enviar el archivo como respuesta
    res.send(guia.guia.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al descargar el archivo");
  }
};








module.exports = archivosController;
