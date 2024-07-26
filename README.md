# Team Productivity Tool


<p align='center'>
  <a target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/JavaScript'><img src='https://img.shields.io/badge/JavaScript-blue?style=for-the-badge&logo=javascript&color=F7DF1E&labelColor=JavaScript&logoColor=white' alt="JavaScript"></a>
  <a target="_blank" href='https://tailwindcss.com/'><img src='https://img.shields.io/badge/Tailwind%20CSS-blue?style=for-the-badge&logo=tailwindcss&color=06B6D4&labelColor=tailwindcss&logoColor=white' alt="Tailwind CSS"></a>
  <a target="_blank" href='https://reactjs.org/'><img src='https://img.shields.io/badge/React-blue?style=for-the-badge&logo=react&color=61DAFB&labelColor=react&logoColor=white' alt="React"></a>
  <a target="_blank" href='https://nodejs.org/'><img src='https://img.shields.io/badge/Node.js-blue?style=for-the-badge&logo=node.js&color=339933&labelColor=node.js&logoColor=white' alt="Node.js"></a>
  <a target="_blank" href='https://firebase.google.com/'><img src='https://img.shields.io/badge/Firebase-blue?style=for-the-badge&logo=firebase&color=FFCA28&labelColor=Firebase&logoColor=white' alt="Firebase"></a>
</p>

A productivity tool designed for project teams to streamline workflows, enhance collaboration, and maximize efficiency.

## Features

- Real-time task management and tracking
- Team chat and collaboration
- Member management with role-based permissions
- Analytics and reporting
- Invitation management with email notifications

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What you need to install the software:

- Node.js (Version 14 or higher)
- npm (Node Package Manager)
- A Firebase project with Firestore and Authentication enabled

### Installing

A step-by-step series of examples that tell you how to get a development environment running:

1. Clone the repository:

    ```bash
    git clone https://github.com/aditya-shrey/productivity-pulse.git
    ```

2. Navigate to the project repository:

    ```bash
    cd productivity-pulse
    ```

3. Install the project dependencies:

    ```bash
    npm install
    ```

4. Set up your Firebase project and get your Firebase configuration. Create a `.env` file in the root directory and add your Firebase configuration:

    ```env
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    ```

5. Start the development server:

    ```bash
    npm start
    ```

    Your application should now be running on `http://localhost:3000`.

## Deploying

Since the deployment process is specific to your environment, ensure to follow your internal guidelines for deploying React applications.

## Built With

- React - Frontend library
- Firebase - Backend services (Authentication, Firestore, etc.)
- Node.js - JavaScript runtime
- CSS - Styling
- Tailwind CSS - Utility-first CSS framework

## Contributing

Contributions to this project are welcome. If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit/). Feel free to use and modify the code as per the license terms.
