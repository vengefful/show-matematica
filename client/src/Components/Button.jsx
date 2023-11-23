import React, { useState } from 'react';
import './Button.css';

function Button(props){

    const [isPressed, setIsPressed] = useState(false);

    const handleTouchStart = () => {
        setIsPressed(true);
        if(props.onTouchStart){
            props.onTouchStart();
        }
        props.setWin(props.win);
    };

    const handleTouchEnd = () => {
        delay();
        if(props.onTouchEnd){
            props.onTouchEnd();
        }
    };

    const delay = () => {
        setTimeout(() => {
            setIsPressed(false);
        }, 1000);
    };



    return (
        <button className={!isPressed ? props.classButton : props.win ? 'answers-button-pressed-win' : 'answers-button-pressed-lose'} onClick={props.onClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {props.text}
        </button>
    );
}

export default Button
