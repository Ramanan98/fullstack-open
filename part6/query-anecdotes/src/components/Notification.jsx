import { useContext } from 'react'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const message = useNotificationValue()

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
