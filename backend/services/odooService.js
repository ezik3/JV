const Odoo = require('odoo-xmlrpc');
const config = require('../config/odooConfig');

class OdooService {
    constructor() {
        this.odoo = new Odoo({
            url: config.url,
            port: config.port,
            db: config.db,
            username: config.username,
            password: config.password
        });
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.odoo.connect((err) => {
                if (err) {
                    console.error('Odoo connection error:', err);
                    reject(err);
                    return;
                }
                console.log('Connected to Odoo successfully');
                resolve(true);
            });
        });
    }

    async getProducts() {
        return new Promise((resolve, reject) => {
            this.odoo.execute_kw('product.template', 'search_read', 
                [
                    [['available_in_pos', '=', true]], // domain
                    ['name', 'list_price', 'description', 'type'] // fields
                ],
                (err, products) => {
                    if (err) {
                        console.error('Error fetching products:', err);
                        reject(err);
                        return;
                    }
                    resolve(products);
                }
            );
        });
    }
}

module.exports = new OdooService();