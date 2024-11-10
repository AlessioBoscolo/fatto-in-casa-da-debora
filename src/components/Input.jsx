import React from "react";

function Input(props){
    const required = props.isRequired!=null && "required";
    
    return <input type={props.type} name={props.name} id={props.id} className={props.className} placeholder={props.placeholder} value={props.value} {...required} />
}

export default Input;