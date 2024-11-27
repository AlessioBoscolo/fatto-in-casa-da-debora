import React from "react";

function Image(props){
    return(<>
        <img src={props.src} alt="websitelogo" className={props.className} width={props.width} height={props.height} />
    </>);

}

export default Image;