import React from 'react';
import styled from 'styled-components';
import Input from 'atoms/input';
import Block from 'atoms/block';
import Paragraphs from 'atoms/paragraphs';
import propType from 'prop-types';

const Error = styled(Block)`

`;

const Flex = styled.div.attrs({
    className : 'flex'
})``;

const Field = ({ title, type, icon: Icon, error, ...props }) => {
    return (
        <Block>
            <Paragraphs>{title}</Paragraphs>
            <Flex>
                <Icon /><Input {...props} type={type} />
            </Flex>
            <Error id={error}></Error>
        </Block>
    )
}

Field.propTypes = {
    title: propType.string,
    type: propType.string,
}

Field.defaultProps = {
    type: 'text'
}

export default Field