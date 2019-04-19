// This section sets up some basic app metadata, the entire section is optional.
App.info({
  id: 'au.com.back2bikes.app',
  name: 'meteor-app',
  description: 'Attendance app',
  author: 'Mike King',
  email: 'mikkel@back2bikes.com.au',
  website: 'http://back2bikes.com.au'
})

// Set up resources such as icons and launch screens.
App.icons({
  // iphone_2x: 'icons/icon-60@2x.png',
  // iphone_3x: 'icons/icon-60@3x.png'
  // More screen sizes and platforms...
})

App.launchScreens({
  // iphone_2x: 'splash/Default@2x~iphone.png',
  // iphone5: 'splash/Default~iphone5.png'
  // More screen sizes and platforms...
})

// Set PhoneGap/Cordova preferences.
App.setPreference('BackgroundColor', '0xff0000ff')
// App.setPreference('HideKeyboardFormAccessoryBar', true)
App.setPreference('Orientation', 'default')
App.setPreference('Orientation', 'all', 'ios')

App.accessRule('blob:*')
App.accessRule('file:*')
//App.accessRule('http://*')
App.accessRule('https://pay.pinpayments.com/*', { type: 'navigation' })
App.accessRule('https://cdn.pin.net.au/*', { type: 'navigation' })
