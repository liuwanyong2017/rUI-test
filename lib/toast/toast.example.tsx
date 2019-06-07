import Button from "../button/button";
import Toast, {OnlyOneToast} from "./toast";
import * as React from "react";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {scopeClassName} from "../../helpers/classes";
import "./toast.example.scss";


const ToastExample: React.FunctionComponent = () => {
    const [time, setTime] = useState(0);  //记录toast 的关闭时间
    const callback = () => {setTime(time - 1);};
    const intervalRef: MutableRefObject<{ set: () => void, timer: undefined | number }> =
        useRef({timer: 0, set: () => console.log("1")});

    useEffect(
        () => {intervalRef.current.set = callback;}
    );
    //以上只是为了展示延迟时间的，不需要关注


    const [currentClose, setCurrentClose] = useState();  //每次点击只出现新的一个，旧的立刻销毁


    const showToast = (config: { [k: string]: any }) => {
        currentClose && currentClose();   //销毁当前存在的toast
        currentClose && setTime(0);  //当前倒计时清除
        const CurrentClose = Toast(config);    //创建新的，并且函数执行返回了，关闭它的方法！
        const tick = () => {
            intervalRef.current.set();
        };   //倒计时的方法
        const timer = intervalRef.current.timer;
        timer && clearInterval(timer);                //清除上一个计时器
        //这里不写清除计时器，就清除不了的，但是，我在useEffect里监听time了，下面有写，只要为0，就会清除，但是为什么没有？
        //因为这个函数执行域里setTime这个setState执行了两次，我在控制台验证是最终合并了，直接执行到最终状态了。
        //我把上面的那个setTime留下来，作为警告了！
        setTime(config && config.autoCloseDelay || 4);    //初始化计时器
        //这里对计时器的类有问题，我记得返回的是个数字，但是ts一直认为是node.Timeout，暂时忽略掉了
        // @ts-ignore
        intervalRef.current.timer = setInterval(tick, 1000);  //创建计时器
        console.log(timer, tick);

        setCurrentClose(() => CurrentClose);  //储存当前toast的关闭方法，为了函数开始那里的关闭
    };
    useEffect(
        () => {
            const timer = intervalRef.current.timer;
            console.log(time, "ttt", timer);
            time === 0 && timer && clearInterval(timer);
            time === 0 && timer && (intervalRef.current.timer = undefined);
        }, [time]
    );

    const sc = scopeClassName("yr-toast-example");
    const lists = [
        <Button message={`点我,我定50s后消失,可点关闭，提前关闭,点一次，旧的没了，新的出来`}
                onClick={
                    () => showToast(
                        {
                            child: <div>
                                <h4>{"点我干哈？我定50s后消失,点击关闭，可提前关闭！"}</h4>
                                <p style={{color: "red"}}>
                                    {`每点击一次，旧的消失，新的生成！看`}
                                    <span style={{color: "blue"}}>
                                        {parseInt(Math.random() * 100 + "" + new Date().toLocaleString())}
                                    </span>
                                </p>
                                <Button message={"吻我！"} icon={"guilian2"}
                                        onClick={() => alert("你问我爱你有多深？给钱！")}/>
                            </div>,
                            autoCloseDelay: 50,
                            closeText: "关闭",
                            closeCallback: () => setTime(0),
                        }
                    )}
        />,
    ];

    return (
        <div className="yr-toast-example">
            <h4>{"点击之后，旧的消除，新的创建！button不加disabled,不依赖关闭的延迟时间！"}</h4>
            <h4 style={{color: "red", fontSize: "12px", textAlign: "left"}}>
                {
                    `重点是showToast方法，跟计时器相关的不需要看，
                    是我做的体验视觉的helpers，核心是如何消除，并创建,我注释好了。
                    思路 —— Toast方法返回一个立刻关闭当前toast的函数，储存好它。
                    然后，点击按钮的showToast方法那里，第一步不是创建了，是判断加执行关闭函数，
                    然后再创建。就折磨简单。
                    `
                }
            </h4>
            <ul>
                {
                    lists.map(
                        (list, index) =>
                            <li key={index}
                                className={sc("list")}>
                                {list}
                                {<span className={sc("timer")}>{time + "s"}</span>}
                            </li>
                    )
                }
            </ul>
            <h4>{"封装的初步的API"}</h4>
            <h4>{"测试一"}</h4>
            <OnlyOneToast config={
                {
                    child: <div>
                        <h4>{"点我干哈？我定10s后消失,点击关闭，可提前关闭！"}</h4>
                        <p style={{color: "red"}}>
                            {`每点击一次，旧的消失，新的生成！看`}
                            <span style={{color: "blue"}}>
                                {parseInt(Math.random() * 100 + "")}
                                {parseInt(Math.random() * 100 + "")}
                            </span>
                        </p>
                        <Button message={"吻我！"} icon={"guilian2"}
                                onClick={() => alert("你问我爱你有多深？给钱！")}/>
                    </div>,
                    autoCloseDelay: 10,
                    closeText: "关闭",
                    closeCallback: () => setTime(0),
                }
            } style={{display: "inline-flex"}}>
                <Button onClick={(e) => { console.log(e, `我的判断条件 ，e.stopPropagation做拦截`);}}
                        message={`点我,我定10s后消失,可点关闭，提前关闭,点一次，旧的没了，新的出来`}/>
            </OnlyOneToast>

        </div>
    );
};
export default ToastExample;