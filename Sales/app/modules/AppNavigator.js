import { createStackNavigator, createAppContainer } from "react-navigation"
import Home from '../views/Home'
import Profile from '../views/Profile'
import Settings from '../views/Settings'

const AppNavigator = createStackNavigator({
    Home: { screen: Home },
    Profile: { screen: Profile },
    Settings: { screen: Settings }
})

const AppContainer = createAppContainer(AppNavigator)

export default AppContainer
