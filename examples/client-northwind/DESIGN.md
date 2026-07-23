---
name: Northwind Steering Report
colors:
  primary: "#1B3A5C"
  secondary: "#5B7A99"
  accent: "#C1440E"
  neutral: "#F5F3EF"
  on-primary: "#FFFFFF"
typography:
  h1:
    fontFamily: Georgia
    fontSize: 1.75rem
    fontWeight: 700
  h2:
    fontFamily: Georgia
    fontSize: 1.25rem
    fontWeight: 700
  body:
    fontFamily: Arial
    fontSize: 0.95rem
  label-caps:
    fontFamily: Arial
    fontSize: 0.75rem
    letterSpacing: 0.05em
spacing:
  sm: 8px
  md: 16px
  lg: 32px
rounded:
  sm: 4px
  md: 8px
---

## Overview

Northwind's steering audience is executives skimming between meetings,
not engineers. Reports should read like a one-page briefing: a
confident navy-and-clay palette, generous whitespace, and headings
that stand on their own if nothing else gets read.

## Colors

- **Primary (#1B3A5C):** Section headings and the report's masthead.
- **Secondary (#5B7A99):** Supporting text — dates, owners, captions.
- **Accent (#C1440E):** The only color used to flag risk — a Critical
  or High severity marker, an overdue Action, a Delayed Milestone.
  Never used decoratively, so it keeps its urgency.
- **Neutral (#F5F3EF):** Page background — warm enough to not read as
  a bare white export.

## Typography

`h1` is reserved for the report's own title; every project or
portfolio section heading uses `h2`. Body copy stays at a comfortable
reading size — this is a briefing document, not a dashboard, so
density is not the goal.

## Layout

Sections stack with `lg` spacing between them and `md` padding inside
each; `sm` spacing separates a heading from the paragraph beneath it.
Rounded corners (`sm`, `md`) apply to callout boxes such as the
at-risk summary, not to the page itself.

## Do's and Don'ts

- Do use the accent color exclusively for genuine risk signals.
- Do keep one report to a single page's worth of scrolling where the
  content allows it.
- Don't introduce additional colors beyond this palette, even for a
  portfolio roll-up with many projects — distinguish sections with
  spacing and headings, not new hues.
