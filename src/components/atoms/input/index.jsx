import styled from 'styled-components';

const Input = styled.input.attrs(({type}) => {
    if(type === 'text' || type === 'password'){
        return {className : 'w-full h-10'}
    }
    return {
        className : ''
    }
})`
  &:focus {
      outline : none;
  }
`

export default Input;