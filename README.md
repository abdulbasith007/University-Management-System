
# University Management System

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: Version 18.x  
  Install Node.js using the following command:
  ```bash
  nvm install 18
  nvm use 18
  ```

- **npm**: Version 10.x  
  Install or update npm using:
  ```bash
  npm install -g npm@10
  ```

## Setting Up the Project

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abdulbasith007/University-Management-System.git
   cd University-Management-System
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment variables**:  
   Create a `.env` file in the root directory of the project. You can refer to the `sample.env` file for reference. The `.env` file should include the following environment variables:

   ```bash
   DB_HOST=<your-database-host>
   DB_USER=<your-database-username>
   DB_PASS=<your-database-password>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRE=<jwt-expiration-time>
   SESSION_SECRET=<your-session-secret>
   ```

4. **Database Setup**:  
   Execute the SQL scripts to set up the database and insert mock data:
   
   - To create the database schema:
     ```bash
     mysql -u <DB_USER> -p <DB_NAME> < create.sql
     ```
   
   - To insert mock data:
     ```bash
     mysql -u <DB_USER> -p <DB_NAME> < insert.sql
     ```

## Running the Application

Start the application using the following command:
```bash
npm start
```

The application will start on the port specified in your `.env` file or default is port 5000.
Enter URL http://localhost:5000/ on your browser to view the UI

