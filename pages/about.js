import React, { Fragment } from "react";

import AboutCanvas from "../components/AboutCanvas.js";
import AboutMe from "../components/AboutMe.js";
import Navigation from "../components/Navigation.js";

import style from "../styles/About.module.scss";

export default function About(props){
    return (
        <div className={style.aboutPage}>
            <AboutCanvas />
            {(() => {
                if(props.switching){
                    return (
                        <Fragment>
                            <AboutMe />
                            <Navigation />
                        </Fragment>
                    );
                }
            })()}
        </div>
    );
}