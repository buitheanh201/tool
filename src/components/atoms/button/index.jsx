import React from 'react';
import Styled from 'styled-components';

const ButtonStyle = Styled.button.attrs(({red,yellow,green}) => {
    return {
        className : `${red ? 'bg-red-500 hover:bg-red-600' : yellow ? 'bg-yellow-500 hover:bg-yellow-600' 
        : green ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} flex mx-1 my-2 border focus:outline-none leading-8 px-4 py-1 rounded text-white`
    }
})`
`;

const Button = ({icon : Icon,children,...props}) => {
    return <ButtonStyle {...props}>{Icon ? <Icon /> : ''}{children}</ButtonStyle>
}
export default Button;

