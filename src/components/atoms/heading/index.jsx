import styled from 'styled-components';

const Heading = styled.h1`
    text-align : ${props => props.center ? 'center' : ''};
    text-transform: ${props => props.uppercase ? 'uppercase' : ''};
    font-weight: 400;
    padding: 10px 0px;
`;

export default Heading;