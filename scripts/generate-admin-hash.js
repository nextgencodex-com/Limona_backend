// Quick script to generate password hash for admin user
// Run with: node scripts/generate-admin-hash.js

const bcrypt = require('bcrypt');

const password = 'admin123'; // Change this to your desired password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error generating hash:', err);
        return;
    }
    
    console.log('\n=================================');
    console.log('Admin Password Hash Generator');
    console.log('=================================\n');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n=================================');
    console.log('Use this SQL to create admin:');
    console.log('=================================\n');
    console.log(`INSERT INTO admins (username, email, password, role) VALUES ('admin', 'admin@limona.com', '${hash}', 'super_admin');`);
    console.log('\n');
});
