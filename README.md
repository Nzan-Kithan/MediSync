# MediSync

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Key Features](#key-features)
- [License](#license)

## Overview

**MediSync** is a **Hospital Management System** developed as a college mini-project. It has been designed to efficiently manage patient information across multiple hospitals, facilitating a seamless user experience for both patients and healthcare providers.

## Key Features

- **Patient Management**: Allows patients to register, manage appointments, and view their medical history and bills.
- **Doctor and Room Availability**: Provides real-time information on doctor availability and room status across hospitals.
- **User-Friendly Interface**: Offers an intuitive and responsive UI/UX to ensure ease of navigation and usability.
- **Authentication**: Implements user authentication to secure access to sensitive data and functionalities.
- **Information Sharing**: Allows patients to share required medical information with new hospitals using modern technology such as QR codes.


## Prerequisites

- Node.js and npm (or yarn)
- MySQL database

## Setup and Installation

After cloning the repository, you can set up the project using either `npm`. Follow the instructions below:

### Using npm

In **bash** or any other terminal, `cd` into the `medisync/client` and `medisync/server` directories in separate terminal windows:

1. **Install Dependencies**:
    ```bash
    # In both directories
    cd medisync/client
    npm install

    cd ../server
    npm install
    ```

2. **Start the Development Server**:
    ```bash
    # In the medisync/client directory
    cd medisync/client
    npm start

    # In the medisync/server directory
    cd ../server
    npm run dev
    ```

### Database Setup

In the `medisync/server` directory, create a file named `.env` and add the following configuration details, replacing the placeholder values with your own:

```dotenv
MYSQL_HOST='127.0.0.1'
MYSQL_PORT=3306
MYSQL_USER='root'
MYSQL_PASSWORD='password'
MYSQL_DATABASE='database'
NODE_PORT=4000
```

**Refer to `TABLE.txt` to create the tables.** This file contains the SQL statements required to set up the database schema. Ensure you execute these statements in your MySQL client or tool to create the necessary tables.

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.