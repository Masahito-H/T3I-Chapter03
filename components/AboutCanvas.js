import React, { Component, useRef, useEffect } from "react";
import * as THREE from "three";
import { extend, Canvas, useFrame, useThree } from "react-three-fiber";

import PageTitle from "../components/PageTitle";

let EffectComposer = null, RenderPass = null, BloomPass = null, TriangleBlurShader = null, ShaderPass = null, CopyShader = null;

class AboutCanvas extends Component{
    constructor(props){
        super(props);
        
        this.canvasStyle = {
            position: "absolute",
            width: "100vw",
            height: "100vh",
            top: "0",
            left: "0"
        };
    }
    
    componentDidMount(){
        EffectComposer = require("three/examples/jsm/postprocessing/EffectComposer").EffectComposer;
        RenderPass = require("three/examples/jsm/postprocessing/RenderPass").RenderPass;
        TriangleBlurShader = require("../public/TriangleBlurShader.js").TriangleBlurShader;
        ShaderPass = require("three/examples/jsm/postprocessing/ShaderPass").ShaderPass;
        CopyShader = require("three/examples/jsm/shaders/CopyShader").CopyShader;
        extend({ EffectComposer, RenderPass, ShaderPass });
    }
    
    render(){
        return(
            <Canvas style={this.canvasStyle} camera={/*{position: [0, 0, 1000], fov: 60, far: 2000}*/{near: -200, far: 2000, position: [0, 0, 1000]}} orthographic={true} onCreated={
                ({ gl, camera }) => { gl.setClearColor("#640D14");
                /*
                window.addEventListener("resize", onResize, false);
                
                function onResize(){
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    gl.setSize(window.innerWidth, window.innerHeight);
                }*/}
            }>
                <PageTitle titleText={"ABOUT"} />
                <Particles />
                <Effect />
            </Canvas>
        );
    }
}

export default React.memo(AboutCanvas);

const Particles = () => {
    const particleRef = useRef();
    const { size } = useThree();
    let oldTime = NaN;
    
    const geom = new THREE.Geometry(),
    mater = new THREE.PointsMaterial({size: 1.25, color: "#E3878D"}),
    R = 100,
    cl = new THREE.Clock(),
    particleParams = [];
    
    for(let n = 0; n < 10000; n++){
        let vel = Math.random(),
        ang = Math.random() * 2 * Math.PI - Math.PI;
        geom.vertices.push(new THREE.Vector3(-size.width / 2 + Math.random() * (size.width / 2), (Math.random() - .5) * size.height, 0));
        particleParams.push({velocity: vel, angle: ang});
    }
    oldTime = cl.getElapsedTime();
    
    useFrame(() => {
        let time = cl.getElapsedTime();
        
        for(let i = 0; i < particleRef.current.geometry.vertices.length; i++){
            let gElem = geom.vertices[i],
            { velocity, angle } = particleParams[i];
            gElem.y += velocity * Math.sin(angle * (gElem.x + size.width / 2) / size.width);
            gElem.x += velocity * Math.cos(angle * (gElem.x + size.width / 2) / size.width);
            
            if(gElem.x > (size.width / 2) || gElem.y > (size.height / 2) || gElem.y < (-size.height / 2)){
                particleParams[i].angle = Math.random() * 2 * Math.PI - Math.PI;
                gElem.x = -size.width / 2;
                gElem.y = (Math.random() - .5) * size.height;
            }
        }
        particleRef.current.geometry.verticesNeedUpdate = true;
        
        oldTime = time;
    });
    
    return (
        <points ref={particleRef} geometry={geom} material={mater} />
    );
};

const Effect = () => {
    const { gl, scene, camera, size } = useThree();
    const effectRef = useRef();
    
    useEffect(() => void effectRef.current.setSize(size.width, size.height), [size]);
    useFrame(() => effectRef.current.render(), 1);
    
    return (
        <effectComposer ref={effectRef} args={[gl]}>
            <renderPass attachArray="passes" args={[scene, camera]} />
            <shaderPass attachArray="passes" args={[TriangleBlurShader(new THREE.Vector2( .005, .005 ))]} />
            <shaderPass attachArray="passes" args={[TriangleBlurShader(new THREE.Vector2( 0.005, -0.005 ))]} />
            <shaderPass attachArray="passes" args={[CopyShader]} renderToScreen/>
        </effectComposer>
    );
};