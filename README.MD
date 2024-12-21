I'll# GoShareNotes

GoShareNotes is a simple, collaborative note-sharing web application designed for users on the same local network. The app allows users to view, write, and edit notes without the need for account creation. Users can set privacy levels for their notes and interact with others in real time.

## Features

- **Public Notes**: Notes that are visible and editable by anyone with access to the web app.
- **Semi-Public Notes**: Notes that are visible by everyone but can only be edited with a password.
- **Private Notes**: Notes that are accessible only to those with the correct password.
- **Default Note**: A default note is visible to all users upon first access and is reset every 30 minutes.
- **Password-Protected Notes**: Users can set passwords for semi-public and private notes on the spot.

## Technologies Used

- **Frontend**: 
  - HTML
  - CSS
  - JavaScript
- **Backend**:
  - Django (Python)
  - Docker (for containerization)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Docker (for running the app in a container)
- Python 3.10.9
- Django 5.1.4 or higher

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sadiq-Muhammad/GoShareNotes.git
2. Navigate to the project directory:
   ```bash
   cd GoShareNotes
3. Build and run the Docker container:
   ```bash
   docker-compose up --build
This will build the Docker image, install dependencies, and start the web application. The app will be accessible on http://localhost:8000.

### Usage
1. When you visit the landing page, you will see a default note that resets every 30 minutes.
2. Users can view and edit public notes, and they will be visible to everyone.
3. Semi-public notes are viewable by everyone but require a password for editing.
4. Private notes are completely protected by passwords, ensuring that only authorized users can view or edit them.

### Customization
You can modify the default note or change the privacy settings for any note from the admin interface.

1. To modify a note, log in using the admin interface (http://localhost:8000/admin).
2. Update the note's content, title, or privacy setting.

### Deployment
The project is designed to run inside a Docker container for easy deployment. You can deploy it on any server by following the same steps to build and run the Docker container.

### Mobile Responsiveness
The application is optimized for mobile devices. On mobile, a hamburger menu is used to toggle the sidebar, providing an easy way to navigate between notes.

### Contributing
If you'd like to contribute to GoShareNotes, please fork the repository, make your changes, and submit a pull request. Be sure to follow the existing code structure and include tests for new features or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) ![License](https://img.shields.io/badge/license-MIT-blue.svg) file for details.