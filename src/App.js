import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const displayResults = (data) => {
    // Example: Assuming the response data contains a "classification" property
    console.log(data)
    const classificationResult = data.output;

    // Display the results on the website
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = `The probable type of skin cancer: ${classificationResult}`;
  };

  const performImageAnalysis = async (image) => {
    try {
      const apiGatewayEndpoint = 'https://b2crnglopl.execute-api.ap-south-1.amazonaws.com/default/fyprojectlambda';
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];

        // Set up the request payload with the Base64-encoded image data
        const requestData = {
          image: base64Image
        };

        // Set up the request headers
        const headers = {
          'Content-Type': 'application/json'
        };

        // Send a POST request to the API Gateway endpoint
        const response = await axios.post(apiGatewayEndpoint, requestData, { headers });

        // Handle the response data from the API Gateway
        const responseData = response.data;
        displayResults(responseData);
      };

      // Read the image file as Data URL
      reader.readAsDataURL(image);
    } catch (error) {
      console.error(error);
      // Handle any errors that occur during the request
    }
  };

  const handleAnalyzeClick = () => {
    if (selectedImage) {
      performImageAnalysis(selectedImage);
      console.log('Analyzing image:', selectedImage);
    } else {
      console.log('No image selected.');
    }
  };

  return (
    <div>
      <h1>Image Analyzer</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleAnalyzeClick}>Analyze</button>
      <h3 id='resultContainer'></h3>
    </div>
  );
};

export default App;