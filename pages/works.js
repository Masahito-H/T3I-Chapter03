import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";

import WorksCanvas from "../components/WorksCanvas.js";
import WorksIndex from "../components/WorksIndex.js";
import WorksDetail from "../components/WorksDetail.js";
import Navigation from "../components/Navigation.js";

import style from "../styles/Works.module.scss";

export default function Works(props){
    const router = useRouter();
    const [indexNum, setIndexNum] = useState(-1);
    const [delta, setDelta] = useState(0);
    
    const wheelAction = useCallback((e) => {
        setDelta(e.deltaY);
    });
    
    return (
        <div className={style.worksPage} onWheel={wheelAction}>
            <WorksCanvas indexNum={indexNum} setIndexNum={setIndexNum} delta={delta} setDelta={setDelta} />
            {(() => {
                if(props.switching){
                    return (
                        <div className={style.wheelArea} onWheel={wheelAction}>
                        {
                            (() => {
                                if(router.asPath === "/works"){
                                    return (<WorksIndex setIndexNum={setIndexNum} />);
                                }
                                else{
                                    return (<WorksDetail pfId={parseInt(router.asPath.slice(7))} />);
                                }
                            })()
                        }
                            <Navigation />
                        </div>
                    );
                }
            })()}
        </div>
    );
}

