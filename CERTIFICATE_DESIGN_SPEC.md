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

- **Width**: 1200 pixels
- **Height**: 800 pixels
- **Orientation**: Landscape
- **Aspect Ratio**: 3:2

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

The system will overlay two pieces of text at these exact coordinates. **Leave these areas CLEAR** of any background patterns or text:

#### Participant Name

- **Position**: Centered horizontally, 420px from top
- **Area**: 800px wide x 100px tall (200px, 370px to 1000px, 470px)
- **Font Style**: Bold, ~60px
- **Color**: Dark (#1a202c)
- **Purpose**: Participant's full name will be written here

#### Badges Earned

- **Position**: Centered horizontally, 520px from top
- **Area**: 600px wide x 60px tall (300px, 490px to 900px, 550px)
- **Font Style**: Regular, ~32px
- **Color**: Gray (#4a5568)
- **Purpose**: Text like "5 Badges Earned" will appear here

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

- Make the name zone (Y: 370-470px) visually prominent
- Use contrasting colors to make overlayed text readable
- Ensure text zones have solid or very light backgrounds
- Include visual hierarchy that draws attention to the name
- Add decorative elements around (not on top of) the text zones
- Test the design with sample names of different lengths

### ❌ DON'T:

- Place any text, patterns, or graphics in the text placeholder zones
- Use busy backgrounds in the text areas
- Add decorative lines that cross through Y: 420px or Y: 520px
- Make the certificate too cluttered

---

## Text Zone Visual Guide

```
╔════════════════════════════════════════════════════════════╗
║                    Certificate Header                       ║
║                  GDG OAU Badge Sprint                       ║
║                                                             ║
║                                                             ║
║     ┌─────────────────────────────────────────────┐       ║
║ Y:  │                                               │       ║
║ 370 │         [PARTICIPANT NAME ZONE]               │ 420   ║
║     │              Keep Clear!                      │       ║
║ 470 └─────────────────────────────────────────────┘       ║
║                                                             ║
║     ┌──────────────────────────────────┐                  ║
║ Y:  │    [BADGES EARNED ZONE]          │ 520              ║
║ 550 └──────────────────────────────────┘                  ║
║                                                             ║
║                                                             ║
║                  Signature Line                             ║
╚════════════════════════════════════════════════════════════╝
    0px                                               1200px
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

- **Name**: "Oluwaseun Adebayo-Johnson"
- **Badges**: "15 Badges Earned"

Test with both short and long names to ensure proper fit within the zones.

---

## Questions?

Contact the development team for any clarifications about text placement or technical requirements.
