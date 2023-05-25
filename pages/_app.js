import { useState, useEffect, useCallback, Fragment } from "react";
import Head from "next/head";
import Router from "next/router";
import { Howl, Howler } from "howler";
import { Transition } from "react-transition-group";
import '../styles/globals.css'

import style from "../styles/App.module.scss";

import AudioTop from "../public/msrc/AATopPlus2.mp3";
import AudioAbout from "../public/msrc/AAAboutPlus.mp3";
import AudioWorks from "../public/msrc/AAWorksPlus.mp3";

function MyApp({ Component, pageProps }) {
    const [isWarningFrag1, setIsWarningFrag1] = useState(true);
    const [isWarningFrag2, setIsWarningFrag2] = useState(true);
    const [warningCloseStep1, setWarningCloseStep1] = useState(true);
    const [warningCloseStep2, setWarningCloseStep2] = useState(true);
    let audioSwitch = false;

    const [audioTop, setAudioTop] = useState(new Howl({
        src: ["/msrc/AATopPlus.mp3"],
        volume: 0,
        preload: false
    }));
    const [audioAbout, setAudioAbout] = useState(new Howl({
        src: ["./msrc/AAAboutPlus.mp3"],
        volume: 0,
        preload: false
    }));
    const [audioWorks, setAudioWorksAbout] = useState(new Howl({
        src: ["./msrc/AAWorksPlus.mp3"],
        volume: 0,
        preload: false
    }));


    useEffect(() => {
        let audio = [], endSign = [];
        [audioTop, audioAbout, audioWorks].forEach((elem) => {
            audio.push(new Promise((res) => {
                elem.once("load", (e) => {
                    endSign.push(new Promise((res) => {
                        elem.on("end", () => {
                            res();
                        });
                    }));
                    res();
                });
                elem.load();
            }));
        });

        Promise.all([...audio]).then(() => {
            Promise.all([...endSign]).then(() => {
                audioTop.play();
                audioAbout.play();
                audioWorks.play();

                recursiveLoop();
            });
        });

        return () => {
            Howler.stop();
        };

        function recursiveLoop(){
            endSign = [];

            [audioTop, audioAbout, audioWorks].forEach((elem) => {
                endSign.push(new Promise((res) => {
                    elem.on("end", () => {
                        res();
                    });
                }));
            });

            Promise.all([...endSign]).then(() => {
                audioTop.play();
                audioAbout.play();
                audioWorks.play();

                recursiveLoop();
            });
        }
    }, []);

    useEffect(() => {
        let currentAudio = null, nextAudio = null;
        Router.events.on("routeChangeStart", (url) => {
            switch(Router.router.pathname){
                case "/":
                    currentAudio = audioTop;
                    break;
                case "/about":
                    currentAudio = audioAbout;
                    break;
                case "/works":
                    currentAudio = audioWorks;
                    break;
            }
        });
        Router.events.on("routeChangeComplete", (url) => {
            if(audioSwitch){
                switch(Router.router.pathname){
                    case "/":
                        nextAudio = audioTop;
                        break;
                    case "/about":
                        nextAudio = audioAbout;
                        break;
                    case "/works":
                        nextAudio = audioWorks;
                        break;

                }

                if(currentAudio !== nextAudio){
                    currentAudio.fade(currentAudio.volume(), 0, 3000);
                    nextAudio.fade(nextAudio.volume(), 1, 3000);
                }
                else if(Router.router.pathname === "/works"){
                    if(url === "/works/2"){
                        audioWorks.fade(1, 0, 3000);
                    }
                    else{
                        audioWorks.fade(audioWorks.volume(), 1, 3000);
                    }
                }
            }
    });
    }, []);

    const clickAction = (e, b) => {
        new Promise((res) => {
            setWarningCloseStep1(false);
            res();
        }).then(() => {
            return new Promise((res) => {
                setTimeout(() => {
                    setIsWarningFrag1(false);
                }, 450);
                setTimeout(() => {
                    setWarningCloseStep2(false);
                    res();
                }, 800);
            });
        }).then(() => {
            if(b){
                audioSwitch = true;
            }
            else{
                audioSwitch = false;
            }

            setTimeout(() => {
                audioTop.play();
                audioAbout.play();
                audioWorks.play();

                if(b){
                    let tawMatch = [0, 0, 0];
                    switch(Router.router.pathname){
                        case "/":
                            tawMatch[0] = 1;
                            break;
                        case "/about":
                            tawMatch[1] = 1;
                            break;
                        case "/works":
                            tawMatch[2] = 1;
                            break;
                    }

                    audioTop.fade(0, tawMatch[0], 3000);
                    audioAbout.fade(0, tawMatch[1], 3000);
                    audioWorks.fade(0, tawMatch[2], 3000);
                }
                else{
                    audioTop.volume(0);
                    audioAbout.volume(0);
                    audioWorks.volume(0);
                }

                setIsWarningFrag2(false);
            }, 1500);
        });
    };

    const defaultStyleCloseStep1 = {
        transition: "opacity .4s",
        opacity: 1
    };
    const transitionStyleCloseStep1 = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 }
    };
    const defaultStyleCloseStep2 = {
        transition: "opacity 1.5s",
        opacity: 1
    };
    const transitionStyleCloseStep2 = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 }
    };

    return (
        <Fragment>
            <Head>
                <title>Chapter03 React - The Three Interactions</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="robots" content="noindex">
            </Head>
            <Component {...pageProps} switching={!isWarningFrag1} />
            {(() => {
                if(isWarningFrag2){
                    return (
                        <Fragment>
                            <Transition in={warningCloseStep2} timeout={2000}>
                                {(state) => (
                                    <div style={{...defaultStyleCloseStep2, ...transitionStyleCloseStep2[state]}} className={style.initProcess}>
                                        <Transition in={warningCloseStep1} timeout={1000}>
                                            {(state) => (
                                                <div style={{...defaultStyleCloseStep1, ...transitionStyleCloseStep1[state]}}>
                                                    <p>This website includes some audio.</p>
                                                    <span><div onClick={(e) => {clickAction(e, true)}}>Audio ON</div><div onClick={(e) => {clickAction(e, false)}}>Audio OFF</div></span>
                                                </div>
                                            )}
                                        </Transition>
                                    </div>
                                )}
                            </Transition>
                        </Fragment>
                    );
                }
            })()}
        </Fragment>
    );
}

export default MyApp
