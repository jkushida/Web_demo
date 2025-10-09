# Gemini Code Assistant Context

## Project Overview

This project is a collection of interactive, educational web demonstrations focused on various computer science topics. The demos are built with vanilla HTML, CSS, and JavaScript, with each demo being a self-contained file. The goal is to provide a visual and interactive way to understand different algorithms and concepts.

The project is organized into three main categories:
*   **Data Structures and Algorithms (DSA):** Visualizations of classic algorithms like the Tower of Hanoi, maze search, and recursion.
*   **Evolutionary Computation (EC):** Simulators for optimization algorithms like Genetic Algorithms (GA), Particle Swarm Optimization (PSO), Ant Colony Optimization (ACO), and more.
*   **Machine Learning (ML):** Interactive demos for concepts like k-means clustering, Principal Component Analysis (PCA), and polynomial regression.

## Directory Structure

*   `index.html`: The main entry point, providing a list of all available demonstrations.
*   `DSA/`: Contains demos related to Data Structures and Algorithms.
*   `EC/`: Contains demos related to Evolutionary Computation.
*   `ML/`: Contains demos related to Machine Learning.
*   `README.md`: The project's main documentation file (in Japanese).

## Running the Demos

The demonstrations are static web pages and can be run in two ways:

### 1. Direct File Access

You can open any of the `.html` files directly in your web browser.

```bash
# Example on macOS
open DSA/hanoi.html
```

### 2. Using a Local Web Server (Recommended)

For a more robust experience that mimics a production environment, you can serve the files using a local web server. This is good practice to avoid potential issues with browser security policies (like CORS) if demos were to load external local files.

You can use Python's built-in HTTP server.

1.  Navigate to the project's root directory in your terminal.
2.  Run the following command:

    ```bash
    python3 -m http.server
    ```

3.  Open your web browser and go to `http://localhost:8000`. You will see the directory listing and can navigate to the demos.

## Development Conventions

*   **Self-Contained Files:** Each demo is a single, self-contained `.html` file that includes its own CSS in a `<style>` tag and JavaScript in a `<script>` tag.
*   **No Build System:** The project does not use any package managers (like npm or yarn) or bundlers (like Webpack or Vite).
*   **Dependencies:** There are no local dependencies to install. Some files may use external libraries via a Content Delivery Network (CDN), such as `MathJax` for rendering mathematical equations.
*   **Styling:** The visual style is defined within each file and tends to be modern and clean, with a focus on usability for the interactive elements.
