#Pi Kitchen Dashboard
#####Because thrift store monitors still need things to do.

This project turns your monitor and Raspberry Pi into a simple, skinnable time and weather dashboard for your kitchen. Want it in your living room? **Too bad.**

![alt text](https://lh5.googleusercontent.com/OvyLwyLtXF69AJ-8U68OPnLXhZNwOPG7JYv5i-fa_44=w1167-h875-no "Pi Kitchen Dashboard")

* * *

+ [Items Needed](#itemsNeeded)
+ [Instructions](#instructions)
    - [Cloning](#cloning)
    - [Fulfilling requirements](#fulfillingRequirements)
    - [Setting your location](#settingYourLocation)
    - [Configuring your Pi](#configuringYourPi)
        * [Disallowing screen sleep](#disallowingScreenSleep)
        * [Installing Chromium](#installingChromium)
        * [Auto-starting Chromium](#autoStartingChromium)
+ [Changing the skin](#changingTheSkin)
+ [Creating skins](#creatingSkins)
+ [Credit](#credit)

* * *

##<a name="itemsNeeded"></a>Items needed

+ Raspberry Pi
+ Monitor
+ Adapter to hook said Raspberry Pi to said monitor
+ Internet connection

##<a name="instructions"></a>Instructions

###<a name="cloning"></a>Cloning

Clone this repository with `git clone https://github.com/userexec/Pi-Kitchen-Dashboard.git`.

If your Pi does not currently have git, you will need to install it first with `sudo apt-get install git`.

###<a name="fulfillingRequirements"></a>Fulfilling requirements

This project is not distributed with its dependencies; however, [Bower](http://bower.io/) will automatically pull them in.

1. `sudo apt-get update && sudo apt-get upgrade` - Update your system
1. Install Node Package Manager (required for Bower)  

   ```
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
```

2. `sudo npm install -g bower` - Install Bower
3. `cd ~/Pi-Kitchen-Dashboard` - cd into the directory of the cloned project
4. `bower install` - Install the project's dependencies

###<a name="settingYourLocation"></a>Setting your location

Open `js/weather.js` and find the following section at the top:

```javascript
// Your ZIP code
// If you do not have a ZIP code, please edit the YQL query appropriately in the queryYahoo() function
var zipcode = 65401;

// Yahoo! query interval (milliseconds)
// Default is every 30 minutes. Be reasonable. Don't query Yahoo every 500ms.
var waitBetweenWeatherQueriesMS = 1800000;
```

Change these variables to match your location and desired update interval, and your part of the coding is done!

###<a name="configuringYourPi"></a>Configuring your Pi

You will need a Raspberry Pi (although you could use anything else) with Raspbian (again, or anything else) and an internet connection. To complete the dashboard, your Pi will need disallow screen sleep and automatically start kiosk mode.

####<a name="disallowingScreenSleep"></a>Disallowing screen sleep
You will need to edit three files.

1. `sudo nano /etc/kbd/config` - Set BLANK_TIME and POWERDOWN_TIME to 0
2. `sudo nano /etc/xdg/lxsession/LXDE/autostart` - Remove the screensaver line, then add the following three lines:  

   ```bash
@xset s noblank 
@xset s off 
@xset -dpms
```

3. `sudo nano /etc/xdg/lxsession/LXDE-pi/autostart` - Repeat the previous step on this file

Instructions courtesy of jwzumwalt http://www.raspberrypi.org/forums/viewtopic.php?f=91&t=57552

####<a name="installingChromium"></a>Installing Chromium
`sudo apt-get install chromium`

####<a name="autoStartingChromium"></a>Auto-starting Chromium

1. Create a new directory at `~/.config/autostart` if it does not exist
2. `cd ~/.config/autostart` - cd into this directory
3. `nano chromiumKiosk.desktop` - Create a new .desktop file
4. Add the following lines and save. Customize the file path to where this project's index.html lives on your Pi.

   ```
[Desktop Entry]
Type=Application
Exec=chromium --kiosk file:///home/pi/Pi-Kitchen-Dashboard/index.html
```

Your Pi should now atomatically start kiosk mode and show the dashboard full screen once your desktop loads.

If your time or date are incorrect, use `sudo raspi-config` to set your locale and timezone.

##<a name="changingTheSkin"></a>Changing the skin

Skins are kept, conveniently, in the skins folder. To switch skins, edit `Pi-Kitchen-Dashboard/index.html` and insert the folder name of the skin you wish to use where the comments direct.

##<a name="creatingSkins"></a>Creating skins

Creating your own skin or a new skin for distribution is easy and only requires knowledge of HTML and CSS. Just copy the `default` folder under skins, rename it, and begin editing. Comments in the default skin will guide you through the process, but it basically boils down to 99% using your imagination and 1% placing a few IDs and classes so that time and weather data can be auto-populated.

##<a name="credit"></a>Credit

Weather icons by Lukas Bischoff and Erik Flowers https://github.com/erikflowers/weather-icons. Icons licensed under [SIL OFL 1.1](http://scripts.sil.org/OFL).  

Time formatting by [Moment.js](http://momentjs.com/)  

Weather data retrieved using Yahoo! Weather API.  

Default skin responsiveness by [RYJASM](https://github.com/ryjasm).

Project is under [MIT license](http://choosealicense.com/licenses/mit/).  