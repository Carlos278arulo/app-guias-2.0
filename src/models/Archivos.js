const mongoose = require("mongoose");

const archivoSchema = new mongoose.Schema(
  {
    carrera: {
      type: String,
      required: true,
    },
    asignatura: {
      type: String,
      required: true,
    },
    grupo: {
      type: String,
      required: true,
    },
    num_estudiantes: {
      type: Number,
      required: true,
    },
    archivo: {
      data: Buffer,
      contentType: {
        type: String,
        default: "application/msword",
      },
    },
    
  },
  {
    timestamps: true,
  }
);

const Archivo = mongoose.model("Archivo", archivoSchema);

module.exports = Archivo;
