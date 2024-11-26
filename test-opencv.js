const cv = require('opencv4nodejs');
const tf = require('@tensorflow/tfjs-node');
const blazeface = require('@tensorflow-models/blazeface');

async function setupFacialRecognition() {
  // Load the BlazeFace model
  const model = await blazeface.load();

  // Start the webcam
  const cap = new cv.VideoCapture(0);

  while (true) {
    const frame = cap.read();
    const image = cv.imencode('.jpg', frame).toString('base64');
    const tensor = tf.node.decodeImage(Buffer.from(image, 'base64'));

    // Detect faces
    const predictions = await model.estimateFaces(tensor, false);

    if (predictions.length > 0) {
      console.log('Face detected!');
      // Draw rectangles around detected faces
      predictions.forEach(pred => {
        const start = new cv.Point(pred.topLeft[0], pred.topLeft[1]);
        const end = new cv.Point(pred.bottomRight[0], pred.bottomRight[1]);
        frame.drawRectangle(start, end, new cv.Vec(0, 255, 0), 2);
      });
    }

    // Display the frame
    cv.imshow('Facial Recognition', frame);

    // Exit if 'q' is pressed
    const key = cv.waitKey(1);
    if (key === 113) { // 'q' key
      break;
    }

    tf.dispose(tensor);
  }

  cap.release();
  cv.destroyAllWindows();
}

setupFacialRecognition();
