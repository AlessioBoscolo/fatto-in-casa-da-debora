import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Home(){
    const {user} = useAuth();
    return(
        <>
            <div>
                Welcome, {user.name}!
            </div>
            <Navbar />
        </>
    )

}

export default Home;