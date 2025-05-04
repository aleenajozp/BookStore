const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

require("./connection.js");

const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());


app.post('/contact', async (req, res) => {
    console.log("Invoked route: '/contact'")
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Please fill all fields.' });
    }

    try {
       
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'aleena.jozph@gmail.com', 
                pass: 'ktiz fsei sboc jnjv', 
            },
        });
        

        
        const mailOptions = {
            from: email,
            to: 'aleena.jozph@gmail.com',
            subject: `Contact Form Submission from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Message: ${message}
           ` ,
        };
        console.log("after 33")

        
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send message.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello! Backend is running.');
});
