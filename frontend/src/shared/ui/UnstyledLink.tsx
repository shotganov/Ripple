import { Link, type LinkProps } from '@mui/material'
import { NavLink } from 'react-router-dom'

type Props = LinkProps<typeof NavLink, { to: string }>

export const UnstyledLink = ({ to, sx, ...rest }: Props) => (
  <Link
    component={NavLink}
    to={to}
    underline="none"
    color="inherit"
    sx={{ display: 'inline-flex', alignItems: 'center', ...sx }}
    {...rest}
  />
)
