# Choice Voting App

## Overview
Choice Voting APP is a simple web-based voting application where users can vote for nominees in various events. Admins can view results, reset votes, and manage the system securely.

## Features
- Users can vote **once per event**.
- Admins can view results with **bar and pie charts** (pie chart is displayed below bar chart).
- Admins can **reset votes**, allowing users to vote again.
- Images for nominees are currently commented out for future addition.
- Admin password management included.

## File Structure
index.html - Home page
vote.html / nominees.html - Voting pages
admin-login.html - Admin login
admin-dashboard.html - Admin dashboard with results
app.js - Helper functions
nominees.js - Voting logic
admin.js - Admin login logic
admin-dashboard.js - Admin dashboard logic
events.json - Event and nominee data
style.css - Styling
README.md - Documentation

markdown
Copy code

## Usage
1. Open `index.html` in a browser.
2. Click "Start Voting" to vote in events.
3. Admin login: `admin-login.html` (default password: `admin123`).
4. In the dashboard:
   - Click an event to see results.
   - Reset votes if needed.

## Notes
- Voting is tracked using `localStorage`.
- Resetting votes clears the `voted_` flags so users can vote again.
- Images are currently commented out; uncomment in JS to display 