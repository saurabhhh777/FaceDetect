import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utils/utils.jsx";

const App = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //Load facemesh
  const handleFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    setInterval(() => {
      handleDetect(net);
    }, 1000);
  };

  const handleDetect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces(video);
      console.log(face);

      const ctx = canvasRef.current.getContext("2d");
      if (face.length > 0) {
        drawMesh(face, ctx);
      }
    }
  };

  handleFacemesh();

  return (
    <div>
      <div style={{
        fontFamily:"Poppins",
        textAlign:"center",
        fontSize:"40px",
        fontWeight:"600",
        font:"white",
      }}>
        Face Detection
      </div>
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginTop:"30px",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius:"4px",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginTop:"30px",
          marginLeft: "auto",
          borderRadius:"4px",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />
    </div>
  );
};

export default App;
