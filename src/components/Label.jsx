import React from "react";

function Label(props){
    return <label htmlFor={props.for} className={props.className}></label>
}

export default Label;