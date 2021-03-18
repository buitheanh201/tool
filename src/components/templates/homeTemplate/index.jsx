import styled from 'styled-components';
import propType from 'prop-types';
import React from 'react';

const Wrapper = styled.div.attrs({
    className : ''
})`
`;

const Header = styled.header.attrs({
    className : ''
})`
`;

const Main = styled.main.attrs({
    className : ''
})`
`;

const Footer = styled.footer.attrs({
    className : ''
})`
`;
const HomeTemplate = ({header,content,footer,...props}) => {
    return (
        <Wrapper {...props}>
            <Header>{header}</Header>
            <Main>{content}</Main>
            <Footer>{footer}</Footer>
        </Wrapper>
    )
}

HomeTemplate.propTypes = {
    header : propType.node.isRequired,
    footer : propType.node.isRequired,
    content : propType.node.isRequired
}


export default HomeTemplate;
