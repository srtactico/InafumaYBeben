const fs = require('fs');
const path = 'c:\\Users\\ikerg\\Desktop\\BRIANDA\\PRACTICAS\\Inafuma y beben 2\\inafumaybeben2\\InafumaYBeben\\app.js';
let content = fs.readFileSync(path, 'utf8');

// Replace accept button
content = content.replace(
    /onclick="acceptFriendRequest\('\$\{req\.uid\}', '\$\{req\.username\}'\)" class="([^"]+)" title="Aceptar">[^<]*<\/button>/,
    'onclick="acceptFriendRequest(\'${req.uid}\', \'${req.username}\')" class="$1" title="Aceptar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>'
);

// Replace reject button
content = content.replace(
    /onclick="rejectFriendRequest\('\$\{req\.uid\}'\)" class="([^"]+)" title="Rechazar">[^<]*<\/button>/,
    'onclick="rejectFriendRequest(\'${req.uid}\')" class="$1" title="Rechazar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>'
);

// Fix AÑADIDO
content = content.replace(/AADIDO RECIENTEMENTE/g, 'AÑADIDO RECIENTEMENTE');

fs.writeFileSync(path, content, 'utf8');
console.log('File updated successfully');
