const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve purchase page
app.get('/purchase435678956', (req, res) => {
    res.sendFile(path.join(__dirname, 'purchase435678956.html'));
});

// Handle email saving
app.post('/save-email', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Append email to file
    fs.appendFile(
        path.join(__dirname, '..', 'emails.txt'),
        email + '\n',
        (err) => {
            if (err) {
                console.error('Error saving email:', err);
                return res.status(500).json({ error: 'Failed to save email' });
            }
            res.json({ message: 'Email saved successfully' });
        }
    );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
