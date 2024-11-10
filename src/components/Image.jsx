import React from "react";

function Image(props){
    return(<>
        <img src={props.src} alt="websitelogo" width={props.width} height={props.height} />
    </>);

}

export default Image;