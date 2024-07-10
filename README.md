# MediSync

## Table of Contents
- [Overview](#overview)
- [Setup](#setup)
- [Tutorials](#tutorials)

## Overview
A **Hospital Management System** designed to manage information across multiple hospitals, facilitating a seamless user experience for patients. The system enables patients to efficiently manage appointments, check doctor and room availability, and access other essential functions. With its user-friendly UI/UX, users can navigate the system effortlessly.

## Setup

The following code snippets cover some common tasks that are essential in developing a web application. These examples demonstrate how to handle HTTP requests, manage state, and set up routing in a React application using popular libraries like `axios` and `react-router-dom`.

<br>

**Client Side**
Open the location **`.../MediSync/client`** in **`cmd`** or **`baash`**
<br>
*bash:*
```bash
# creating the web application
npx create-react-app [folder-name]

# installs 'react-router-dom' package
npm i react-router-dom

# installs 'axios' package
npm i axios
```
<br>

**Server Side**
Open the location **`.../MediSync/server`** in **`cmd`** or **`baash`**
*bash:*
<br>
```bash
# initializes a new Node.js project and create a package.json file with default values
npm init -y
```

*package.json:*
```notepad
{
    ...
    "version": "1.0.0",
    "type": "module", # add this
    "main": "index.js",
    ...
}
```
*bash:*
```bash
# installs the packages 'express', 'cors' and 'body-parser'
npm i express cors body-parser

# installs 'mysql2' package
npm i mysql2

# installs 'dotenv' package
npm i dotenv
```

Create a file `.env` and write the following:

```notepad
MYSQL_HOST='127.0.0.1'
MYSQL_USER="root"     // your username
MYSQL_PASSWORD=''     // your password
MYSQL_DATABASE='TEST' // database name
```
*bash:*
```bash
# installs 'nodmon' package
npm i -D nodemon
```

*package.json:*
```notepad
{
    ...
    "scripts": {
        "dev": "npx nodemon index.js" # add this
    },
    ...
}
```

## Tutorials
For React JS
https://www.youtube.com/playlist?list=PL7lXhMmy4JB5X38OT1JzXLmgP2hUM-v5f

For Node Js
https://www.youtube.com/watch?v=Hej48pi_lOc