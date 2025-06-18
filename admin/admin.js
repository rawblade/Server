async function fetchLogs() {
    try {
        const response = await fetch('/admin/data');
        if (response.status === 401) {
            window.location.href = '/admin/login';
            return;
        }
        const logs = await response.json();
        displayLogs(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}

function displayLogs(logs) {
    const tbody = document.querySelector('#logsTable tbody');
    tbody.innerHTML = logs.map(log => `
        <tr>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
            <td>${log.ip}</td>
            <td>${log.userAgent}</td>
            <td><a href="https://www.google.com/maps?q=${log.latitude},${log.longitude}" target="_blank">
                ${log.latitude}, ${log.longitude}
            </a></td>
            <td>${log.accuracy ? Math.round(log.accuracy) + 'm' : 'N/A'}</td>
        </tr>
    `).join('');
}

// Fetch logs when page loads
fetchLogs();
// Refresh logs every 30 seconds
setInterval(fetchLogs, 30000);
