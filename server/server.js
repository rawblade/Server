const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const auth = require('./auth');

app.use(express.json());
app.use(express.static('public'));

// Set up admin authentication
app.use('/admin', auth);

// Admin routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'dashboard.html'));
});

// Serve static files from admin directory
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Log visit route
app.post('/log-visit', async (req, res) => {
    try {
        const visitorData = {
            ...req.body,
            ip: req.ip,
            timestamp: new Date().toISOString()
        };

        const dataFile = path.join(__dirname, 'data.json');
        let logs = [];
        
        try {
            const data = await fs.readFile(dataFile, 'utf8');
            logs = JSON.parse(data);
        } catch (error) {
            // File doesn't exist or is empty
        }

        logs.push(visitorData);
        await fs.writeFile(dataFile, JSON.stringify(logs, null, 2));
        res.status(200).json({ message: 'Not Available For ur Location Yet' });
    } catch (error) {
        res.status(500).json({ error: 'Error logging location' });
    }
});

// Admin data route
app.get('/admin/data', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error reading logs' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
