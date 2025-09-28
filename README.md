# Coswin+

This is a ticketing and reporting system for IT issues, built with Next.js in Firebase Studio.

## Overview

Coswin+ is a web application designed to streamline IT support requests and incident reporting. It provides separate interfaces for regular users and administrators, each with tailored functionalities.

## Features

- **Dual User Roles:**
  - **User:** Can submit IT support tickets through a simple form.
  - **Admin:** Has a comprehensive dashboard to manage incoming tickets and create detailed follow-up reports.

- **Ticketing Dashboard (Admin):**
  - View all tickets in a clear, tabular format.
  - Separate tabs for "Active" and "Archived" tickets.
  - Update ticket status (Done, Cancelled, or reopen).
  - Download the entire ticket history as a CSV file.
  - Access the reporting section.

- **Reporting Dashboard (Admin):**
  - View all submitted follow-up reports as individual cards.
  - Create new, detailed reports with specific fields for site, post name, problem type, OS, and PC type.

## How to Run the Project

1.  **Install dependencies:**
    Open your terminal and run the following command to install the necessary packages.
    ```bash
    npm install
    ```

2.  **Start the development server:**
    Once the installation is complete, run this command to start the app.
    ```bash
    npm run dev
    ```

3.  **Access the application:**
    Open your web browser and navigate to the local address provided in the terminal (usually `http://localhost:9002`).

## Login Credentials

-   **User:**
    -   Username: `user`
    -   Password: `user123`
-   **Admin:**
    -   Username: `admin`
    -   Password: `admin123`
