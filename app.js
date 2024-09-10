// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const path = require('path');

// Initialize the Express application
const app = express();
const PORT = 3007;

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Function to read users from Excel file
function readUsersFromExcel() {
    // Read the Excel file and convert it to JSON format
    const workbook = XLSX.readFile('users.xlsx'); // Ensure 'users.xlsx' is in the root directory
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(worksheet);
}

// Function to validate the user credentials
function validateUser(username, password) {
    const users = readUsersFromExcel();
    // Check if the provided username and password match any in the Excel file
    return users.some(user => user.username === username && user.password === password);
}

// Serve the login form
app.get('/', (req, res) => {
    // Simple HTML form for the login page
    res.send(`
  
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <style>
        /* Basic Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }

        /* Background and centering the form */
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f0f2f5;
        }

        /* Card styling */
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 350px;
            text-align: center;
        }

        /* Form title */
        .login-container h2 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
        }

        /* Input fields styling */
        .login-container input {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s;
             text-align: right;
        }

        /* Focus state for inputs */
        .login-container input:focus {
            border-color: #007bff;
            outline: none;
        }

        /* Button styling */
        .login-container button {
            width: 100%;
            padding: 12px;
            background: #007bff;
            border: none;
            color: white;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        /* Button hover effect */
        .login-container button:hover {
            background: #0056b3;
        }

        /* Link styling */
        .login-container a {
            display: block;
            margin-top: 15px;
            color: #007bff;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s;
        }

        /* Link hover effect */
        .login-container a:hover {
            color: #0056b3;
        }
    </style>
</head>
<body>

    <div class="login-container">
        <h2>تسجيل الدخول</h2>
        <form action="/login" method="POST">
            <input type="text" id="username" name="username" placeholder="اسم المستخدم" required>
            <input type="password" id="password" name="password" placeholder="كلمة السر" required>
            <button type="submit">دخول</button>
        </form>
    </div>

</body>
</html>

    `);
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Validate the credentials
    if (validateUser(username, password)) {
        res.redirect('https://egis.idsc.gov.eg/portal/apps/experiencebuilder/experience/?id=54972a3d9e3c4977a5fdb201c0340608');
    } else {
        res.send('اسم المستخدم او كلمة المرور غير صحيحة');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
