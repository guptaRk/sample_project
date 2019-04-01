import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h2>WELCOME!</h2>
            <Link to='/sign-in'>LOG IN / REGISTER</Link>
        </div>
    )
} 
export default Home; 