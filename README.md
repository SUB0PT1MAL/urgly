URL Overflow is a web application that allows users to create both short and long custom URLs. 
Originally created to tease my freind's twitch chat with links that spanned the whole 500 limit.

![Web UI](https://github.com/SUB0PT1MAL/IconsAndArt/blob/main/WebUI.png)

## Features

- Create short URLs for easy sharing
- Generate long URLs with customizable length (up to 2000 characters)
- Commodore 64 style user interface
- Copy generated URLs to clipboard with a single click
- Responsive design that works on both desktop and mobile devices

## Installation

You can run it as-is or use a container that you can either create using the Dockerfile in this repo or use the image on docker hub (sub0pt1mal/urgly:latest).

Some features are hardcoded to my domain, like the character limit taking in to account the lenght of it, and the preview containing my url, you will have to manually change the code for that.

You will need a postgresql database to store and retrieve the generated urls and set up the following variables:

- `DATABASE_URL`: The URL for your postgresql connection (postgresql://user:password@ip:port)
- `DOMAIN`: The domain where your application is hosted (default: 'localhost:5000')
- `CONTACT_EMAIL`: Your contact email address to be displayed in the footer
- `GITHUB_REPO`: If you make a fork and modify this app, please set your own GitHub repo, otherwise, please put this one so other people can find it.
- `DEBUG`: Set to 'True' for development, 'False' for production (default: 'False')

## Usage

1. Enter the original URL you want to shorten or lengthen
2. Choose between "SHORT URL" or "LONG URL"
3. For long URLs, adjust the desired length using the slider, input field or preset buttons.
4. Click "CREATE URL" to generate your new URL
5. Use the "COPY URL" button to copy the generated URL to your clipboard

## Maintenance

Old URLs are automatically deleted after 7 days. To manually run the cleanup process:
flask delete-old-urls
