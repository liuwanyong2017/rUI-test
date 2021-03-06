import React from "react";

import "./importicons.js";
import "./icon.scss";
import classes from "../../helpers/classes";

interface IconProps extends React.SVGAttributes<SVGElement> {
    name: string;
}

const Icon: React.FunctionComponent<IconProps> = ({className, name, ...rest}) =>
    <svg className={classes("yr-icon", className)} {...rest}>
        <use xlinkHref={`#${name}`}/>
    </svg>;
export default Icon;