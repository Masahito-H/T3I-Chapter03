import React, { Component, useRef, useState, useEffect, useCallback, Fragment } from "react";
import * as THREE from "three";
import { extend, Canvas, useFrame, useThree } from "react-three-fiber";

let EffectComposer = null, RenderPass = null, GlitchPass = null, SVGLoader = null;

//color palette: https://coolors.co/250902-38040e-640d14-800e13-ad2831

export default class TopCanvas extends Component{
    constructor(props){
        super(props);
        this.state = {
            mousePos: {x: 0, y: 0}
        };
        this.canvasStyle = {
            position: "absolute",
            width: "100vw",
            height: "100vh",
            top: "0",
            left: "0"
        };
        this.symbolEvent = this.symbolEvent.bind(this);
    }
    
    componentDidMount(){
        EffectComposer = require("three/examples/jsm/postprocessing/EffectComposer").EffectComposer;
        RenderPass = require("three/examples/jsm/postprocessing/RenderPass").RenderPass;
        GlitchPass = require("three/examples/jsm/postprocessing/GlitchPass").GlitchPass;
        extend({ EffectComposer, RenderPass, GlitchPass });
        
        SVGLoader = require("three/examples/jsm/loaders/SVGLoader").SVGLoader;
    }
    
    symbolEvent(e){
        this.setState({mousePos: {
            x: e.pageX,
            y: e.pageY
        }});
    }
    
    render(){
        return(
            <Canvas style={this.canvasStyle} camera={{position: [0, 0, 1000], fov: 45, far: 2000}} onPointerMove={this.symbolEvent} onCreated={({ gl }) => {
                gl.setClearColor("#640D14");
            }}>
                <Symbol mousePos={this.state.mousePos} />
                <PLight />
                <Effect />
            </Canvas>
        );
    }
}

const Symbol = (props) => {
    const { size } = useThree();
    const [svgFile, setSvgFile] = useState((<Fragment />));
    const [meshGroupFlag, setMeshGroupFlag] = useState(true);
    const refSymbol = useRef();
    let meshGroup = [];
    
    function loadSVG(url){
        return new Promise((res) => {
            let loader = new SVGLoader();
                
            loader.load(url,
                function(data){
                    let paths = data.paths,
                    mater = new THREE.MeshStandardMaterial({
                        color: "#250902",
                        roughness: .5
                    });
                    
                    for(let i = 0; i < paths.length; i++){
                        let path = paths[i],
                        shapes = path.toShapes(true);
                        
                        for(let j = 0; j < shapes.length; j++){
                            let shape = shapes[j];
                            
                            let geom = new THREE.ExtrudeBufferGeometry(shape, {
                                steps: 2,
                                depth: 50,
                                bevelEnabled: false
                            });
                                
                            meshGroup.push({
                                geometry: geom,
                                material: mater
                            });
                        }
                    }
                    
                    res();
                },
                function(){
                
                }
            );
        });
    }
    
    //svg load process
    useEffect(() => {
        if(meshGroupFlag){
            loadSVG("t3i_symbol2.svg").then(() => {
                const box = new THREE.Box3().setFromObject(refSymbol.current);
                const size = new THREE.Vector3();
                box.getSize(size);
                
                setSvgFile((
                    <Fragment>
                        <mesh position={[0, 0, 0]} scale={[1, 1, 1]} geometry={meshGroup[0].geometry} material={meshGroup[0].material} />
                        <mesh position={[0, 0, 0]} scale={[1, 1, 1]} geometry={meshGroup[1].geometry} material={meshGroup[1].material} />
                        <mesh position={[0, 0, 0]} scale={[1, 1, 1]} geometry={meshGroup[2].geometry} material={meshGroup[2].material} />
                    </Fragment>
                ));
                
                refSymbol.current.children.forEach((item) => {
                    item.position.y = -size.y * 2;
                    item.position.x = -size.x * 2;
                });
                
                setMeshGroupFlag(false);
            });
        }
    }, [svgFile, meshGroupFlag]);
    
    //mouse event process
    useEffect(() => {
        const coord = {
            x: props.mousePos.x - size.width / 2,
            y: props.mousePos.y - size.height / 2
        };
        
        if(props.mousePos){
            refSymbol.current.rotation.x = coord.y / size.height / 2 * Math.PI / 2;
            
            refSymbol.current.children.forEach((elem) => {
                elem.rotation.y = coord.x / size.width / 2 * Math.PI / 4;
            });
        }
    }, [props.mousePos]);
    
    useFrame(() => {
        
    });
    
    return (
        <group position={[0, 70, 0]} scale={[.25, -.25, .25]} ref={refSymbol}>
            {svgFile}
        </group>
    );
};

const PLight = () => {
    const refPLight = useRef();
    
    return (
        <pointLight ref={refPLight} color="#640D14" position={[0, 70, 35]} intensity={55} distance={150} />
    );
};

const Effect = () => {
    const { gl, scene, camera, size } = useThree();
    const effectRef = useRef();
    
    useEffect(() => void effectRef.current.setSize(size.width, size.height), [size]);
    useFrame(() => effectRef.current.render(), 1);
    
    return (
        <effectComposer ref={effectRef} args={[gl]}>
            <renderPass attachArray="passes" args={[scene, camera]}/>
            <glitchPass attachArray="passes" args={[64]} renderToScreen/>
        </effectComposer>
    );
};