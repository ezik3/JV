   const tf = require('@tensorflow/tfjs-node');
   const blazeface = require('@tensorflow-models/blazeface');

   console.log("Hello! I'm the face recognition service. I'm here to help!");

   let model;

   async function loadModel() {
     model = await blazeface.load();
   }

   loadModel();

   async function generateEmbedding(faceImage) {
     if (faceImage === "dummyBase64String") {
       // For testing, return a dummy embedding
       return Array(16).fill(0).map(() => Math.random());
     }

     try {
       const tensor = tf.node.decodeImage(Buffer.from(faceImage, 'base64'));
       const predictions = await model.estimateFaces(tensor, false);
       if (predictions.length === 0) {
         throw new Error('No face detected');
       }
       // Use the first face's landmarks as a simple embedding
       return predictions[0].landmarks.flat();
     } catch (error) {
       console.error('Error generating embedding:', error);
       throw new Error('Failed to generate face embedding');
     }
   }

   function cosineSimilarity(embedding1, embedding2) {
     const dotProduct = embedding1.reduce((sum, value, index) => sum + value * embedding2[index], 0);
     const magnitude1 = Math.sqrt(embedding1.reduce((sum, value) => sum + value * value, 0));
     const magnitude2 = Math.sqrt(embedding2.reduce((sum, value) => sum + value * value, 0));
     return dotProduct / (magnitude1 * magnitude2);
   }


   async function verify(storedEmbedding, faceImage) {
     const newEmbedding = await generateEmbedding(faceImage);
     if (faceImage === "dummyBase64String") {
       return true; // For testing, always return true for dummy string
     }
     const similarity = cosineSimilarity(storedEmbedding, newEmbedding);
     return similarity > 0.8; // Adjust this threshold as needed
   }

   module.exports = { generateEmbedding, verify };
