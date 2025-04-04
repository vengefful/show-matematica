import React, { useState } from 'react';
import './Button.css';

function Button(props){

    const [isPressed, setIsPressed] = useState(false);

    const handleTouchStart = () => {
        if (props.disabled) return;
        
        setIsPressed(true);
        if(props.onTouchStart){
            props.onTouchStart();
        }
        props.onClick(props.resultado);
        delay();
    };

    const delay = () => {
        setTimeout(() => {
            setIsPressed(false);
        }, 1000);
    };



    return (
        <button className={!isPressed ? props.classButton : props.resultado ? 'answers-button-pressed-win' : 'answers-button-pressed-lose'} onClick={handleTouchStart} disabled={props.disabled} >
            {props.text}
        </button>
    );
}

export default Button
