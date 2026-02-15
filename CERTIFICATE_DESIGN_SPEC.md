# Certificate Design Specification

## Overview

Design a certificate template for the GDG OAU Badge Sprint challenge. The certificate will be used to recognize participants who have completed badges.

---

## Technical Requirements

### File Format

- **Primary Format**: SVG (Scalable Vector Graphics)
- **Alternate Format**: High-resolution PNG or JPG (minimum 1200x800px at 150 DPI)
- **Filename**: `certificate-template.svg` or `certificate-template.png`

### Canvas Dimensions

- **Width**: 2800 pixels
- **Height**: 2000 pixels
- **Orientation**: Landscape
- **Aspect Ratio**: 7:5

---

## Design Elements

### 1. Background & Branding

- Include GDG (Google Developer Groups) branding
- Use GDG color palette: Blue (#4285F4), Green (#34A853), Yellow (#FBBC04), Red (#EA4335)
- Add GDG OAU logo prominently
- Background should be professional and celebratory

### 2. Certificate Title/Header

- Include text like "Certificate of Achievement" or "Certificate of Completion"
- Add subtitle: "GDG OAU Badge Sprint Challenge"
- This should be part of the template design (not dynamically added)

### 3. Text Placeholder Zones 🔴 **CRITICAL**

The system will overlay the participant's name at these exact coordinates. **Leave this area CLEAR** of any background patterns or text:

#### Participant Name

- **Position**: Centered horizontally between X: 462 and X: 2344, at Y: 1150
- **Center Point**: X: 1403 (midpoint of signature line)
- **Signature Line**: Starts at (462, 1251) and ends at (2344, 1251)
- **Font Style**: Bold, ~140px Arial
- **Color**: Dark (#1a202c)
- **Purpose**: Participant's full name will be written here
- **Note**: Name is positioned above the signature line at Y: 1251

### 4. Additional Design Elements

Include in the template (these won't be dynamically changed):

- Border or decorative frame
- Date line or space for event dates
- Signature line(s) with "GDG OAU Organizer" label
- Achievement icons or badges graphics
- QR code placeholder (optional)
- Footer with GDG OAU contact/social media

---

## Important Notes for Designer

### ✅ DO:

- Make the name zone (around Y: 1150) visually prominent
- Use contrasting colors to make overlayed text readable
- Ensure the text zone has solid or very light background
- Include visual hierarchy that draws attention to the name
- Keep the signature line at Y: 1251 clear and visible
- Add decorative elements around (not on top of) the text zone
- Test the design with sample names of different lengths

### ❌ DON'T:

- Place any text, patterns, or graphics in the name placeholder zone
- Use busy backgrounds in the text area (Y: 1050-1200)
- Add decorative lines that cross through Y: 1150
- Obscure the signature line at Y: 1251
- Make the certificate too cluttered

---

## Text Zone Visual Guide

```
╔════════════════════════════════════════════════════════════╗
║                    Certificate Header                       ║
║                  GDG OAU Badge Sprint                       ║
║                                                             ║
║                                                             ║
║                                                             ║
║                                                             ║
║     ┌─────────────────────────────────────────────┐       ║
║ Y:  │         [PARTICIPANT NAME ZONE]               │       ║
║1150 │              Keep Clear!                      │       ║
║     └─────────────────────────────────────────────┘       ║
║     ════════════════════════════════════════════           ║
║     ^                                           ^           ║
║   X:462          Signature Line              X:2344        ║
║                       (Y:1251)                              ║
║                                                             ║
║                                                             ║
║                   GDG OAU Organizer                         ║
╚════════════════════════════════════════════════════════════╝
    0px                                               2800px
```

---

## Color Suggestions

- **Primary**: Blues and purples (matches website theme)
- **Accent**: Gold/yellow for achievement feel
- **Background**: Light gradient or subtle pattern
- **Text Zones**: White or very light background for contrast

---

## Delivery Format

Please provide:

1. **certificate-template.svg** - Main file to use
2. Preview PNG showing how it looks with sample name
3. Layered source file (AI, PSD, or Figma) for future edits

---

## Example Text to Test

- **Name**: "Oluwaseun Adebayo-Johnson" (long name)
- **Name**: "John Doe" (short name)

Test with both short and long names to ensure proper fit within the zone and good spacing above the signature line.

---

## Questions?

Contact the development team for any clarifications about text placement or technical requirements.
