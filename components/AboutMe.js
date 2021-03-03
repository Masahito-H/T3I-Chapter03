import react, { useState, useEffect, Fragment } from "react";
import { Transition } from "react-transition-group";

import style from "../styles/AboutMe.module.scss";

export default function AboutMe(){
    const [initMotionFlag, setInitMotionFlag] = useState(false);
    
    const defaultStyleProfile = {
        transition: "opacity .5s, left .5s",
        opacity: 1,
        left: "50vw"
    };
    const transitionStyleProfile = {
        entering: { opacity: 1, left: "50vw" },
        entered: { opacity: 1, left: "50vw" },
        exiting: { opacity: 0, left: "calc(50vw + 50px)" },
        exited: { opacity: 0, left: "calc(50vw + 50px)" }
    };
    const defaultStyleImg = {
        transition: "opacity .5s, top .5s",
        opacity: 1,
        top: "calc(50vh + 45px)"
    };
    const transitionStyleImg = {
        entering: { opacity: 1, top: "calc(50vh + 45px)" },
        entered: { opacity: 1, top: "calc(50vh + 45px)" },
        exiting: { opacity: 0, top: "calc(50vh - 40px)" },
        exited: { opacity: 0, top: "calc(50vh - 40px)" }
    };
    const defaultStyleFunc = {
        transition: "opacity .5s, left .5s",
        opacity: 1,
        left: "calc(50vw + 200px)"
    };
    const transitionStyleFunc = {
        entering: { opacity: 1, left: "calc(50vw + 260px)" },
        entered: { opacity: 1, left: "calc(50vw + 260px)" },
        exiting: { opacity: 0, left: "calc(50vw + 140px)" },
        exited: { opacity: 0, left: "calc(50vw + 140px)" }
    };
    
    useEffect(() => {
        setTimeout(() => {
            if(!initMotionFlag){
                setInitMotionFlag(true);
            }
        }, 900);
    }, [initMotionFlag]);
    
    return (
        <Fragment>
            <Transition in={initMotionFlag} timeout={1000}>
                {(state) => (
                    <div style={{...defaultStyleProfile, ...transitionStyleProfile[state]}} className={style.aboutme}>
                        <h2>Masahito H.</h2>
                        <div className="myIntroDesc">
                            <p>法政大学情報科学部ディジタルメディア学科卒業</p>
                            <p>
                                ジェネラティブアートと視線誘導に関する学士論文を執筆。<br />
                                他、大学の音楽サークルにてVJ、CDジャケットのデザインの経験を持つ。<br />
                                現在、Webエンジニア（フロントエンドエンジニア）に向けて勉強中。
                            </p>
                            <hr />
                            <h3 className="memberSkill">取得資格</h3>
                            <p>
                                基本情報技術者試験<br />
                                TOEIC IPテスト スコア605
                            </p>
                            <hr />
                            <h3 className="memberSkill">プログラミングスキル</h3>
                            <p>C++(openFrameworks) / Java / Processing /<br /> javascript(jQuery, Vue.js, Nuxt.js, p5.js, React, three.js, Howler.js) / Python / etc..</p>
                            
                            
                        </div>
                    </div>
                )}
            </Transition>
            <Transition in={initMotionFlag} timeout={1000}>
                {(state) => (
                    <img src="la.png" width="380vh" style={{...defaultStyleImg, ...transitionStyleImg[state]}} className={style.img} />
                )}
            </Transition>
            
            <Transition in={initMotionFlag} timeout={1000}>
                {(state) => (
                    <a id="function-list" href="https://docs.google.com/spreadsheets/d/1vni9QR5hQmeM8H7di9dCajCkrwmHjsemvcBw_6CoGnA" target="_blink" style={{...defaultStyleFunc, ...transitionStyleFunc[state]}} className={style.funcList}>
                        <div id="function-list-button">
                            <span>ポートフォリオ<br />機能一覧表</span>
                        </div>
                    </a>
                )}
            </Transition>
            
        </Fragment>
    );
}