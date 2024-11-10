import React from "react";

function Element(props){
    return(
        <li className={props.className}>{props.value}</li>


    );

}

export default Element;