// @flow
import React from 'react'
import { Animated, findNodeHandle } from 'react-native'
import styled from 'styled-components/native'
import TextInputState from 'react-native/lib/TextInputState'

// Import Styles
import { StyledBody, StyledBodySmall } from '../../constants/styledText'
import { colors } from '../../constants/styleGuide'

type State = {
  inputFocus: boolean,
  animateLabel: Object,
  inputText: string,
  secure: boolean
}

type Props = {
  labelText: string,
  value?: string,
  onChangeText?: (text: string) => void,
  required?: boolean,
  type?: 'email' | 'password',
  onChangeText: (text: string) => void,
  hasError?: boolean,
  shouldFocus?: boolean
}

class Input extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      inputFocus: false,
      animateLabel: new Animated.Value((props.value) ? 1 : 0),
      inputText: props.value || '',
      secure: props.type === 'password'
    }
  }

  input = undefined

  componentWillReceiveProps (newProps: Props) {
    if (!this.props.shouldFocus && newProps.shouldFocus) {
      TextInputState.focusTextInput(findNodeHandle(this.input))
    }
  }

  animate (value: number) {
    Animated.timing(this.state.animateLabel, {
      toValue: value,
      duration: 200
    }).start()
  }

  onFocus () {
    this.animate(1)
  }

  onBlur () {
    if (!this.state.inputText) {
      this.animate(0)
    }
  }

  onChangeText (text: string) {
    this.setState({ inputText: text })
    if (this.props.onChangeText) {
      this.props.onChangeText(text)
    }
  }

  render () {
    const { labelText, type, required, hasError, ...props } = this.props
    return (
      <InputContainer>
        <Label
          style={{
            top: this.state.animateLabel.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0]
            }),
            fontSize: this.state.animateLabel.interpolate({
              inputRange: [0, 1],
              outputRange: [18, 12]
            }),
            lineHeight: this.state.animateLabel.interpolate({
              inputRange: [0, 1],
              outputRange: [26, 16]
            })
          }}
        >
          {labelText}
          {required && '*'}
        </Label>
        {type === 'password' && (
          <ShowPassword
            onPress={() => {
              this.setState({ secure: !this.state.secure })
            }}
          >
            Tonen
          </ShowPassword>
        )}
        <TextInput
          {...props}
          ref={(ref) => { this.input = ref }}
          hasError={hasError}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          value={this.state.inputText}
          onChangeText={(text) => this.onChangeText(text)}
          underlineColorAndroid='transparent'
          placeholderTextColor={colors.grey}
          keyboardType={type === 'email' ? 'email-address' : 'default'}
          secureTextEntry={this.state.secure}
        />
      </InputContainer>
    )
  }
}

const InputContainer = styled.View`
  height: 48px;
  position: relative;
  justify-content: flex-end;
  margin: 14px 0;
`

const Label = Animated.createAnimatedComponent(StyledBody.extend`
  font-family: 'foco-italic';
  position: absolute;
  left: 0;
  color: ${colors.grey};
`)

const TextInput = styled.TextInput`
  borderBottomWidth: 1px;
  borderColor: ${(props) => props.hasError ? colors.error : colors.grey};
  padding-bottom: 5px;
`

const ShowPassword = StyledBodySmall.extend`
  color: ${colors.blueMedium}
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 16px 0 8px 16px;
  z-index: 1;
`

export default Input
