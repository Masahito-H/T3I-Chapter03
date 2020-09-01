import React, { Fragment, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Transition } from "react-transition-group";

import style from "../styles/WorksIndex.module.scss";
import pfData from "../public/portfolioData.json"; 

export default function WorksIndex(props){
    const [transiteFlagIndex, setTransiteFlagIndex] = useState(false);
    
    useEffect(() => {
        if(!transiteFlagIndex){
            new Promise((res) => {
                setTimeout(() => {
                    setTransiteFlagIndex(true);
                    res();
                }, 500)
            }).then(() => {});
        }
    }, [transiteFlagIndex]);
    
    const viewImg = useCallback((i, e) => {
        props.setIndexNum(i);
    });
    
    const defaultStyleIndex = {
        transition: "opacity .5s",
        opacity: 1
    };
    const transitionStyleIndex = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 }
    };
    
    return (
        <Fragment>
            <Transition in={transiteFlagIndex} timeout={1000}>
                {(state) => (
                    <div style={{...defaultStyleIndex, ...transitionStyleIndex[state]}} className={style.worksIndex}>
                        <ul>
                            {(() => {
                                const items = [];
                            
                                for(let i = 0; i < pfData.length; i++){
                                    items.push((
                                        <Link href="/works" as={"/works/" + i} key={"work" + i}>
                                            <li onMouseOver={(e) => viewImg(i, e)}>
                                                <h2>{pfData[i].title}</h2>
                                                <p>Genre: {pfData[i].genre}</p>
                                            </li>
                                        </Link>
                                    ));
                                }
                                
                                return (<Fragment>{items}</Fragment>);
                            })()}
                        </ul>
                    </div>
                )}
            </Transition>
        </Fragment>
    );
}