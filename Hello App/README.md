# Hello App

A personalized greeting application that uses geolocation to offer users a greeting in their native language.

## Features

- Mock login panel with username and password fields
- Form validation for required fields
- Personalized greeting in the user's native language based on location
- Optional language code override for testing different greetings
- Automatic location permission request after login
- Display of detailed geolocation information
- Logout functionality with farewell message
- View location on Google Maps with a single click
- Precise location detection using device GPS (browser Geolocation API)

## User Stories Implemented

- User can see a mock login panel with username and password fields, plus login/logout buttons
- Password input is masked with asterisks
- Form validation shows error messages and highlights fields in red when empty
- Personalized greeting on successful login: `<hello-in-native-language> <user-name> you have successfully logged in!`
- User is prompted to allow location access immediately after login
- Logout functionality clears fields and displays a farewell message: `Have a great day <user-name>!`
- Bonus: Language code override field for testing
- Bonus: Additional geolocation information display after login
- Bonus: "View on Google Maps" button to see the detected location on Google Maps
- Bonus: Precise location detection using the device's GPS/location services

## API Services Used

- [IP-API](http://ip-api.com/docs/api:json) - For obtaining the user's IP and location data
- [Fourtonfish](https://www.fourtonfish.com/hellosalut/hello/) - For obtaining greetings in different languages
- [Google Maps](https://www.google.com/maps) - For displaying user location on a map
- [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) - For reverse geocoding precise coordinates

## How to Use

1. Open `index.html` in a web browser
2. Enter a username and password in the provided fields
3. Click "Login" to see your personalized greeting
4. You'll see a notification asking for location permission
5. Click "Allow Location Access" to get accurate location from your device
6. View your geolocation information below
7. Click "View on Google Maps" to see your location on Google Maps in a new tab
8. (Optional) Enter a language code in the optional field to override the default language detection
9. Click "Logout" to clear the form and see a farewell message

## Notes

- This is a frontend-only application with no actual authentication
- The password field is for demonstration purposes only
- Some API services may have usage limitations or may require HTTPS in production environments
- The map feature requires an active internet connection
- Precise location detection requires browser permission and HTTPS in most browsers
- IP-based geolocation is often not accurate (may show ISP location rather than actual location)
- If you don't interact with the location permission notification, it will auto-dismiss after 30 seconds and fall back to IP-based location

## Language Codes for Testing

Some examples of language codes you can use in the override field:
- `en` - English
- `fr` - French
- `es` - Spanish
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `zh` - Chinese

## Known Issues

- The Fourtonfish API might be unavailable at times
- Some browsers may block mixed content (HTTP API calls from HTTPS pages)
- Geolocation data might not be 100% accurate
- Precise location detection requires user permission and may not work in all environments 