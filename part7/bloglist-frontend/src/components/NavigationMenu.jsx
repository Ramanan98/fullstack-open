import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const NavigationMenu = ({ onLogout }) => {
  const user = useSelector(state => state.user)

  return (
    <div style={{ background: '#eee', padding: '8px' }}>
      <span style={{ paddingRight: '10px' }}>
        <Link to="/">blogs</Link>
      </span>
      <span style={{ paddingRight: '10px' }}>
        <Link to="/users">users</Link>
      </span>
      <span style={{ paddingRight: '10px' }}>{user && `${user.username} logged in`}</span>
      <button onClick={onLogout}>logout</button>
    </div>
  )
}

export default NavigationMenu
