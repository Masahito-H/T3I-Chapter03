import React, { Component, useRef, useEffect, useState, Fragment } from "react";
import * as THREE from "three";
import Router from "next/router";
import { extend, Canvas, useFrame, useThree } from "react-three-fiber";

import PageTitle from "../components/PageTitle";

import pfData from "../public/portfolioData.json";

let EffectComposer = null, RenderPass = null, ShaderPass = null;

export default class WorksCanvas extends Component{
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
        ShaderPass = require("three/examples/jsm/postprocessing/ShaderPass").ShaderPass;
        extend({ EffectComposer, RenderPass, ShaderPass });
    }

    render(){
        return(
            <Canvas style={this.canvasStyle} camera={{near: -200, far: 2000, position: [0, 0, 1000]}} orthographic={true} onCreated={
                ({ gl }) => { gl.setClearColor("#640D14"); }
            }>
                <PageTitle titleText={"WORKS"} />
                <ImageScene indexNum={this.props.indexNum} setIndexNum={this.props.setIndexNum} delta={this.props.delta} setDelta={this.props.setDelta} workScrollSwitch={this.props.workScrollSwitch} setWorkScrollSwitch={this.props.setWorkScrollSwitch} />
            </Canvas>
        );
    }
}

const ImageScene = (props) => {
    const { size } = useThree(),
    pCam = useRef();

    return (
        <Fragment>
            <perspectiveCamera ref={pCam} aspect={size.width / size.height} fov={60} near={.1} far={2000} position={[0, 0, 2000]} />
            {
                (() => {
                    if(!Router.router || Router.router.asPath === "/works"){
                        return (
                            <ThumbImage indexNum={props.indexNum} setIndexNum={props.setIndexNum} />
                        );
                    }
                    else{
                        let pfId = parseInt(Router.router.asPath.slice(7, 10));

                        return (
                            <Fragment>
                                <WorkImage pfId={pfId} camera={pCam.current} delta={props.delta} setDelta={props.setDelta} workScrollSwitch={props.workScrollSwitch} setWorkScrollSwitch={props.setWorkScrollSwitch} />
                            </Fragment>
                        );
                    }
                })()
            }
        </Fragment>
    );
};

const ThumbImage = (props) => {
    const loader = new THREE.TextureLoader();

    const thumbImgRef = useRef(),
    cl = new THREE.Clock(),
    { size } = useThree();

    const blank = new THREE.Texture(null);

    useEffect(() => {
        if(props.indexNum > -1){
            thumbImgRef.current.material.map = loader.load(pfData[props.indexNum].thumbnail.imgsrc, () => {
                let img = thumbImgRef.current.material.map.image;
                if(img){
                    thumbImgRef.current.scale.set(.5, .5 * (img.height / img.width) * (size.width / size.height), 1);
                }
            });
        }
        else{
            thumbImgRef.current.material.map = blank;
        }
    }, [props.indexNum]);

    useEffect(() => {

    }, []);

    return (
        <mesh ref={thumbImgRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
            <planeGeometry attach="geometry" args={[size.width, size.height]} />
            <meshBasicMaterial attach="material" map={blank} />
        </mesh>
    );

};

const WorkImage = (props) => {
    const workImgRef = useRef(),
    groupRef = useRef(),
    groupRef2 = useRef(),
    cl = new THREE.Clock(),
    { size } = useThree();

    const loader = new THREE.TextureLoader(),
    srcArray = pfData[props.pfId].thumbnail.detailsrcs;

    let textureArray = [], yPos = 0;
    srcArray.forEach((data, i) => {
        textureArray.push(loader.load("../" + data, () => {
            let img = groupRef2.current.children[i].material.map.image;
            console.log(yPos);
            if(img){
                let aspectProd = (img.height / img.width) * (size.width / size.height);
                groupRef2.current.children[i].scale.set(.75, 1.25 * aspectProd, 1);
                groupRef2.current.children[i].position.y = yPos;
                yPos -= (size.height / 4 + size.height / 8) * aspectProd;
                console.log(yPos);
            }
        }));
    });
    const [texArray, setTexArray] = useState(textureArray);

    const [velocity, setVelocity] = useState(0);

    useEffect(() => {
        if(props.workScrollSwitch){
            setVelocity(props.delta * .1);
            props.setWorkScrollSwitch(false);
        }
    }, [props.workScrollSwitch]);

    useFrame(({ gl }) => void ((gl.autoClear = false), (groupRef.current.visible = true), gl.render(workImgRef.current, props.camera), (groupRef.current.visible = false)));
    useFrame(() => {
      /*
        if(velocity !== 0 && (velocity < 1 && velocity > -1)){
            setVelocity(0);
        }
        else if(groupRef2.current.position.y < 0){
            groupRef2.current.position.y = 0;
            setVelocity(velocity * .8);
        }
        else if(groupRef2.current.position.y > size.height / 2 * (groupRef2.current.children.length - 1)){
            groupRef2.current.position.y = size.height / 2 * (groupRef2.current.children.length - 1);
            setVelocity(velocity * .8);
        }
        */
        console.log(groupRef2.current);
        console.log(groupRef2.current.position);
        if(velocity > 0){
            groupRef2.current.translateY(velocity);
            setVelocity(velocity - 1);
        }
        else if(velocity < 0){
            groupRef2.current.translateY(velocity);
            setVelocity(velocity + 1);
        }
    });


    return (
        <scene ref={workImgRef}>
            <group ref={groupRef} position={[0, 0, 1000]} scale={[1, 1, 1]} rotation={[0, Math.PI / 4, 0]} visible={false}>
                <group ref={groupRef2} position={[-size.width / 6 + 100, 0, 0]} scale={[1, 1, 1]}>
                    {
                        (() => {
                            let images = srcArray.map((data, i) => {
                                return (
                                    <mesh position={[0, size.height / 4 * i, 5]} scale={[1, 1, 1]} key={"img" + i}>
                                        <planeGeometry attach="geometry" args={[size.width / 4, size.height / 4]} />
                                        <meshBasicMaterial attach="material" map={texArray[i]} />
                                    </mesh>
                                );
                            });

                            return images;
                        })()
                    }
                </group>
            </group>
        </scene>
    );
};


const Effect = (props) => {
    const { gl, scene, camera, size } = useThree();
    const effectRef = useRef();

    useEffect(() => void effectRef.current.setSize(size.width, size.height), [size]);
    useFrame(() => effectRef.current.render(), 1);

    return (
        <effectComposer ref={effectRef} args={[gl]}>
            <renderPass attachArray="passes" args={[scene, camera]} clear={false} />
        </effectComposer>
    );
}
