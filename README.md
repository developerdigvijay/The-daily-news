# The Daily News

A production-ready news website built with **Vanilla HTML, CSS, and JavaScript**. No frameworks, no build steps.

## Quick Start

1.  **Open** the `index.html` file in your web browser (Double-click or drag into browser).
2.  **Browse** the Featured and Top stories.
3.  **Search** using the search bar (try "AI" or "Green").
4.  **Click** any article to view the full details on `article.html`.
5.  **Watch** the "Trending" sidebar update automatically every 5 seconds.

## Project Structure

-   `index.html`: Homepage structure.
-   `article.html`: Template for individual articles.
-   `styles/`: Contains `styles.css` with all styling variables and responsive rules.
-   `scripts/`: Contains `main.js` which handles routing, mock data, and interactions.
-   `assets/`: (Directory created) Images are handled via inline SVG Data URIs for offline compatibility.

## Features

-   **Zero Dependencies**: Runs entirely offline without `npm` or internet access.
-   **Responsive Design**: Mobile-first CSS Grid/Flexbox layout.
-   **Client-Side Routing**: `article.html?id=X` loads content dynamically from the JS mock database.
-   **Mock "Live" Data**: Trending numbers fluctuate in real-time.
-   **Accessibility**: Semantic HTML5 and ARIA labels.
