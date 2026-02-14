# Certificate Generation Feature

## Overview

The certificate generation feature allows participants to generate and download a certificate of completion after the event has concluded. Certificates are automatically generated with the participant's name, badges, posts, and points overlay on a custom template.

## How It Works

### Eligibility Requirements

To receive a certificate, participants must have:

- **At least 1 badge** completed
- **At least 1 social media post** made

### Event Timeline

The certificate page is controlled by an event end date:

- **Before event ends**: Shows "Coming Soon" message with the event end date
- **After event ends**: Full certificate generation is available

### Current Configuration

The event end date is currently set to: **March 1, 2026**

To change this date, update the `EVENT_END_DATE` in:

```typescript
// File: app/certificate/page.tsx
const EVENT_END_DATE = new Date("2026-03-01"); // Change this date
```

## Pages and API

### 1. Certificate Page (`/certificate`)

- Located at: `app/certificate/page.tsx`
- URL: `/certificate`
- Features:
  - Email input form
  - Eligibility checking
  - Real-time certificate generation using HTML Canvas
  - Download certificate as PNG

### 2. Certificate API (`/api/certificate`)

- Located at: `app/api/certificate/route.ts`
- Endpoint: `GET /api/certificate?email={email}`
- Returns:
  ```json
  {
    "eligible": true,
    "message": "Congratulations! You are eligible for a certificate.",
    "participant": {
      "name": "Participant Name",
      "email": "email@example.com",
      "badges": 25,
      "posts": 15,
      "points": 155
    }
  }
  ```

## Customizing the Certificate Template

### Current Template

A default SVG template is located at: `public/certificate-template.svg`

### Creating a Custom Template

You can replace the certificate template with your own design:

#### Option 1: Use an Image (PNG/JPG)

1. Create a certificate design (1200x800px recommended)
2. Save it as `public/certificate-template.png`
3. Update the code in `app/certificate/page.tsx`:
   ```typescript
   img.src = "/certificate-template.png";
   ```
4. Leave space in the middle for the participant's name to be overlaid

#### Option 2: Use SVG (Current)

1. Edit `public/certificate-template.svg`
2. Keep the same dimensions (1200x800)
3. Design your certificate in any vector editor
4. Save as SVG

#### Option 3: Modify the Fallback Design

The code includes a fallback that generates a certificate programmatically if the template fails to load. You can customize this in the `img.onerror` handler.

### Text Overlay Positions

The participant information is overlaid at these positions (you can adjust in `app/certificate/page.tsx`):

```typescript
// Participant name
ctx.fillText(participant.name, canvas.width / 2, 420);

// Completion text
ctx.fillText("For completing ...", canvas.width / 2, 500);

// Points
ctx.fillText("Total Points: ...", canvas.width / 2, 540);

// Date
ctx.fillText(new Date().toLocaleDateString(...), canvas.width / 2, 580);
```

## User Flow

1. User visits `/certificate`
2. Checks if event has ended
   - If not: Shows "Coming Soon" message
   - If yes: Shows certificate form
3. User enters their email
4. System checks eligibility via API
5. If eligible:
   - Certificate is generated on canvas
   - Participant's name and stats are overlaid
   - User can download as PNG
6. If not eligible:
   - Shows specific requirements needed

## Navigation

Certificate links have been added to:

- Main leaderboard header (`/`)
- Empty state header
- "🎓 Get Certificate" button in the navigation

## Design Features

- **Responsive**: Works on mobile and desktop
- **Real-time generation**: Certificate is rendered in the browser
- **Download capability**: Users can save as PNG
- **Fallback design**: If template fails to load, a default design is used
- **Google-themed colors**: Matches GDG branding

## Testing

To test the certificate feature:

1. **Before Event Ends** (current state):

   ```
   Visit: http://localhost:3000/certificate
   Expected: "Certificates Coming Soon!" message
   ```

2. **After Event Ends**:
   - Change the `EVENT_END_DATE` to a past date
   - Visit: http://localhost:3000/certificate
   - Enter a valid participant email
   - Generate and download certificate

3. **Test Eligibility**:
   - Try with email that has 0 badges or 0 posts
   - Should show specific requirements

## Troubleshooting

### Certificate template not loading

- Check that `public/certificate-template.svg` exists
- Check browser console for CORS errors
- The fallback design will be used automatically

### Canvas not rendering

- Ensure browser supports HTML5 Canvas
- Check that participant data is being fetched correctly

### Download not working

- Check browser's download settings
- Try different browsers
- Ensure pop-ups are not blocked

## Future Enhancements

Potential improvements:

- Add email sending functionality
- Store generated certificates in database
- Add sharing to social media features
- Multiple certificate designs
- QR code verification
- PDF generation option
