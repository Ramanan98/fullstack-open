import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  if (action.type === 'SET') {
    return action.payload
  }
  if (action.type === 'CLEAR') {
    return ''
  }
  return state
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, 'Welcome')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export const setNotification = () => {
    const dispatch = useNotificationDispatch()
    return (message, timeInSeconds = 5) => {
        dispatch({ type: 'SET', payload: message })
        setTimeout(() => {
            dispatch({ type: 'CLEAR' })
        }, timeInSeconds * 1000)
    }
}

export default NotificationContext