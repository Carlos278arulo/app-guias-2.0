const guiasController = {};


guiasController.renderdocente = (req, res) => {
  res.render("users/pdocente");
};

guiasController.renderviewdocente = (req, res) => {
  res.render("users/guiasdocen");
};
guiasController.renderform = (req, res) => {
  res.render("users/form");
};

guiasController.renderestudiante = (req, res) => {
  res.render("users/pestudiante");
};
guiasController.renderword = (req, res) => {
  res.render("users/guiasestu");
};

module.exports = guiasController;