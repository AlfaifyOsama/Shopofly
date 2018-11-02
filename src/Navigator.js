import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
import Home from './screens/Home'
import Login from './screens/Login'
import Register from './screens/Register'
import Scan from './screens/Scan'


const MyApp = createStackNavigator({
  Login: {
    screen: Login
  },
  Scan: {
    screen: Scan
  },
  Home: {
    screen: Home
  },
  Register: {
    screen: Register
  }
}, {
  navigationOptions: {
    header: null
  }
})

export default MyApp