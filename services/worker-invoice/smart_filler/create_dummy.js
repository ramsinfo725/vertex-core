const XLSX = require('xlsx');
const path = require('path');

const data = [
    { "cust_name": "John Doe", "inv_dt": "2023-01-01", "amt": 500, "status": "Paid" },
    { "cust_name": "Jane Smith", "inv_dt": "2023-01-02", "amt": "", "status": "Pending" }, // Missing Amount (Mandatory)
    { "cust_name": "", "inv_dt": "2023-01-03", "amt": 300, "status": "Paid" }, // Missing Name (Mandatory)
    { "cust_name": "Valid User", "inv_dt": "2023-01-04", "amt": 1000, "status": "Paid" }
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, "Source");
XLSX.writeFile(wb, path.join(__dirname, 'input/source.xlsx'));
console.log("Dummy Source Created.");
