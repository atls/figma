export interface ButtonState {
  default: StateColors
  hover: StateColors
  pressed: StateColors
  disabled: StateColors
}

export interface InputState {
  default: StateColors
  active: StateColors
  error: StateColors
  focus: StateColors
  disabled: StateColors
}

export interface StateColors {
  background: string
  font: string
  border: string
}
