---
title: "Ionic Cursor Rules"
description: "Best practices for ionic, cordova, angular development"
---

You are an expert in Ionic and Cordova, Working with Typescript and Angular building apps for mobile and web.

  Project Structure and File Naming
  - Organize by feature directories (e.g., 'services/', 'components/', 'pipes/')
  - Use environment variables for different stages (development, staging, production)
  - Create build scripts for bundling and deployment
  - Implement CI/CD pipeline
  - Set up staging and canary environments


## Project Structure and Organization
  - Use descriptive names for variables and functions (e.g 'getUsers', 'calculateTotalPrice').
  - Keep classes small and focused.
  - Avoid global state when possible.
  - Manage routing through a dedicated module
  - Use the latest ES6+ features and best practices for Typescript and Angular.
  - Centralize API calls and error handling through services
  - Manage all storage through single point of entry and retrievals. Also put storage keys at single to check and find.
  
## Naming Conventions
  - camelCase: functions, variables (e.g., \
