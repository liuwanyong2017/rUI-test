import * as React from "react";
import "./tabs.scss";
import classes from "../../helpers/classes";
import {Fragment} from "react";
import TabsItem from "./tabs-Item";
import Icon from "../icon/icon";

export interface tabType {
    text: string,
    icon?: string,
    name: string,
    right?: boolean
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    tabs: tabType[],
    extra?: { text?: string, icon?: string, name: string }
}

const TabsHead: React.FunctionComponent<Props> = ({className, children, tabs, extra, ...rest}) => {
    return (
        <div className={classes("yr-tabs-head", className)} {...rest}>
            {
                tabs.map(
                    (tab, index) =>
                        <Fragment key={index}>
                            <TabsItem tab={tab}/>
                        </Fragment>
                )
            }
            {
                extra && <div className="yr-tabs-extra" onClick={() => {console.log(extra.name);}}>
                    {extra.text}
                    {extra.icon && <Icon name={extra.icon}/>}
                </div>
            }
        </div>
    );
};
export default TabsHead;

