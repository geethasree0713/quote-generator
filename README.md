# Quote Generator with Share Feature

A simple random quote generator built with HTML, CSS and vanilla JavaScript.

## vercel
https://quote-generator-eight-liard.vercel.app/
## Features
- Random motivational/success/life/happiness quotes
- Category filter
- Quote of the day banner
- Smooth fade-in animation on every new quote
- Copy quote to clipboard
- Share on Twitter, LinkedIn and WhatsApp
- Save quotes to favorites using localStorage
- Fully responsive

## Tech
- HTML5
- CSS3
- Vanilla JavaScript
- Local JSON file as the quote source (quotes.json)

## Run locally
Just open a local server in this folder (opening index.html directly will block the fetch of quotes.json), for example:

```
npx serve .
```

or with Python:

```
python -m http.server 5500
```

Then visit the printed localhost URL.

## Deploy on Vercel
1. Push this folder to a GitHub repo.
2. Go to vercel.com, import the repo.
3. Framework preset: Other / Static.
4. Deploy. No build step needed.

## Files
- index.html — page structure
- style.css — all styling
- script.js — app logic
- quotes.json — quote data
