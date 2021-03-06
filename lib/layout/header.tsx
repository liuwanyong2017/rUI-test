import * as React from "react";
import {scopeClassName} from "../../helpers/classes";

const sc = scopeClassName("yr-layout");

interface Props extends React.HTMLAttributes<HTMLElement> {

}

const Header: React.FunctionComponent<Props> = ({className, ...rest}) => {
    return (
        <div className={sc("header", className)} {...rest}>
            {rest.children}
        </div>
    );
};

export default Header;