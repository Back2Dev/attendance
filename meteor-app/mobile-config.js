// mobile-config.js
// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.back2bikes.attendance.tablet',
  version: "0.3.0",
  name: 'Attendance',
  description: 'Back2bikes Attendance app',
  author: 'Mike King',
  email: 'mikkel@back2bikes.com.au',
  website: 'http://back2bikes.com.au'
});
// Set up resources such as icons and launch screens.
App.icons({
// 'iphone_2x        // (120x120)
// 'iphone_3x        // (180x180)
// 'ipad               // (76x76)
// 'ipad_2x          // (152x152)
// 'ipad_pro           // (167x167)
// 'ios_settings       // (29x29)
// 'ios_settings_2x  // (58x58)
// 'ios_settings_3x  // (87x87)
// 'ios_spotlight    // (40x40)
// 'ios_spotlight_2x   // (80x80)
'android_mdpi'    : 'public/res/icon/mipmap-mdpi/ic_launcher.png',     // (48x48)
'android_hdpi'    : 'public/res/icon/mipmap-hdpi/ic_launcher.png',   // (72x72)
'android_xhdpi'   : 'public/res/icon/mipmap-xhdpi/ic_launcher.png',  // (96x96)
'android_xxhdpi'  : 'public/res/icon/mipmap-xxhdpi/ic_launcher.png',   // (144x144)
'android_xxxhdpi' : 'public/res/icon/mipmap-xxxhdpi/ic_launcher.png'   // (192x192)//   
});
App.launchScreens({
'iphone_2x': 'public/res/screen.png',
'iphone5': 'public/res/screen.png',
'iphone6': 'public/res/screen.png',
'iphone6p_portrait': 'public/res/screen.png',
'iphone6p_landscape': 'public/res/screen.png',
'ipad_portrait': 'public/res/screen.png',
'ipad_portrait_2x': 'public/res/screen.png',
'ipad_landscape': 'public/res/screen.png',
'ipad_landscape_2x': 'public/res/screen.png',
'android_mdpi_portrait': 'public/res/screen.png',
'android_mdpi_landscape': 'public/res/screen.png',
'android_hdpi_portrait': 'public/res/screen.png',
'android_hdpi_landscape': 'public/res/screen.png',
'android_xhdpi_portrait': 'public/res/screen.png',
'android_xhdpi_landscape': 'public/res/screen.png',
'android_xxhdpi_portrait': 'public/res/screen.png',
'android_xxhdpi_landscape': 'public/res/screen.png'
  // 'iphone': 'splash/Default~iphone.png',
  // 'iphone_2x': 'splash/Default@2x~iphone.png',
  // ... more screen sizes and platforms ...
});
// Set PhoneGap/Cordova preferences
//App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
// App.setPreference('Orientation', 'landscape');
// App.setPreference('Orientation', 'landscape', 'android');
// App.setPreference('Orientation', 'landscape', 'ios');
App.setPreference('Fullscreen', 'true', 'android');
App.setPreference('Fullscreen', 'true', 'ios');
App.setPreference('android-targetSdkVersion', '25');
App.setPreference('WebAppStartupTimeout', 60000);
App.setPreference('AndroidPersistentFileLocation','Compatibility')

// Pass preferences for a particular PhoneGap/Cordova plugin
// App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//   APP_ID: '1234567890',
//   API_KEY: 'supersecretapikey'
// });
// Add custom tags for a particular PhoneGap/Cordova plugin
// to the end of generated config.xml.
// Universal Links is shown as an example here.
App.appendToConfig(`
  <universal-links>
    <host name="localhost:3030" />
  </universal-links>
`);

App.accessRule('blob:*');

