import React from "react";

import WorksCanvas from "../../components/WorksCanvas.js";
import WorksDetail from "../../components/WorksDetail.js";
import Navigation from "../../components/Navigation.js";

import style from "../../styles/Works.module.scss";

export default function Work(){
    return (
        <div className={style.worksPage}>
            <WorksCanvas />
            <WorksDetail />
            <Navigation />
        </div>
    );
}