import styled from 'styled-components';
import React from 'react';
import Field from 'molecules/Field';
import { emailIcon,keyIcon } from 'atoms/icon';
import Heading from 'atoms/heading';
import Button from 'atoms/button';

const Wrapper = styled.div.attrs({
    className : 'border mx-auto my-7 px-5 py-5 rounded w-2/5'
})``;


const Form = ({...props}) => {
    return (
        <Wrapper {...props}>
            <Heading uppercase center>Đăng nhập hệ thống</Heading>
            <Field
                onChange = {e => console.log(e.target.value)}
                title = 'Email '
                placeholder = 'Nhập email của bạn...'
                icon = {emailIcon}
            />
            <Field
                type = 'password'
                onChange = {e => console.log(e.target.value)}
                title = 'Mật khẩu '
                placeholder = 'Nhập mật khẩu của bạn...'
                icon = {keyIcon}
            />
            <Button blue>Đăng nhập</Button>
        </Wrapper>
    )
}

export default Form;