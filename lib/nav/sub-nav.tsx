import React, {HTMLAttributes, RefObject, useContext, useEffect, useRef, useState} from "react";
import {Context, Item} from "./nav";
import classes, {scopeClassName} from "../../helpers/classes";
import NavItem from "./nav-item";

interface Props extends HTMLAttributes<HTMLDivElement> {
    data: Item,
    level: number,
}

const sc = scopeClassName("yr-nav-sub");

interface Props1 {
    sub: Item[],
    level: number,
    visible?: string
}

const Content = (
    {sub, level}: Props1,
    ref: RefObject<HTMLDivElement>) =>
    <div className={sc("popover-content", "fade-in1")} ref={ref}>
        {
            sub.map(
                item => item.sub ?
                    <SubNav data={item} key={item.name} level={level + 1}/> :
                    <NavItem key={item.name} data={item} level={level + 1}/>
            )
        }
    </div>;

const Content1 = React.forwardRef(Content);

const Popover = ({sub, level, visible}: Props1) => {
    const ref = useRef(document.body as HTMLDivElement);
    const fadeIn = (dom: HTMLDivElement, height: number) => {
        dom.classList.add("fade-in2");
        dom.animate(
            [
                {height: 0, overflow: "hidden"},
                {height: height + "px", overflow: "hidden"}
            ], 300
        );
        dom.classList.remove("fade-in2", "fade-in1");
    };
    const fadeOut = (dom: HTMLDivElement, height: number) => {
        dom.animate(
            [
                {height: height + "px", overflow: "hidden"},
                {height: 0, overflow: "hidden"}
            ], 200
        );
        console.log("out", dom, height, visible);
    };
    useEffect(
        () => {
            const dom = ref.current;  //初始化时为默认值，需要等下一次宏任务时拿到
            setTimeout(
                () => {
                    const {height} = dom.getBoundingClientRect();
                    fadeIn(dom, height);
                }
            );
        }, []
    );
    useEffect(
        () => {
            if (!visible) {
                const dom = ref.current;
                const {height} = dom.getBoundingClientRect();
                fadeOut(dom, height);
            }
        }, [visible]
    );
    return <div className={classes(sc("popover"))}>
        <Content1 level={level} sub={sub} ref={ref}/>
    </div>;
};

const SubNav = ({
                    className, level, children,
                    data, ...rest
                }: Props) => {
    const {sub, name, slotFn} = data;
    const {store, setStore} = useContext(Context);
    const [destroy, setDestroy] = useState(true);
    const set = () => {
        const arr = store.slice(0, level);
        arr.push(name);
        setStore(arr);
    };
    const visible =
        store[level] === name ? "active" : "";

    useEffect(
        () => {
            if (visible) {
                setDestroy(false);
            } else {
                setTimeout(
                    () => {
                        setDestroy(true);
                    }, 200
                );
            }
        }, [visible]
    );

    return <div {...rest}
                className={classes(className, sc())}
    >
        <div className={classes(sc("text"), visible)} onClick={set}>
            {
                slotFn ? slotFn() :
                    name
            }
        </div>
        {
            sub && !destroy &&
            <Popover level={level} sub={sub} visible={visible}/>
        }
    </div>;
};

export default SubNav;