import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Transition } from "react-transition-group";

import style from "../styles/Navigation.module.scss";

const Navigation = (props) => {
    const router = useRouter();
    
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleItem1, setVisibleItem1] = useState(false);
    const [visibleItem2, setVisibleItem2] = useState(false);
    const [visibleItem3, setVisibleItem3] = useState(false);
    const [visibleItem4, setVisibleItem4] = useState(false);
    const [visibleItem5, setVisibleItem5] = useState(false);
    
    const defaultStyleNav = {
        transition: "opacity .5s, transform .5s",
        opacity: 1,
        transform: "translateX(-50%) scale(1)"
    };
    const transitionStyleNav = {
        entering: { opacity: 1, transform: "translateX(-50%) scale(1)" },
        entered: { opacity: 1, transform: "translateX(-50%) scale(1)" },
        exiting: { opacity: 0, transform: "translateX(-50%) scale(1.1)" },
        exited: { opacity: 0, transform: "translateX(-50%) scale(1.1)" }
    };
    
    const defaultStyleLink = {
        transition: "opacity .5s, transform .5s",
        opacity: 1,
        transform: "translateY(0)"
    };
    const transitionStyleLink = {
        entering: { opacity: 1, transform: "translateY(0)" },
        entered: { opacity: 1, transform: "translateY(0)" },
        exiting: { opacity: 0, transform: "translateY(-20px)" },
        exited: { opacity: 0, transform: "translateY(-20px)" }
    };
    const defaultStyleLink2 = {
        transition: "opacity .5s, margin .5s",
        opacity: 1,
        margin: "0 20px"
    };
    const transitionStyleLink2 = {
        entering: { opacity: 1, margin: "0 20px" },
        entered: { opacity: 1, margin: "0 20px" },
        exiting: { opacity: 0, margin: "0 -20px" },
        exited: { opacity: 0, margin: "0 -20px" }
    };
    
    const defaultStyleLinkSwitch = (router.pathname === "/") ? defaultStyleLink : defaultStyleLink2;
    const transitionStyleLinkSwitch = (router.pathname === "/") ? transitionStyleLink : transitionStyleLink2;
    const linkArray = [
        linkGenerator(0, "/", (<Fragment>TOP</Fragment>), defaultStyleLinkSwitch, transitionStyleLinkSwitch, true),
        linkGenerator(1, "/about", (<Fragment>ABOUT</Fragment>), defaultStyleLinkSwitch, transitionStyleLinkSwitch, true),
        linkGenerator(2, "/works", (<Fragment>WORKS</Fragment>), defaultStyleLinkSwitch, transitionStyleLinkSwitch, true),
        linkGenerator(3, "https://t3i-chapter01-prototype.netlify.app", (<Fragment>Chapter01{(router.pathname === "/") ? (<br />) : (<Fragment>:&ensp;</Fragment>)}jQuery</Fragment>), defaultStyleLinkSwitch, transitionStyleLinkSwitch, false),
        linkGenerator(4, "https://t3i-chapter02-prototype.netlify.app", (<Fragment>Chapter02{(router.pathname === "/") ? (<br />) : (<Fragment>:&ensp;</Fragment>)}Vue.js</Fragment>), defaultStyleLinkSwitch, transitionStyleLinkSwitch, false)
    ];
    
    function linkGenerator(idAug, hrefAug, jsxAug, defaultStyleAug, transitionStyleAug, isLink){
        let visibleItems = [visibleItem1, visibleItem2, visibleItem3, visibleItem4, visibleItem5];
        
        return (
            <Fragment>
                <Transition in={visibleItems[idAug]} timeout={200}>
                    {(state) => (
                        <Fragment>
                            {(() => {
                                if(isLink){
                                    return (
                                        <Link href={hrefAug}>
                                            <span style={{...defaultStyleAug, ...transitionStyleAug[state]}}>
                                                <div className={(router.pathname === hrefAug) ? style.currentPage : style.otherPage }>
                                                    {jsxAug}
                                                </div>
                                            </span>
                                        </Link>
                                    );
                                }
                                else{
                                    return (
                                        <a href={hrefAug} style={{...defaultStyleAug, ...transitionStyleAug[state]}}>
                                            <div className={style.otherPage}>
                                                {jsxAug}
                                            </div>
                                        </a>
                                    );
                                }
                            })()}
                        </Fragment>
                    )}
                </Transition>
            </Fragment>
        );
    }
    
    useEffect(() => {
        const initWait = (router.pathname === "/") ? 2000 : 100 ;
        
        new Promise((res) => {
            setTimeout(() => {
                setVisibleMenu(true);
                res();
            }, initWait);
        }).then(() => {
            return new Promise((res) => {
                setTimeout(() => {
                    setVisibleItem1(true);
                    res();
                }, 100);
            });
        }).then(() => {
            return new Promise((res) => {
                setTimeout(() => {
                    setVisibleItem2(true);
                    res();
                }, 100);
            });
        }).then(() => {
            return new Promise((res) => {
                setTimeout(() => {
                    setVisibleItem3(true);
                    res();
                }, 100);
            });
        }).then(() => {
            return new Promise((res) => {
                setTimeout(() => {
                    setVisibleItem4(true);
                    res();
                }, 100);
            });
        }).then(() => {
            return new Promise((res) => {
                setTimeout(() => {
                    setVisibleItem5(true);
                    res();
                }, 100);
            });
        });
    }, []);
    
    return (
        <Fragment>
            <Transition in={visibleMenu} timeout={550}>
                {(state) => (
                    <nav style={{...defaultStyleNav, ...transitionStyleNav[state]}} className={(router.pathname === "/") ? style.navigation : style.navigation2}>
                        {   
                            linkArray.map((val, id) => {
                                return (
                                    <Fragment key={id}>
                                        {val}
                                    </Fragment>);
                            })
                        }
                    </nav>
                )}
            </Transition>
        </Fragment>
    );
};

export default Navigation;