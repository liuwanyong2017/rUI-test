import * as React from "react";
import "./tabs.scss";
import classes from "../../helpers/classes";
import {tabType} from "./tabs-head";
import Icon from "../icon/icon";
import {useContext, useEffect, useRef} from "react";
import {TabsContext} from "./tabs.context";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    tab: tabType,
    moveline: (style: { [k: string]: number }) => void
}


const TabsItem: React.FunctionComponent<Props> = ({className, children, tab, moveline, ...rest}) => {
    const {text, name, icon} = tab;
    const {current, setCurrent} = useContext(TabsContext);
    const div = document.createElement("div");
    const item = useRef(div);
    useEffect(
        () => {
            current === name && helpLine();
        }, []
    );
    const helpLine = () => {
        const div = item.current;
        const {width, left} = div ? div.getBoundingClientRect() : {width: 0, left: 0};
        moveline({left, width});
    };
    const tabClick = () => {

        setCurrent(name);
        helpLine();
        // console.log(left, width, div.getBoundingClientRect() ,window.getComputedStyle(div,null));
    };
    return (
        <div onClick={tabClick} ref={item}
             className={classes(`yr-tabs-item  ${name} ${current === name ? "active" : ""}`, className)}
             {...rest}>
            {text && <span>{text}</span>}
            {icon && <Icon name={icon}/>}
        </div>
    );
};
export default TabsItem;
