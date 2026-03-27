# **App Name**: InsightNav Survey

## Core Features:

- Public Survey Interface: Displays survey questions with 'Statement A' and 'Statement B' presented side-by-side, separated by a central 'OR' badge in a responsive flex-row layout.
- URL-Based Survey Navigation: Enables sequential navigation through survey questions using a 'Step' system encoded in the URL (e.g., '?question=2').
- Survey Response Submission: Allows users to submit their choice (A or B) for each question, which is validated using Zod and saved directly to the database.
- Secure Admin Authentication: Provides a single-user login mechanism for the admin portal, authenticating credentials against environment variables and issuing a JWT stored in an HTTP-only cookie.
- Admin Portal Protection: A middleware intercepts all requests to '/admin/*', ensuring only authenticated users with a valid JWT can access administrative routes, redirecting to login otherwise.
- Question Management (CRUD): Offers administrators a simple CRUD interface within the admin portal to manage (add, view, activate/deactivate) research questions.
- Results Dashboard: Presents administrators with a basic table displaying aggregated total counts for 'Choice A' versus 'Choice B' for each survey question.

## Style Guidelines:

- A dark color scheme that evokes professionalism and analytical clarity.
- Primary brand color: Dark Blue (#004266). This strong hue anchors the professional aesthetic.
- Background color: A very dark, desaturated bluish-grey (#161C1E). Visibly related to the primary blue, ensuring good contrast for text and interactive elements.
- Accent color: Bright Orange (#CC5500). Provides high contrast against the dark background and primary blue, effectively drawing attention to calls-to-action and important information, as provided by the user.
- Body and headline font: 'Inter' (sans-serif) for its modern, neutral, and highly readable qualities, supporting the professional and objective feel.
- Utilize minimalist and geometric icons that complement the sharp, rectangular design aesthetic, avoiding anything overly decorative or playful.
- Strictly rectangular elements and components with `rounded-none` or a very small border radius to maintain a 'sharp-edged' visual identity.
- Consistent use of a responsive flex-row container for side-by-side content display in the survey interface, ensuring optimal viewing across devices.