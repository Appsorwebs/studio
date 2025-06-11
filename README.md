
# Rxpiration Alert

**Rxpiration Alert** is a modern web application designed to tackle the critical issue of pharmaceutical waste and improve medication accessibility. It provides a comprehensive platform for pharmacists, healthcare providers, and organizations to manage drug inventories, track expiration dates, facilitate donations, and collaborate effectively.

## Core Features

-   **Drug Listing and Management**: Intuitive interface for listing drugs with details like name, dosage, manufacturer, and expiration date.
-   **Advanced Search and Filtering**: Quickly locate drugs by name, category, or expiration status.
-   **AI-Powered Expiration Prediction**: (Planned Feature) Employs an AI model to predict drug expiration dates more accurately.
-   **Facilitate Drug Donations**: Connects with charities and organizations to streamline the donation of surplus medications.
-   **Communication & Collaboration**: Enables seamless communication between stakeholders regarding drug availability and management.
-   **Data Analytics Dashboard**: Provides insights into drug expiration trends, inventory levels, and user activity.
-   **Theme Toggle**: Supports light and dark mode preferences for user comfort.
-   **User Authentication**: Secure registration and login for pharmacists.
-   **Profile Management**: Allows pharmacists to manage their professional information.

## Tech Stack

This application is built with a modern, robust, and scalable technology stack:

-   **Frontend**:
    -   Next.js (App Router)
    -   React
    -   TypeScript
    -   ShadCN UI Components
    -   Tailwind CSS
-   **Backend/Authentication**:
    -   Firebase (Authentication, Firestore for user profiles and potentially drug data)
-   **AI Functionality**:
    -   Genkit (for integrating AI models)
-   **Styling**:
    -   Tailwind CSS
    -   CSS Variables for Theming

## Getting Started

To get this project up and running on your local machine, follow these steps:

1.  **Prerequisites**:
    *   Node.js (version 18.x or later recommended)
    *   npm or pnpm or yarn

2.  **Clone the Repository** (if applicable):
    ```bash
    git clone <repository-url>
    cd rxpiration-alert
    ```

3.  **Install Dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    # or
    yarn install
    ```

4.  **Set Up Environment Variables**:
    Create a `.env.local` file in the root of your project and add your Firebase project configuration details. You can find these in your Firebase project settings.
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id (optional)

    # For Firebase Admin SDK (used in API routes)
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_CLIENT_EMAIL=your_firebase_admin_sdk_client_email
    FIREBASE_PRIVATE_KEY="your_firebase_admin_sdk_private_key_with_newlines_escaped"
    ```
    *Note on `FIREBASE_PRIVATE_KEY`*: When copying from the JSON file, ensure newlines (`\n`) are preserved or escaped as `\\n` if your system requires it for single-line environment variables.*

5.  **Run the Development Server**:
    ```bash
    npm run dev
    # or
    pnpm dev
    # or
    yarn dev
    ```
    The application will typically be available at `http://localhost:9002` (as per your current `package.json` dev script) or `http://localhost:3000`.

6.  **Explore the App**:
    Navigate to the application in your browser. You can register as a new pharmacist, log in, and explore features like the dashboard, inventory management, and profile settings.

## Design & UI

-   **Primary Color**: Soft Blue (`#64B5F6`)
-   **Background Color**: Light Gray (`#F0F4F8`) / Dark Gray (`#37474F`)
-   **Accent Color**: Teal (`#26A69A`)
-   **Fonts**: 'Space Grotesk' (Headlines), 'Inter' (Body)
-   **Icons**: Lucide React

The application aims for a clean, modern, and responsive design suitable for professional use across various devices.

## Contributing

Details on contributing to this project will be added here.

## License

This project is licensed under [Specify License - e.g., MIT License].
