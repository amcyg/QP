# Quantified Pony
Quantified Pony is the Fitbit for horses. Despite being a $40 billion market in the United States alone, equestrian sports are distinctly lacking in useful technologies that take advantage of today's computing capabilities. One particularly important application is equine gait analysis. Studying the equilibrium of horses offers insights into their physical wellbeing, and can be used for early lameness detection. However, most quantifiable gait analysis techniques require expensive equipment that isn't accessible outside of academic environments. Quantified Pony is a real-time web app that collects and visualizes the gaits and motion of horses using no specialized hardware other than a smartphone.

Technology stack: Javascript, HTML/CSS, Firebase, Flot, Gyro.js

## I'm a horseback rider. How do I use this? 
Ideally, you'll have two mobile devices - one to wear while riding, and one for your instructor (or barn friend) to control and observe the recordings. Consider using a running belt (like this one) to keep your phone snug and secure on your back. Your instructor can also use an iPad or other tablet. However, both devices need to be connected to the internet (wifi or 3G).

If you're the rider, first be sure to turn off the auto-lock/power saving settings on your phone. Since this is a mobile web app, recordings will cease if your phone goes to sleep. On an iPhone, go to Settings > General > Auto-Lock > Never. Then, enter the web app and switch the toggle to Ride Mode. Place your phone in your running belt, and you're ready to go.

If you're the instructor, enter the app and switch the toggle to Observe Mode. When you click Start, you will be prompted to name your data run. After that, your recordings will begin immediately. 

## Is this app deployed?
Yes! Check out a demo here: https://quantifiedpony.firebaseapp.com
However, since this app is open to everyone (user auth has not been implemented yet), please take care not to delete any run data you did not create. Also, if multiple people are trying to record data at once, you will see them all at the same time. 

## Can I deploy this app myself?
Yes! However, you'll need to use Firebase for the real-time backend. 
Read the Firebase docs here: https://www.firebase.com/docs/hosting/guide/deploying.html
You will also need to update the Firebase references in the main.js file. 

## What features are up next? 
* Re-implementing the app in native iOS to take advantage of ad-hoc networks. Realistically, most horseback riding environments don't have access to wifi or even cellular data range, which is a severe limitation. 
* Implementing signal processing and machine learning algorithms to perform real gait analysis (apart from simple step counting). This could include a gait classifier (is the horse walking, trotting, cantering?) and a long-range equilibrium monitor (is your horse beginning to lean to the left more often?). 
* User authentication for privacy, custom data, etc. 





