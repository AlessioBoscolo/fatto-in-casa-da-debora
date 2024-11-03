import React from "react";

function Input(props){
    return <input type={props.type} name={props.name} id={props.id} className={props.className} placeholder={props.placeholder} value={props.value} {...props.isRequired!=null && "required"} />
}

export default Input;