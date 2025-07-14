import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const NavigationMenu = ({ onLogout }) => {
  const user = useSelector(state => state.user)

  if (!user) return null;

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar variant="dense">
        <Button component={Link} to="/blogs" color="inherit" size="small">blogs</Button>
        <Button component={Link} to="/users" color="inherit" size="small">users</Button>
        <Typography variant="body2" sx={{ flexGrow: 1, ml: 2 }}>
          {user && `${user.username} logged in`}
        </Typography>
        <Button onClick={() => { onLogout(); window.location.assign('/'); }} color="inherit" size="small">logout</Button>
      </Toolbar>
    </AppBar>
  )
}

export default NavigationMenu
