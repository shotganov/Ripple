export type LoginData = {
  email: string
  password: string
}

export type RegisterData = {
  tag: string
  email: string
  password: string
}

export type Auth = LoginData | RegisterData
