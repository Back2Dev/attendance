App.info({
  id: 'au.com.back2bikes.demo',
  name: 'Attendance',
  version: '3.0.1',
})

App.setPreference('BackgroundColor', '0xff0000ff')
App.setPreference('Orientation', 'default')
//App.setPreference('Orientation', 'all', 'ios')

App.appendToConfig(`
    <edit-config file="AndroidManifest.xml" mode="merge" target="/manifest/application" xmlns:android="http://schemas.android.com/apk/res/android">
        <application android:usesCleartextTraffic="true"></application>
    </edit-config>
`)
App.configurePlugin('cordova-plugin-googleplus', {
  REVERSED_CLIENT_ID: 'REVERSED_CLIENT_ID_FOR_cordova-plugin-googleplus',
})
