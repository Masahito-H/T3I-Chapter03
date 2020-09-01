import React, { useState, Fragment } from "react";
//import { Transition } from "react-transition-group";

import Navigation from "../components/Navigation.js";
import Titles from "../components/Titles.js";
import TopCanvas from "../components/TopCanvas.js";

import style from "../styles/Index.module.scss";

export default function Top(props){
    return (
        <div className={style.indexPage}>
            <TopCanvas />
            {(() => {
                if(props.switching){
                    return (
                        <Fragment>
                            <Titles />
                            <Navigation />
                        </Fragment>
                    );
                }
            })()}
        </div>
    );
} 