import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification)
  if (!message) return null
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="info" variant="filled">{message}</Alert>
    </Box>
  )
}


export default Notification
