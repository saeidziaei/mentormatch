Create a hero landing page for "MentorMatch" — a tutoring/mentorship platform.

## Reference Design
The page has:
- A top navbar with: logo (graduation cap icon + "MentorMatch" wordmark), center nav links ("Find Tutors", "My Learning"), right-side "Tutor Portal" link + "Sign In" button (purple/violet filled)
- A full-viewport hero section with a dark blue overlay on top of a background image (aerial city/guitar player photo), featuring:
  - A small pill/badge label: "✦ ELEVATE YOUR LEARNING"
  - Large bold headline: "Unlock Your Potential with Expert Mentors." — where "Expert" is in italic purple
  - Subtitle: "Connect with vetted, professional tutors for personalized learning experiences that fit your schedule."
  - Two CTA buttons: "Find a Tutor 🔍" (solid purple) and "Become a Tutor" (semi-transparent/ghost style)

## Tech
- React component (default export)
- Tailwind CSS (already configured)
- Use a placeholder background image from web\public\images\wavysea.jpg

## Design Constraints
- Color palette: deep navy/indigo overlay (#1e1b6e or similar), purple accent (#7c3aed / violet-600), white text
- "Expert" word should be italic and in purple/violet
- The pill badge should have a border and small star icon
- Buttons: primary is solid purple with rounded-full, secondary is white/transparent with border and rounded-full
- Navbar should be clean, dark, with slight transparency over the hero
- Fully responsive

## Notes
- No form tags — use onClick handlers for buttons
- Keep it a single file component
- Add subtle hover states on nav links and buttons