// backend/config/odooConfig.js
require('dotenv').config();

module.exports = {
    url: process.env.ODOO_URL || 'http://localhost',
    port: process.env.ODOO_PORT || 8069,
    db: process.env.ODOO_DB || 'jointvibepos',
    username: process.env.ODOO_USER || 'admin@example.com',
    password: process.env.ODOO_PASSWORD || 'alayahgianna'
};