import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { Transition } from "react-transition-group";

import pfData from "../public/portfolioData.json";

import style from "../styles/WorksDetail.module.scss";

export default function WorksDetail(props){
    let portfolio = pfData[props.pfId];
    const [transiteFlagDetail, setTransiteFlagDetail] = useState(false),
    [transiteFlagView, setTransiteFlagView] = useState(false);
    
    useEffect(() => {
        if(!transiteFlagDetail && !transiteFlagView){
            new Promise((res) => {
                setTimeout(() => {
                    setTransiteFlagDetail(true);
                    res();
                }, 500);
            }).then(() => {
                setTimeout(() => { setTransiteFlagView(true) }, 500);
            });
        }
    }, [transiteFlagDetail, transiteFlagView]);
    
    const defaultStyleDetail = {
        transition: "opacity .5s",
        opacity: 1
    };
    const transitionStyleDetail = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 }
    };
    const defaultStyleHr = {
        transition: "opacity 1s, width 2.5s",
        opacity: 1,
        width: "90%"
    };
    const transitionStyleHr = {
        entering: { opacity: 1, width: "90%" },
        entered: { opacity: 1, width: "90%" },
        exiting: { opacity: 0, width: 0 },
        exited: { opacity: 0, width: 0 }
    };
    const defaultStyleView = {
        transition: "opacity .5s",
        opacity: 1
    };
    const transitionStyleView = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 }
    };
    
    return (
        <Fragment>
            <Transition in={transiteFlagDetail} timeout={1000}>
                {(state) => (    
                    <div style={{...defaultStyleDetail, ...transitionStyleDetail[state]}} className={style.worksDetail}>
                        <div className={style.portfolioHead}>
                            <h2>{portfolio.title}</h2>
                            <h3>{portfolio.genre}</h3>
                        </div>
                        <hr style={{...defaultStyleHr, ...transitionStyleHr[state]}} />
                        <div className={style.portfolioDescribe}>
                            <p>{portfolio.language}</p>
                            { (portfolio.githubLink !== "") && (<a className={style.githubLink} href={portfolio.githubLink} target="_blank"><span>{portfolio.githubLink}</span></a>) }
                            <div className={style.innerHtml} dangerouslySetInnerHTML={{__html: portfolio.describe}}></div>
                        </div>
                    </div>
                )}
            </Transition>
            <Transition in={transiteFlagView} timeout={1000}>
                {(state) => (
                    <Fragment>
                        <div style={{...defaultStyleView, ...transitionStyleView[state]}} className={style.portfolioView}>
                            {
                                portfolio.thumbnail.isMovie && 
                                (<iframe src={portfolio.thumbnail.movsrc} scroll="no" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />)
                            }
                        </div>
                        <Link href="/works" as="/works"><div style={{...defaultStyleDetail, ...transitionStyleDetail[state]}} className={style.backLink}>&gt;&gt; Back</div></Link>
                    </Fragment>
                )}
                {/*<div className="portfolioView">
                    {
                        portfolio.thumbnail.isMovie ? 
                        (<iframe src={portfolio.thumbnail.movsrc} scroll="no" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullScreen />) :
                        (<div className="images">
                            {portfolio.thumbnail.detailsrcs.map((src, i) => {
                                return (<img src={"../" + src} className={style.imageClass} key={"img" + i} />);
                            })}
                        </div>)
                    }
                </div>*/}
            </Transition>
        </Fragment>
    );
}