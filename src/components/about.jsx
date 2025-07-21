import React from "react";
import {Link} from 'react-router-dom';
import Navbar from './navbar.jsx';

const about = () => {
    return (
        <div className="about-container" style={{display: 'flex', flexDirection: 'row', height: '100vh'}}
        >
            <Navbar style={{  
            height: 'auto',
            width: '200px',
            backgroundColor: '#f2f2f2',
            display: 'flex',
            flexDirection: 'column',
            top: '0',
            textAlign: 'center'}}/>
            <div className="about" style={{paddingLeft: '2rem'}}>
                <h2>About SEAEdu</h2>
                <p>This is a simple tool to help understand facts about education access in Southeast Asia</p>
            </div>
        </div>
    );
};
export default about;