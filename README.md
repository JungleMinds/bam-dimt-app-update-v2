## Prerequisites
Android
- You need to have Android Studio Installed: [Android Studio](https://developer.android.com/studio/)

RN Debugger
- You need to have RN Debugger installed for debugging: [RN debugger](https://github.com/jhen0409/react-native-debugger)

Expo

This project was created using Expo and you'll need it to build and publish: [Expo](https://expo.io/tools)
- install the Client and Expo CLI


## Create React app
This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).
The most recent version of the Create React Native App guide is available [here](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md).


## Install

Copy `.env.example` to `.env`

Ask someone in your team for correct env variables

Run `yarn install && flow-typed install`

You then need to build the project using Android Studio

- Open de `/android` folder in Android Studio
- if you use a real device, [connect an android device with a usb cable](https://developer.android.com/studio/debug/dev-options) and click the green play button.
- Or create an emulator device, start it and click the green play button

Run `yarn start` and press 'a' to start the build on your selected Android device


## App usage

### Login
If the build succeeds you'll be prompted with a login screen, ask someone on your team for
login details.

### Connect to a location tag
The app connects with a websocket to get updates about the user's (tag's) current location. This
server is mocked at [mock-server](https://bam-dimt-websocket-server.now.sh/).
- Visit this url and you'll see a green dot with a number on top of the ecw floorplan, this number is used to connect with the correct websocket and represents a location tag. (Refresh the page to get a new tag number).
- To enter this number tap 7 times on the top left corner of your Android device.
- An Admin panel should show up where you must select 'instellingen wijzigen'.
- Fill in the number at the 'Tagnummer' field and press 'wijzigingen opslaan'.
- Press 'terug'.
- If you now 'click and drag' the green dot at [mock-server](https://bam-dimt-websocket-server.now.sh/)
the red location indicator on your Android device should move along.

### Debugger
To open the React Native Debugger:
Set Expo XDE Host to LAN and run this from the project root your terminal:
```
  yarn rn-debugger
```

If you open the debugger from the Android device and a browser tab opens instead of the RN Debugger
you need to close the browser tab, quit RN Debugger, kill the app and stop the react-native yarn process.

Then you can run `yarn rn-debugger && yarn start` and it should work.


## Adding data
Studios, spaces and hotspots need to be edited in the database directly,
you'll have to ask someone from Oberon to do that. The options can be edited in the CMS.
Pictures can also be sent through the api, to add them, follow the following steps:

- Open any project
- Go to "MEDIA"
- Open the folder "ECW App Afbeeldingen" (or create it if it doesnt exist yet, *be aware that this folder is created for all projects*)
- From here you can upload files
- The most left column  ("#") contains the image id, you can use this in the database "image_id" field to 'connect' the image


## Building the app for release
There's three things you need to get a working app on a device.
- Bump the semver in `app.json`
- You need Android Studio to generate an APK and install it on a device
- You need to publish the javascript code through Expo app

### Generate an APK
To generate the APK in Android Studio:
- click `build` in the main navigation and select `Generate signed APK`
- Leave the value for module at `app` and click `next`
- You will be asked for the keystore path, ask one of your teammembers for the file and passwords
- Click `next`
- The build will start and if it succeeds the resulting apk will be at `android/app/release/app-release.apk`

To put this apk on a device:
- Connect an Android Device to your pc/laptop using a usb and make sure you have enabled developer mode and usb access on your Android device: [Enable Android Dev mode](https://developer.android.com/studio/debug/dev-options)
- Go to the project folder in your terminal
- Run `adb devices` this should list one Android device
- Run `adb install android/app/release/app-release.apk`
- The app should be installed on your device

### Publish the javascript code
Once you open the app on your device the app goes looking for the js code on the remote Expo url
The code won't be there however until you publish it. *Once you publish the code will also be distibuted to all the devices in the ECW center so only do this after thourough testing!*
To do this:
- *Make sure you're using the correct .env values!*
- Open Expo XDE
- Select the BAM project
- Hit the green `Publish` button at the top


## Bug reports
The app uses Sentry for reporting bugs in the production build of the app. Ask one of your teammates for login details


## On site tools and links
For testing the app at the HomeStudios, the following will be of use:

### Env
To test the application on site, make sure to build the app with the correct .env configuration settings!

### Mobilock
[Mobilock](https://mobilock.in/) is an app running on all the devices in the ECW center to prevent a user from exiting the app
and using the device in an unintended way. From there you can lock/unlock devices and you can also update the apk on all devices in the ECW center at once. However you only need to do this when you've made changes to the native Android part of the app.
This usually only happens if you either:
- Installed a library to incorporate Native functionality (for example we use `react-native-battery` to detect charging/docking)
- Or have updated the Expo sdk

### Wifi
In order to connect with the tags and embedded apps your tablet needs to be connected
to the correct network. (Not the guest network!).
The wifi network has a hidden SSID. Ask one of your teammates for the name and password

### On site tools
Locatify comes with it's own dashboard for managing and tracking location tags.
This comes in handy when you need to check if the location of a tag is not updating at all
or just not working in the app.
You can find it at: `LOCATIFY_ENDPOINT_REST/rtls`. Ask one of your teammates for the login details


## Organisations involved
- [BAM](https://www.bam.com/) Owner of the project
- [DST](https://www.dst.nl/en/) responsible for all the construction inside the HomeStudios center
- [Rapenburg-plaza](https://rapenburgplaza.nl/contact/) (Responsible for the WiFi accesspoints and locatify hardware, Ask for Jean-Paul (JP))
- [Kiss the Frog](https://www.kissthefrog.nl/) (Responsible for the interactive installations such as touch tables and 3d-studio software, ask for Maarten)