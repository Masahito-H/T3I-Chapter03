import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "react-three-fiber";

// props -> titleText, threeSize
const PageTitle = (props) => {
    const stringRef = useRef(),
    cl = new THREE.Clock(),
    { size } = useThree();
    
    let clFlag = true,
    canvas = document.createElement("canvas");
    canvas.width = size.width / 3;
    canvas.height = size.height;
    canvas.style = "font-family: 'Didot'";
    
    let context = canvas.getContext("2d");
    
    useFrame(() => {
        let time = cl.getElapsedTime();
        if(time > .5 && clFlag){
            generateAbout(false, 1, 0);
            stringRef.current.material.map.needsUpdate = true;
            clFlag = false;
        }
        else if(time < .5){
            generateAbout(false, (time - .25) / .25, 0);
            stringRef.current.material.map.needsUpdate = true;
        }
    });
    
    return (
        <mesh ref={stringRef} position={[-size.width / 2 + size.width / 6, 0, -1]} scale={[1, 1, 1]}>
            <planeGeometry attach="geometry" args={[size.width / 3, size.height]} />
            <meshBasicMaterial attach="material" map={generateAbout(true, 0, 0)} transparent />
        </mesh>
    );
    
    function generateAbout(b, alpha, dx){
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = "#250902";
        context.textBaseline = "bottom";
        context.font = "270px 'Didot'";
        context.globalAlpha = alpha;
        
        context.rotate(Math.PI / 2);
        context.fillText(props.titleText, 15 + Math.pow(50 * (1 - alpha), .5), 55);
        context.rotate(-Math.PI / 2);
        
        if(b){
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            
            return texture;
        }
    }
};

export default React.memo(PageTitle);