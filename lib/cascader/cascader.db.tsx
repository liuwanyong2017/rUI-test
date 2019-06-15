import {scopeClassName} from "../../helpers/classes";
import * as React from "react";
import CascaderItem, {RecursiveCascaderItem} from "./cascaderItem";
import "./cascader.scss";
import {useContext, useEffect, useState} from "react";
import Icon from "../icon/icon";

// import CascaderContextProvider, {cascaderContext} from "./cascader.context";

export interface sourceItem {
    value: string,
    label?: string,
    children?: sourceItem[]
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    placeholder?: string,
    scopedItemsBoxClassName?: string,
    update: (data: string) => void,
    db: dbType[]
}

export interface dbType {
    id: number,
    value: string,
    parent_id: number,

    [k: string]: string | number
}

const sc = scopeClassName("yr-cascader");
const DBCascader: React.FunctionComponent<Props> =
    ({className, placeholder, scopedItemsBoxClassName, update, db, ...rest}) => {
        const [selector, setSelect] = useState<Array<dbType>>([]);
        const [visible, setVisible] = useState(false);
        const [dom, getDom] = useState<HTMLElement>();

        const clickItem = (item: dbType, index: number) => {
            const val = index === 0 ? [item] : index === 1 ? [selector[0], item] :
                index > selector.length - 1 ? [...selector, item] :
                    [...selector.slice(0, index - 1), item];
            setSelect(val);

            console.log(item, val);
        };
        const ajax = (parent_id = 0) => db && db.filter(
            item => item.parent_id === parent_id
        );
        const results = (data: dbType[]) =>
            data.reduce(
                (a, b) => a + (b ? b.value : ""), ""
            );

        useEffect(
            () => {
                update(results(selector));
            }, [selector]
        );
        const visibleSet = (e: React.MouseEvent) => {
            const node = e.target && (e.target as HTMLElement);
            !dom && node && getDom(node);
            if (!dom) return setVisible(!visible);
            const clear = dom && dom.querySelector(".yr-cascader-clear");
            if (!clear) return setVisible(!visible);
            !(clear.contains(node) || clear === node) &&
            setVisible(!visible);
            // console.log(e.target, dom, clear);
        };
        return (
            <div className={sc("", className)} {...rest}>
                <div className={sc("results")} onClick={visibleSet}>
                    {
                        selector.length === 0 ? placeholder :
                            results(selector)
                    }
                    {
                        selector.length > 0 &&
                        <Icon name={"close"}
                              onClick={() => setSelect([])}
                              className={sc("clear")}/>
                    }
                </div>
                {}
                {
                    visible &&
                    <div className={sc("selectorBox", scopedItemsBoxClassName)}>
                        <div className={sc("items")}>
                            {
                                ajax().map(
                                    (item, index) =>
                                        <CascaderItem
                                            db={item}
                                            className={selector[0] === item ? "active" : ""}
                                            key={index} onClick={() => clickItem(item, 0)}/>
                                )
                            }
                        </div>
                        {
                            selector.length > 0 &&
                            selector.map(
                                (item, index) =>
                                    <div className={sc("items")} key={index}>
                                        {console.log(ajax(item.id), item.id)}
                                        {
                                            ajax(item.id).map(
                                                (child, ind) => {
                                                    // console.log(child,item);
                                                    return <CascaderItem
                                                        db={child} key={ind}
                                                        className={selector[index + 1] === child ? "active" : ""}
                                                        onClick={() => clickItem(child, index + 1)}/>;
                                                }
                                            )
                                        }
                                    </div>
                            )
                        }
                    </div>
                }
            </div>
        );
    };
DBCascader.defaultProps = {
    placeholder: "\u00A0"
};
// const RecursiveCascader: React.FunctionComponent<Props> =
//     ({className, data, placeholder, scopedItemsBoxClassName, update, ...rest}) => {
//         const [visible, setVisible] = useState(false);
//         const [dom, getDom] = useState<HTMLElement>();
//         const {selectors, set} = useContext(cascaderContext);
//         const results = (data: sourceItem[]) =>
//             data.reduce(
//                 (a, b) => a + (b ? b.value : ""), ""
//             );
//         const visibleSet = (e: React.MouseEvent) => {
//             const node = e.target;
//             !dom && e.target && getDom(node as HTMLElement);
//             if (!dom) return setVisible(!visible);
//             const clear = dom && dom.querySelector(".yr-cascader-clear");
//             if (!clear) return setVisible(!visible);
//             !(clear.contains(e.target as HTMLElement) || clear === e.target) &&
//             setVisible(!visible);
//         };
//         return (
//             <div className={sc("", className)} {...rest}>
//                 <div className={sc("results")} onClick={visibleSet}>
//                     {
//                         selectors.length === 0 ? placeholder :
//                             results(selectors)
//                     }
//                     {
//                         selectors.length > 0 &&
//                         <Icon name={"close"}
//                               onClick={() => set()}
//                               className={sc("clear")}/>
//                     }
//                 </div>
//                 {
//                     visible && data &&
//                     <div className={sc("selectorBox", scopedItemsBoxClassName)}>
//                         <RecursiveCascaderItem data={data} level={0} selector={selectors[0]}/>
//                     </div>
//                 }
//             </div>
//         );
//     };
// const Cascader1: React.FunctionComponent<Props> = (props) => {
//     return (
//         <React.Fragment>
//             <CascaderContextProvider>
//                 <RecursiveCascader {...props}/>
//             </CascaderContextProvider>
//         </React.Fragment>
//     );
// };
// Cascader1.defaultProps = {
//     placeholder: "\u00A0"
// };
// export {Cascader1};

export default DBCascader;