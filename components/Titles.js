import React, { Component, Fragment } from "react";
import { Transition } from "react-transition-group";

import style from "../styles/Titles.module.scss";

export default class Titles extends Component{
    constructor(props){
        super(props);
        this.state = {
            h1MotionFlag: false,
            h2MotionFlag: false
        };
        
    }
    
    componentDidMount(){
        new Promise((res) => {
            setTimeout(() => {
                this.setState({h1MotionFlag: true});
                res();
            }, 50);
        }).then(() => {
            setTimeout(() => {
                this.setState({h2MotionFlag: true});
            }, 700);
        });
    }
    
    render(){
        const defaultStyleTitle = {
            transition: "letter-spacing 1.5s, opacity 1.5s",
            letterSpacing: "normal",
            opacity: 1
        };
        const transitionStyleTitle = {
            entering: { letterSpacing: "15px", opacity: 1 },
            entered: { letterSpacing: "15px", opacity: 1 },
            exiting: { letterSpacing: "-10px", opacity: 0 },
            exited: { letterSpacing: "-10px", opacity: 0 }
        };
        
        const defaultStyleCp3 = {
            transition: "opacity .7s",
            opacity: 1
        };
        const transitionStyleCp3 = {
            entering: { opacity: 1 },
            entered: { opacity: 1 },
            exiting: { opacity: 0 },
            exited: { opacity: 0 }
        };
        
        const defaultStyleReactNext = {
            transition: "opacity .7s, transform .7s",
            opacity: 1,
            transform: "translateX(-50%) translateY(0)"
        };
        const transitionStyleReactNext = {
            entering: { opacity: 1, transform: "translateX(-50%) translateY(0)" },
            entered: { opacity: 1, transform: "translateX(-50%) translateY(0)" },
            exiting: { opacity: 0, transform: "translateX(-50%) translateY(150%)" },
            exited: { opacity: 0, transform: "translateX(-50%) translateY(150%)" }
        };
        
        return (
            <Fragment>
                <Transition in={this.state.h1MotionFlag} timeout={2000}>
                    {(state) => (
                        <h1 style={{...defaultStyleTitle, ...transitionStyleTitle[state]}} className={style.title}>The Three Interaction</h1>
                    )}
                </Transition>
                <Transition in={this.state.h2MotionFlag} timeout={1000}>
                    {(state) => (
                        <h2 style={{...defaultStyleReactNext, ...transitionStyleReactNext[state]}} className={style.reactNext}>React / Next.js + Three.js + Howler.js</h2>
                    )}
                </Transition>
                <Transition in={this.state.h2MotionFlag} timeout={1000}>
                    {(state) => (
                        <h2 style={{...defaultStyleCp3, ...transitionStyleCp3[state]}} className={style.cp3}>Chapter 03</h2>
                    )}
                </Transition>
            </Fragment>
        );
    }
}