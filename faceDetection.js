const tf = require('@tensorflow/tfjs-node');
const blazeface = require('@tensorflow-models/blazeface');

let model;

async function loadModel() {
  if (!model) {
    model = await blazeface.load();
  }
  return model;
}

async function detectFaces(imagePath) {
  const model = await loadModel();
  return [];
}

module.exports = { detectFaces };
