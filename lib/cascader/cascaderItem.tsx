import {scopeClassName} from "../../helpers/classes";
import * as React from "react";
import Icon from "../icon/icon";
import {useContext} from "react";
import {cascaderContext} from "./cascader.context";
import {dbType, sourceItem} from "./cascader.db";


interface Props extends React.HTMLAttributes<HTMLDivElement> {
    data?: sourceItem,
    db?: dbType
}

const sc = scopeClassName("yr-cascader-item");
const CascaderItem: React.FunctionComponent<Props> = ({className, data, db, ...rest}) => {
    const val = data || db;
    return (
        <div className={sc("", className)} {...rest}>
            {val && val.value}
            {
                val && (data && val.children || db && !val.isLeaf) &&
                <Icon name={"right"}/>
            }
        </div>
    );
};

interface Props1 extends React.HTMLAttributes<HTMLDivElement> {
    data: sourceItem[] | sourceItem,
    selector: sourceItem,
    level: number,
    ajax?: (item: sourceItem, fn: () => void) => void
}


const RecursiveCascaderItem: React.FunctionComponent<Props1> =
    ({className, data, selector, level, ajax, ...rest}) => {
        const {selectors, set} = useContext(cascaderContext);
        const sc = scopeClassName("yr-cascader-items");
        const select = (list: sourceItem) => {
            ajax ? ajax(list, () => {set(list, level);}) :
                set(list, level);
        };
        const leftDom = (list: sourceItem, index?: number) =>
            <div key={index} className={sc("left-item", list === selectors[level] ? "active" : "")}
                 onClick={() => select(list)}>
                {list.value}
                {
                    list.children &&
                    <Icon name={"right"}/>
                }
            </div>;
        const leftView = (data: sourceItem | sourceItem[]) => {
            const val = Array.isArray(data) ? data :
                Array.isArray(data.children) ? data.children : "";
            return val &&
                val.map(
                    (list, index) => leftDom(list, index)
                );
        };
        return (
            <div className={sc("container", className)} {...rest}>
                <div className={sc("left")}>
                    {
                        leftView(data)
                    }
                </div>
                {
                    selector &&
                    <div className={sc("right")}>
                        <RecursiveCascaderItem data={selector} level={level + 1} ajax={ajax}
                                               selector={selectors[level + 1]}/>
                    </div>
                }
            </div>
        );
    };
export {RecursiveCascaderItem};
export default CascaderItem;

{/*{*/}
{/*    data.children &&*/}
{/*        data.children.map(*/}
{/*            (child,index)=><CascaderItem data={child} key={index}/>*/}
{/*        )*/}
{/*}*/}