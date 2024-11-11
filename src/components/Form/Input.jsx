import React from "react";

function Input(props) {
  const required = props.isRequired;

  if (required) {
    return (
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        className={props.className}
        placeholder={props.placeholder}
        value={props.value}
        required
      />
    );
  } else {
    return (
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        className={props.className}
        placeholder={props.placeholder}
        value={props.value}
      />
    );
  }
}

export default Input;
