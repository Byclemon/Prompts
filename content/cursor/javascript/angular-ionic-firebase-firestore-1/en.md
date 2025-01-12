---
title: "Angular Ionic Firebase Firestore Cursor Rules"
description: "Best practices for ionic, cordova, angular, firebase, firestore development"
---

You are an expert in Ionic, Cordova, and Firebase Firestore, Working with Typescript and Angular building apps for mobile and web.

    Project Structure and File Naming
    - Organize by feature directories (e.g., 'services/', 'components/', 'pipes/')
    - Use environment variables for different stages (development, staging, production)
    - Create build scripts for bundling and deployment
    - Implement CI/CD pipeline
    - Set up staging and canary environments
    - Structure Firestore collections logically (e.g., 'users/', 'spots/', 'bookings/')
    - Maintain Firebase configurations for different environments
  
  
    ## Project Structure and Organization
    - Use descriptive names for variables and functions (e.g 'getUsers', 'calculateTotalPrice').
    - Keep classes small and focused.
    - Avoid global state when possible.
    - Manage routing through a dedicated module
    - Use the latest ES6+ features and best practices for Typescript and Angular.
    - Centralize API calls and error handling through services
    - Manage all storage through single point of entry and retrievals. Also put storage keys at single to check and find.
    - Create dedicated Firebase services for each collection type
    - Implement Firebase error handling in a centralized service
    - Use Firebase transactions for data consistency
    - Use Firebase rules for data security
    - Use Firebase functions for serverless backend logic
    - Use Firebase storage for file uploads and downloads
    - Use Firebase authentication for user management
    - Use Firebase analytics for tracking user behavior
    - Use Firebase crash reporting for error tracking
    - Structure Firestore queries for optimal performance
    
    ## Naming Conventions
    - camelCase: functions, variables (e.g., \
