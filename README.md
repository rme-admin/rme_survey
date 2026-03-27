# Research Made Easy (RME) Survey Platform

This is the official survey and data collection platform for Research Made Easy.

## Features
- Interactive Researcher Experience Survey
- Professional Profile Collection
- Admin Dashboard for managing questions and viewing results
- Secured Admin Portal

## How to push to GitHub
1. **Initialize git**: Open the terminal in this directory and run:
   ```bash
   git init
   ```
2. **Add all files**:
   ```bash
   git add .
   ```
3. **Commit changes**:
   ```bash
   git commit -m "Initial commit of RME Survey Platform"
   ```
4. **Link to GitHub**:
   ```bash
   git remote add origin https://github.com/rme-admin/rme_survey.git
   ```
5. **Push your code**:
   ```bash
   git push -u origin main
   ```

**Security Note:** Your `.env` file contains sensitive credentials. It has been added to `.gitignore` so it won't be pushed to GitHub. You should manually add these environment variables to your production environment (e.g., GitHub Secrets or Firebase App Hosting settings).
