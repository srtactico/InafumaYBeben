const firebaseConfig = {
    apiKey: "AIzaSyBvlnwg6VwX-U5yqjiG350ERFtc6cGrNlA",
    authDomain: "inafuma-y-beben-10cfc.firebaseapp.com",
    projectId: "inafuma-y-beben-10cfc",
    storageBucket: "inafuma-y-beben-10cfc.firebasestorage.app",
    messagingSenderId: "745321582772",
    appId: "1:745321582772:web:eb3f39dcb80df0d6eec7e1",
    measurementId: "G-JZGK0D0JMS"
};

// Arrancamos los motores de la nube
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
/* =========================================================================
   BASE DE DATOS: JUGADORES Y AVATARES
   ========================================================================= */
function getAvatar(name) { return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`; }

const PLAYERS_DB = [
    { id: 101, name: "Lionel Messi", pos: "DEL", pac: 80, sho: 93, pas: 94, def: 30, phy: 65, rep: 5000, priceBasic: 150000000, pricePrem: 12000, img: "https://us-tuna-sounds-images.voicemod.net/f0a3dd8a-eea8-4f46-9e4b-26637d97899c-1682820619597.jpeg" },
    { id: 102, name: "Cristiano Ronaldo", pos: "DEL", pac: 82, sho: 95, pas: 80, def: 35, phy: 85, rep: 5000, priceBasic: 140000000, pricePrem: 11000, img: "https://i.pinimg.com/236x/fc/16/9c/fc169c4de125f69c56bf67c9ef03d931.jpg" },
    { id: 103, name: "Kylian MbappÃ©", pos: "DEL", pac: 99, sho: 92, pas: 85, def: 35, phy: 78, rep: 4500, priceBasic: 135000000, pricePrem: 10000, img: "https://pbs.twimg.com/media/FUMiCSJXEAAHdvH.jpg" },
    { id: 201, name: "Kevin De Bruyne", pos: "MED", pac: 72, sho: 85, pas: 98, def: 65, phy: 75, rep: 4800, priceBasic: 110000000, pricePrem: 9000, img: "https://i.redd.it/ekbnqb2za2y51.jpg" },
    { id: 301, name: "Virgil van Dijk", pos: "DEF", pac: 78, sho: 60, pas: 75, def: 95, phy: 90, rep: 4500, priceBasic: 95000000, pricePrem: 7800, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGWdbul4YolKhJhyNFg6s3G57zUScIbryrtw&s" },
    { id: 401, name: "Thibaut Courtois", pos: "POR", sal: 87, par: 93, saq: 84, ref: 92, vel: 84, posi: 94, rep: 4000, priceBasic: 85000000, pricePrem: 6500, img: "https://www.clarin.com/2022/05/28/-h5dvaCni_360x240__1.jpg" },
    { id: 104, name: "Vini", pos: "DEL", pac: 95, sho: 86, pas: 85, def: 30, phy: 70, rep: 3500, priceBasic: 95000000, pricePrem: 7500, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt8XM1bPlLnxJiwtXA-dRI0m2_JFiF06AOCw&s" },
    { id: 202, name: "Jude Bellingham", pos: "MED", pac: 82, sho: 85, pas: 88, def: 78, phy: 85, rep: 4500, priceBasic: 105000000, pricePrem: 8500, img: "https://img.asmedia.epimg.net/resizer/v2/A43ZCIYQ45GOPD6RSU4BMQDJKA.jpg?auth=28955647f8c2746ddacbcaef794724da6461afeb5818292923b1c8266be15a5e&width=360" },
    { id: 302, name: "Antonio RÃ¼diger", pos: "DEF", pac: 85, sho: 40, pas: 70, def: 90, phy: 92, rep: 3500, priceBasic: 75000000, pricePrem: 6000, img: "https://images7.memedroid.com/images/UPLOADED575/652d60841d73b.jpeg" },
    { id: 402, name: "Alisson Becker", pos: "POR", sal: 90, par: 91, saq: 88, ref: 90, vel: 85, posi: 90, rep: 3000, priceBasic: 65000000, pricePrem: 5000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUODxT9kUGcLFOAQG-xYCweQphUsebWt7whg&s" },
    { id: 105, name: "A. Griezmann", pos: "DEL", pac: 80, sho: 85, pas: 88, def: 50, phy: 70, rep: 2000, priceBasic: 55000000, pricePrem: 4500, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6Xl8wrodmxAQjKIMaHo8yXTA_1r23KaTsuw&s" },
    { id: 203, name: "Pedri GonzÃ¡lez", pos: "MED", pac: 78, sho: 70, pas: 92, def: 68, phy: 65, rep: 3000, priceBasic: 75000000, pricePrem: 6000, img: "https://esportbase.valenciaplaza.com/wp-content/uploads/2021/08/E8MPi_LWUAY2YvY.jpg" },
    { id: 304, name: "Dani Carvajal", pos: "DEF", pac: 80, sho: 50, pas: 80, def: 82, phy: 80, rep: 800, priceBasic: 20000000, pricePrem: 1500, img: "https://pbs.twimg.com/media/GSeKCF4XMAAILjg.jpg" },
    { id: 403, name: "Unai SimÃ³n", pos: "POR", sal: 82, par: 84, saq: 85, ref: 83, vel: 80, posi: 84, rep: 400, priceBasic: 12000000, pricePrem: 900, img: "https://assets.goal.com/images/v3/blt58f6b3a15aac644b/0b605ad106ff7459d79745dd71267d9de5783cb3.png?auto=webp&format=pjpg&width=3840&quality=60" },
    { id: 506, name: "Neymar", pos: "DEL", pac: 88, sho: 90, pas: 90, def: 40, phy: 80, rep: 5000, priceBasic: 135000000, pricePrem: 10500, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTaVXm4MJpY-0VUq-dOIU0Bhqa8kXb_0489Q&s" },
    { id: 507, name: "Luis Suarez", pos: "DEL", pac: 85, sho: 88, pas: 85, def: 50, phy: 85, rep: 5000, priceBasic: 130000000, pricePrem: 10000, img: "https://i.pinimg.com/736x/37/04/b0/3704b045926c5754515afcb51bc5cb37.jpg" },
    { id: 106, name: "Joselu", pos: "DEL", pac: 65, sho: 82, pas: 68, def: 40, phy: 82, rep: 800, priceBasic: 5000000, pricePrem: 400, img: "https://estaticos-cdn.prensaiberica.es/clip/916e8357-aa8e-450f-95d7-0fd46b11ccf1_source-aspect-ratio_default_0.jpg" },
    { id: 107, name: "Borja Iglesias", pos: "DEL", pac: 60, sho: 80, pas: 65, def: 35, phy: 85, rep: 500, priceBasic: 4000000, pricePrem: 300, img: "https://static.eldiario.es/clip/dc7c24bc-4e9b-46fa-b0d7-bd9080e2986a_16-9-discover-aspect-ratio_default_1134172.jpg" },
    { id: 108, name: "Hugo Duro", pos: "DEL", pac: 75, sho: 75, pas: 65, def: 40, phy: 75, rep: 500, priceBasic: 3000000, pricePrem: 200, img: "https://image.ondacero.es/clipping/cmsimages02/2024/01/23/BA3CE66A-7976-4522-95D4-3B094E6A5BCB/hugo-duro_103.jpg?crop=600,450,x137,y0&width=1200&height=900&optimize=low&format=webply" },
    { id: 204, name: "Sergi Darder", pos: "MED", pac: 68, sho: 75, pas: 80, def: 70, phy: 70, rep: 600, priceBasic: 4000000, pricePrem: 300, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyOd-ScVKgWFmy4Uwuf5Q20jDrEOFvmHi4w&s" },
    { id: 205, name: "Isco AlarcÃ³n", pos: "MED", pac: 62, sho: 78, pas: 85, def: 45, phy: 60, rep: 700, priceBasic: 5000000, pricePrem: 400, img: "https://www.mundodeportivo.com/files/og_thumbnail/uploads/2021/01/20/60e70648d9fe5.jpeg" },
    { id: 206, name: "Pepelu", pos: "MED", pac: 60, sho: 65, pas: 78, def: 75, phy: 75, rep: 600, priceBasic: 2500000, pricePrem: 150, img: "https://www.valenciacf.com/public/Image/2023/12/nr30b5l0gsuquemyeyxbqsuc2g74drmjrmwvgont4jasseos8edirodhdhuwssn8.jpg" },
    { id: 207, name: "Ã“scar Trejo", pos: "MED", pac: 65, sho: 70, pas: 78, def: 50, phy: 60, rep: 500, priceBasic: 1500000, pricePrem: 100, img: "https://killerasturias.com/sites/default/files/2021-12/trejo.jpeg" },
    { id: 305, name: "Pau CubarsÃ­", pos: "DEF", pac: 75, sho: 40, pas: 78, def: 80, phy: 75, rep: 800, priceBasic: 8000000, pricePrem: 600, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHJk1Gw8cjNu4w5mlv3kCZFNJi3wZhCeMj8g&s" },
    { id: 306, name: "David GarcÃ­a", pos: "DEF", pac: 65, sho: 45, pas: 60, def: 82, phy: 85, rep: 400, priceBasic: 4500000, pricePrem: 350, img: "https://img.a.transfermarkt.technology/portrait/big/298589-1740664950.jpg?lm=1" },
    { id: 307, name: "Pablo Maffeo", pos: "DEF", pac: 82, sho: 55, pas: 70, def: 75, phy: 78, rep: 550, priceBasic: 2500000, pricePrem: 200, img: "https://i.pinimg.com/474x/16/3c/ff/163cffab021629302f8314665c2c1582.jpg" },
    { id: 308, name: "JesÃºs Navas", pos: "DEF", pac: 75, sho: 60, pas: 80, def: 70, phy: 60, rep: 600, priceBasic: 1500000, pricePrem: 100, img: "https://pbs.twimg.com/media/Fwgt6PSXwAEvYWv.jpg" },
    { id: 309, name: "Harry Maguire", pos: "DEF", pac: 48, sho: 50, pas: 65, def: 78, phy: 85, rep: 800, priceBasic: 2000000, pricePrem: 150, img: "https://pics.craiyon.com/2023-09-13/fd5957a5268b45d4b5b0640c78980701.webp" },
    { id: 404, name: "David Soria", pos: "POR", sal: 78, par: 82, saq: 76, ref: 81, vel: 79, posi: 84, rep: 650, priceBasic: 3000000, pricePrem: 200, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRE2H0vymmNHD9tmRyLPodRo7GwSRBne7pUg&s" },
    { id: 405, name: "P. Gazzaniga", pos: "POR", sal: 80, par: 83, saq: 78, ref: 82, vel: 79, posi: 84, rep: 400, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/736x/a3/97/b5/a397b5f830894abb925a36ae74652e35.jpg" },
    { id: 601, name: "Ximo Navarro", pos: "DEF", pac: 74, sho: 55, pas: 62, def: 70, phy: 72, rep: 400, priceBasic: 2000000, pricePrem: 150, img: "https://pbs.twimg.com/media/G61mZWUXMAAC_RV.jpg" },
    { id: 602, name: "Arnau Comas", pos: "DEF", pac: 68, sho: 34, pas: 55, def: 68, phy: 72, rep: 400, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTSykN3Bo3xa42HvnRRxbZTyCiUGkYYDBTGQ&s" },
    { id: 603, name: "Julian Alvarez", pos: "DEL", pac: 86, sho: 88, pas: 82, def: 58, phy: 80, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://fotos.perfil.com//2024/08/12/900/0/meme-julian-1852788.jpg" },
    { id: 604, name: "G. Donnarumma", pos: "POR", sal: 85, par: 89, saq: 82, ref: 90, vel: 84, posi: 92, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhXZqkSPTOqr5S0Vk7--yubJNZCF-SQU7vmg&s" },
    { id: 605, name: "David Raya", pos: "POR", sal: 90, par: 86, saq: 89, ref: 85, vel: 84, posi: 88, rep: 1000, priceBasic: 2000000, pricePrem: 150, img: "https://pbs.twimg.com/media/GxRQV1cXIAMBRVr.jpg" },
    { id: 606, name: "Dibu Martinez", pos: "POR", sal: 86, par: 92, saq: 84, ref: 90, vel: 83, posi: 93, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://fastly.restofworld.org/uploads/2023/04/Meme-2-scaled.jpg?width=800&dpr=2&crop=16:9" },
    { id: 607, name: "Diogo Costa", pos: "POR", sal: 84, par: 87, saq: 82, ref: 86, vel: 83, posi: 88, rep: 1700, priceBasic: 2000000, pricePrem: 150, img: "https://img.iol.pt/image/id/66846a39d34ebf9bbb3f59cc/" },
    { id: 608, name: "Iker Casillas", pos: "POR", sal: 89, par: 93, saq: 82, ref: 95, vel: 90, posi: 97, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/736x/6d/b3/50/6db3509b016a26789e3825a9da183acf.jpg" },
    { id: 609, name: "Buffon", pos: "POR", sal: 90, par: 95, saq: 84, ref: 93, vel: 87, posi: 97, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCawnsEmsDOD-7UAN_XKWACheyi7RCdPT8yg&s" },
    { id: 610, name: "D. Maradona", pos: "MED", pac: 92, sho: 96, pas: 97, def: 42, phy: 75, rep: 5000, priceBasic: 2000000, pricePrem: 150, img: "https://images3.memedroid.com/images/UPLOADED166/5fbe899a8ba4c.jpeg" },
    { id: 611, name: "Pele", pos: "DEL", pac: 96, sho: 96, pas: 94, def: 60, phy: 78, rep: 5000, priceBasic: 2000000, pricePrem: 150, img: "https://imgcdn.stablediffusionweb.com/2024/11/15/1c9b5037-d3ff-4163-8105-b6db827f44a8.jpg" },
    { id: 612, name: "Samuel Eto'o", pos: "DEL", pac: 94, sho: 92, pas: 82, def: 45, phy: 80, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAB-RUzgcKTmaQGj0GSU2Pfoo4TcLgLpBqLQ&s" },
    { id: 613, name: "A. Hakimi", pos: "DEF", pac: 91, sho: 76, pas: 80, def: 78, phy: 79, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://pbs.twimg.com/media/FH3edrtWYAYX_zZ.jpg" },
    { id: 614, name: "M. Cucurella", pos: "DEF", pac: 82, sho: 64, pas: 75, def: 78, phy: 76, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXD9oA8nNKRBVPEXqWMJFM1bB_Seuplqw7xA&s" },
    { id: 615, name: "Nuno Mendes", pos: "DEF", pac: 88, sho: 70, pas: 77, def: 79, phy: 78, rep: 3500, priceBasic: 2000000, pricePrem: 150, img: "https://www.francebleu.fr/pikapi/images/cb910f4d-158e-474c-939c-18dc563d5e15/1200x680?webp=false" },
    { id: 616, name: "Pedro Porro", pos: "DEF", pac: 85, sho: 72, pas: 78, def: 75, phy: 74, rep: 1000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJmvlEqLdo_RCce7P8HotGGl_WC5wvjVtq5A&s" },
    { id: 617, name: "Willian Pancho", pos: "DEF", pac: 76, sho: 40, pas: 62, def: 82, phy: 83, rep: 800, priceBasic: 2000000, pricePrem: 150, img: "https://img.a.transfermarkt.technology/portrait/big/661171-1696508666.jpg?lm=1" },
    { id: 618, name: "Vitinha", pos: "MED", pac: 82, sho: 74, pas: 86, def: 74, phy: 70, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCT13H1TMBGYJ1rMl_35jZqUxr3o_PmmDn0g&s" },
    { id: 619, name: "M. Merino", pos: "MED", pac: 71, sho: 78, pas: 82, def: 82, phy: 84, rep: 1000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5_1m1nTPpKD11pwCMHAqWn6zesv7iup5YAg&s" },
    { id: 620, name: "B. Fernandes", pos: "MED", pac: 75, sho: 86, pas: 89, def: 66, phy: 74, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1pNq4eEDxBqaqFjtuBRtdzaWT-NHWWsau2Q&s" },
    { id: 621, name: "E. Fernandez", pos: "MED", pac: 74, sho: 74, pas: 85, def: 80, phy: 78, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThu830lfg-Hvon71p40_8eLFLN5X4QhCkD9w&s" },
    { id: 622, name: "D. Rice", pos: "MED", pac: 72, sho: 72, pas: 82, def: 87, phy: 86, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShw-iupY_AGXerLPmfcy1bJcrOk-SDYGXRbw&s" },
    { id: 623, name: "Lamine Yamal", pos: "DEL", pac: 90, sho: 80, pas: 82, def: 40, phy: 60, rep: 0, priceBasic: 2000000, pricePrem: 150, img: "https://www.ole.us/2025/10/26/3hcMxXdOM_720x0__1.jpg" },
    { id: 624, name: "Raphinha", pos: "DEL", pac: 88, sho: 82, pas: 80, def: 48, phy: 70, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxwmPw0vkp_b51TfFMkfTn3mCC82APOp42iw&s" },
    { id: 625, name: "M. Salah", pos: "DEL", pac: 89, sho: 88, pas: 86, def: 45, phy: 76, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgFt3Vsmv0QAT3X_BOT1_zNjHetnPPF7p1dA&s" },
    { id: 626, name: "H. Kane", pos: "DEL", pac: 65, sho: 93, pas: 84, def: 49, phy: 82, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ5uQoutLKwD97-lw0wm-p_2ZmSSsAYudeHA&s" },
    { id: 627, name: "E. Haaland", pos: "DEL", pac: 88, sho: 92, pas: 70, def: 45, phy: 88, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/736x/36/0f/24/360f24adf34c1bedcf2a29e8e85788e7.jpg" },
    { id: 628, name: "Lautaro", pos: "DEL", pac: 83, sho: 89, pas: 78, def: 50, phy: 85, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-PXpk7GSC6rXrdXJDrPpMqQhhu4o1GtQGCQ&s" },
    { id: 629, name: "K. Kvaratskhelia", pos: "DEL", pac: 89, sho: 84, pas: 82, def: 45, phy: 72, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://witty-images.s3.amazonaws.com/Z/G/K/703ef693-1f62-4f29-b6da-4da53fb29981-board.jpg" },
    { id: 630, name: "DÃ©sirÃ© DouÃ©", pos: "DEL", pac: 88, sho: 80, pas: 78, def: 50, phy: 74, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://media.tenor.com/tSFkSorTlbUAAAAe/dou%C3%A9-d%C3%A9sir%C3%A9.png" },
    { id: 631, name: "Falcao", pos: "DEL", pac: 82, sho: 94, pas: 72, def: 40, phy: 86, rep: 800, priceBasic: 2000000, pricePrem: 150, img: "https://pbs.twimg.com/media/F57dq38WMAAEmcj.jpg" },
    { id: 632, name: "Benzema", pos: "DEL", pac: 82, sho: 92, pas: 87, def: 45, phy: 82, rep: 1000, priceBasic: 2000000, pricePrem: 150, img: "https://media.tycsports.com/files/2022/03/09/400134/benzema-meme-residente-_862x485.jpg?v=1" },
    { id: 633, name: "G. Bale", pos: "DEL", pac: 95, sho: 91, pas: 85, def: 62, phy: 86, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/736x/e9/ff/49/e9ff49d248ac43b973451802b01093c0.jpg" },
    { id: 634, name: "Lewandowski", pos: "DEL", pac: 75, sho: 88, pas: 79, def: 44, phy: 84, rep: 3500, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/474x/3f/74/d0/3f74d078c7086bddeba9780da7ed550a.jpg" },
    { id: 635, name: "SzczÄ™sny", pos: "POR", sal: 86, par: 89, saq: 83, ref: 88, vel: 84, posi: 92, rep: 5000, priceBasic: 2000000, pricePrem: 150, img: "https://www.diez.hn/binrepository/465x444/0c0/0d0/none/3014757/VVNE/screenshot-20250305-152209_10084737_20250305165700.jpg" },
    { id: 636, name: "Rodri", pos: "MED", pac: 66, sho: 80, pas: 86, def: 87, phy: 85, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://s1.abcstatics.com/abc/www/multimedia/gente/2024/06/15/rodri-espana-kYNG-U603206132602BCB-1024x512@diario_abc.jpg" },
    { id: 637, name: "O. DembÃ©lÃ©", pos: "DEL", pac: 92, sho: 84, pas: 80, def: 45, phy: 65, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://i.ytimg.com/vi/JFp4iIMjnXk/oardefault.jpg?sqp=-oaymwEiCJwEENAFSFqQAgHyq4qpAxEIARUAAAAAJQAAyEI9AICiQw==&rs=AOn4CLCCQbFaofMRWdfxkdBUpu4KCDzNRA&usqp=CCk" },
    { id: 638, name: "Kepa", pos: "POR", sal: 82, par: 83, saq: 80, ref: 82, vel: 81, posi: 84, rep: 800, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/736x/09/6a/b1/096ab18fd2ee6cd6b22dadb3a067d9ae.jpg" },
    { id: 639, name: "J. Musiala", pos: "MED", pac: 88, sho: 83, pas: 86, def: 62, phy: 70, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://pics.craiyon.com/2023-09-19/999ca101a2a64d088ca1cbef7e92a44b.webp" },
    { id: 640, name: "A. Mac Allister", pos: "MED", pac: 74, sho: 80, pas: 86, def: 72, phy: 78, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://media.themoviedb.org/t/p/w235_and_h235_face/yWz8WZejSBD6u6YZwEB4srTKIXB.jpg" },
    { id: 641, name: "F. Valverde", pos: "MED", pac: 88, sho: 82, pas: 84, def: 80, phy: 82, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://i.redd.it/0tyxnnjccfq81.png" },
    { id: 642, name: "J. Kimmich", pos: "MED", pac: 70, sho: 76, pas: 88, def: 87, phy: 79, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/20180602_FIFA_Friendly_Match_Austria_vs._Germany_Joshua_Kimmich_850_0717.jpg/960px-20180602_FIFA_Friendly_Match_Austria_vs._Germany_Joshua_Kimmich_850_0717.jpg" },
    { id: 643, name: "N. Barella", pos: "MED", pac: 81, sho: 78, pas: 84, def: 83, phy: 80, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://sempreinter.com/wp-content/uploads/2021/10/Nicolo-Barella-3-1-scaled-e1633615982244.jpg" },
    { id: 644, name: "Marquinhos", pos: "DEF", pac: 79, sho: 56, pas: 74, def: 88, phy: 82, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCshNm3OJ3zVFJV6peJeERZjQAH2h_tfJa-Q&s" },
    { id: 645, name: "P. Foden", pos: "MED", pac: 86, sho: 86, pas: 85, def: 57, phy: 63, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/originals/30/8b/84/308b846c2e56ef02f9b18696256cc99e.jpg" },
    { id: 646, name: "C. Palmer", pos: "MED", pac: 79, sho: 84, pas: 85, def: 55, phy: 65, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://i.kym-cdn.com/photos/images/newsfeed/002/838/629/39b.jpg" },
    { id: 647, name: "G. Rodrygo", pos: "DEL", pac: 91, sho: 83, pas: 81, def: 40, phy: 68, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://images.meme-arsenal.com/d907b94d69c2ab52af28b044525c2111.jpg" },
    { id: 648, name: "N. Williams", pos: "DEL", pac: 94, sho: 79, pas: 77, def: 40, phy: 65, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5YAsrMJ6pG4jOObFRxvCkqMXDKVpNmH5hSA&s" },
    { id: 649, name: "I. Williams", pos: "DEL", pac: 93, sho: 82, pas: 72, def: 45, phy: 80, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://pbs.twimg.com/media/FFjNDgrXwAUaFsi.jpg" },
    { id: 650, name: "R. LeÃ£o", pos: "DEL", pac: 94, sho: 85, pas: 78, def: 35, phy: 78, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://pbs.twimg.com/media/F3LB8dmXIAAfxwg.jpg" },
    { id: 651, name: "Mamardashvili", pos: "POR", sal: 83, par: 90, saq: 78, ref: 91, vel: 84, posi: 90, rep: 3500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzZ_d0xvOOYRimgMMepoOivPoYEmSCQ7dFDg&s" },
    { id: 652, name: "F. de Jong", pos: "MED", pac: 82, sho: 72, pas: 88, def: 80, phy: 78, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://e00-marca.uecdn.es/assets/multimedia/imagenes/2022/09/23/16639478284639.jpg" },
    { id: 653, name: "Sergio Ramos", pos: "DEF", pac: 78, sho: 70, pas: 75, def: 90, phy: 88, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2n297NFs8qOJeCSars9pa81ZkOrHc-pniKg&s" },
    { id: 654, name: "Varane", pos: "DEF", pac: 84, sho: 49, pas: 68, def: 89, phy: 84, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://pbs.twimg.com/profile_images/1426617019928129537/Hq5_AcCB_400x400.jpg" },
    { id: 655, name: "Puyol", pos: "DEF", pac: 72, sho: 50, pas: 65, def: 92, phy: 88, rep: 5000, priceBasic: 2000000, pricePrem: 150, img: "https://www.rodneypikeart.com/wp-content/uploads/2017/06/Carles-Puyol-1024x768.jpg" },
    { id: 656, name: "Marcelo", pos: "DEF", pac: 83, sho: 75, pas: 84, def: 82, phy: 78, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://static.wikia.nocookie.net/memes-pedia/images/6/6a/Marselo.png/revision/latest?cb=20200108165346&path-prefix=es" },
    { id: 657, name: "Xavi Alonso", pos: "MED", pac: 65, sho: 78, pas: 92, def: 86, phy: 82, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://estaticos-cdn.prensaiberica.es/clip/bc2feed5-654c-41c7-b3fe-c272f4b34e89_alta-libre-aspect-ratio_default_0.jpg" },
    { id: 658, name: "Xavi Hernandez", pos: "MED", pac: 70, sho: 75, pas: 96, def: 83, phy: 73, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://phantom-marca.unidadeditorial.es/2bdef96b9027219076a397ae474ba34b/resize/640/assets/multimedia/imagenes/2023/04/27/16825702042066.jpg" },
    { id: 659, name: "Iniesta", pos: "MED", pac: 82, sho: 81, pas: 94, def: 72, phy: 68, rep: 5000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI9TnfBVTllJGY4zv9P6sezGHd0PHv2HQSsg&s" },
    { id: 660, name: "Ronaldo", pos: "DEL", pac: 96, sho: 96, pas: 90, def: 45, phy: 85, rep: 6000, priceBasic: 2000000, pricePrem: 150, img: "https://images.meme-arsenal.com/a4ef20509403920815bbf03d9eb0aa37.jpg" },
    { id: 661, name: "R. Carlos", pos: "DEF", pac: 92, sho: 82, pas: 86, def: 85, phy: 83, rep: 5000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Ne75q2lCt7jwRD5qduInCr1-y7as-9LllA&s" },
    { id: 662, name: "Casemiro", pos: "MED", pac: 60, sho: 75, pas: 80, def: 91, phy: 90, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG-RxJKaO-o1-0QYIshQ_6eHZC8j7oK-l90w&s" },
    { id: 663, name: "L. Modric", pos: "MED", pac: 76, sho: 80, pas: 92, def: 82, phy: 70, rep: 3500, priceBasic: 2000000, pricePrem: 150, img: "https://i.redd.it/tiny-lukita-modric-10-v0-1pmpht7peql81.jpg?width=1080&format=pjpg&auto=webp&s=d066323331a19f7c6d45835386f58fc6c576ce52" },
    { id: 664, name: "T. Kroos", pos: "MED", pac: 65, sho: 86, pas: 94, def: 78, phy: 74, rep: 3500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRGgkk2_6qgedwmN_EBqV9qI3MyfPf5PiJ_Q&s" },
    { id: 665, name: "S. Busquets", pos: "MED", pac: 58, sho: 70, pas: 88, def: 90, phy: 82, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe8BkkQGlAtcr2FFmWrFZYdsdksAFbAunnVA&s" },
    { id: 666, name: "Pique", pos: "DEF", pac: 67, sho: 61, pas: 74, def: 90, phy: 84, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4GCkYabKHAotXda3YmdbNY_rtkBQvcnWKfQ&s" },
    { id: 667, name: "Mascherano", pos: "DEF", pac: 72, sho: 64, pas: 78, def: 89, phy: 86, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Javier_Mascherano_NE_Revolution_Inter_Miami_7.9.25-040_%28cropped%29.jpg/330px-Javier_Mascherano_NE_Revolution_Inter_Miami_7.9.25-040_%28cropped%29.jpg" },
    { id: 668, name: "Dybala", pos: "DEL", pac: 82, sho: 84, pas: 85, def: 45, phy: 65, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn0mgIG9lOBdjb2v_MNS3Wsl1HtUI_YXZrYQ&s" },
    { id: 669, name: "Jordi Alba", pos: "DEF", pac: 90, sho: 69, pas: 82, def: 84, phy: 75, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUzYS01Drh0XErHlv_yaYphbhO22aW2th2nw&s-" },
    { id: 670, name: "Kun AgÃ¼ero", pos: "DEL", pac: 88, sho: 92, pas: 85, def: 40, phy: 78, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb9WAhXRvqZsH3Z9OXXS4kZxu5Jg09MB13qw&s" },
    { id: 671, name: "Ter Stegen", pos: "POR", sal: 91, par: 88, saq: 94, ref: 87, vel: 84, posi: 90, rep: 3500, priceBasic: 2000000, pricePrem: 150, img: "https://barcauniversal.com/wp-content/uploads/2025/08/fc-barcelona-v-ssc-napoli-round-of-16-second-leg-uefa-champions-league-2023-24-scaled.jpg" },
    { id: 672, name: "Joan Garcia", pos: "POR", sal: 79, par: 81, saq: 77, ref: 80, vel: 80, posi: 83, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfzQMiGiz4Wo3cnv-1PB4oIHgSOg_GNwDIzw&s" },
    { id: 673, name: "Godin", pos: "DEF", pac: 64, sho: 52, pas: 65, def: 90, phy: 87, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://media.themoviedb.org/t/p/w235_and_h235_face/gE5FVq48t1SIwOIwPtXwPWBCbBU.jpg" },
    { id: 674, name: "Filipe Luis", pos: "DEF", pac: 78, sho: 65, pas: 76, def: 84, phy: 79, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://img.a.transfermarkt.technology/portrait/big/21725-1447152742.jpg?lm=1" },
    { id: 675, name: "Koke", pos: "MED", pac: 70, sho: 75, pas: 85, def: 75, phy: 75, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://album.mediaset.es/eimg/2025/11/11/koke-okkkkjpg-jpg-16-9-aspect-ratio-default-0_da39.jpg" },
    { id: 676, name: "A. Correa", pos: "DEL", pac: 86, sho: 82, pas: 78, def: 45, phy: 70, rep: 1500, priceBasic: 2000000, pricePrem: 150, img: "https://media.tenor.com/N__bujihGRsAAAAe/angel-correa.png" },
    { id: 677, name: "Joao Felix", pos: "DEL", pac: 83, sho: 82, pas: 82, def: 40, phy: 68, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://phantom.estaticos-marca.com/dc91d80f711c73e0b796c35691b638b2/resize/828/f/jpg/assets/multimedia/imagenes/2023/09/19/16951604567922.jpg" },
    { id: 678, name: "De Paul", pos: "MED", pac: 75, sho: 78, pas: 84, def: 70, phy: 80, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://www.rosario3.com/__export/1684933220601/sites/rosario3/img/2023/05/24/rodrigo_de_paul_crop1684933129163.jpg_682626441.jpg" },
    { id: 679, name: "Carrasco", pos: "MED", pac: 88, sho: 80, pas: 78, def: 50, phy: 72, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://e00-marca.uecdn.es/assets/multimedia/imagenes/2023/08/04/16911571971081.jpg" },
    { id: 680, name: "Llorente", pos: "MED", pac: 88, sho: 82, pas: 80, def: 78, phy: 84, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://img.asmedia.epimg.net/resizer/v2/SOB3XOY3WRAERMRK3MJH7U7YFU.jpg?auth=ef732fc6e1d37995e68a1a1befdcdccd698270be953d1df424d96604f800e362&width=1200&height=1200&smart=true" },
    { id: 681, name: "Oblak", pos: "POR", sal: 84, par: 93, saq: 80, ref: 90, vel: 83, posi: 98, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://ctxt.es/images/cache/800x540/nocrop/images%7Ccms-image-000023026.jpg" },
    { id: 682, name: "Savic", pos: "DEF", pac: 62, sho: 40, pas: 60, def: 85, phy: 84, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://www.sportyou.es/blog/wp-content/uploads/2018/05/savic.jpg" },
    { id: 683, name: "P. Maldini", pos: "DEF", pac: 84, sho: 66, pas: 77, def: 95, phy: 88, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/474x/0a/3b/f5/0a3bf59885969a05c60c999faddd67d0.jpg" },
    { id: 684, name: "Yashin", pos: "POR", sal: 93, par: 95, saq: 86, ref: 96, vel: 90, posi: 98, rep: 4500, priceBasic: 2000000, pricePrem: 150, img: "https://www.panenka.org/wp-content/uploads/2021/08/Captura-de-pantalla-2021-08-30-a-las-10.31.42-768x432.png" },
    { id: 685, name: "Cafu", pos: "DEF", pac: 91, sho: 67, pas: 82, def: 90, phy: 86, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://objetos-xlk.estaticos-marca.com/uploads/2025/04/20/680536007f5c8.jpeg" },
    { id: 686, name: "J. Cruyff", pos: "DEL", pac: 91, sho: 92, pas: 94, def: 50, phy: 75, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/736x/a3/d1/39/a3d1398a01087c93146fd4676c0ef5fe.jpg" },
    { id: 687, name: "Victor Valdes", pos: "POR", sal: 90, par: 90, saq: 88, ref: 91, vel: 86, posi: 89, rep: 4500, priceBasic: 2000000, pricePrem: 150, img: "https://www.aupaathletic.com/comun/jugadores_fotos/foto_jugador-111.jpg" },
    { id: 688, name: "Di Stefano", pos: "DEL", pac: 90, sho: 93, pas: 90, def: 65, phy: 82, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://www.tiempoar.com.ar/wp-content/uploads/2024/07/Di-Stefano-como-jugador-en-el-Madrid-500x333.jpg" },
    { id: 689, name: "F. Hierro", pos: "DEF", pac: 70, sho: 76, pas: 78, def: 91, phy: 86, rep: 3500, priceBasic: 2000000, pricePrem: 150, img: "https://www.footballdatabase.eu/images/photos/players/1998-1999/a_0/380.jpg" },
    { id: 690, name: "Eusebio", pos: "DEL", pac: 94, sho: 96, pas: 90, def: 42, phy: 80, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://revistalibero.com/cdn/shop/articles/Eusebio.jpg?v=1638445765" },
    { id: 691, name: "Rooney", pos: "DEL", pac: 82, sho: 91, pas: 88, def: 55, phy: 88, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://pbs.twimg.com/media/CwC0-8cWAAYL-vH.jpg" },
    { id: 692, name: "A. di Maria", pos: "MED", pac: 91, sho: 86, pas: 89, def: 48, phy: 70, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNvI-TU1G0ikjlwyECWPURX8tdhE35JRp6Rg&s" },
    { id: 693, name: "Robben", pos: "DEL", pac: 93, sho: 92, pas: 88, def: 40, phy: 75, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://img.a.transfermarkt.technology/portrait/big/4360-1719545379.jpg?lm=1" },
    { id: 694, name: "Neuer", pos: "POR", sal: 96, par: 90, saq: 94, ref: 89, vel: 87, posi: 90, rep: 3500, priceBasic: 2000000, pricePrem: 150, img: "https://pbs.twimg.com/media/Gt7lBlbWYAAtHkU.jpg" },
    { id: 695, name: "R. Gonzalez", pos: "DEL", pac: 85, sho: 92, pas: 84, def: 45, phy: 78, rep: 4500, priceBasic: 2000000, pricePrem: 150, img: "https://fotografias.lasexta.com/clipping/cmsimages01/2020/08/11/6F67F8B9-58F1-469A-9D5B-ACC709494524/104.jpg?crop=500,500,x85,y0&width=1200&height=1200&optimize=low&format=webply" },
    { id: 696, name: "Roberto Baggio", pos: "DEL", pac: 88, sho: 92, pas: 94, def: 45, phy: 70, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfeFsDWdblOqe9jFlohT500ciFlAmwACd6oA&s" },
    { id: 697, name: "Thierry Henry", pos: "DEL", pac: 94, sho: 93, pas: 86, def: 50, phy: 82, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/736x/44/a9/e8/44a9e8e9984c0938dc703c9aa06b8967.jpg" },
    { id: 698, name: "Ronaldinho", pos: "MED", pac: 91, sho: 93, pas: 95, def: 50, phy: 80, rep: 6000, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCWZ8pH70yhFCCrH20IQhdx-522HpgLVxW5w&s" },
    { id: 699, name: "F. Puskas", pos: "DEL", pac: 90, sho: 96, pas: 88, def: 40, phy: 78, rep: 4500, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/736x/44/ad/48/44ad4874969ef11e7ecd1024f30a7699.jpg" },
    { id: 700, name: "KakÃ¡", pos: "MED", pac: 89, sho: 90, pas: 91, def: 60, phy: 75, rep: 3000, priceBasic: 2000000, pricePrem: 150, img: "https://media.printler.com/media/photo/145625-1.jpg?rmode=crop&width=638&height=900" },
    { id: 701, name: "Ibrahimovic", pos: "DEL", pac: 78, sho: 94, pas: 86, def: 40, phy: 90, rep: 4000, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/236x/d1/84/83/d18483dbf5325f469aa715d7d5242afb.jpg" },
    { id: 702, name: "F. Totti", pos: "DEL", pac: 75, sho: 91, pas: 92, def: 45, phy: 78, rep: 3500, priceBasic: 2000000, pricePrem: 150, img: "https://img.asmedia.epimg.net/resizer/v2/YXZXGY25YFLJXGLIPSQZMJYZAI.jpg?auth=b6a1ee2164a31bbaf7a7f31029bee76a62f93d1b735978cac1f0c657f9e947f9&width=1472&height=1104&smart=true" },
    { id: 703, name: "Gundogan", pos: "MED", pac: 69, sho: 80, pas: 88, def: 73, phy: 71, rep: 3500, priceBasic: 2000000, pricePrem: 150, img: "https://i.redd.it/i2ury833z4me1.jpeg" },
    { id: 704, name: "Camavinga", pos: "MED", pac: 78, sho: 70, pas: 80, def: 82, phy: 82, rep: 2000, priceBasic: 2000000, pricePrem: 150, img: "https://i.pinimg.com/474x/79/7f/60/797f60c83743e3fa97e68665309eb540.jpg" },
    { id: 705, name: "Grealish", pos: "MED", pac: 76, sho: 78, pas: 85, def: 50, phy: 70, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://media.bolavip.com/wp-content/uploads/sites/18/2024/06/07085826/GettyImages-2155984484-scaled-e1719767995850-714x535.webp" },
    { id: 706, name: "Endrick", pos: "DEL", pac: 88, sho: 83, pas: 70, def: 30, phy: 72, rep: 2500, priceBasic: 2000000, pricePrem: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB9gFTaAXauJ8L4rpJtwbpSg5UC4y4-8S-Nw&s" },
    { id: 707, name: "Guti", pos: "MED", pac: 70, sho: 84, pas: 91, def: 60, phy: 69, rep: 5000, priceBasic: 2000000, pricePrem: 150, img: "https://www.shutterstock.com/editorial/image-editorial/N1zeQe41NaTfgez9NzI3MA==/jose-maria-guti--real-madrid-captain-440nw-7436431bh.jpg" },
    { id: 708, name: "M. Soriano", pos: "MED", pac: 75, sho: 70, pas: 76, def: 55, phy: 60, rep: 500, priceBasic: 2000000, pricePrem: 150, img: "https://img.asmedia.epimg.net/resizer/v2/NZW5M7PSTNGHFDX3XVAOJ3VJZM.jpg?auth=46b53182d8d8c4f71e873ec2e7514488c43b1fc4072f0b11eaea7d705885fbd5&width=1200&height=1200&smart=true" },
    { id: 709, name: "JosÃ© Ãngel", pos: "MED", pac: 72, sho: 60, pas: 68, def: 74, phy: 72, rep: 500, priceBasic: 2000000, pricePrem: 150, img: "https://www.bdfutbol.com/i/j/401089h.jpg?v=1717578381" },
    { id: 710, name: "Mella", pos: "DEL", pac: 85, sho: 65, pas: 65, def: 40, phy: 60, rep: 500, priceBasic: 2000000, pricePrem: 150, img: "https://assets.laliga.com/squad/2025/t180/p554651/2048x2225/p554651_t180_2025_1_001_000.png" },
    { id: 711, name: "Luismi Cruz", pos: "DEL", pac: 82, sho: 68, pas: 66, def: 38, phy: 62, rep: 500, priceBasic: 2000000, pricePrem: 150, img: "https://img.a.transfermarkt.technology/portrait/big/610461-1647594517.jpg?lm=1" },
];

// === COMPETITIVE RANK CONSTANTS & LOGIC ===
const RANK_NAMES = [
    'Novato', 'Principiante', 'Amateur', 'Intermedio',
    'Avanzado', 'Pro', 'Maestro', 'Leyenda', 'Top Global'
];

function getRankIndex(rankName) {
    return RANK_NAMES.indexOf(rankName);
}

function calculateRankPoints(currentRank, currentSubrank, matchResult) {
    const rankIdx = getRankIndex(currentRank);
    let ptsChange = 0;

    if (matchResult === 'win') {
        // Asymmetric logic: lower ranks gain more points, higher ranks gain fewer
        if (rankIdx <= 1) ptsChange = 30; // Novato, Principiante
        else if (rankIdx <= 3) ptsChange = 25; // Amateur, Intermedio
        else if (rankIdx <= 5) ptsChange = 20; // Avanzado, Pro
        else if (rankIdx <= 7) ptsChange = 15; // Maestro, Leyenda
        else ptsChange = 10; // Top Global
    }
    else if (matchResult === 'draw') {
        if (rankIdx <= 2) ptsChange = 10;
        else if (rankIdx <= 5) ptsChange = 5;
        else if (rankIdx <= 7) ptsChange = 0;
        else ptsChange = -5; // Top Global gets penalized slightly for draws
    }
    else { // loss
        // Asymmetric logic: lower ranks lose fewer points, higher ranks lose more
        if (rankIdx === 0) ptsChange = -5; // Novato
        else if (rankIdx <= 2) ptsChange = -10; // Principiante, Amateur
        else if (rankIdx <= 4) ptsChange = -15; // Intermedio, Avanzado
        else if (rankIdx <= 6) ptsChange = -20; // Pro, Maestro
        else ptsChange = -25; // Leyenda, Top Global
    }

    return ptsChange;
}

function processRankUpdate(state, ptsChange) {
    let comp = state.competitive;
    if (!comp) return;

    comp.points += ptsChange;

    // Promotion logic (100 pts to next subrank)
    if (comp.points >= 100) {
        if (comp.subrank < 3) {
            comp.subrank++;
            comp.points -= 100;
        } else {
            // Next Rank!
            const nextRankIdx = getRankIndex(comp.rank) + 1;
            if (nextRankIdx < RANK_NAMES.length) {
                comp.rank = RANK_NAMES[nextRankIdx];
                comp.subrank = 1;
                comp.points -= 100;
            } else {
                // Max rank reached, cap points
                comp.points = 100;
            }
        }
    }
    // Demotion logic
    else if (comp.points < 0) {
        if (comp.subrank > 1) {
            comp.subrank--;
            comp.points += 100;
        } else {
            const prevRankIdx = getRankIndex(comp.rank) - 1;
            // Never drop below Novato I
            if (prevRankIdx >= 0) {
                comp.rank = RANK_NAMES[prevRankIdx];
                comp.subrank = 3;
                comp.points += 100;
            } else {
                comp.points = 0; // Hard cap at Novato I (0 points)
            }
        }
    }
}

function calcPlayerOVR(p) {
    let ovr = 50;
    if (p.pos === 'DEL') {
        const score = (p.pac * 0.15) + (p.sho * 0.40) + (p.pas * 0.30) + (p.phy * 0.15) + 5;
        ovr = Math.round(score);
    } else if (p.pos === 'MED') {
        const attScore = (p.pas * 0.40) + (p.sho * 0.30) + (p.pac * 0.15) + (p.phy * 0.15) + 6;
        const defScore = (p.pas * 0.30) + (p.def * 0.45) + (p.phy * 0.15) + (p.pac * 0.10) + 6;
        ovr = Math.round(Math.max(attScore, defScore));
    } else if (p.pos === 'DEF') {
        const cbScore = (p.def * 0.55) + (p.phy * 0.25) + (p.pac * 0.15) + (p.pas * 0.05) + 2;
        const fbScore = (p.pac * 0.35) + (p.def * 0.30) + (p.pas * 0.20) + (p.phy * 0.15) + 2;
        ovr = Math.round(Math.max(cbScore, fbScore));
    } else if (p.pos === 'POR') {
        // Stats de portero: SAL, PAR, SAQ, REF, VEL, POS
        const score = (p.sal + p.par + p.saq + p.ref + p.vel + p.posi) / 6;
        ovr = Math.round(score);
    }
    return Math.max(50, Math.min(99, ovr)); // Limitar entre 50 y 99
}

// Calcular precios dinÃ¡micamente en base a su OVR (calidad) y reputaciÃ³n
PLAYERS_DB.forEach(p => {
    const ovr = calcPlayerOVR(p);
    let basePrice, premPrice;

    // Curva de precios exponencial por OVR
    if (ovr >= 93) { basePrice = 200000000; premPrice = 15000; }
    else if (ovr >= 90) { basePrice = 100000000 + (ovr - 90) * 30000000; premPrice = 9000 + (ovr - 90) * 2000; }
    else if (ovr >= 85) { basePrice = 40000000 + (ovr - 85) * 12000000; premPrice = 4000 + (ovr - 85) * 1000; }
    else if (ovr >= 80) { basePrice = 12000000 + (ovr - 80) * 5600000; premPrice = 1500 + (ovr - 80) * 500; }
    else if (ovr >= 75) { basePrice = 4000000 + (ovr - 75) * 1600000; premPrice = 500 + (ovr - 75) * 200; }
    else if (ovr >= 70) { basePrice = 1500000 + (ovr - 70) * 500000; premPrice = 150 + (ovr - 70) * 70; }
    else { basePrice = 500000 + Math.max(0, ovr - 60) * 100000; premPrice = 50 + Math.max(0, ovr - 60) * 10; }

    // Multiplicador de reputaciÃ³n
    let repMultiplier = 1.0;
    if (p.rep >= 5000) repMultiplier = 2.5;
    else if (p.rep >= 4000) repMultiplier = 2.0;
    else if (p.rep >= 3000) repMultiplier = 1.6;
    else if (p.rep >= 2000) repMultiplier = 1.3;
    else if (p.rep >= 800) repMultiplier = 1.15;
    else if (p.rep >= 400) repMultiplier = 1.05;

    p.priceBasic = Math.round(basePrice * repMultiplier);
    p.pricePrem = Math.round(premPrice * repMultiplier);
});

// Inicializar DB 
PLAYERS_DB.forEach(p => {
    p.ovr = calcPlayerOVR(p);
    p.morale = 100;
    p.con = 100;
    p.injuryMatches = 0;
});

/* =========================================================================
   EQUIPOS IA (LA LIGA TUSSI)
   ========================================================================= */
const AI_TEAMS = [
    { name: "Madrid Kings", ovr: 88, c1: "#ffffff", c2: "#e2e8f0", shape: "shape-shield" },
    { name: "Catalunya AC", ovr: 87, c1: "#b91c1c", c2: "#1d4ed8", shape: "shape-shield" },
    { name: "Atletico Titan", ovr: 85, c1: "#ef4444", c2: "#ffffff", shape: "shape-circle" },
    { name: "Basque Lions", ovr: 82, c1: "#dc2626", c2: "#ffffff", shape: "shape-hexagon" },
    { name: "Sevilla Sur", ovr: 80, c1: "#ffffff", c2: "#dc2626", shape: "shape-shield" },
    { name: "Valencia Bats", ovr: 78, c1: "#ffffff", c2: "#0f172a", shape: "shape-circle" },
    { name: "Galicia CF", ovr: 76, c1: "#60a5fa", c2: "#ffffff", shape: "shape-shield" },
    { name: "Betis Norte", ovr: 75, c1: "#16a34a", c2: "#ffffff", shape: "shape-circle" },
    { name: "Villarreal Sun", ovr: 74, c1: "#eab308", c2: "#ca8a04", shape: "shape-shield" },
    { name: "Real Sebastian", ovr: 73, c1: "#1d4ed8", c2: "#ffffff", shape: "shape-circle" },
    { name: "Celta Sky", ovr: 71, c1: "#93c5fd", c2: "#ffffff", shape: "shape-shield" },
    { name: "Mallorca Red", ovr: 70, c1: "#ef4444", c2: "#0f172a", shape: "shape-hexagon" },
    { name: "Osasuna Bulls", ovr: 68, c1: "#991b1b", c2: "#1e293b", shape: "shape-shield" },
    { name: "Alaves Blue", ovr: 67, c1: "#1e3a8a", c2: "#ffffff", shape: "shape-circle" },
    { name: "Rayo Thunder", ovr: 66, c1: "#ffffff", c2: "#dc2626", shape: "shape-shield" },
    { name: "Getafe Light", ovr: 65, c1: "#2563eb", c2: "#1e40af", shape: "shape-circle" },
    { name: "Las Palmas FC", ovr: 64, c1: "#fde047", c2: "#1e293b", shape: "shape-shield" },
    { name: "Granada City", ovr: 63, c1: "#b91c1c", c2: "#ffffff", shape: "shape-hexagon" },
    { name: "Cadiz Yellows", ovr: 62, c1: "#facc15", c2: "#1e3a8a", shape: "shape-shield" }
];

function initLeague() {
    let league = [{ name: state.team.name, isUser: true, pld: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }];
    AI_TEAMS.forEach(ai => league.push({ name: ai.name, isUser: false, ovr: ai.ovr, pld: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, badge: ai }));
    return league;
}

/* =========================================================================
   SISTEMA DE ALERTAS Y SEGURIDAD DOM
   ========================================================================= */
window.showAlert = function (msg) {
    const alertModal = document.getElementById('custom-alert');
    if (alertModal) {
        document.getElementById('alert-message').textContent = msg;
        alertModal.classList.remove('hidden');
    } else {
        alert(msg); // Fallback por si falta el HTML
    }
}
window.closeAlert = function () {
    const alertModal = document.getElementById('custom-alert');
    if (alertModal) alertModal.classList.add('hidden');
}

let confirmCallback = null;
window.showConfirm = function (msg, callback) {
    const confirmModal = document.getElementById('custom-confirm');
    if (confirmModal) {
        document.getElementById('confirm-message').textContent = msg;
        confirmCallback = callback;
        confirmModal.classList.remove('hidden');
    } else {
        if (confirm(msg)) callback(); // Fallback por si falta el HTML
    }
}
window.closeConfirm = function (result) {
    const confirmModal = document.getElementById('custom-confirm');
    if (confirmModal) confirmModal.classList.add('hidden');
    if (result && confirmCallback) confirmCallback();
}

/* =========================================================================
   SISTEMA DE LIMPIEZA DE NaNs (VITAL PARA CUENTAS ANTIGUAS)
   ========================================================================= */
let state = null;

/* Genera una plantilla inicial aleatoria: 1 POR, 4 DEF, 3 MED, 3 DEL (de jugadores base, rep=0) */
function generateRandomInitialRoster() {
    const basePlayers = PLAYERS_DB.filter(p => p.rep <= 800);
    const byPos = { POR: [], DEF: [], MED: [], DEL: [] };
    basePlayers.forEach(p => { if (byPos[p.pos]) byPos[p.pos].push(p); });

    // Mezclar cada pool aleatoriamente (Fisher-Yates)
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    shuffle(byPos.POR); shuffle(byPos.DEF); shuffle(byPos.MED); shuffle(byPos.DEL);

    const picked = [
        ...byPos.POR.slice(0, 1),
        ...byPos.DEF.slice(0, 4),
        ...byPos.MED.slice(0, 3),
        ...byPos.DEL.slice(0, 3)
    ];

    return picked.map(p => JSON.parse(JSON.stringify(p)));
}

function cleanState(s) {
    if (!s) return null;

    // Convertir todo a nÃºmeros seguros para borrar los NaNs
    if (!s.stats) s.stats = {};
    s.stats.wins = isNaN(parseInt(s.stats.wins)) ? 0 : parseInt(s.stats.wins);
    s.stats.draws = isNaN(parseInt(s.stats.draws)) ? 0 : parseInt(s.stats.draws);
    s.stats.losses = isNaN(parseInt(s.stats.losses)) ? 0 : parseInt(s.stats.losses);
    s.stats.matches = isNaN(parseInt(s.stats.matches)) ? 0 : parseInt(s.stats.matches);
    s.stats.rep = isNaN(parseInt(s.stats.rep)) ? 0 : parseInt(s.stats.rep);
    s.stats.matchday = isNaN(parseInt(s.stats.matchday)) ? 1 : Math.max(1, parseInt(s.stats.matchday));
    s.stats.goals = isNaN(parseInt(s.stats.goals)) ? 0 : parseInt(s.stats.goals);
    s.stats.trophies = isNaN(parseInt(s.stats.trophies)) ? 0 : parseInt(s.stats.trophies);

    // EconomÃ­a
    if (!s.economy) s.economy = { coins: 50000000, premium: 0 };
    if (isNaN(parseInt(s.economy.coins))) s.economy.coins = 50000000;
    if (isNaN(parseInt(s.economy.premium))) s.economy.premium = 0;

    // Liga y Equipos IA
    if (!s.league || s.league.length < 20) {
        s.league = [{ name: s.team ? s.team.name : "TÃº", isUser: true, pld: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }];
        AI_TEAMS.forEach(ai => s.league.push({ name: ai.name, isUser: false, ovr: ai.ovr, pld: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, badge: ai }));
    } else {
        s.league.forEach(t => { if (!t.isUser && !t.badge) t.badge = AI_TEAMS.find(a => a.name === t.name) || AI_TEAMS[0]; });
    }

    if (!s.flags) s.flags = { canTrain: true, canTalk: true };
    if (!s.settings) s.settings = { volMusic: 0.05, volSfx: 0.5 };
    if (!s.playedTeams || !Array.isArray(s.playedTeams)) s.playedTeams = [];
    if (!s.history) s.history = {};
    if (!s.activeBets) s.activeBets = [];
    if (!s.betHistory) s.betHistory = [];
    if (!s.pvpStats) s.pvpStats = { matches: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0 };
    if (!s.nextFixtures) s.nextFixtures = [];
    if (!s.friends) s.friends = [];
    if (!s.friendRequests) s.friendRequests = [];

    // Sistema Competitivo
    if (!s.competitive) {
        s.competitive = {
            rank: 'Novato',
            subrank: 1, // 1 a 3 (I, II, III). 1 = Novato I, 2 = Novato II, etc.
            points: 0,
            history: [] // Historial de partidos
        };
    }

    // Plantilla a prueba de errores
    if (!s.roster || s.roster.length < 11) {
        const randomRoster = generateRandomInitialRoster();
        s.roster = randomRoster;
    }
    s.roster.forEach(p => {
        if (p.con === undefined) p.con = 100;
        if (p.morale === undefined) p.morale = 100;
        if (p.injuryMatches === undefined) p.injuryMatches = 0;
    });

    if (!s.lineup || s.lineup.length !== 11) s.lineup = s.roster.slice(0, 11).map(p => p.id);
    if (!s.formation) s.formation = '4-4-2';

    // Asegurar estructura del escudo del equipo de usuario
    if (s.team && !s.team.shape) {
        s.team.shape = "shape-shield";
        s.team.c1 = s.team.color || "#e11d48";
        s.team.c2 = "#1e293b";
    }
    if (s.team && !s.team.pattern) {
        s.team.pattern = "diagonal";
    }

    // Forzar creaciÃ³n de calendario si no lo hay
    if (s.team && s.nextFixtures.length === 0) {
        generateFixtures(s);
    }

    return s;
}

window.onload = () => {
    const cookiesModal = document.getElementById('modal-cookies');
    if (!localStorage.getItem('inafuma_cookies') && cookiesModal) cookiesModal.classList.remove('hidden');

    // Auto-resume music if cookies already accepted
    if (localStorage.getItem('inafuma_cookies')) {
        initBgMusic();
    }

    // Escuchar cambios de autenticaciÃ³n de Firebase
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const doc = await db.collection('users').doc(user.uid).get();
                if (doc.exists) {
                    state = cleanState(doc.data());
                    // Connect to PVP server immediately to support friend invites
                    if (!pvpSocket || !pvpSocket.connected) {
                        pvpSocket = io(PVP_SERVER_URL, { transports: ['websocket', 'polling'] });
                        pvpSocket.on('connect', () => {
                            pvpSocket.emit('register_user', { uid: user.uid, username: state.auth.user });
                            if (typeof setupPrivateMatchSocketEvents === 'function') setupPrivateMatchSocketEvents(pvpSocket);
                        });
                    } else {
                        pvpSocket.emit('register_user', { uid: user.uid, username: state.auth.user });
                    }
                }
            } catch (err) {
                console.error('Error al cargar estado desde Firestore:', err);
            }
        }
        routeView();
    });
};

function saveState() {
    if (!state) return;
    const user = auth.currentUser;
    if (user) {
        // Subir el estado completo a Firestore
        db.collection('users').doc(user.uid).set(JSON.parse(JSON.stringify(state)))
            .catch(err => console.error('Error al guardar en Firestore:', err));
    }
    updateUI();
}

window.acceptCookies = function () {
    localStorage.setItem('inafuma_cookies', 'true');
    const cookiesModal = document.getElementById('modal-cookies');
    if (cookiesModal) cookiesModal.classList.add('hidden');
    if (typeof initBgMusic === 'function') initBgMusic();
}

/* =========================================================================
   SISTEMA DE LOGIN, REGISTRO Y CLUB
   ========================================================================= */
window.toggleAuth = function (mode) {
    document.getElementById('login-form').classList.toggle('hidden', mode !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', mode !== 'register');

    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');

    if (tabLogin && tabReg) {
        tabLogin.className = mode === 'login' ? "flex-1 pb-2 text-white border-b-2 border-yellow-400 font-bold text-xs uppercase transition" : "flex-1 pb-2 text-sky-400 hover:text-white font-bold text-xs uppercase transition cursor-pointer";
        tabReg.className = mode === 'register' ? "flex-1 pb-2 text-white border-b-2 border-yellow-400 font-bold text-xs uppercase transition" : "flex-1 pb-2 text-sky-400 hover:text-white font-bold text-xs uppercase transition cursor-pointer";
    }
}

document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;
    const email = user + '@inafuma.com';

    auth.createUserWithEmailAndPassword(email, pass)
        .then((cred) => {
            state = cleanState({ auth: { user }, team: null, economy: { coins: 50000000, premium: 0 } });
            // Guardar estado inicial en Firestore
            db.collection('users').doc(cred.user.uid).set(JSON.parse(JSON.stringify(state)));
            initBgMusic();
            routeView();
        })
        .catch((err) => {
            if (err.code === 'auth/email-already-in-use') showAlert("El usuario ya existe.");
            else if (err.code === 'auth/weak-password') showAlert("La contraseÃ±a debe tener al menos 6 caracteres.");
            else showAlert("Error al registrar: " + err.message);
        });
});

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('log-user').value;
    const p = document.getElementById('log-pass').value;
    const email = u + '@inafuma.com';

    auth.signInWithEmailAndPassword(email, p)
        .then(async (cred) => {
            // Login exitoso â€” intentar descargar estado desde Firestore
            try {
                const doc = await db.collection('users').doc(cred.user.uid).get();
                if (doc.exists) {
                    state = cleanState(doc.data());
                } else {
                    // Si no existe documento (cuenta legacy), crear uno nuevo
                    state = cleanState({ auth: { user: u }, team: null, economy: { coins: 50000000, premium: 0 } });
                    db.collection('users').doc(cred.user.uid).set(JSON.parse(JSON.stringify(state))).catch(() => { });
                }
            } catch (firestoreErr) {
                console.error('Firestore no disponible, usando estado local:', firestoreErr);
                // Crear estado local si Firestore falla
                state = cleanState({ auth: { user: u }, team: null, economy: { coins: 50000000, premium: 0 } });
            }
            initBgMusic();
            routeView();
        })
        .catch((err) => {
            if (err.code === 'auth/user-not-found') showAlert("No existe ninguna cuenta con este usuario.");
            else if (err.code === 'auth/wrong-password') showAlert("ContraseÃ±a incorrecta.");
            else showAlert("Error al iniciar sesiÃ³n: " + err.message);
        });
});

// Creador Visual de Escudos (Seguro)
window.updatePreviewBadge = function () {
    const shapeEl = document.getElementById('set-shape');
    const c1El = document.getElementById('set-c1');
    const c2El = document.getElementById('set-c2');
    const badgeEl = document.getElementById('preview-badge');
    const nameEl = document.getElementById('set-team');
    const patternEl = document.getElementById('set-pattern');

    if (!badgeEl) return;

    const shape = shapeEl ? shapeEl.value : 'shape-shield';
    const c1 = c1El ? c1El.value : '#e11d48';
    const c2 = c2El ? c2El.value : '#1e293b';
    const name = nameEl ? nameEl.value : 'CLUB';
    const pattern = patternEl ? patternEl.value : 'diagonal';

    let bg = '';
    if (pattern === 'diagonal') bg = `linear-gradient(135deg, ${c1} 50%, ${c2} 50%)`;
    else if (pattern === 'vertical') bg = `linear-gradient(90deg, ${c1} 50%, ${c2} 50%)`;
    else if (pattern === 'horizontal') bg = `linear-gradient(180deg, ${c1} 50%, ${c2} 50%)`;
    else if (pattern === 'solid') bg = c1;
    else if (pattern === 'gradient') bg = `linear-gradient(180deg, ${c1}, ${c2})`;

    badgeEl.className = `w-24 h-28 club-badge text-sm shadow-lg ${shape}`;
    badgeEl.style.background = bg;
    badgeEl.innerHTML = name.substring(0, 4).toUpperCase();
}

const teamInput = document.getElementById('set-team');
if (teamInput) teamInput.addEventListener('input', updatePreviewBadge);

document.getElementById('setup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const shapeEl = document.getElementById('set-shape');
    const c1El = document.getElementById('set-c1');
    const c2El = document.getElementById('set-c2');

    state.team = {
        name: document.getElementById('set-team').value,
        manager: document.getElementById('set-manager').value,
        shape: shapeEl ? shapeEl.value : 'shape-shield',
        c1: c1El ? c1El.value : '#e11d48',
        c2: c2El ? c2El.value : '#1e293b',
        pattern: document.getElementById('set-pattern') ? document.getElementById('set-pattern').value : 'diagonal',
        icon: ''
    };
    state.league = initLeague();

    // Initialize empty roster â€” will be filled by starter pack
    state.roster = [];
    state.lineup = [];

    generateFixtures(state);

    if (!state.inbox) state.inbox = [];
    addEmail('Directiva', 'Bienvenido a LaLiga Tussi', `MÃ­ster ${state.team.manager}, la temporada consta de 38 jornadas (Ida y Vuelta). Abre tu sobre inicial para conocer a tu plantilla.`);
    initBgMusic();
    saveState();

    // Generate starter pack (14 players) and show reveal animation
    const starterCards = generateStarterPackCards();
    // Split into sobres of 4-4-4-2 for dramatic reveal (like 4 sobres: 4+4+4+2)
    const sobres = [];
    const bonuses = [];
    for (let i = 0; i < starterCards.length; i += 4) {
        sobres.push(starterCards.slice(i, i + 4));
        bonuses.push([]); // No bonuses for starter pack
    }

    startPackReveal(sobres, bonuses, true, function () {
        // After reveal complete, set lineup from roster
        // Pick the first 11 in position order: 1 POR, 4 DEF, 4 MED, 2 DEL
        const por = state.roster.filter(p => p.pos === 'POR').slice(0, 1);
        const def = state.roster.filter(p => p.pos === 'DEF').slice(0, 4);
        const med = state.roster.filter(p => p.pos === 'MED').slice(0, 4);
        const del = state.roster.filter(p => p.pos === 'DEL').slice(0, 2);
        const xi = [...por, ...def, ...med, ...del];
        state.lineup = xi.map(p => p.id);

        // Ensure we have 11
        if (state.lineup.length < 11) {
            const remaining = state.roster.filter(p => !state.lineup.includes(p.id));
            while (state.lineup.length < 11 && remaining.length > 0) {
                state.lineup.push(remaining.shift().id);
            }
        }

        saveState();
        routeView();
    });
});

window.logout = function () { auth.signOut().then(() => { state = null; location.reload(); }).catch(err => console.error('Error al cerrar sesiÃ³n:', err)); }

// Abrir Ajustes
window.openSettings = function () {
    const s = state.settings || { volMusic: 0.05, volSfx: 0.5 };
    const musicSlider = document.getElementById('setting-music');
    const sfxSlider = document.getElementById('setting-sfx');
    if (musicSlider) musicSlider.value = s.volMusic;
    if (sfxSlider) sfxSlider.value = s.volSfx;

    // Show speed control only during active match (local or PVP)
    const speedSection = document.getElementById('settings-sim-speed-section');
    if (speedSection) {
        const matchActive = !document.getElementById('match-modal').classList.contains('hidden')
            || !document.getElementById('pvp-match-modal').classList.contains('hidden');
        speedSection.classList.toggle('hidden', !matchActive);
    }
    // Sync slider value
    const speedSlider = document.getElementById('setting-sim-speed');
    if (speedSlider) speedSlider.value = simSpeedLevel;
    const speedLabel = document.getElementById('sim-speed-label');
    if (speedLabel) speedLabel.textContent = SIM_SPEED_LABELS[simSpeedLevel] || 'Normal';

    document.getElementById('modal-settings').classList.remove('hidden');
}

// Update Volume
window.updateVolume = function (type, val) {
    if (state) {
        if (!state.settings) state.settings = { volMusic: 0.05, volSfx: 0.5 };
        const volume = parseFloat(val);
        if (type === 'music') {
            state.settings.volMusic = volume;
        } else if (type === 'sfx') {
            state.settings.volSfx = volume;
        }
        saveState();
    }
    const volume = parseFloat(val);
    if (type === 'music') {
        const bgm = document.getElementById('bg-music');
        if (bgm) bgm.volume = volume;
    }
}
window.closeSettings = function () {
    document.getElementById('modal-settings').classList.add('hidden');
}

/* --- Simulation Speed Control --- */
const SIM_SPEED_MAP = { slow: 700, medium: 350, fast: 100 };
let simSpeedMs = 350;
let simSpeedLevel = 3;

window.updateSimSpeed = function (val) {
    simSpeedLevel = parseInt(val);
    simSpeedMs = { 1: 700, 2: 500, 3: 350, 4: 200, 5: 100 }[simSpeedLevel] || 350;
    // If a local match is running, restart the intervals with new speed
    if (matchState && matchState.interval) {
        clearInterval(matchState.interval);
        runMatchLoop(matchState._targetMinute || 90);
    }
    if (matchState && matchState.pitchInterval) {
        animatePitchTokens();
    }
}

window.toggleProfileMenu = function () { document.getElementById('profile-dropdown').classList.toggle('hidden'); }

window.showSubpage = function (id) {
    document.getElementById('page-' + id).classList.remove('hidden');
    if (id === 'settings') {
        const s = (state && state.settings) ? state.settings : { volMusic: 0.05, volSfx: 0.5 };
        const musicSlider = document.getElementById('setting-music');
        const sfxSlider = document.getElementById('setting-sfx');
        if (musicSlider) musicSlider.value = s.volMusic;
        if (sfxSlider) sfxSlider.value = s.volSfx;
    }
    if (id === 'stats') {
        document.getElementById('stat-goals').textContent = state.stats.goals;
        document.getElementById('stat-matches').textContent = state.stats.matches;
        document.getElementById('stat-trophies').textContent = state.stats.trophies;
        document.getElementById('stat-wins').textContent = state.stats.wins;
        document.getElementById('stat-draws').textContent = state.stats.draws;
        document.getElementById('stat-losses').textContent = state.stats.losses;
    }
    // Ranked
    if (document.getElementById('comp-rank-name')) {
        document.getElementById('comp-rank-name').textContent = `${state.competitive.rank} ${'I'.repeat(state.competitive.subrank)}`;
        document.getElementById('comp-rank-points-text').textContent = `${state.competitive.points} / 100 PTS`;
        document.getElementById('comp-rank-progress-bar').style.width = `${state.competitive.points}%`;

        const historyContainer = document.getElementById('comp-match-history');
        if (!state.competitive.history || state.competitive.history.length === 0) {
            historyContainer.innerHTML = `
            <div>
                <div class="text-3xl mb-2 opacity-50">âš½</div>
                AÃºn no has jugado partidos clasificatorios
            </div>`;
        } else {
            // Render actual history
            historyContainer.innerHTML = '';
            historyContainer.classList.remove('items-center', 'justify-center', 'text-slate-500'); // Remove empty state centering
            historyContainer.classList.add('space-y-4'); // better spacing for list

            state.competitive.history.forEach((match) => {
                const isWin = match.result === 'win';
                const isDraw = match.result === 'draw';

                let resultClass = 'text-red-400';
                let resultText = 'DERROTA';
                if (isWin) { resultClass = 'text-green-400'; resultText = 'VICTORIA'; }
                else if (isDraw) { resultClass = 'text-yellow-400'; resultText = 'EMPATE'; }

                const pointsSign = match.pointsChange > 0 ? '+' : '';
                const pointsClass = match.pointsChange > 0 ? 'text-green-500' : (match.pointsChange < 0 ? 'text-red-500' : 'text-slate-400');

                // Formatear fecha
                const d = new Date(match.date);
                const dateStr = `${d.getDate()}/${d.getMonth() + 1} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

                historyContainer.innerHTML += `
                    <div class="flex items-center justify-between p-3 bg-[#111119] rounded-lg border border-[#313145]">
                        <div class="flex items-center gap-4">
                            <div class="font-bold ${resultClass} text-xs w-20">${resultText}</div>
                            <div class="text-white font-gaming text-sm">${match.myGoals} - ${match.oppGoals}</div>
                            <div class="text-slate-400 text-xs truncate max-w-[120px] md:max-w-[200px]">vs ${match.opponentName}</div>
                        </div>
                        <div class="text-right flex flex-col items-end">
                            <div class="font-bold text-sm ${pointsClass}">${pointsSign}${match.pointsChange} PTS</div>
                            <div class="text-[10px] text-slate-500">${dateStr}</div>
                        </div>
                    </div>
                `;
            });
        }
    }
}
window.closeSubpage = function () { document.querySelectorAll('.subpage-container').forEach(el => el.classList.add('hidden')); }

function routeView() {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    if (!state) document.getElementById('view-landing').classList.remove('hidden');
    else if (!state.team) document.getElementById('view-setup').classList.remove('hidden');
    else {
        // Ir directamente al dashboard (modo local por defecto)
        currentGameMode = 'local';
        document.getElementById('app-layout').classList.remove('hidden');
        updateUI();
        const savedTab = localStorage.getItem('inafuma_active_tab') || 'dash';
        switchTab(savedTab);
    }
}

/* =========================================================================
   SELECCIÃ“N DE MODO DE JUEGO (LOCAL / MULTIJUGADOR)
   ========================================================================= */
let currentGameMode = null;
let pvpSocket = null;
let pvpRoomId = null;
let pvpSide = null; // 'home' o 'away'
let pvpMatchFinished = false;

window.showPlayModeSelect = function () {
    // Mostrar la pantalla de selecciÃ³n de modo al pulsar JUGAR
    document.getElementById('app-layout').classList.add('hidden');
    document.getElementById('view-mode-select').classList.remove('hidden');
}

window.closeModeSelect = function () {
    // Volver al dashboard desde la selecciÃ³n de modo
    document.getElementById('view-mode-select').classList.add('hidden');
    document.getElementById('app-layout').classList.remove('hidden');
}

window.selectGameMode = function (mode) {
    currentGameMode = mode;
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

    if (mode === 'local') {
        // Modo carrera contra IA â€” iniciar partido directamente
        document.getElementById('app-layout').classList.remove('hidden');
        updateUI();
        startMatch();
    } else if (mode === 'multiplayer-normal' || mode === 'multiplayer-ranked') {
        // Modo PvP â€” conectar al servidor y buscar rival
        document.getElementById('app-layout').classList.remove('hidden');
        startMultiplayerSearch(mode);
    }
}

/* =========================================================================
   MULTIPLAYER â€” Cliente Socket.io
   ========================================================================= */
const PVP_SERVER_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://inafumaybeben1.onrender.com';

function startMultiplayerSearch(mode) {
    document.getElementById('pvp-searching-overlay').classList.remove('hidden');
    document.getElementById('pvp-search-status').textContent = 'Conectando al servidor...';

    pvpMatchFinished = false;

    // PVP match state (mirrors local matchState structure)
    let pvpMatchState = {
        stats: { hPoss: 50, aPoss: 50, hShots: 0, aShots: 0, hSot: 0, aSot: 0, hCorners: 0, aCorners: 0, hXG: 0, aXG: 0 },
        events: [],
        pitchTokens: [],
        pitchInterval: null
    };
    let pvpPitchPhase = 'neutral';
    let pvpPitchPhaseTimer = 0;

    /* --- PVP Pitch Token Functions (mirrored from local) --- */
    function pvpInitPitchTokens() {
        const tokensDiv = document.getElementById('pvp-fm-pitch-tokens');
        if (!tokensDiv) return;
        tokensDiv.innerHTML = '';
        pvpMatchState.pitchTokens = [];

        const homePositions = [
            { x: 5, y: 50 },
            { x: 15, y: 20 }, { x: 15, y: 40 }, { x: 15, y: 60 }, { x: 15, y: 80 },
            { x: 30, y: 25 }, { x: 30, y: 45 }, { x: 30, y: 55 }, { x: 30, y: 75 },
            { x: 42, y: 35 }, { x: 42, y: 65 }
        ];
        const awayPositions = [
            { x: 95, y: 50 },
            { x: 85, y: 20 }, { x: 85, y: 40 }, { x: 85, y: 60 }, { x: 85, y: 80 },
            { x: 70, y: 25 }, { x: 70, y: 45 }, { x: 70, y: 55 }, { x: 70, y: 75 },
            { x: 58, y: 35 }, { x: 58, y: 65 }
        ];

        homePositions.forEach((pos, i) => {
            const token = document.createElement('div');
            token.className = 'fm-pitch-token fm-pitch-token-home';
            token.innerHTML = `<span class="fm-pitch-token-number">${i + 1}</span>`;
            token.style.left = pos.x + '%';
            token.style.top = pos.y + '%';
            tokensDiv.appendChild(token);
            pvpMatchState.pitchTokens.push({ el: token, baseX: pos.x, baseY: pos.y, side: 'home' });
        });

        awayPositions.forEach((pos, i) => {
            const token = document.createElement('div');
            token.className = 'fm-pitch-token fm-pitch-token-away';
            token.innerHTML = `<span class="fm-pitch-token-number">${i + 1}</span>`;
            token.style.left = pos.x + '%';
            token.style.top = pos.y + '%';
            tokensDiv.appendChild(token);
            pvpMatchState.pitchTokens.push({ el: token, baseX: pos.x, baseY: pos.y, side: 'away' });
        });
    }

    function pvpAnimatePitchTokens() {
        if (pvpMatchState.pitchInterval) clearInterval(pvpMatchState.pitchInterval);
        pvpMatchState.pitchInterval = setInterval(() => {
            const ball = document.getElementById('pvp-fm-pitch-ball');

            if (pvpPitchPhaseTimer > 0) pvpPitchPhaseTimer--;
            if (pvpPitchPhaseTimer <= 0 && pvpPitchPhase !== 'neutral') pvpPitchPhase = 'neutral';

            let ballX, ballY;
            const hPoss = pvpMatchState.stats.hPoss || 50;

            if (pvpPitchPhase === 'home-goal') {
                ballX = 96 + Math.random() * 3; ballY = 44 + Math.random() * 12;
            } else if (pvpPitchPhase === 'away-goal') {
                ballX = 1 + Math.random() * 3; ballY = 44 + Math.random() * 12;
            } else if (pvpPitchPhase === 'home-attack') {
                ballX = 62 + Math.random() * 28; ballY = 20 + Math.random() * 60;
            } else if (pvpPitchPhase === 'away-attack') {
                ballX = 10 + Math.random() * 28; ballY = 20 + Math.random() * 60;
            } else if (pvpPitchPhase === 'home-corner') {
                ballX = 94 + Math.random() * 4; ballY = Math.random() < 0.5 ? 3 + Math.random() * 6 : 91 + Math.random() * 6;
            } else if (pvpPitchPhase === 'away-corner') {
                ballX = 2 + Math.random() * 4; ballY = Math.random() < 0.5 ? 3 + Math.random() * 6 : 91 + Math.random() * 6;
            } else {
                const possWeight = (hPoss - 50) / 50;
                ballX = 50 + possWeight * 25 + (Math.random() - 0.5) * 28;
                ballY = 15 + Math.random() * 70;
            }
            ballX = Math.max(1, Math.min(99, ballX));
            ballY = Math.max(3, Math.min(97, ballY));

            if (ball) { ball.style.left = ballX + '%'; ball.style.top = ballY + '%'; }

            let homeBlockX = 0, awayBlockX = 0;
            const possShift = (hPoss - 50) * 0.18;
            homeBlockX += possShift; awayBlockX -= possShift;
            const isGoalPhase = pvpPitchPhase === 'home-goal' || pvpPitchPhase === 'away-goal';
            if (pvpPitchPhase === 'home-attack' || pvpPitchPhase === 'home-goal' || pvpPitchPhase === 'home-corner') {
                homeBlockX += 15; awayBlockX -= 8;
            } else if (pvpPitchPhase === 'away-attack' || pvpPitchPhase === 'away-goal' || pvpPitchPhase === 'away-corner') {
                awayBlockX -= 15; homeBlockX += 8;
            }

            pvpMatchState.pitchTokens.forEach((t) => {
                const isGK = t.baseY === 50 && (t.baseX === 5 || t.baseX === 95);
                const isAttacker = t.side === 'home' ? (t.baseX >= 42) : (t.baseX <= 58);
                let newX, newY;

                if (isGK) {
                    if (t.side === 'home') { newX = 4 + (Math.random() - 0.5) * 3; newY = 45 + Math.random() * 10; }
                    else { newX = 96 + (Math.random() - 0.5) * 3; newY = 45 + Math.random() * 10; }
                    if ((pvpPitchPhase === 'away-goal' && t.side === 'home') || (pvpPitchPhase === 'home-goal' && t.side === 'away')) {
                        newY += (ballY - newY) * 0.5;
                    }
                } else if (isGoalPhase && isAttacker) {
                    const attackingSide = pvpPitchPhase === 'home-goal' ? 'home' : 'away';
                    if (t.side === attackingSide) {
                        newX = ballX + (Math.random() - 0.5) * 12; newY = ballY + (Math.random() - 0.5) * 18;
                    } else {
                        const goalX = t.side === 'home' ? 10 : 90;
                        newX = goalX + (Math.random() - 0.5) * 14; newY = 30 + Math.random() * 40;
                    }
                } else {
                    const shift = t.side === 'home' ? homeBlockX : awayBlockX;
                    const jitterX = (Math.random() - 0.5) * 4; const jitterY = (Math.random() - 0.5) * 5;
                    newX = t.baseX + shift + jitterX; newY = t.baseY + jitterY;
                    const distToBall = Math.sqrt(Math.pow(newX - ballX, 2) + Math.pow(newY - ballY, 2));
                    let pullFactor;
                    if (pvpPitchPhase.includes('attack') || pvpPitchPhase.includes('corner')) {
                        pullFactor = distToBall < 25 ? 0.25 : 0.1;
                    } else { pullFactor = distToBall < 20 ? 0.15 : 0.05; }
                    newX += (ballX - newX) * pullFactor; newY += (ballY - newY) * pullFactor;
                }
                if (!isGoalPhase) {
                    if (t.side === 'home') newX = Math.min(newX, 78);
                    else newX = Math.max(newX, 22);
                }
                newX = Math.max(1, Math.min(99, newX)); newY = Math.max(3, Math.min(97, newY));
                t.el.style.left = newX + '%'; t.el.style.top = newY + '%';
            });
        }, 1800);
    }

    function pvpStopPitchAnimation() {
        if (pvpMatchState.pitchInterval) { clearInterval(pvpMatchState.pitchInterval); pvpMatchState.pitchInterval = null; }
    }

    function pvpUpdateMatchStatsUI(s) {
        const hp = document.getElementById('pvp-fm-stat-poss-home'); if (hp) hp.textContent = s.hPoss + '%';
        const ap = document.getElementById('pvp-fm-stat-poss-away'); if (ap) ap.textContent = s.aPoss + '%';
        const bph = document.getElementById('pvp-fm-bar-poss-h'); if (bph) bph.style.width = s.hPoss + '%';
        const bpa = document.getElementById('pvp-fm-bar-poss-a'); if (bpa) bpa.style.width = s.aPoss + '%';

        const sh_ = document.getElementById('pvp-fm-stat-shots-home'); if (sh_) sh_.textContent = s.hShots;
        const sa_ = document.getElementById('pvp-fm-stat-shots-away'); if (sa_) sa_.textContent = s.aShots;
        const totalS = s.hShots + s.aShots || 1;
        const bsh = document.getElementById('pvp-fm-bar-shots-h'); if (bsh) bsh.style.width = ((s.hShots / totalS) * 100) + '%';
        const bsa = document.getElementById('pvp-fm-bar-shots-a'); if (bsa) bsa.style.width = ((s.aShots / totalS) * 100) + '%';

        const soth = document.getElementById('pvp-fm-stat-sot-home'); if (soth) soth.textContent = s.hSot || 0;
        const sota = document.getElementById('pvp-fm-stat-sot-away'); if (sota) sota.textContent = s.aSot || 0;
        const totalSot = (s.hSot || 0) + (s.aSot || 0) || 1;
        const bsoth = document.getElementById('pvp-fm-bar-sot-h'); if (bsoth) bsoth.style.width = (((s.hSot || 0) / totalSot) * 100) + '%';
        const bsota = document.getElementById('pvp-fm-bar-sot-a'); if (bsota) bsota.style.width = (((s.aSot || 0) / totalSot) * 100) + '%';

        const xgh = document.getElementById('pvp-fm-stat-xg-home'); if (xgh) xgh.textContent = (s.hXG || 0).toFixed(2);
        const xga = document.getElementById('pvp-fm-stat-xg-away'); if (xga) xga.textContent = (s.aXG || 0).toFixed(2);
        const totalXG = (s.hXG || 0) + (s.aXG || 0) || 1;
        const bxgh = document.getElementById('pvp-fm-bar-xg-h'); if (bxgh) bxgh.style.width = (((s.hXG || 0) / totalXG) * 100) + '%';
        const bxga = document.getElementById('pvp-fm-bar-xg-a'); if (bxga) bxga.style.width = (((s.aXG || 0) / totalXG) * 100) + '%';

        const ch = document.getElementById('pvp-fm-stat-corners-home'); if (ch) ch.textContent = s.hCorners || 0;
        const ca = document.getElementById('pvp-fm-stat-corners-away'); if (ca) ca.textContent = s.aCorners || 0;
        const totalC = (s.hCorners || 0) + (s.aCorners || 0) || 1;
        const bch = document.getElementById('pvp-fm-bar-corners-h'); if (bch) bch.style.width = (((s.hCorners || 0) / totalC) * 100) + '%';
        const bca = document.getElementById('pvp-fm-bar-corners-a'); if (bca) bca.style.width = (((s.aCorners || 0) / totalC) * 100) + '%';
    }

    function pvpRenderMatchEvents(filter) {
        const list = document.getElementById('pvp-fm-events-list');
        if (!list) return;
        const filtered = pvpMatchState.events.filter(e => filter === 'home' ? e.side === 'home' : e.side === 'away');
        if (filtered.length === 0) {
            list.innerHTML = '<div class="text-slate-600 text-[10px] text-center mt-4 italic">Sin eventos aÃºn</div>';
            return;
        }
        list.innerHTML = filtered.map(e => `
            <div class="fm-event-item">
                <span class="fm-event-icon">${e.icon}</span>
                <span class="fm-event-text">${e.text}</span>
                <span class="fm-event-min">${e.min}'</span>
            </div>
        `).join('');
        // Store events globally for tab switching 
        window._pvpEvents = pvpMatchState.events;
    }

    // Conectar al servidor PvP (usar existente si ya estÃ¡ conectado)
    if (!pvpSocket || !pvpSocket.connected) {
        pvpSocket = io(PVP_SERVER_URL, { transports: ['websocket', 'polling'] });
    }

    const onConnectHandler = () => {
        document.getElementById('pvp-search-status').textContent = 'Buscando rival...';

        // Registrar de nuevo por seguridad si se reconecta
        if (auth.currentUser) {
            pvpSocket.emit('register_user', { uid: auth.currentUser.uid, username: state.auth.user });
        }

        pvpSocket.emit('join_lobby', {
            teamName: state.team.name,
            managerName: state.team.manager,
            roster: state.roster,
            lineup: state.lineup,
            badge: { shape: state.team.shape, c1: state.team.c1, c2: state.team.c2 }
        });
    };

    if (pvpSocket.connected) onConnectHandler();
    else pvpSocket.on('connect', onConnectHandler);

    pvpSocket.on('connect_error', () => {
        document.getElementById('pvp-search-status').textContent = 'Error: Servidor no disponible';
    });

    pvpSocket.on('lobby_waiting', (data) => {
        document.getElementById('pvp-search-status').textContent = data.message;
    });

    // ---- PARTIDO ENCONTRADO ----
    pvpSocket.on('match_start', (data) => {
        pvpRoomId = data.roomId;
        pvpSide = data.you;

        document.getElementById('pvp-searching-overlay').classList.add('hidden');

        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        document.getElementById('pvp-match-modal').classList.remove('hidden');
        window.inviteFriend1v1 = function (targetUid) {
            if (!pvpSocket || !pvpSocket.connected) return showAlert("No estás conectado al servidor multiplayer.");
            pvpSocket.emit('invite_friend', { targetUid: targetUid, senderName: state.auth.user, senderOvr: state.squadOvr || 50 });
            showAlert("Invitación enviada. Esperando respuesta del jugador...");
        }

        window.setupPrivateMatchSocketEvents = function (sock) {
            if (sock._privateEventsHooked) return;
            sock._privateEventsHooked = true;

            sock.on('receive_invite', (data) => {
                pending1v1Invite = data;
                const modal = document.getElementById('modal-1v1-invite');
                if (modal) {
                    document.getElementById('invite-sender-name').textContent = data.senderName;
                    modal.classList.remove('hidden');
                }
            });

            sock.on('invite_response', (data) => {
                if (!data.accepted) {
                    showAlert(data.message || "Invitación rechazada o fallida.");
                }
            });

            sock.on('private_match_start', (data) => {
                closeSubpage();
                const mm = document.getElementById('match-modal');
                if (mm) {
                    mm.classList.remove('hidden');
                    mm.style.display = 'flex';
                }
                simIsRanked = false;
                simIsMultiplayer = true;
                simMultiplayerRoom = data.room;
                simMatchInProgress = true;
                simLatestNarrativeTime = 0;

                const homeLabel = data.isPlayer1 ? state.team.name : data.opponentName;
                const awayLabel = data.isPlayer1 ? data.opponentName : state.team.name;
                document.getElementById('sim-home-name').textContent = homeLabel;
                document.getElementById('sim-away-name').textContent = awayLabel;
                document.getElementById('sim-home-score').textContent = "0";
                document.getElementById('sim-away-score').textContent = "0";
                document.getElementById('match-narrative').innerHTML = "";

                setTimeout(() => {
                    if (typeof sendMultiplayerLineup === 'function') sendMultiplayerLineup();
                }, 500);
            });
        }

        // Hook inicial por si ya estÃ¡ conectado
        if (pvpSocket && pvpSocket.connected) {
            setupPrivateMatchSocketEvents(pvpSocket);
        }

        window.accept1v1Invite = function () {
            if (!pending1v1Invite || !pvpSocket) return;
            document.getElementById('modal-1v1-invite').classList.add('hidden');
            pvpSocket.emit('respond_invite', { accepted: true, targetSocketId: pending1v1Invite.fromSocketId, senderName: state.auth.user });
            pending1v1Invite = null;
        }

        window.reject1v1Invite = function () {
            if (!pending1v1Invite || !pvpSocket) return;
            document.getElementById('modal-1v1-invite').classList.add('hidden');
            pvpSocket.emit('respond_invite', { accepted: false, targetSocketId: pending1v1Invite.fromSocketId });
            pending1v1Invite = null;
        }
        document.getElementById('pvp-halftime-actions').classList.add('hidden');
        document.getElementById('pvp-post-match').classList.add('hidden');
        setNowPlayingVisibility();

        // Re-enable halftime talk buttons for the new match
        const pvpBtnM = document.getElementById('pvp-btn-talk-motivar');
        const pvpBtnB = document.getElementById('pvp-btn-talk-bronca');
        [pvpBtnM, pvpBtnB].forEach(btn => {
            if (!btn) return;
            btn.disabled = false;
            btn.classList.remove('fm-dugout-btn-disabled');
        });
        if (pvpBtnM) pvpBtnM.onclick = function () { pvpHalftimeAction('animar'); };
        if (pvpBtnB) pvpBtnB.onclick = function () { pvpHalftimeAction('bronca'); };

        // Reset state
        pvpMatchState.stats = { hPoss: 50, aPoss: 50, hShots: 0, aShots: 0, hSot: 0, aSot: 0, hCorners: 0, aCorners: 0, hXG: 0, aXG: 0 };
        pvpMatchState.events = [];
        window._pvpEvents = [];
        pvpPitchPhase = 'neutral';
        pvpPitchPhaseTimer = 0;

        // Header data
        document.getElementById('pvp-home-name').textContent = data.homeName;
        document.getElementById('pvp-away-name').textContent = data.awayName;
        document.getElementById('pvp-home-score').textContent = '0';
        document.getElementById('pvp-away-score').textContent = '0';
        document.getElementById('pvp-match-progress').style.width = '0%';
        document.getElementById('pvp-match-time').textContent = "0'";
        document.getElementById('pvp-match-narrative').innerHTML = '';

        // FM panel team labels
        const statHomeLbl = document.getElementById('pvp-fm-stat-home-name');
        const statAwayLbl = document.getElementById('pvp-fm-stat-away-name');
        if (statHomeLbl) statHomeLbl.textContent = data.homeName;
        if (statAwayLbl) statAwayLbl.textContent = data.awayName;
        const evtTabHome = document.getElementById('pvp-fm-evt-tab-home');
        const evtTabAway = document.getElementById('pvp-fm-evt-tab-away');
        if (evtTabHome) evtTabHome.textContent = data.homeName;
        if (evtTabAway) evtTabAway.textContent = data.awayName;
        const pitchLblH = document.getElementById('pvp-fm-pitch-label-home');
        const pitchLblA = document.getElementById('pvp-fm-pitch-label-away');
        if (pitchLblH) pitchLblH.textContent = data.homeName;
        if (pitchLblA) pitchLblA.textContent = data.awayName;

        // Badges (FM-style)
        const myBadge = { shape: state.team.shape, c1: state.team.c1, c2: state.team.c2, pattern: state.team.pattern };
        const oppBadge = data.opponentBadge || { shape: 'shape-shield', c1: '#666', c2: '#333' };

        if (pvpSide === 'home') {
            document.getElementById('pvp-home-shield').innerHTML = getBadgeHTML(data.homeName, myBadge.shape, myBadge.c1, myBadge.c2, 'w-8 h-10 text-[8px]', myBadge.pattern);
            document.getElementById('pvp-away-shield').innerHTML = getBadgeHTML(data.awayName, oppBadge.shape, oppBadge.c1, oppBadge.c2, 'w-8 h-10 text-[8px]', oppBadge.pattern);
        } else {
            document.getElementById('pvp-home-shield').innerHTML = getBadgeHTML(data.homeName, oppBadge.shape, oppBadge.c1, oppBadge.c2, 'w-8 h-10 text-[8px]', oppBadge.pattern);
            document.getElementById('pvp-away-shield').innerHTML = getBadgeHTML(data.awayName, myBadge.shape, myBadge.c1, myBadge.c2, 'w-8 h-10 text-[8px]', myBadge.pattern);
        }

        // Render formation panels â€” use real opponent roster if available from server
        const myPlayers = getStartingXI().map(p => ({ name: p.name, pos: p.pos, ovr: calcPlayerOVR(p), img: p.img || '' }));
        let oppPlayers;
        if (data.opponentRoster && data.opponentRoster.length > 0) {
            // Use real opponent roster sent by server (with lineup filter if available)
            let oppRosterFull = data.opponentRoster;
            if (data.opponentLineup && data.opponentLineup.length === 11) {
                const lineupPlayers = data.opponentLineup.map(id => oppRosterFull.find(p => p.id === id)).filter(Boolean);
                oppPlayers = lineupPlayers.length >= 11 ? lineupPlayers : oppRosterFull.slice(0, 11);
            } else {
                oppPlayers = oppRosterFull.slice(0, 11);
            }
            oppPlayers = oppPlayers.map(p => ({ name: p.name, pos: p.pos, ovr: p.ovr || calcPlayerOVR(p), img: p.img || '' }));
        } else {
            oppPlayers = generateAIPlayers(pvpSide === 'home' ? data.awayName : data.homeName, pvpSide === 'home' ? data.awayOvr : data.homeOvr);
        }
        const homeColor = pvpSide === 'home' ? (myBadge.c1 || '#2563eb') : (oppBadge.c1 || '#2563eb');
        const awayColor = pvpSide === 'home' ? (oppBadge.c1 || '#dc2626') : (myBadge.c1 || '#dc2626');

        if (pvpSide === 'home') {
            renderFormationPanel('pvp-fm-formation-home', myPlayers, homeColor);
            renderFormationPanel('pvp-fm-formation-away', oppPlayers, awayColor);
        } else {
            renderFormationPanel('pvp-fm-formation-home', oppPlayers, homeColor);
            renderFormationPanel('pvp-fm-formation-away', myPlayers, awayColor);
        }

        pvpRenderMatchEvents('home');
        pvpInitPitchTokens();
        pvpAnimatePitchTokens();

        const dugNarr = document.getElementById('pvp-fm-dugout-narrative');
        if (dugNarr) dugNarr.innerHTML = '<div class="text-blue-400 text-[10px]">Conectado. Esperando inicio...</div>';

        pvpUpdateMatchStatsUI(pvpMatchState.stats);
    });

    // ---- KICKOFF ----
    pvpSocket.on('match_kickoff', (data) => {
        const logDiv = document.getElementById('pvp-match-narrative');
        logDiv.innerHTML += `<div class='text-blue-400 font-bold'>${data.message}</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
        const dugNarr = document.getElementById('pvp-fm-dugout-narrative');
        if (dugNarr) dugNarr.innerHTML = '<div class="text-blue-400 text-[10px]">Partido en curso...</div>';
    });

    // ---- TICK DEL PARTIDO ----
    pvpSocket.on('match_tick', (data) => {
        document.getElementById('pvp-match-time').textContent = data.min + "'";
        document.getElementById('pvp-home-score').textContent = data.homeGoals;
        document.getElementById('pvp-away-score').textContent = data.awayGoals;
        document.getElementById('pvp-match-progress').style.width = data.progress + '%';

        pvpMatchState.stats = data.stats;

        // Set pitch phase from server
        if (data.pitchPhase && data.pitchPhase !== 'neutral') {
            pvpPitchPhase = data.pitchPhase;
            pvpPitchPhaseTimer = data.pitchPhase.includes('goal') ? 4 : 2;
        }

        // Events
        if (data.eventType === 'home_goal') {
            const scorer = data.narrative.replace(/^.*perfecta de |^.*jugada de /i, '').replace(/\.$/, '') || 'Jugador';
            pvpMatchState.events.push({ min: data.min, icon: 'âš½', text: `GOL â€” ${scorer}`, side: 'home' });
        } else if (data.eventType === 'away_goal') {
            const scorer = data.narrative.replace(/^.*perfecta de |^.*jugada de /i, '').replace(/\.$/, '') || 'Jugador';
            pvpMatchState.events.push({ min: data.min, icon: 'âš½', text: `GOL â€” ${scorer}`, side: 'away' });
        }
        if (data.card) {
            pvpMatchState.events.push({ min: data.min, icon: 'ðŸŸ¨', text: 'Tarjeta amarilla', side: data.card.side });
        }

        // Narrativa
        const logDiv = document.getElementById('pvp-match-narrative');
        let cssClass = '';
        if (data.eventType === 'home_goal') cssClass = 'text-green-400 font-bold';
        else if (data.eventType === 'away_goal') cssClass = 'text-red-400 font-bold';
        logDiv.innerHTML += `<div><span class="text-slate-500">${data.min}'</span> - <span class="${cssClass}">${data.narrative.split(' - ').slice(1).join(' - ') || data.narrative}</span></div>`;
        logDiv.scrollTop = logDiv.scrollHeight;

        pvpUpdateMatchStatsUI(data.stats);
        pvpRenderMatchEvents('home');
    });

    // ---- DESCANSO ----
    pvpSocket.on('match_halftime', (data) => {
        pvpStopPitchAnimation();
        document.getElementById('pvp-halftime-actions').classList.remove('hidden');
        const logDiv = document.getElementById('pvp-match-narrative');
        logDiv.innerHTML += `<div class="mt-4"><strong class="text-yellow-400 font-bold">${data.narrative}</strong></div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
        pvpMatchState.events.push({ min: 45, icon: 'â±', text: 'Descanso', side: 'home' });
        pvpRenderMatchEvents('home');
        const dugNarr = document.getElementById('pvp-fm-dugout-narrative');
        if (dugNarr) dugNarr.innerHTML = '<div class="text-yellow-400 text-[10px] font-bold">Medio tiempo â€” elige tus acciones en el dugout.</div>';
    });

    pvpSocket.on('halftime_response', (data) => {
        const logDiv = document.getElementById('pvp-match-narrative');
        logDiv.innerHTML += `<div class="text-blue-400 mt-2 text-xs italic">${data.message}</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
        document.getElementById('pvp-halftime-actions').classList.add('hidden');
    });

    pvpSocket.on('match_resume', (data) => {
        document.getElementById('pvp-halftime-actions').classList.add('hidden');
        const logDiv = document.getElementById('pvp-match-narrative');
        logDiv.innerHTML += `<div class="mt-4"><strong class="text-white">${data.message}</strong></div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
        const dugNarr = document.getElementById('pvp-fm-dugout-narrative');
        if (dugNarr) dugNarr.innerHTML = '<div class="text-blue-400 text-[10px]">Segunda parte en juego...</div>';
        pvpAnimatePitchTokens();
    });

    // ---- FIN DEL PARTIDO ----
    pvpSocket.on('match_result', (data) => {
        pvpStopPitchAnimation();
        document.getElementById('pvp-post-match').classList.remove('hidden');

        const logDiv = document.getElementById('pvp-match-narrative');
        logDiv.innerHTML += `<div class="mt-4 text-white font-bold uppercase border-t border-[#313145] pt-2">Fin del tiempo reglamentario.</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;

        const rewards = data.yourRewards;
        let resultText = '';
        if (rewards.result === 'win') resultText = 'ðŸ† Â¡VICTORIA!';
        else if (rewards.result === 'draw') resultText = 'ðŸ¤ EMPATE';
        else resultText = 'ðŸ’” DERROTA';

        document.getElementById('pvp-result-text').textContent = resultText;
        document.getElementById('pvp-rewards-text').innerHTML = `+â‚¬${(rewards.coins / 1000000).toFixed(1)}M | +${rewards.pts} PTS | REP: ${rewards.rep > 0 ? '+' : ''}${rewards.rep}`;

        const dugNarr = document.getElementById('pvp-fm-dugout-narrative');
        if (dugNarr) dugNarr.innerHTML = '<div class="text-amber-400 text-[10px] font-bold">Partido finalizado.</div>';

        if (rewards.result === 'win') state.stats.wins++;
        else if (rewards.result === 'draw') state.stats.draws++;
        else state.stats.losses++;
        state.stats.matches++;
        state.stats.goals += rewards.goalsScored;
        state.economy.coins += rewards.coins;
        state.stats.rep = Math.max(0, state.stats.rep + rewards.rep);

        // --- Actualizar estadÃ­sticas PVP online ---
        const myGF = (data.you === 'home') ? data.homeGoals : data.awayGoals;
        const myGA = (data.you === 'home') ? data.awayGoals : data.homeGoals;
        if (!state.pvpStats) state.pvpStats = { matches: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0 };
        state.pvpStats.matches++;
        state.pvpStats.gf += myGF;
        state.pvpStats.ga += myGA;
        if (rewards.result === 'win') { state.pvpStats.wins++; state.pvpStats.pts += 3; }
        else if (rewards.result === 'draw') { state.pvpStats.draws++; state.pvpStats.pts += 1; }
        else { state.pvpStats.losses++; }

        // --- Ranked Match Logic ---
        if (currentGameMode === 'multiplayer-ranked') {
            const ptsChange = calculateRankPoints(state.competitive.rank, state.competitive.subrank, rewards.result);
            processRankUpdate(state, ptsChange);

            // Add match to history
            state.competitive.history.unshift({
                opponentName: data.you === 'home' ? data.awayName : data.homeName,
                result: rewards.result,
                myGoals: myGF,
                oppGoals: myGA,
                pointsChange: ptsChange,
                date: new Date().toISOString()
            });

            // Keep history limited to 20 matches max
            if (state.competitive.history.length > 20) {
                state.competitive.history.pop();
            }

            // Also show points change in rewards text
            const ptsSign = ptsChange > 0 ? '+' : '';
            document.getElementById('pvp-rewards-text').innerHTML += ` | RANK: <span class="${ptsChange >= 0 ? 'text-green-400' : 'text-red-400'}">${ptsSign}${ptsChange} PTS</span>`;
        }

        // --- CondiciÃ³n FÃ­sica y Lesiones Post-Partido (PvP) ---
        state.lineup.forEach(id => {
            if (!id) return;
            const p = state.roster.find(x => x.id === id);
            if (p) p.con = Math.max(30, p.con - 15);
        });
        state.roster.forEach(p => {
            if (p.injuryMatches && p.injuryMatches > 0) {
                p.injuryMatches--;
                if (p.injuryMatches <= 0) p.con = 80; // Sale de lesiÃ³n con 80%  
            }
        });

        pvpMatchFinished = true;
        saveState();
    });

    // ---- RIVAL DESCONECTADO ----
    pvpSocket.on('opponent_disconnected', (data) => {
        if (pvpMatchFinished) return;

        pvpStopPitchAnimation();
        document.getElementById('pvp-searching-overlay').classList.add('hidden');
        document.getElementById('pvp-halftime-actions').classList.add('hidden');
        document.getElementById('pvp-post-match').classList.remove('hidden');
        document.getElementById('pvp-result-text').textContent = 'ðŸ† Â¡VICTORIA POR ABANDONO!';
        document.getElementById('pvp-rewards-text').textContent = data.message;
    });
}

/* --- PVP Event Tabs --- */
window.pvpFmEvtTab = function (team) {
    document.getElementById('pvp-fm-evt-tab-home').className = 'fm-evt-tab' + (team === 'home' ? ' active' : '');
    document.getElementById('pvp-fm-evt-tab-away').className = 'fm-evt-tab' + (team === 'away' ? ' active' : '');
    const list = document.getElementById('pvp-fm-events-list');
    if (!list) return;
    const filtered = (window._pvpEvents || []).filter(e => team === 'home' ? e.side === 'home' : e.side === 'away');
    if (filtered.length === 0) {
        list.innerHTML = '<div class="text-slate-600 text-[10px] text-center mt-4 italic">Sin eventos aÃºn</div>';
        return;
    }
    list.innerHTML = filtered.map(e => `
        <div class="fm-event-item">
            <span class="fm-event-icon">${e.icon}</span>
            <span class="fm-event-text">${e.text}</span>
            <span class="fm-event-min">${e.min}'</span>
        </div>
    `).join('');
};

/* --- PVP Dugout toggle --- */
window.togglePvpDugout = function () {
    const content = document.getElementById('pvp-fm-dugout-content');
    if (content) content.classList.toggle('expanded');
};

window.pvpHalftimeAction = function (action) {
    if (pvpSocket && pvpRoomId) {
        pvpSocket.emit('match_halftime_action', { roomId: pvpRoomId, action: action });
    }
    // Disable both talk buttons after choosing
    const btnM = document.getElementById('pvp-btn-talk-motivar');
    const btnB = document.getElementById('pvp-btn-talk-bronca');
    [btnM, btnB].forEach(btn => {
        if (!btn) return;
        btn.disabled = true;
        btn.classList.add('fm-dugout-btn-disabled');
        btn.onclick = null;
    });
    const dugNarr = document.getElementById('pvp-fm-dugout-narrative');
    if (dugNarr) dugNarr.innerHTML = '<div class="text-green-400 text-[10px]">Charla completada. Pulsa "JUGAR 2Âª PARTE" para continuar.</div>';
}

window.pvpGoToTactics = function () {
    document.getElementById('pvp-match-modal').classList.add('hidden');
    document.getElementById('app-layout').classList.remove('hidden');
    setNowPlayingVisibility();
    switchTab('tactics');

    const topBtn = document.getElementById('top-continue-btn');
    topBtn.innerHTML = 'VOLVER AL PARTIDO â±';
    topBtn.className = "btn-continue shadow-lg bg-yellow-600";
    topBtn.onclick = function () {
        document.getElementById('app-layout').classList.add('hidden');
        document.getElementById('pvp-match-modal').classList.remove('hidden');
        setNowPlayingVisibility();
        topBtn.innerHTML = 'CONTINUAR â­';
        topBtn.className = "btn-continue shadow-lg";
        topBtn.onclick = startMatch;
    };
}

window.pvpResumeMatch = function () {
    if (pvpSocket && pvpRoomId) {
        pvpSocket.emit('resume_match', { roomId: pvpRoomId });
    }
}

window.cancelMultiplayerSearch = function () {
    if (pvpSocket) {
        pvpSocket.disconnect();
        pvpSocket = null;
    }
    document.getElementById('pvp-searching-overlay').classList.add('hidden');
    routeView();
}

window.exitPvpMatch = function () {
    if (pvpSocket) {
        pvpSocket.disconnect();
        pvpSocket = null;
    }
    pvpRoomId = null;
    pvpSide = null;
    pvpMatchFinished = false;
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    setNowPlayingVisibility();
    routeView();
}

/* =========================================================================
   UI GLOBAL, TABS Y BUZÃ“N
   ========================================================================= */
window.switchTab = function (tabId) {
    document.querySelectorAll('.fm-tab').forEach(t => { t.classList.remove('active'); t.style.display = 'none'; });
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) { targetTab.classList.add('active'); targetTab.style.display = 'flex'; }

    const targetBtn = document.getElementById('nav-' + tabId);
    if (targetBtn) targetBtn.classList.add('active');

    const titles = { 'dash': 'Inicio', 'squad': 'Plantilla', 'tactics': 'TÃ¡cticas', 'train': 'Entrenamientos', 'talk': 'Vestuario', 'league': 'ClasificaciÃ³n', 'season': 'Resultados Temporada', 'market': 'Mercado de Fichajes', 'sobres': 'Sobres de Jugadores', 'bet': 'Apuestas', 'comp': 'CompeticiÃ³n' };
    const pTitle = document.getElementById('page-title');
    if (pTitle) pTitle.textContent = titles[tabId] || 'Panel';

    // Guardar tab activo en localStorage
    localStorage.setItem('inafuma_active_tab', tabId);

    if (tabId === 'market') { setMarketMode('buy'); filterMarket(); }
    if (tabId === 'tactics') renderTactics();
    if (tabId === 'league') renderLeague();
    if (tabId === 'train') renderTrainStatus();
    if (tabId === 'talk') renderTalkStatus();
    if (tabId === 'season') renderSeasonTab();
    if (tabId === 'bet') renderBetTab();
    if (tabId === 'sobres') renderSobresTab();
    if (tabId === 'dash') updateUI();
    if (tabId === 'squad') renderSquad();
}

window.showRanksInfo = function () {
    document.getElementById('modal-comp-ranks-info').classList.remove('hidden');
}

window.closeRanksInfo = function () {
    document.getElementById('modal-comp-ranks-info').classList.add('hidden');
}

function addEmail(sender, subject, body) {
    const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    state.inbox.unshift({ id: Date.now(), sender, subject, body, date, read: false });
}

function renderInbox() {
    const list = document.getElementById('inbox-list');
    if (!list) return;
    list.innerHTML = '';

    if (state.inbox.length === 0) {
        list.innerHTML = '<div class="text-slate-500 text-sm text-center italic mt-4">Sin noticias.</div>';
        return;
    }

    state.inbox.forEach(mail => {
        const opacity = mail.read ? 'opacity-60' : 'opacity-100';
        const dot = mail.read ? '' : '<span class="w-2 h-2 rounded-full bg-blue-500 inline-block mr-2"></span>';
        list.innerHTML += `
        <div class="bg-[#111119] p-3 rounded border border-[#313145] cursor-pointer hover:border-slate-500 transition mb-2 ${opacity}" onclick="readMail(${mail.id})">
            <div class="flex justify-between items-baseline mb-1">
                <span class="text-[10px] font-bold text-blue-400">${mail.sender}</span>
                <span class="text-[9px] text-slate-500">${mail.date}</span>
            </div>
            <h4 class="text-xs font-bold text-white truncate">${dot}${mail.subject}</h4>
            <p class="text-[10px] text-slate-400 mt-1 line-clamp-2">${mail.body}</p>
        </div>`;
    });
}
window.readMail = function (id) { const m = state.inbox.find(x => x.id === id); if (m) { m.read = true; saveState(); renderInbox(); } }

function getStartingXI() {
    if (!state || !state.lineup) return [];
    return state.lineup.map(id => state.roster.find(p => p.id === id)).filter(p => p && !p.suspension);
}
function getTeamOvr() {
    const xi = getStartingXI();
    if (xi.length === 0) return 0;
    const sum = xi.reduce((acc, p) => acc + calcPlayerOVR(p), 0);
    return Math.round(sum / xi.length);
}

function getBadgeHTML(name, shape, c1, c2, extraClass = "w-8 h-10 text-[10px]", pattern, icon) {
    let n = name ? name.substring(0, 3).toUpperCase() : "FM";
    let sh = shape || "shape-shield";
    let col1 = c1 || "#1e293b";
    let col2 = c2 || "#0f172a";
    let pat = pattern || 'diagonal';
    let ic = icon || '';
    let bg = '';
    if (pat === 'vertical') bg = `linear-gradient(90deg, ${col1} 50%, ${col2} 50%)`;
    else if (pat === 'horizontal') bg = `linear-gradient(180deg, ${col1} 50%, ${col2} 50%)`;
    else if (pat === 'solid') bg = col1;
    else if (pat === 'gradient') bg = `linear-gradient(180deg, ${col1}, ${col2})`;
    else bg = `linear-gradient(135deg, ${col1} 50%, ${col2} 50%)`;
    let iconHtml = ic ? `<span class="badge-icon">${ic}</span>` : '';
    return `<div class="club-badge ${sh} ${extraClass}" style="background: ${bg};">${iconHtml}${n}</div>`;
}

function updateUI() {
    if (!state || !state.team) return;
    const formatM = (num) => num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : num.toLocaleString();

    document.getElementById('ui-rep').textContent = "â˜… " + state.stats.rep;
    document.getElementById('ui-coins').textContent = "â‚¬" + formatM(state.economy.coins);
    document.getElementById('ui-prem').textContent = state.economy.premium;
    document.getElementById('ui-jornada').textContent = state.stats.matchday || 1;
    document.getElementById('dash-jornada').textContent = state.stats.matchday || 1;

    document.getElementById('top-manager').textContent = state.team.manager;
    document.getElementById('sidebar-manager').textContent = state.team.manager;

    const teamNameEls = document.querySelectorAll('#top-teamname, #sidebar-teamname, #dash-greeting-team');
    teamNameEls.forEach(el => el.textContent = state.team.name);

    const badgeHTML = getBadgeHTML(state.team.name, state.team.shape, state.team.c1, state.team.c2, "w-full h-full text-xs shadow", state.team.pattern);
    document.getElementById('top-shield').innerHTML = badgeHTML;
    document.getElementById('sidebar-shield').innerHTML = badgeHTML;

    // PrÃ³ximo Partido en UI
    let myNextFix = state.nextFixtures ? state.nextFixtures.find(f => f.isUserMatch) : null;
    if (myNextFix) {
        let isHome = myNextFix.home === state.team.name;
        let oppName = isHome ? myNextFix.away : myNextFix.home;
        let oppData = state.league.find(t => t.name === oppName) || { badge: AI_TEAMS[0] };

        document.getElementById('ui-next-opp').textContent = oppName;
        document.getElementById('dash-next-home').textContent = myNextFix.home;
        document.getElementById('dash-next-away').textContent = myNextFix.away;

        let homeBadge = isHome ? getBadgeHTML(state.team.name, state.team.shape, state.team.c1, state.team.c2, "w-full h-full border border-white/20", state.team.pattern) : getBadgeHTML(oppName, oppData.badge.shape, oppData.badge.c1, oppData.badge.c2, "w-full h-full border border-white/20");
        let awayBadge = isHome ? getBadgeHTML(oppName, oppData.badge.shape, oppData.badge.c1, oppData.badge.c2, "w-full h-full border border-white/20") : getBadgeHTML(state.team.name, state.team.shape, state.team.c1, state.team.c2, "w-full h-full border border-white/20", state.team.pattern);

        document.getElementById('dash-next-home-shield').innerHTML = homeBadge;
        document.getElementById('dash-next-away-shield').innerHTML = awayBadge;
    } else {
        document.getElementById('ui-next-opp').textContent = "Fin Temporada";
    }

    document.getElementById('dash-ovr-big').textContent = getTeamOvr();
    document.getElementById('dash-matches').textContent = state.stats.matches;
    document.getElementById('dash-wins').textContent = state.stats.wins;
    document.getElementById('dash-draws').textContent = state.stats.draws;
    document.getElementById('dash-losses').textContent = state.stats.losses;

    // Actualizar UI del Modo Competitivo
    if (state.competitive) {
        let rankNameEl = document.getElementById('comp-rank-name');
        let pointsTextEl = document.getElementById('comp-rank-points-text');
        let progressBarEl = document.getElementById('comp-rank-progress-bar');

        if (rankNameEl) {
            let rootRankStr = state.competitive.rank || 'Novato';
            let subRanks = ['I', 'II', 'III'];
            // subrank 1 -> I, 2 -> II, 3 -> III
            let subIndex = Math.max(1, Math.min(3, state.competitive.subrank || 1)) - 1;
            rankNameEl.textContent = `${rootRankStr} ${subRanks[subIndex]}`;
        }
        if (pointsTextEl && progressBarEl) {
            let pts = Math.max(0, Math.min(100, state.competitive.points || 0));
            pointsTextEl.textContent = `${pts} / 100 PTS`;
            progressBarEl.style.width = `${pts}%`;
        }

        // Historial de Partidos (Empty state o historial)
        let histContainer = document.getElementById('comp-match-history');
        if (histContainer) {
            if (!state.competitive.history || state.competitive.history.length === 0) {
                histContainer.innerHTML = `
                    <div>
                        <div class="text-3xl mb-2 opacity-50">âš½</div>
                        AÃºn no has jugado partidos clasificatorios
                    </div>
                `;
            } else {
                // En el futuro, renderizar historial aquÃ­
                histContainer.innerHTML = '';
                state.competitive.history.slice(-5).reverse().forEach(match => {
                    let resultClass = match.result === 'win' ? 'text-green-500' : (match.result === 'loss' ? 'text-red-500' : 'text-gray-400');
                    histContainer.innerHTML += `
                        <div class="flex justify-between items-center w-full p-2 bg-[#0b1628] rounded border border-[#313145]">
                            <span class="${resultClass} font-bold w-12 text-left">${match.result === 'win' ? 'V' : (match.result === 'loss' ? 'D' : 'E')}</span>
                            <span class="flex-1 text-white">${match.opponent}</span>
                            <span class="text-yellow-400 font-mono w-16 text-right">${match.pointsChange > 0 ? '+' : ''}${match.pointsChange}</span>
                        </div>
                    `;
                });
            }
        }
    }

    renderInbox(); renderSquad();
    if (document.getElementById('tab-tactics').classList.contains('active')) renderTactics();
}

/* =========================================================================
   FIXTURES (CALENDARIO DE 38 JORNADAS) Y RESULTADOS
   ========================================================================= */
function generateFixtures(targetState = state) {
    if (targetState.stats.matchday > 38) return;
    let fixtures = [];

    // Buscamos equipo que el usuario haya jugado MENOS de 2 veces.
    const unplayed = targetState.league.filter(t => !t.isUser && targetState.playedTeams.filter(x => x === t.name).length < 2);
    let myOpponent = null;

    if (unplayed.length > 0) {
        myOpponent = unplayed[Math.floor(Math.random() * unplayed.length)];
        let isHome = Math.random() > 0.5;
        if (isHome) fixtures.push({ home: targetState.team.name, away: myOpponent.name, isUserMatch: true, homeOvr: getTeamOvr(), awayOvr: myOpponent.ovr });
        else fixtures.push({ home: myOpponent.name, away: targetState.team.name, isUserMatch: true, homeOvr: myOpponent.ovr, awayOvr: getTeamOvr() });
    }

    // Partidos IA contra IA
    let remainingAIs = targetState.league.filter(t => !t.isUser && (!myOpponent || t.name !== myOpponent.name));
    remainingAIs = remainingAIs.sort(() => Math.random() - 0.5);

    for (let i = 0; i < remainingAIs.length; i += 2) {
        if (remainingAIs[i + 1]) {
            fixtures.push({
                home: remainingAIs[i].name,
                away: remainingAIs[i + 1].name,
                isUserMatch: false,
                homeOvr: remainingAIs[i].ovr,
                awayOvr: remainingAIs[i + 1].ovr
            });
        }
    }
    targetState.nextFixtures = fixtures;
}

window.renderSeasonTab = function () {
    const selector = document.getElementById('season-matchday-select');
    const list = document.getElementById('season-results-list');
    if (!selector || !list) return;

    if (selector.options.length === 0 || selector.options.length < state.stats.matchday - 1) {
        selector.innerHTML = '';
        for (let i = 1; i < state.stats.matchday; i++) {
            selector.innerHTML += `<option value="${i}">Jornada ${i}</option>`;
        }
        if (selector.options.length > 0) selector.value = state.stats.matchday - 1;
    }

    const selectedDay = selector.value;
    list.innerHTML = '';

    if (!state.history || !state.history[selectedDay]) {
        list.innerHTML = '<div class="text-center text-slate-500 text-xs mt-10">Selecciona una jornada pasada.</div>';
        return;
    }

    state.history[selectedDay].forEach(res => {
        let hClass = res.hG > res.aG ? "text-green-400 font-bold" : "text-white";
        let aClass = res.aG > res.hG ? "text-green-400 font-bold" : "text-white";
        let isMyMatch = res.home === state.team.name || res.away === state.team.name;
        let borderClass = isMyMatch ? "border-blue-500 bg-[#1e293b]" : "border-[#313145] bg-[#111119]";

        list.innerHTML += `
        <div class="p-3 rounded border ${borderClass} flex justify-between items-center text-xs shadow-lg mb-2">
            <span class="w-2/5 text-right ${hClass} truncate px-2">${res.home}</span>
            <span class="w-1/5 text-center font-bold bg-black py-1 rounded mx-2">${res.hG} - ${res.aG}</span>
            <span class="w-2/5 text-left ${aClass} truncate px-2">${res.away}</span>
        </div>`;
    });
}

/* =========================================================================
   APUESTAS DEPORTIVAS
   ========================================================================= */
window.renderBetTab = function () {
    const selMatch = document.getElementById('bet-match-select');
    const listBets = document.getElementById('active-bets-list');
    if (!selMatch || !listBets) return;

    selMatch.innerHTML = '';
    if (state.nextFixtures) {
        state.nextFixtures.forEach((fix, index) => {
            selMatch.innerHTML += `<option value="${index}">${fix.home} vs ${fix.away}</option>`;
        });
    }

    listBets.innerHTML = '';

    // Show resolved bet history
    if (state.betHistory && state.betHistory.length > 0) {
        state.betHistory.slice(-10).reverse().forEach(bet => {
            let currText = bet.currency === 'coins' ? 'â‚¬ Club' : 'Premium';
            let resultIcon = bet.result === 'exact' ? 'âœ… EXACTO' : bet.result === 'winner' ? 'âœ… GANADOR' : 'âŒ FALLO';
            let resultColor = bet.result === 'fail' ? 'red' : 'green';
            listBets.innerHTML += `
            <div class="bg-[#111119] border border-slate-600/50 p-3 rounded flex justify-between items-center opacity-80">
                <div>
                    <div class="text-[10px] text-${resultColor}-400 font-bold mb-1 uppercase">${resultIcon}</div>
                    <div class="text-xs text-white">${bet.home} vs ${bet.away}</div>
                    <div class="text-[10px] text-slate-400 mt-1">PronÃ³stico: <span class="text-white font-bold bg-slate-800 px-2 py-0.5 rounded">${bet.hG} - ${bet.aG}</span> | Real: <span class="text-white font-bold">${bet.realHG}-${bet.realAG}</span></div>
                </div>
                <div class="text-right">
                    <div class="text-lg font-mono font-bold text-${bet.result === 'fail' ? 'red' : 'green'}-400">${bet.result === 'fail' ? '-' : '+'}${bet.winnings || bet.amount}</div>
                    <div class="text-[9px] text-slate-500 uppercase">${currText}</div>
                </div>
            </div>`;
        });
    }

    // Show active bets
    if (!state.activeBets || state.activeBets.length === 0) {
        if (!state.betHistory || state.betHistory.length === 0) {
            listBets.innerHTML = '<div class="text-slate-500 text-xs italic text-center mt-4">No tienes apuestas activas para esta jornada.</div>';
        }
        return;
    }

    state.activeBets.forEach(bet => {
        let currText = bet.currency === 'coins' ? 'â‚¬ Club' : 'Premium';
        listBets.innerHTML = `
        <div class="bg-[#111119] border border-yellow-500/50 p-3 rounded flex justify-between items-center">
            <div>
                <div class="text-[10px] text-yellow-400 font-bold mb-1 uppercase">â³ Boleto en Curso</div>
                <div class="text-xs text-white">${bet.home} vs ${bet.away}</div>
                <div class="text-[10px] text-slate-400 mt-1">PronÃ³stico: <span class="text-white font-bold bg-slate-800 px-2 py-0.5 rounded">${bet.hG} - ${bet.aG}</span></div>
            </div>
            <div class="text-right">
                <div class="text-[9px] font-bold text-slate-300 uppercase">InversiÃ³n</div>
                <div class="text-lg font-mono font-bold text-${bet.currency === 'coins' ? 'green' : 'yellow'}-400">${bet.amount}</div>
                <div class="text-[9px] text-slate-500 uppercase">${currText}</div>
            </div>
        </div>` + listBets.innerHTML;
    });
}

window.placeBet = function () {
    const matchIdx = document.getElementById('bet-match-select').value;
    const hG = parseInt(document.getElementById('bet-hg').value);
    const aG = parseInt(document.getElementById('bet-ag').value);
    const amount = parseInt(document.getElementById('bet-amount').value);
    const currency = document.getElementById('bet-currency').value;

    if (isNaN(hG) || isNaN(aG) || isNaN(amount) || amount < 10) return showAlert("Introduce datos vÃ¡lidos. MÃ­nimo 10 de apuesta.");
    if (currency === 'coins' && state.economy.coins < amount) return showAlert("No hay fondos suficientes en el club.");
    if (currency === 'premium' && state.economy.premium < amount) return showAlert("No tienes suficientes Monedas Premium.");

    if (currency === 'coins') state.economy.coins -= amount;
    else state.economy.premium -= amount;

    const fixture = state.nextFixtures[matchIdx];
    state.activeBets.push({ home: fixture.home, away: fixture.away, hG: hG, aG: aG, amount: amount, currency: currency });

    saveState();
    renderBetTab();
    showAlert(`Boleto validado: ${amount} apostados al resultado ${hG}-${aG}.`);
}

/* =========================================================================
   LIGA Y TABLA DE CLASIFICACIÃ“N
   ========================================================================= */
function renderLeague() {
    const tbody = document.getElementById('league-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const sorted = [...state.league].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));

    sorted.forEach((t, i) => {
        const isUserClass = t.isUser ? 'user-row' : '';
        const badgeObj = t.isUser ? state.team : (t.badge || AI_TEAMS[0]);
        const miniBadge = getBadgeHTML(t.name, badgeObj.shape, badgeObj.c1, badgeObj.c2, "w-6 h-8 text-[8px] mx-auto border border-white/10", badgeObj.pattern, badgeObj.icon);

        tbody.innerHTML += `
        <tr class="${isUserClass}">
            <td class="text-center font-bold">${i + 1}</td>
            <td class="text-center p-1">${miniBadge}</td>
            <td class="text-white">${t.name}</td>
            <td>${t.pld}</td>
            <td>${t.w}</td>
            <td>${t.d}</td>
            <td>${t.l}</td>
            <td>${t.gf}</td>
            <td>${t.ga}</td>
            <td>${t.gf - t.ga}</td>
            <td class="text-white font-bold text-sm bg-slate-800/50 text-center">${t.pts}</td>
        </tr>`;
    });
}

function updateTeamStats(team, gf, ga) {
    if (!team) return;
    team.pld++; team.gf += gf; team.ga += ga;
    if (gf > ga) { team.w++; team.pts += 3; }
    else if (gf === ga) { team.d++; team.pts += 1; }
    else { team.l++; }
}

/* =========================================================================
   ENTRENAMIENTO Y VESTUARIO
   ========================================================================= */
function renderTrainStatus() {
    const st = document.getElementById('train-status');
    if (st) st.textContent = state.flags.canTrain ? "PROGRAMACIÃ“N DISPONIBLE" : "SESIÃ“N COMPLETADA. JUEGA PARA AVANZAR.";
}

window.executeWeeklyTraining = function () {
    if (!state.flags.canTrain) return showAlert("Los jugadores estÃ¡n agotados. Juega la jornada de liga para avanzar de semana.");
    if (state.roster.length === 0) return showAlert("No tienes jugadores.");

    const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
    days.forEach(d => {
        let type = document.getElementById(`train-${d}`).value;
        state.roster.forEach(p => {
            if (type !== 'rest') {
                if (p.pos === 'POR') {
                    if (type === 'atk') { p.saq++; p.sal++; }
                    if (type === 'def') { p.par++; p.ref++; }
                    if (type === 'phy') { p.vel++; p.posi++; }
                } else {
                    if (type === 'atk' && (p.pos === 'DEL' || p.pos === 'MED')) { p.sho++; p.pas++; }
                    if (type === 'def' && (p.pos !== 'DEL')) { p.def++; p.phy++; }
                    if (type === 'phy') { p.pac++; p.phy++; }
                }
                p.con = Math.max(10, p.con - 6);
            } else {
                p.con = Math.min(100, p.con + 15);
            }
            p.ovr = calcPlayerOVR(p);
        });
    });

    state.flags.canTrain = false; saveState(); renderTrainStatus(); updateUI();
    showAlert("Programa completado. Atributos y CondiciÃ³n FÃ­sica actualizados.");
}

function renderTalkStatus() {
    const st = document.getElementById('talk-status');
    if (st) st.textContent = state.flags.canTalk ? "DISPONIBLE" : "COMPLETADO";
}

window.executeTalk = function (tone) {
    if (!state.flags.canTalk) return showAlert("Ya has dado la charla pre-partido.");
    let xi = getStartingXI();
    let bench = state.roster.filter(p => !state.lineup.includes(p.id));

    if (tone === 'calm') {
        state.roster.forEach(p => p.morale = Math.min(100, p.morale + 5));
        showAlert("Toda la plantilla sube +5 de Moral.");
    } else if (tone === 'aggressive') {
        if (Math.random() < 0.7) {
            state.roster.forEach(p => p.morale = Math.min(100, p.morale + 20));
            showAlert("Â¡La bronca ha funcionado! (+20 Moral).");
        } else {
            state.roster.forEach(p => p.morale = Math.max(0, p.morale - 15));
            showAlert("Te has pasado. El equipo estÃ¡ presionado (-15 Moral).");
        }
    } else if (tone === 'passionate') {
        state.roster.forEach(p => { if (Math.random() < 0.5) p.morale = Math.min(100, p.morale + 15); });
        showAlert("El discurso ha calado en parte de la plantilla (+15 Moral).");
    } else if (tone === 'assertive') {
        xi.forEach(p => p.morale = Math.min(100, p.morale + 10));
        bench.forEach(p => p.morale = Math.max(0, p.morale - 5));
        showAlert("Titulares suben (+10 Moral), suplentes bajan (-5 Moral).");
    }

    state.flags.canTalk = false; saveState(); renderTalkStatus();
}

/* =========================================================================
   PLANTILLA Y TÃCTICAS (ARRASTRAR Y SOLTAR)
   ========================================================================= */
function getAttrClass(val) {
    if (val >= 85) return 'bg-[#10b981] text-white';
    if (val >= 70) return 'bg-[#eab308] text-black';
    if (val >= 50) return 'bg-[#f97316] text-white';
    return 'bg-[#ef4444] text-white';
}

window.executeTraining = function () {
    let injuredCount = 0;
    let recoveredCount = 0;

    state.roster.forEach(p => {
        if (p.injuryMatches && p.injuryMatches > 0) return; // Injured players can't train

        if (p.con < 85) {
            p.con = Math.min(100, p.con + 15);
            recoveredCount++;
        } else {
            // Risk of overtraining
            if (Math.random() < 0.3) {
                p.con = 30;
                p.injuryMatches = Math.floor(Math.random() * 3) + 1; // 1 to 3 matches
                injuredCount++;
            } else {
                p.con = 100;
            }
        }
    });

    saveState();
    renderSquad();
    renderTactics();

    if (injuredCount > 0) {
        showConfirm(`Entrenamiento finalizado. Â¡CUIDADO! ${injuredCount} jugador(es) se han lesionado por sobrecarga fÃ­sica. Revisa la EnfermerÃ­a.`, () => { });
    } else {
        showAlert("Entrenamiento completado. La plantilla ha recuperado condiciÃ³n fÃ­sica.");
    }
};

window.showInjuries = function () {
    const listEl = document.getElementById('injuries-list');
    const modal = document.getElementById('modal-injuries');
    if (!listEl || !modal) return;

    listEl.innerHTML = '';
    const injured = state.roster.filter(p => p.injuryMatches && p.injuryMatches > 0);

    if (injured.length === 0) {
        listEl.innerHTML = '<div class="text-center text-slate-400 py-6 text-sm">No hay jugadores en la enfermerÃ­a. Â¡Plantilla sana! ðŸ</div>';
    } else {
        injured.forEach(p => {
            listEl.innerHTML += `
            <div class="flex justify-between items-center bg-[#1c1c28] p-3 rounded border border-red-900/50">
                <div class="flex items-center gap-3">
                    <img src="${p.img}" class="w-8 h-8 rounded-full border border-red-500">
                    <div>
                        <p class="text-white font-bold text-sm">${p.name}</p>
                        <p class="text-xs text-slate-400">OVR: ${p.ovr} &bull; POS: ${p.pos}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-red-500 font-bold text-lg leading-none mb-1">ðŸ¤• ${p.injuryMatches}</p>
                    <p class="text-[9px] text-slate-400 uppercase tracking-widest leading-none">Partidos de Baja</p>
                </div>
            </div>`;
        });
    }

    modal.classList.remove('hidden');
};

function renderSquad() {
    const tbody = document.getElementById('squad-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const posOrder = { 'POR': 1, 'DEF': 2, 'MED': 3, 'DEL': 4 };
    const sorted = [...state.roster].sort((a, b) => posOrder[a.pos] - posOrder[b.pos] || b.ovr - a.ovr);

    sorted.forEach(p => {
        let pClass = `pos-${p.pos.toLowerCase()}`;
        let conIcon = p.con >= 85 ? 'ðŸŸ¢' : p.con >= 60 ? 'ðŸŸ¡' : 'ðŸ”´';
        let moralColor = p.morale >= 80 ? '#10b981' : p.morale >= 40 ? '#f59e0b' : '#ef4444';

        let conDisplay = `${conIcon} ${p.con}%`;
        let nameDisplay = p.name;
        if (p.injuryMatches && p.injuryMatches > 0) {
            conDisplay = `<span class="text-red-500 text-xs">ðŸ¤• ${p.injuryMatches}P</span>`;
            nameDisplay = `<span class="text-red-400">${p.name}</span>`;
        }

        tbody.innerHTML += `
        <tr>
            <td class="text-center" title="${p.pos === 'POR' ? 'Portero' : p.pos === 'DEF' ? 'Defensa' : p.pos === 'MED' ? 'Mediocampista' : 'Delantero'}"><span class="pos-badge ${pClass}">${p.pos}</span></td>
            <td class="font-bold text-white" title="${p.name}"><div class="flex items-center gap-2"><img src="${p.img}" class="w-6 h-6 rounded-full border border-slate-600">${nameDisplay}</div></td>
            <td class="font-bold text-[10px] text-center" title="CondiciÃ³n FÃ­sica: ${p.con}%">${conDisplay}</td>
            <td title="Moral: ${p.morale}%">
                <div class="w-full h-1.5 bg-slate-700 rounded overflow-hidden"><div class="h-full" style="width:${p.morale}%; background:${moralColor};"></div></div>
            </td>
            <td class="font-bold text-white text-sm bg-slate-800/50 text-center" title="Overall: ${p.ovr}">${p.ovr}</td>
            <td class="text-center" title="${p.pos === 'POR' ? 'Salida' : 'Velocidad'}: ${p.pos === 'POR' ? p.sal : p.pac}">${p.pos === 'POR' ? p.sal : p.pac}</td>
            <td class="text-center" title="${p.pos === 'POR' ? 'Paradas' : 'Tiro'}: ${p.pos === 'POR' ? p.par : p.sho}">${p.pos === 'POR' ? p.par : p.sho}</td>
            <td class="text-center" title="${p.pos === 'POR' ? 'Saque' : 'Pase'}: ${p.pos === 'POR' ? p.saq : p.pas}">${p.pos === 'POR' ? p.saq : p.pas}</td>
            <td class="text-center" title="${p.pos === 'POR' ? 'Reflejos' : 'Defensa'}: ${p.pos === 'POR' ? p.ref : p.def}">${p.pos === 'POR' ? p.ref : p.def}</td>
            <td class="text-center" title="${p.pos === 'POR' ? 'Posicionamiento' : 'FÃ­sico'}: ${p.pos === 'POR' ? p.posi : p.phy}">${p.pos === 'POR' ? p.posi : p.phy}</td>
        </tr>`;
    });
    const ovrTag = document.getElementById('squad-ovr');
    if (ovrTag) ovrTag.textContent = getTeamOvr();
}

let dragSrc = { id: null, slot: null };
window.dragStart = function (e, pId, slotIndex) {
    dragSrc = { id: pId, slot: slotIndex };

    // Crear ghost personalizado: solo la bola con la imagen del jugador
    const player = state.roster.find(p => p.id === pId);
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    if (player) {
        ghost.style.backgroundImage = `url(${player.img})`;
    }
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 22, 22);
    // Limpiar ghost despuÃ©s de que el navegador lo capture
    setTimeout(() => { if (ghost.parentNode) ghost.parentNode.removeChild(ghost); }, 100);

    setTimeout(() => e.target.classList.add('opacity-50'), 0);
};
window.dragEnd = function (e) { e.target.classList.remove('opacity-50'); };
window.allowDrop = function (e) { e.preventDefault(); };

window.dropOnPitch = function (e, targetSlotIndex) {
    e.preventDefault(); if (!dragSrc.id) return;

    const dragPlayer = state.roster.find(p => p.id === dragSrc.id);
    if (dragPlayer && dragPlayer.injuryMatches > 0) {
        showAlert("No puedes alinear a un jugador lesionado.");
        return;
    }

    const targetPlayerId = state.lineup[targetSlotIndex];
    if (dragSrc.slot !== null) {
        state.lineup[dragSrc.slot] = targetPlayerId;
        state.lineup[targetSlotIndex] = dragSrc.id;
    } else {
        state.lineup[targetSlotIndex] = dragSrc.id;
    }
    saveState(); renderTactics();
};

window.dropOnBench = function (e) {
    e.preventDefault();
    if (dragSrc.slot !== null) { state.lineup[dragSrc.slot] = null; saveState(); renderTactics(); }
};

window.changeFormation = function () { state.formation = document.getElementById('tactics-formation').value; saveState(); renderTactics(); }

window.autoFillLineup = function () {
    const posMap = {
        '4-4-2': ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'DEL', 'DEL'],
        '4-3-3': ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'DEL', 'DEL', 'DEL'],
        '5-3-2': ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'DEL', 'DEL'],
        '3-4-3': ['POR', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'DEL', 'DEL', 'DEL'],
        '4-2-3-1': ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'MED', 'DEL'],
        '5-4-1': ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'DEL']
    };
    const targetLayout = posMap[state.formation];
    let newLineup = new Array(11).fill(null);
    let availableRoster = [...state.roster].filter(p => !p.injuryMatches || p.injuryMatches <= 0).sort((a, b) => b.ovr - a.ovr);

    for (let i = 0; i < 11; i++) {
        let neededPos = targetLayout[i];
        let bestPlayerIndex = availableRoster.findIndex(p => p.pos === neededPos);
        if (bestPlayerIndex !== -1) {
            newLineup[i] = availableRoster[bestPlayerIndex].id;
            availableRoster.splice(bestPlayerIndex, 1);
        }
    }
    for (let i = 0; i < 11; i++) {
        if (newLineup[i] === null && availableRoster.length > 0) {
            newLineup[i] = availableRoster[0].id;
            availableRoster.splice(0, 1);
        }
    }
    state.lineup = newLineup; saveState(); renderTactics();
};

function renderTactics() {
    const formSelect = document.getElementById('tactics-formation');
    if (formSelect) formSelect.value = state.formation;
    const pitch = document.getElementById('pitch-players');
    const benchContainer = document.getElementById('bench-list');
    if (!pitch || !benchContainer) return;
    pitch.innerHTML = ''; benchContainer.innerHTML = '';

    const layouts = {
        '4-4-2': [{ x: 50, y: 92 }, { x: 20, y: 65 }, { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 80, y: 65 }, { x: 20, y: 35 }, { x: 40, y: 40 }, { x: 60, y: 40 }, { x: 80, y: 35 }, { x: 40, y: 15 }, { x: 60, y: 15 }],
        '4-3-3': [{ x: 50, y: 92 }, { x: 20, y: 70 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 70 }, { x: 30, y: 45 }, { x: 50, y: 40 }, { x: 70, y: 45 }, { x: 20, y: 20 }, { x: 50, y: 15 }, { x: 80, y: 20 }],
        '5-3-2': [{ x: 50, y: 92 }, { x: 10, y: 65 }, { x: 30, y: 72 }, { x: 50, y: 75 }, { x: 70, y: 72 }, { x: 90, y: 65 }, { x: 30, y: 40 }, { x: 50, y: 45 }, { x: 70, y: 40 }, { x: 40, y: 15 }, { x: 60, y: 15 }],
        '3-4-3': [{ x: 50, y: 92 }, { x: 25, y: 70 }, { x: 50, y: 75 }, { x: 75, y: 70 }, { x: 15, y: 45 }, { x: 38, y: 40 }, { x: 62, y: 40 }, { x: 85, y: 45 }, { x: 25, y: 20 }, { x: 50, y: 15 }, { x: 75, y: 20 }],
        '4-2-3-1': [{ x: 50, y: 92 }, { x: 20, y: 70 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 70 }, { x: 35, y: 50 }, { x: 65, y: 50 }, { x: 20, y: 30 }, { x: 50, y: 25 }, { x: 80, y: 30 }, { x: 50, y: 10 }],
        '5-4-1': [{ x: 50, y: 92 }, { x: 10, y: 70 }, { x: 30, y: 72 }, { x: 50, y: 75 }, { x: 70, y: 72 }, { x: 90, y: 70 }, { x: 20, y: 45 }, { x: 40, y: 50 }, { x: 60, y: 50 }, { x: 80, y: 45 }, { x: 50, y: 20 }]
    };

    layouts[state.formation].forEach((pos, index) => {
        const player = state.roster.find(p => p.id === state.lineup[index]);
        let innerHTML = '';
        if (player) {
            let conColor = player.con >= 85 ? '#10b981' : player.con >= 60 ? '#eab308' : '#ef4444';
            let injuryBadge = '';
            if (player.injuryMatches && player.injuryMatches > 0) {
                conColor = '#ef4444';
                injuryBadge = `<div class="absolute -top-1 -right-1 bg-red-600 rounded-full text-[10px] w-4 h-4 flex items-center justify-center">ðŸ¤•</div>`;
            }
            innerHTML = `
                <div class="pitch-ovr-tag">${player.ovr}</div>
                <div class="pitch-shirt relative" style="background-image:url(${player.img}); border-color: ${conColor}" draggable="true" ondragstart="dragStart(event, ${player.id}, ${index})" ondragend="dragEnd(event)">${injuryBadge}</div>
                <div class="pitch-name">${player.name.split(' ').pop()}</div>
            `;
        } else {
            innerHTML = `<div class="pitch-shirt border-dashed bg-black/50 text-slate-400">+</div>`;
        }
        pitch.innerHTML += `<div class="pitch-player" data-slot="${index}" style="left:${pos.x}%; top:${pos.y}%;" ondragover="allowDrop(event)" ondrop="dropOnPitch(event, ${index})">${innerHTML}</div>`;
    });

    const benchPlayers = state.roster.filter(p => !state.lineup.includes(p.id));
    benchPlayers.forEach(p => {
        let pClass = `pos-${p.pos.toLowerCase()}`;
        let nameDisplay = p.name;
        let conDisplay = `Con: ${p.con}%`;
        if (p.injuryMatches && p.injuryMatches > 0) {
            nameDisplay = `<span class="text-red-400">${p.name} ðŸ¤•</span>`;
            conDisplay = `<span class="text-red-500">${p.injuryMatches}P</span>`;
        }
        benchContainer.innerHTML += `
        <div class="bench-player" data-pid="${p.id}" draggable="true" ondragstart="dragStart(event, ${p.id}, null)" ondragend="dragEnd(event)">
            <div class="flex items-center gap-2">
                <img src="${p.img}" class="w-6 h-6 rounded-full object-cover border border-[#313145]">
                <span class="pos-badge ${pClass} text-[8px] w-auto px-1">${p.pos}</span>
                <span class="text-white text-[10px] font-bold truncate max-w-[80px] block">${nameDisplay}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[9px] text-slate-400">${conDisplay}</span>
                <span class="text-yellow-400 font-bold bg-[#111119] px-1.5 py-0.5 rounded text-[10px] border border-[#313145]">${p.ovr}</span>
            </div>
        </div>`;
    });

    // Init touch drag for mobile
    initTouchDrag();
}

/* Touch drag support for mobile tactics */
let touchDragData = { id: null, slot: null, ghost: null };

function initTouchDrag() {
    const pitch = document.getElementById('pitch-players');
    const bench = document.getElementById('bench-list');
    if (!pitch || !bench) return;

    pitch.querySelectorAll('.pitch-player').forEach(el => {
        const shirt = el.querySelector('.pitch-shirt[draggable="true"]');
        if (!shirt) return;
        shirt.addEventListener('touchstart', handleTouchStart, { passive: false });
        shirt.addEventListener('touchmove', handleTouchMove, { passive: false });
        shirt.addEventListener('touchend', handleTouchEnd, { passive: false });
    });

    bench.querySelectorAll('.bench-player').forEach(el => {
        el.addEventListener('touchstart', handleTouchStart, { passive: false });
        el.addEventListener('touchmove', handleTouchMove, { passive: false });
        el.addEventListener('touchend', handleTouchEnd, { passive: false });
    });
}

function handleTouchStart(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const pitchPlayer = el.closest('.pitch-player');

    if (pitchPlayer) {
        const slotIndex = parseInt(pitchPlayer.dataset.slot);
        const playerId = state.lineup[slotIndex];
        if (!playerId) return;
        touchDragData = { id: playerId, slot: slotIndex };
    } else {
        const benchPlayer = el.closest('.bench-player');
        if (!benchPlayer) return;
        const pid = parseInt(benchPlayer.dataset.pid);
        touchDragData = { id: pid, slot: null };
    }

    const player = state.roster.find(p => p.id === touchDragData.id);
    const ghost = document.createElement('div');
    ghost.id = 'touch-drag-ghost';
    ghost.style.cssText = 'position:fixed;z-index:9999;width:44px;height:44px;border-radius:50%;border:2px solid #facc15;background-size:cover;background-position:center;pointer-events:none;opacity:0.9;box-shadow:0 0 15px rgba(250,204,21,0.5);';
    if (player) ghost.style.backgroundImage = `url(${player.img})`;
    document.body.appendChild(ghost);
    touchDragData.ghost = ghost;

    const touch = e.touches[0];
    ghost.style.left = (touch.clientX - 22) + 'px';
    ghost.style.top = (touch.clientY - 22) + 'px';
    el.classList.add('opacity-50');
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!touchDragData.ghost) return;
    const touch = e.touches[0];
    touchDragData.ghost.style.left = (touch.clientX - 22) + 'px';
    touchDragData.ghost.style.top = (touch.clientY - 22) + 'px';
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (!touchDragData.id) return;

    if (touchDragData.ghost) { touchDragData.ghost.remove(); touchDragData.ghost = null; }
    document.querySelectorAll('.opacity-50').forEach(el => el.classList.remove('opacity-50'));

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!dropTarget) { touchDragData = { id: null, slot: null, ghost: null }; return; }

    const pitchSlot = dropTarget.closest('.pitch-player');
    if (pitchSlot) {
        const targetSlot = parseInt(pitchSlot.dataset.slot);
        const targetPlayerId = state.lineup[targetSlot];
        if (touchDragData.slot !== null) {
            state.lineup[touchDragData.slot] = targetPlayerId;
            state.lineup[targetSlot] = touchDragData.id;
        } else {
            state.lineup[targetSlot] = touchDragData.id;
        }
        saveState(); renderTactics();
    } else if (dropTarget.closest('#bench-list') || dropTarget.closest('#tactics-bench')) {
        if (touchDragData.slot !== null) {
            state.lineup[touchDragData.slot] = null;
            saveState(); renderTactics();
        }
    }

    touchDragData = { id: null, slot: null, ghost: null };
}

/* =========================================================================
   MERCADO Y BUSCADOR CENTRADO SIN LUPA
   ========================================================================= */
let marketMode = 'buy';
let currentMarketFilter = 'ALL';

window.setMarketMode = function (mode) {
    marketMode = mode;
    document.getElementById('mode-buy').className = mode === 'buy' ? "text-white font-bold border-b-2 border-red-500 pb-1 uppercase tracking-widest text-xs" : "text-slate-500 hover:text-white font-bold pb-1 cursor-pointer uppercase tracking-widest text-xs transition";
    document.getElementById('mode-sell').className = mode === 'sell' ? "text-white font-bold border-b-2 border-red-500 pb-1 uppercase tracking-widest text-xs" : "text-slate-500 hover:text-white font-bold pb-1 cursor-pointer uppercase tracking-widest text-xs transition";
    document.getElementById('market-th-rep').style.display = mode === 'buy' ? "table-cell" : "none";
    document.getElementById('market-th-prem').style.display = mode === 'buy' ? "table-cell" : "none";

    // Change "Precio" header text to fit the context
    const thPrecio = document.getElementById('market-th-price');
    if (thPrecio) thPrecio.textContent = mode === 'buy' ? "Precio" : "Valor Venta";

    // Adjust column widths for each mode so separators stay aligned
    const table = document.getElementById('market-table');
    if (table) {
        const ths = table.querySelectorAll('thead th');
        if (mode === 'buy') {
            // 7 columns: Jugador 30%, Pos 8%, OVR 8%, Rep 10%, Precio 14%, Premium 12%, Gestion 18%
            if (ths[0]) ths[0].style.width = '30%';
            if (ths[1]) ths[1].style.width = '8%';
            if (ths[2]) ths[2].style.width = '8%';
            if (ths[3]) ths[3].style.width = '10%';
            if (ths[4]) ths[4].style.width = '14%';
            if (ths[5]) ths[5].style.width = '12%';
            if (ths[6]) ths[6].style.width = '18%';
        } else {
            // 5 visible columns: Jugador 35%, Pos 10%, OVR 10%, Valor Venta 20%, Gestion 25%
            if (ths[0]) ths[0].style.width = '35%';
            if (ths[1]) ths[1].style.width = '10%';
            if (ths[2]) ths[2].style.width = '10%';
            if (ths[4]) ths[4].style.width = '20%';
            if (ths[6]) ths[6].style.width = '25%';
        }
    }

    // Clear search when switching modes
    const searchInput = document.getElementById('market-search');
    if (searchInput) searchInput.value = '';

    filterMarket();
};

window.filterMarket = function (pos) {
    if (pos) currentMarketFilter = pos;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`filter-${currentMarketFilter}`);
    if (btn) btn.classList.add('active');

    const formatM = (num) => (num / 1000000).toFixed(1) + 'M';
    document.getElementById('market-funds').textContent = `â‚¬${formatM(state.economy.coins)}`;
    document.getElementById('market-prem').textContent = `â—ˆ${state.economy.premium.toLocaleString()}`;

    const searchInput = document.getElementById('market-search');
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const tbody = document.getElementById('market-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let items = marketMode === 'buy' ? PLAYERS_DB.filter(db_p => !state.roster.find(rp => rp.id === db_p.id)) : state.roster;
    if (currentMarketFilter !== 'ALL') items = items.filter(p => p.pos === currentMarketFilter);
    if (searchTerm) items = items.filter(p => p.name.toLowerCase().includes(searchTerm));

    const colSpan = marketMode === 'buy' ? 7 : 5;
    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${colSpan}" class="text-center text-slate-500 py-6 text-xs">Sin resultados de bÃºsqueda.</td></tr>`;
        return;
    }

    items.forEach(p => {
        let pClass = `pos-${p.pos.toLowerCase()}`;
        if (marketMode === 'buy') {
            const canRep = state.stats.rep >= p.rep;
            tbody.innerHTML += `
            <tr>
                <td class="pl-4"><div class="flex items-center gap-2 font-bold text-white"><img src="${p.img}" class="w-6 h-6 rounded-full border border-slate-600 flex-shrink-0">${p.name}</div></td>
                <td class="text-center"><span class="pos-badge ${pClass}">${p.pos}</span></td>
                <td class="font-bold text-white text-sm bg-slate-800/50 text-center">${p.ovr}</td>
                <td class="${canRep ? 'text-slate-400' : 'text-red-500 font-bold'} text-center">â˜… ${p.rep}</td>
                <td class="font-mono text-green-400 text-right pr-4">â‚¬${formatM(p.priceBasic)}</td>
                <td class="font-mono text-yellow-400 text-right pr-4">â—ˆ${p.pricePrem.toLocaleString()}</td>
                <td class="text-center"><div class="flex gap-1 justify-center"><button class="btn-action px-2 py-1 text-[9px]" onclick="buyPlayer(${p.id}, 'basic')">FICHAR</button><button class="btn-buy premium px-2 py-1 text-[9px]" onclick="buyPlayer(${p.id}, 'premium')">PREMIUM</button><button class="text-xs bg-slate-700 px-1.5 py-1 rounded hover:bg-slate-600 text-white cursor-pointer" onclick="showPlayerInfo(${p.id})">â„¹</button></div></td>
            </tr>`;
        } else {
            const sellValue = Math.floor(p.priceBasic * 0.6);
            tbody.innerHTML += `
            <tr>
                <td class="pl-4"><div class="flex items-center gap-2 font-bold text-white"><img src="${p.img}" class="w-6 h-6 rounded-full border border-slate-600 flex-shrink-0">${p.name}</div></td>
                <td class="text-center"><span class="pos-badge ${pClass}">${p.pos}</span></td>
                <td class="font-bold text-white text-sm bg-slate-800/50 text-center">${p.ovr}</td>
                <td class="font-mono text-green-400 text-right pr-4 font-bold">+ â‚¬${formatM(sellValue)}</td>
                <td class="text-center"><div class="flex gap-2 justify-center"><button class="bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 px-4 rounded text-xs shadow-lg transition" onclick="sellPlayer(${p.id}, ${sellValue})">VENDER</button><button class="text-xs bg-slate-700 px-2 py-1.5 rounded hover:bg-slate-600 text-white cursor-pointer transition" onclick="showPlayerInfo(${p.id})">â„¹ INFO</button></div></td>
            </tr>`;
        }
    });
}

window.buyPlayer = function (id, curr) {
    const p = PLAYERS_DB.find(x => x.id === id);

    // Only verify reputation for 'basic' purchases. Premium skips reputation block!
    if (curr === 'basic' && state.stats.rep < p.rep) {
        return showAlert(`ReputaciÃ³n Insuficiente para Fichaje EstÃ¡ndar (Req: â˜… ${p.rep}).`);
    }

    if (curr === 'basic') {
        if (state.economy.coins < p.priceBasic) return showAlert("Presupuesto del club insuficiente.");
        state.economy.coins -= p.priceBasic;
    } else {
        if (state.economy.premium < p.pricePrem) return showAlert("Moneda Premium insuficiente.");
        state.economy.premium -= p.pricePrem;
    }

    let newPlayer = JSON.parse(JSON.stringify(p));
    newPlayer.con = 100;
    newPlayer.morale = 100;

    state.roster.push(newPlayer);
    const emptySlot = state.lineup.findIndex(slot => slot === null);
    if (emptySlot !== -1) state.lineup[emptySlot] = p.id;

    addEmail('Director Deportivo', `Fichaje Cerrado: ${p.name}`, `Hemos llegado a un acuerdo y el jugador se incorpora al club.`);
    saveState(); filterMarket();
}

window.sellPlayer = function (id, sellValue) {
    showConfirm(`Â¿Vender al jugador y aÃ±adir â‚¬${(sellValue / 1000000).toFixed(1)}M al club?`, () => {
        state.economy.coins += sellValue;
        state.roster = state.roster.filter(p => p.id !== id);
        for (let i = 0; i < state.lineup.length; i++) { if (state.lineup[i] === id) state.lineup[i] = null; }
        saveState(); filterMarket();
    });
}

window.buyIAP = function () { document.getElementById('modal-store').classList.remove('hidden'); renderCart(); }

/* =========================================================================
   CARRITO DE COMPRA Y METODO DE PAGO (1 PACK A LA VEZ CON PRECIOS EUR)
   ========================================================================= */
let selectedPack = null; // { amount: number, price: number } o null

window.selectPack = function (amount, price) {
    // Solo un paquete a la vez: si ya estÃ¡ seleccionado el mismo, deseleccionar
    if (selectedPack && selectedPack.amount === amount) {
        selectedPack = null;
    } else {
        selectedPack = { amount, price };
    }
    renderCart();
}

window.addToCart = function (amount) {
    // Legacy compat - mapear a selectPack
    const priceMap = { 500: 0.99, 2000: 3.99, 5000: 7.99, 10000: 14.99, 25000: 34.99, 50000: 59.99 };
    selectPack(amount, priceMap[amount] || 0.99);
}

window.clearCart = function () {
    selectedPack = null;
    renderCart();
}

window.removeFromCart = function () {
    selectedPack = null;
    renderCart();
}

function showMatchPost(isHome, myMatch, hG, aG, hXG, aXG) {
    document.getElementById('match-modal').classList.add('hidden');
    document.getElementById('match-post').classList.remove('hidden');

    const titleEl = document.getElementById('post-title');
    const msgEl = document.getElementById('post-message');
    const bgEl = document.getElementById('post-bg');

    let isWin = false, isDraw = false;
    if (isHome) {
        if (hG > aG) isWin = true;
        else if (hG === aG) isDraw = true;
    } else {
        if (aG > hG) isWin = true;
        else if (hG === aG) isDraw = true;
    }

    if (isWin) {
        titleEl.textContent = "VICTORIA";
        titleEl.className = "text-5xl font-gaming text-green-400 mb-4 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]";
        msgEl.innerHTML = "Excelente planteamiento tÃ¡ctico.<br>Sumamos 3 puntos clave.";
        bgEl.className = "glass-panel p-12 rounded-2xl max-w-2xl w-full text-center border-t-8 border-green-500 shadow-[0_0_80px_rgba(74,222,128,0.2)]";
        playSFX('win');
    } else if (isDraw) {
        titleEl.textContent = "EMPATE";
        titleEl.className = "text-5xl font-gaming text-yellow-500 mb-4 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]";
        msgEl.innerHTML = "Reparto de puntos.<br>Hay margen de mejora.";
        bgEl.className = "glass-panel p-12 rounded-2xl max-w-2xl w-full text-center border-t-8 border-yellow-500 shadow-[0_0_80px_rgba(234,179,8,0.2)]";
    } else {
        titleEl.textContent = "DERROTA";
        titleEl.className = "text-5xl font-gaming text-red-500 mb-4 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]";
        msgEl.innerHTML = "El equipo no estuvo a la altura.<br>Toca revisar la tÃ¡ctica.";
        bgEl.className = "glass-panel p-12 rounded-2xl max-w-2xl w-full text-center border-t-8 border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.2)]";
        playSFX('lose');
    }
}

function renderCart() {
    const listEl = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    const totalEurEl = document.getElementById('cart-total-eur');
    const btnPayAmount = document.getElementById('btn-pay-amount');
    if (!listEl || !totalEl) return;

    // Actualizar selecciÃ³n visual de packs
    document.querySelectorAll('.store-pack').forEach(el => {
        el.classList.remove('selected');
        if (selectedPack && el.dataset.pack == selectedPack.amount) {
            el.classList.add('selected');
        }
    });

    if (!selectedPack) {
        listEl.innerHTML = '<div class="text-sky-500 text-xs text-center italic">NingÃºn paquete seleccionado</div>';
        totalEl.textContent = '0';
        if (totalEurEl) totalEurEl.textContent = '0,00 â‚¬';
        if (btnPayAmount) btnPayAmount.textContent = '0,00 â‚¬';
        updatePaymentButton();
        return;
    }

    const priceStr = selectedPack.price.toFixed(2).replace('.', ',');
    listEl.innerHTML = `
    <div class="flex justify-between items-center bg-[#132a4a] p-3 rounded border border-yellow-500/30">
        <div>
            <span class="text-sm text-yellow-400 font-mono font-bold">${selectedPack.amount.toLocaleString()} Monedas</span>
        </div>
        <div class="flex items-center gap-3">
            <span class="text-green-400 font-bold text-sm font-mono">${priceStr} â‚¬</span>
            <button onclick="removeFromCart()" class="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer px-2">âœ•</button>
        </div>
    </div>`;

    totalEl.textContent = selectedPack.amount.toLocaleString();
    if (totalEurEl) totalEurEl.textContent = priceStr + ' â‚¬';
    if (btnPayAmount) btnPayAmount.textContent = priceStr + ' â‚¬';
    updatePaymentButton();
}

function updatePaymentButton() {
    const payBtn = document.getElementById('btn-process-payment');
    const payMethod = document.getElementById('payment-method');
    if (!payBtn || !payMethod) return;

    const hasPack = selectedPack !== null;
    const hasMethod = payMethod.value !== '';

    if (hasPack && hasMethod) {
        payBtn.disabled = false;
        payBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        payBtn.disabled = true;
        payBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

window.closeStore = function () {
    document.getElementById('modal-store').classList.add('hidden');
    selectedPack = null;
    renderCart();
    const payMethod = document.getElementById('payment-method');
    if (payMethod) payMethod.value = '';
    const cardForm = document.getElementById('payment-card-form');
    if (cardForm) cardForm.classList.add('hidden');
}

window.processPayment = function () {
    if (!selectedPack) return showAlert("Selecciona un paquete de monedas.");
    const payMethod = document.getElementById('payment-method');
    if (!payMethod || payMethod.value === '') return showAlert("Selecciona un metodo de pago.");

    // Validar datos de tarjeta si es visa/mastercard
    if (payMethod.value === 'visa' || payMethod.value === 'mastercard') {
        const cardNum = document.getElementById('card-number').value.replace(/\s/g, '').trim();
        const cardExpiry = document.getElementById('card-expiry').value.trim();
        const cardCvv = document.getElementById('card-cvv').value.trim();
        const cardName = document.getElementById('card-name').value.trim();
        if (!cardNum || !cardExpiry || !cardCvv || !cardName) {
            return showAlert("Completa todos los datos de la tarjeta.");
        }
        if (cardNum.length !== 16 || !/^\d{16}$/.test(cardNum)) {
            return showAlert("El nÃºmero de tarjeta debe tener 16 dÃ­gitos.");
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
            return showAlert("El formato de caducidad debe ser MM/AA.");
        }
        if (!/^\d{3}$/.test(cardCvv)) {
            return showAlert("El CVV debe tener 3 dÃ­gitos.");
        }
    }

    const amount = selectedPack.amount;
    const priceStr = selectedPack.price.toFixed(2).replace('.', ',');
    state.economy.premium += amount;
    selectedPack = null;
    saveState();
    closeStore();
    showAlert(`Pago de ${priceStr} â‚¬ procesado correctamente. +${amount.toLocaleString()} Monedas Premium aÃ±adidas.`);
}

window.confirmIAP = function () {
    // Legacy - kept for compatibility
    processPayment();
}

/* =========================================================================
   MOTOR DE PARTIDO AVANZADO FM â€” ESTILO FOOTBALL MANAGER
   ========================================================================= */
let matchState = {
    mG: 0, oG: 0, min: 0, myProb: 0, oppProb: 0, interval: null, talkMod: 0, isHome: true,
    stats: { hPoss: 50, aPoss: 50, hShots: 0, aShots: 0, hSot: 0, aSot: 0, hCorners: 0, aCorners: 0, hXG: 0, aXG: 0 },
    events: [], pitchTokens: [], pitchInterval: null
};
let currentOpponent = null;

/* ---------- Formation rendering helpers ---------- */
function getFormationPositions442() {
    return [
        { row: 'POR', slots: [{ x: 50, y: 92 }] },
        { row: 'DEF', slots: [{ x: 15, y: 72 }, { x: 38, y: 72 }, { x: 62, y: 72 }, { x: 85, y: 72 }] },
        { row: 'MED', slots: [{ x: 15, y: 45 }, { x: 38, y: 45 }, { x: 62, y: 45 }, { x: 85, y: 45 }] },
        { row: 'DEL', slots: [{ x: 35, y: 18 }, { x: 65, y: 18 }] }
    ];
}

function renderFormationPanel(containerId, players, teamColor) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const sorted = [];
    const posOrder = { POR: 0, DEF: 1, MED: 2, DEL: 3 };
    players.sort((a, b) => (posOrder[a.pos] || 0) - (posOrder[b.pos] || 0));

    players.forEach((p, i) => {
        const ovr = p.ovr || calcPlayerOVR(p);
        const ratingClass = ovr >= 80 ? 'fm-rating-good' : ovr >= 65 ? 'fm-rating-avg' : 'fm-rating-bad';
        const div = document.createElement('div');
        div.className = 'fm-formation-player';
        div.innerHTML = `
            <div class="fm-formation-shirt" style="background-image:url('${p.img || ''}');background-color:${teamColor || '#1e293b'}">
                <span class="fm-formation-ovr">${ovr}</span>
            </div>
            <div class="fm-formation-info">
                <div class="fm-formation-name">${p.name}</div>
                <div class="fm-formation-pos">${p.pos}</div>
            </div>
            <span class="fm-formation-rating ${ratingClass}">${(6 + Math.random() * 2.5).toFixed(1)}</span>
        `;
        container.appendChild(div);
    });
}

function generateAIPlayers(teamName, ovr) {
    const positions = ['POR', 'DEF', 'DEF', 'DEF', 'DEF', 'MED', 'MED', 'MED', 'MED', 'DEL', 'DEL'];
    const players = [];
    const usedIds = new Set();
    for (let i = 0; i < 11; i++) {
        const pos = positions[i];
        const candidates = PLAYERS_DB.filter(p => p.pos === pos && !usedIds.has(p.id));
        if (candidates.length > 0) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            usedIds.add(pick.id);
            const pOvr = pick.ovr || calcPlayerOVR(pick);
            players.push({ name: pick.name, pos: pick.pos, ovr: pOvr, img: pick.img || '' });
        } else {
            const allPos = PLAYERS_DB.filter(p => !usedIds.has(p.id));
            if (allPos.length > 0) {
                const pick = allPos[Math.floor(Math.random() * allPos.length)];
                usedIds.add(pick.id);
                const pOvr = pick.ovr || calcPlayerOVR(pick);
                players.push({ name: pick.name, pos: pos, ovr: pOvr, img: pick.img || '' });
            } else {
                const pOvr = Math.max(40, ovr + Math.floor(Math.random() * 15) - 7);
                players.push({ name: 'Jugador ' + (i + 1), pos: pos, ovr: pOvr, img: '' });
            }
        }
    }
    return players;
}

/* ---------- Match Events Tabs ---------- */
window.fmEvtTab = function (team) {
    document.getElementById('fm-evt-tab-home').className = 'fm-evt-tab' + (team === 'home' ? ' active' : '');
    document.getElementById('fm-evt-tab-away').className = 'fm-evt-tab' + (team === 'away' ? ' active' : '');
    renderMatchEvents(team);
};

function renderMatchEvents(filter) {
    const list = document.getElementById('fm-events-list');
    if (!list) return;
    const filtered = matchState.events.filter(e => filter === 'home' ? e.side === 'home' : e.side === 'away');
    if (filtered.length === 0) {
        list.innerHTML = '<div class="text-slate-600 text-[10px] text-center mt-4 italic">Sin eventos aÃºn</div>';
        return;
    }
    list.innerHTML = filtered.map(e => `
        <div class="fm-event-item">
            <span class="fm-event-icon">${e.icon}</span>
            <span class="fm-event-text">${e.text}</span>
            <span class="fm-event-min">${e.min}'</span>
        </div>
    `).join('');
}

/* ---------- Dugout toggle ---------- */
window.toggleDugout = function () {
    const content = document.getElementById('fm-dugout-content');
    if (content) content.classList.toggle('expanded');
};

/* ---------- Mini Pitch Token Animation ---------- */
function initPitchTokens() {
    const tokensDiv = document.getElementById('fm-pitch-tokens');
    if (!tokensDiv) return;
    tokensDiv.innerHTML = '';
    matchState.pitchTokens = [];

    // Home team tokens (left side)
    const homePositions = [
        { x: 5, y: 50 }, // GK
        { x: 15, y: 20 }, { x: 15, y: 40 }, { x: 15, y: 60 }, { x: 15, y: 80 }, // DEF
        { x: 30, y: 25 }, { x: 30, y: 45 }, { x: 30, y: 55 }, { x: 30, y: 75 }, // MID
        { x: 42, y: 35 }, { x: 42, y: 65 } // FWD
    ];
    // Away team tokens (right side)
    const awayPositions = [
        { x: 95, y: 50 },
        { x: 85, y: 20 }, { x: 85, y: 40 }, { x: 85, y: 60 }, { x: 85, y: 80 },
        { x: 70, y: 25 }, { x: 70, y: 45 }, { x: 70, y: 55 }, { x: 70, y: 75 },
        { x: 58, y: 35 }, { x: 58, y: 65 }
    ];

    homePositions.forEach((pos, i) => {
        const token = document.createElement('div');
        token.className = 'fm-pitch-token fm-pitch-token-home';
        token.innerHTML = `<span class="fm-pitch-token-number">${i + 1}</span>`;
        token.style.left = pos.x + '%';
        token.style.top = pos.y + '%';
        tokensDiv.appendChild(token);
        matchState.pitchTokens.push({ el: token, baseX: pos.x, baseY: pos.y, side: 'home' });
    });

    awayPositions.forEach((pos, i) => {
        const token = document.createElement('div');
        token.className = 'fm-pitch-token fm-pitch-token-away';
        token.innerHTML = `<span class="fm-pitch-token-number">${i + 1}</span>`;
        token.style.left = pos.x + '%';
        token.style.top = pos.y + '%';
        tokensDiv.appendChild(token);
        matchState.pitchTokens.push({ el: token, baseX: pos.x, baseY: pos.y, side: 'away' });
    });
}

/* Current tactical situation for pitch animation */
let pitchPhase = 'neutral'; // 'neutral', 'home-attack', 'away-attack', 'home-goal', 'away-goal', 'home-corner', 'away-corner'
let pitchPhaseTimer = 0;

function setPitchPhase(phase, duration) {
    pitchPhase = phase;
    pitchPhaseTimer = duration || 3;
}

function animatePitchTokens() {
    if (matchState.pitchInterval) clearInterval(matchState.pitchInterval);
    matchState.pitchInterval = setInterval(() => {
        const ball = document.getElementById('fm-pitch-ball');

        // Decay phase timer
        if (pitchPhaseTimer > 0) pitchPhaseTimer--;
        if (pitchPhaseTimer <= 0 && pitchPhase !== 'neutral') pitchPhase = 'neutral';

        // Decide ball zone based on possession and phase
        let ballX, ballY;
        const hPoss = matchState.stats.hPoss || 50;

        if (pitchPhase === 'home-goal') {
            // Ball IN the away goal net (far right)
            ballX = 96 + Math.random() * 3;
            ballY = 44 + Math.random() * 12;
        } else if (pitchPhase === 'away-goal') {
            // Ball IN the home goal net (far left)
            ballX = 1 + Math.random() * 3;
            ballY = 44 + Math.random() * 12;
        } else if (pitchPhase === 'home-attack') {
            ballX = 62 + Math.random() * 28;
            ballY = 20 + Math.random() * 60;
        } else if (pitchPhase === 'away-attack') {
            ballX = 10 + Math.random() * 28;
            ballY = 20 + Math.random() * 60;
        } else if (pitchPhase === 'home-corner') {
            ballX = 94 + Math.random() * 4;
            ballY = Math.random() < 0.5 ? 3 + Math.random() * 6 : 91 + Math.random() * 6;
        } else if (pitchPhase === 'away-corner') {
            ballX = 2 + Math.random() * 4;
            ballY = Math.random() < 0.5 ? 3 + Math.random() * 6 : 91 + Math.random() * 6;
        } else {
            // Neutral - possession-weighted drift
            const possWeight = (hPoss - 50) / 50;
            ballX = 50 + possWeight * 25 + (Math.random() - 0.5) * 28;
            ballY = 15 + Math.random() * 70;
        }
        ballX = Math.max(1, Math.min(99, ballX));
        ballY = Math.max(3, Math.min(97, ballY));

        if (ball) {
            ball.style.left = ballX + '%';
            ball.style.top = ballY + '%';
        }

        // Compute team block shifts based on phase and possession
        let homeBlockX = 0, awayBlockX = 0;
        const possShift = (hPoss - 50) * 0.18;
        homeBlockX += possShift;
        awayBlockX -= possShift;

        const isGoalPhase = pitchPhase === 'home-goal' || pitchPhase === 'away-goal';

        if (pitchPhase === 'home-attack' || pitchPhase === 'home-goal' || pitchPhase === 'home-corner') {
            homeBlockX += 15;
            awayBlockX -= 8;
        } else if (pitchPhase === 'away-attack' || pitchPhase === 'away-goal' || pitchPhase === 'away-corner') {
            awayBlockX -= 15;
            homeBlockX += 8;
        }

        matchState.pitchTokens.forEach((t, idx) => {
            const isGK = t.baseY === 50 && (t.baseX === 5 || t.baseX === 95);
            const isAttacker = t.side === 'home' ? (t.baseX >= 42) : (t.baseX <= 58);

            let newX, newY;

            // Goalkeepers stay near their goal
            if (isGK) {
                if (t.side === 'home') {
                    newX = 4 + (Math.random() - 0.5) * 3;
                    newY = 45 + Math.random() * 10;
                } else {
                    newX = 96 + (Math.random() - 0.5) * 3;
                    newY = 45 + Math.random() * 10;
                }
                // GK dives toward ball when goal phase targets their goal
                if ((pitchPhase === 'away-goal' && t.side === 'home') || (pitchPhase === 'home-goal' && t.side === 'away')) {
                    newY += (ballY - newY) * 0.5;
                }
            }
            // Attackers rush to goal on goal phases
            else if (isGoalPhase && isAttacker) {
                const attackingSide = pitchPhase === 'home-goal' ? 'home' : 'away';
                if (t.side === attackingSide) {
                    // Rush toward the goal mouth - cluster near ball
                    newX = ballX + (Math.random() - 0.5) * 12;
                    newY = ballY + (Math.random() - 0.5) * 18;
                } else {
                    // Defending team retreats to own goal area
                    const goalX = t.side === 'home' ? 10 : 90;
                    newX = goalX + (Math.random() - 0.5) * 14;
                    newY = 30 + Math.random() * 40;
                }
            }
            // Normal positioning with block shift
            else {
                const shift = t.side === 'home' ? homeBlockX : awayBlockX;
                const jitterX = (Math.random() - 0.5) * 4;
                const jitterY = (Math.random() - 0.5) * 5;
                newX = t.baseX + shift + jitterX;
                newY = t.baseY + jitterY;

                // Pull towards ball - stronger when closer or during attacks
                const distToBall = Math.sqrt(Math.pow(newX - ballX, 2) + Math.pow(newY - ballY, 2));
                let pullFactor;
                if (pitchPhase.includes('attack') || pitchPhase.includes('corner')) {
                    pullFactor = distToBall < 25 ? 0.25 : 0.1;
                } else {
                    pullFactor = distToBall < 20 ? 0.15 : 0.05;
                }
                newX += (ballX - newX) * pullFactor;
                newY += (ballY - newY) * pullFactor;
            }

            // Ensure home tokens stay mostly on left half, away on right (soft constraint)
            if (!isGoalPhase) {
                if (t.side === 'home') newX = Math.min(newX, 78);
                else newX = Math.max(newX, 22);
            }

            // Clamp to pitch
            newX = Math.max(1, Math.min(99, newX));
            newY = Math.max(3, Math.min(97, newY));

            t.el.style.left = newX + '%';
            t.el.style.top = newY + '%';
        });
    }, 700);
}

function stopPitchAnimation() {
    if (matchState.pitchInterval) {
        clearInterval(matchState.pitchInterval);
        matchState.pitchInterval = null;
    }
}

/* ---------- Stats UI Update ---------- */
function updateMatchStatsUI() {
    const s = matchState.stats;

    // Possession
    const hp = document.getElementById('fm-stat-poss-home');
    const ap = document.getElementById('fm-stat-poss-away');
    if (hp) hp.textContent = s.hPoss + '%';
    if (ap) ap.textContent = s.aPoss + '%';
    const bph = document.getElementById('fm-bar-poss-h');
    const bpa = document.getElementById('fm-bar-poss-a');
    if (bph) bph.style.width = s.hPoss + '%';
    if (bpa) bpa.style.width = s.aPoss + '%';

    // Shots
    const sh = document.getElementById('fm-stat-shots-home');
    const sa = document.getElementById('fm-stat-shots-away');
    if (sh) sh.textContent = s.hShots;
    if (sa) sa.textContent = s.aShots;
    const totalS = s.hShots + s.aShots || 1;
    const bsh = document.getElementById('fm-bar-shots-h');
    const bsa = document.getElementById('fm-bar-shots-a');
    if (bsh) bsh.style.width = ((s.hShots / totalS) * 100) + '%';
    if (bsa) bsa.style.width = ((s.aShots / totalS) * 100) + '%';

    // Shots on Target
    const soth = document.getElementById('fm-stat-sot-home');
    const sota = document.getElementById('fm-stat-sot-away');
    if (soth) soth.textContent = s.hSot;
    if (sota) sota.textContent = s.aSot;
    const totalSot = s.hSot + s.aSot || 1;
    const bsoth = document.getElementById('fm-bar-sot-h');
    const bsota = document.getElementById('fm-bar-sot-a');
    if (bsoth) bsoth.style.width = ((s.hSot / totalSot) * 100) + '%';
    if (bsota) bsota.style.width = ((s.aSot / totalSot) * 100) + '%';

    // xG
    const xgh = document.getElementById('fm-stat-xg-home');
    const xga = document.getElementById('fm-stat-xg-away');
    if (xgh) xgh.textContent = s.hXG.toFixed(2);
    if (xga) xga.textContent = s.aXG.toFixed(2);
    const totalXG = s.hXG + s.aXG || 1;
    const bxgh = document.getElementById('fm-bar-xg-h');
    const bxga = document.getElementById('fm-bar-xg-a');
    if (bxgh) bxgh.style.width = ((s.hXG / totalXG) * 100) + '%';
    if (bxga) bxga.style.width = ((s.aXG / totalXG) * 100) + '%';

    // Corners
    const ch = document.getElementById('fm-stat-corners-home');
    const ca = document.getElementById('fm-stat-corners-away');
    if (ch) ch.textContent = s.hCorners;
    if (ca) ca.textContent = s.aCorners;
    const totalC = s.hCorners + s.aCorners || 1;
    const bch = document.getElementById('fm-bar-corners-h');
    const bca = document.getElementById('fm-bar-corners-a');
    if (bch) bch.style.width = ((s.hCorners / totalC) * 100) + '%';
    if (bca) bca.style.width = ((s.aCorners / totalC) * 100) + '%';
}

window.startMatch = function () {
    const xi = getStartingXI();
    if (xi.length < 11) return showAlert(`Plantilla incompleta. Asigna a 11 titulares en TÃ¡cticas.`);

    if (!state.nextFixtures || state.nextFixtures.length === 0) generateFixtures(state);

    let myMatch = state.nextFixtures.find(f => f.isUserMatch);
    if (!myMatch || state.stats.matchday > 38) {
        endSeason();
        return;
    }

    // Show speed selection modal
    document.getElementById('modal-match-speed').classList.remove('hidden');
}

window.selectMatchSpeed = function (speed) {
    simSpeedMs = SIM_SPEED_MAP[speed] || 350;
    document.getElementById('modal-match-speed').classList.add('hidden');
    launchMatch();
}

function launchMatch() {
    const xi = getStartingXI();

    let myMatch = state.nextFixtures.find(f => f.isUserMatch);

    let isHome = myMatch.home === state.team.name;
    currentOpponent = state.league.find(t => t.name === (isHome ? myMatch.away : myMatch.home));

    document.getElementById('app-layout').classList.add('hidden');
    document.getElementById('match-modal').classList.remove('hidden');
    document.getElementById('match-post').classList.add('hidden');
    document.getElementById('match-halftime').classList.add('hidden');
    setNowPlayingVisibility();

    const homeName = isHome ? state.team.name : currentOpponent.name;
    const awayName = isHome ? currentOpponent.name : state.team.name;

    document.getElementById('sim-home-name').textContent = homeName;
    document.getElementById('sim-away-name').textContent = awayName;

    // FM panel team labels
    const statHomeLbl = document.getElementById('fm-stat-home-name');
    const statAwayLbl = document.getElementById('fm-stat-away-name');
    if (statHomeLbl) statHomeLbl.textContent = homeName;
    if (statAwayLbl) statAwayLbl.textContent = awayName;
    const evtTabHome = document.getElementById('fm-evt-tab-home');
    const evtTabAway = document.getElementById('fm-evt-tab-away');
    if (evtTabHome) evtTabHome.textContent = homeName;
    if (evtTabAway) evtTabAway.textContent = awayName;
    const pitchLblH = document.getElementById('fm-pitch-label-home');
    const pitchLblA = document.getElementById('fm-pitch-label-away');
    if (pitchLblH) pitchLblH.textContent = homeName;
    if (pitchLblA) pitchLblA.textContent = awayName;

    const hTeam = isHome ? state.team : currentOpponent.badge;
    const aTeam = isHome ? currentOpponent.badge : state.team;

    document.getElementById('sim-home-shield').innerHTML = getBadgeHTML(homeName, hTeam.shape, hTeam.c1, hTeam.c2, "w-8 h-10 text-[8px]", hTeam.pattern);
    document.getElementById('sim-away-shield').innerHTML = getBadgeHTML(awayName, aTeam.shape, aTeam.c1, aTeam.c2, "w-8 h-10 text-[8px]", aTeam.pattern);

    const myOvr = getTeamOvr();

    // Cansancio Post Partido
    state.roster.forEach(p => { if (state.lineup.includes(p.id)) p.con = Math.max(10, p.con - 10); });

    matchState = {
        mG: 0, oG: 0, min: 0, talkMod: 0, isHome: isHome,
        myProb: 0.08 + ((myOvr - currentOpponent.ovr) * 0.003),
        oppProb: 0.08 - ((myOvr - currentOpponent.ovr) * 0.003),
        interval: null,
        stats: { hPoss: 50, aPoss: 50, hShots: 0, aShots: 0, hSot: 0, aSot: 0, hCorners: 0, aCorners: 0, hXG: 0, aXG: 0 },
        events: [], pitchTokens: [], pitchInterval: null, talkDone: false
    };
    pitchPhase = 'neutral';
    pitchPhaseTimer = 0;

    // Re-enable motivar/bronca buttons for the new match
    const btnM = document.getElementById('btn-talk-motivar');
    const btnB = document.getElementById('btn-talk-bronca');
    [btnM, btnB].forEach(btn => {
        if (!btn) return;
        btn.disabled = false;
        btn.classList.remove('fm-dugout-btn-disabled');
    });
    if (btnM) btnM.onclick = function () { matchTalk('animar'); };
    if (btnB) btnB.onclick = function () { matchTalk('exigir'); };

    document.getElementById('sim-home-score').textContent = "0";
    document.getElementById('sim-away-score').textContent = "0";
    document.getElementById('match-progress').style.width = "0%";
    document.getElementById('match-time').textContent = "0'";
    document.getElementById('match-narrative').innerHTML = "<div class='text-blue-400 font-bold'>Â¡El Ã¡rbitro seÃ±ala el inicio del partido!</div>";

    // Render FM formation panels
    const myPlayers = xi.map(p => ({ name: p.name, pos: p.pos, ovr: calcPlayerOVR(p), img: p.img || '' }));
    const aiPlayers = generateAIPlayers(currentOpponent.name, currentOpponent.ovr);
    if (isHome) {
        renderFormationPanel('fm-formation-home', myPlayers, hTeam.c1 || '#2563eb');
        renderFormationPanel('fm-formation-away', aiPlayers, aTeam.c1 || '#dc2626');
    } else {
        renderFormationPanel('fm-formation-home', aiPlayers, hTeam.c1 || '#2563eb');
        renderFormationPanel('fm-formation-away', myPlayers, aTeam.c1 || '#dc2626');
    }

    // Render events (empty)
    renderMatchEvents('home');

    // Init and animate pitch tokens
    initPitchTokens();
    animatePitchTokens();

    // Dugout narrative reset
    const dugNarr = document.getElementById('fm-dugout-narrative');
    if (dugNarr) dugNarr.innerHTML = '<div class="text-blue-400 text-[10px]">Partido en curso...</div>';

    updateMatchStatsUI();
    runMatchLoop(45);
}

function runMatchLoop(targetMinute) {
    matchState._targetMinute = targetMinute;
    const logDiv = document.getElementById('match-narrative');
    const commentary = [
        "Controlando el ritmo del partido.", "Pase filtrado peligroso que corta la zaga.",
        "Falta tÃ¡ctica en la medular.", "Disparo lejano que se va alto.",
        "Gran intervenciÃ³n del portero.", "Despeje de cabeza en el Ã¡rea.",
        "Centro desde la banda derecha.", "PosesiÃ³n tranquila en campo propio.",
        "PresiÃ³n alta del equipo rival.", "RecuperaciÃ³n en la medular.",
        "Lateral largo buscando al extremo.", "Tiro que rechaza la defensa."
    ];

    matchState.interval = setInterval(() => {
        matchState.min += 3;
        document.getElementById('match-time').textContent = `${matchState.min}'`;
        document.getElementById('match-progress').style.width = `${(matchState.min / 90) * 100}%`;

        // PosesiÃ³n dinÃ¡mica realista
        const basePoss = 50 + ((matchState.myProb - matchState.oppProb) * 200);
        matchState.stats.hPoss = Math.max(20, Math.min(80, Math.floor(basePoss + (Math.random() * 10 - 5))));
        matchState.stats.aPoss = 100 - matchState.stats.hPoss;

        // (Corners now handled below alongside pitch phases)

        if (matchState.min === 45 && targetMinute === 45) {
            clearInterval(matchState.interval);
            stopPitchAnimation();
            logDiv.innerHTML += `<div class="mt-4"><strong class="text-yellow-400 font-bold">45': Final de la primera mitad. Nos vamos al descanso.</strong></div>`;
            logDiv.scrollTop = logDiv.scrollHeight;
            document.getElementById('match-halftime').classList.remove('hidden');
            matchState.events.push({ min: 45, icon: 'â±', text: 'Descanso', side: 'home' });
            updateMatchStatsUI();
            renderMatchEvents('home');
            // Dugout update
            const dugNarr = document.getElementById('fm-dugout-narrative');
            if (dugNarr) dugNarr.innerHTML = '<div class="text-yellow-400 text-[10px] font-bold">Medio tiempo â€” elige tus acciones en el dugout.</div>';
            return;
        }

        if (matchState.min >= 90) {
            clearInterval(matchState.interval);
            stopPitchAnimation();
            finishMatch(matchState.mG, matchState.oG);
            return;
        }

        let eventText = commentary[Math.floor(Math.random() * commentary.length)];
        let rand = Math.random();

        // Modificadores de probabilidad basados en posesiÃ³n
        let homePossMod = matchState.stats.hPoss / 50;
        let awayPossMod = matchState.stats.aPoss / 50;

        let activeMyProb = (matchState.myProb + matchState.talkMod) * (matchState.isHome ? homePossMod : awayPossMod);
        let activeOppProb = matchState.oppProb * (matchState.isHome ? awayPossMod : homePossMod);

        let isMyGoal = rand < (activeMyProb * 0.4);
        let isOppGoal = !isMyGoal && rand > 1 - (activeOppProb * 0.4);

        if (isMyGoal) {
            matchState.mG++;
            let xG = 0.6 + Math.random() * 0.3;
            // Shot + SOT + xG for our team
            if (matchState.isHome) {
                matchState.stats.hShots++; matchState.stats.hSot++;
                matchState.stats.hXG += xG;
            } else {
                matchState.stats.aShots++; matchState.stats.aSot++;
                matchState.stats.aXG += xG;
            }
            const xi = getStartingXI();
            const scorers = xi.filter(p => !p.suspension && (p.pos === 'DEL' || p.pos === 'MED'));
            const scorer = scorers.length > 0 ? scorers[Math.floor(Math.random() * scorers.length)].name : "el delantero";
            eventText = `<span class="text-green-400 font-bold">Â¡GOL! DefiniciÃ³n perfecta de ${scorer}.</span>`;
            const goalSide = matchState.isHome ? 'home' : 'away';
            matchState.events.push({ min: matchState.min, icon: 'âš½', text: `GOL â€” ${scorer}`, side: goalSide });
            // Animate pitch: our goal = attack towards opponent goal
            setPitchPhase(matchState.isHome ? 'home-goal' : 'away-goal', 4);
        } else if (isOppGoal) {
            matchState.oG++;
            let xG = 0.6 + Math.random() * 0.3;
            if (matchState.isHome) {
                matchState.stats.aShots++; matchState.stats.aSot++;
                matchState.stats.aXG += xG;
            } else {
                matchState.stats.hShots++; matchState.stats.hSot++;
                matchState.stats.hXG += xG;
            }
            const aiPlayers = generateAIPlayers(currentOpponent.name, currentOpponent.ovr);
            const scorers = aiPlayers.filter(p => p.pos === 'DEL' || p.pos === 'MED');
            const scorer = scorers.length > 0 ? scorers[Math.floor(Math.random() * scorers.length)].name : "el delantero";
            eventText = `<span class="text-red-400 font-bold">Â¡Gol del equipo rival! Grave error en defensa que aprovecha ${scorer}.</span>`;
            const goalSide = matchState.isHome ? 'away' : 'home';
            matchState.events.push({ min: matchState.min, icon: 'âš½', text: `GOL â€” ${scorer}`, side: goalSide });
            // Animate pitch: opponent goal = they attack our goal
            setPitchPhase(matchState.isHome ? 'away-goal' : 'home-goal', 4);
        } else if (rand < 0.25) {
            // Shot home (no goal)
            matchState.stats.hShots++;
            let xG = 0.05 + Math.random() * 0.15;
            matchState.stats.hXG += xG;
            if (Math.random() < 0.4) {
                matchState.stats.hSot++;
                eventText = `Mala definiciÃ³n, el portero visitante detiene sin problemas (xG: ${xG.toFixed(2)}).`;
            } else {
                eventText = `Disparo desviado del equipo local que se pierde por la banda (xG: ${xG.toFixed(2)}).`;
            }
            setPitchPhase('home-attack', 2);
        } else if (rand > 0.75) {
            // Shot away (no goal)
            matchState.stats.aShots++;
            let xG = 0.05 + Math.random() * 0.15;
            matchState.stats.aXG += xG;
            if (Math.random() < 0.4) {
                matchState.stats.aSot++;
                eventText = `Atrapada segura de nuestro guardameta ante el tiro visitante (xG: ${xG.toFixed(2)}).`;
            } else {
                eventText = `Tiro lejano sin peligro del rival (xG: ${xG.toFixed(2)}).`;
            }
            setPitchPhase('away-attack', 2);
        } else {
            // Neutral play â€” occasional possession phase shifts
            if (Math.random() < 0.3) {
                setPitchPhase(matchState.stats.hPoss > 55 ? 'home-attack' : matchState.stats.aPoss > 55 ? 'away-attack' : 'neutral', 1);
            }
        }

        // Random event icons for cards
        if (Math.random() < 0.05) {
            const cardSide = Math.random() < (matchState.stats.aPoss / 100) ? 'home' : 'away'; // El equipo sin el balÃ³n hace la falta

            // Elegir jugador sancionado
            let sanctionedName = "Jugador";
            let isUserPlayer = false;
            let playerId = null;

            if ((cardSide === 'home' && matchState.isHome) || (cardSide === 'away' && !matchState.isHome)) {
                const xi = getStartingXI().filter(p => !p.suspension);
                if (xi.length > 0) {
                    const p = xi[Math.floor(Math.random() * xi.length)];
                    sanctionedName = p.name;
                    isUserPlayer = true;
                    playerId = p.id;
                }
            } else {
                const aiPlayers = generateAIPlayers(currentOpponent.name, currentOpponent.ovr);
                if (aiPlayers.length > 0) sanctionedName = aiPlayers[Math.floor(Math.random() * aiPlayers.length)].name;
            }

            // Gestionar estado de tarjeta del partido
            const matchPlayerKey = `${cardSide}_${sanctionedName}`;
            if (!matchState.playersCards) matchState.playersCards = {};

            // Si ya tenÃ­a amarilla -> Roja
            if (matchState.playersCards[matchPlayerKey] === 'yellow') {
                matchState.playersCards[matchPlayerKey] = 'red';
                eventText = `<span class="text-red-500 font-bold">Â¡SEGUNDA AMARILLA! ExpulsiÃ³n para ${sanctionedName} tras una entrada tardÃ­a.</span>`;
                matchState.events.push({ min: matchState.min, icon: 'ðŸŸ¥', text: `Roja â€” ${sanctionedName}`, side: cardSide });

                // Aplicar sanciÃ³n al jugador del usuario directamente
                if (isUserPlayer && state && state.roster) {
                    const player = state.roster.find(p => p.id === playerId);
                    if (player) {
                        player.suspension = 2;
                        addEmail('ComitÃ© de CompeticiÃ³n', 'SanciÃ³n por doble amarilla', `Tu jugador ${player.name} ha sido expulsado y se perderÃ¡ 2 partidos.`);
                    }
                }
            } else {
                matchState.playersCards[matchPlayerKey] = 'yellow';
                eventText = `Falta dura de ${sanctionedName}. El Ã¡rbitro le muestra amarilla.`;
                matchState.events.push({ min: matchState.min, icon: 'ðŸŸ¨', text: `Amarilla â€” ${sanctionedName}`, side: cardSide });

                // Acumular amarilla al jugador del usuario
                if (isUserPlayer && state && state.roster) {
                    const player = state.roster.find(p => p.id === playerId);
                    if (player) {
                        player.yellowCards = (player.yellowCards || 0) + 1;
                        if (player.yellowCards >= 5) {
                            player.suspension = 1;
                            player.yellowCards = 0;
                            addEmail('ComitÃ© de CompeticiÃ³n', 'SanciÃ³n por acumulaciÃ³n', `Tu jugador ${player.name} ha acumulado 5 tarjetas amarillas y se perderÃ¡ 1 partido.`);
                        }
                    }
                }
            }
        }

        // Corners trigger pitch phase
        if (Math.random() < 0.08) {
            if (Math.random() < 0.5) {
                matchState.stats.hCorners++;
                setPitchPhase('home-corner', 2);
            } else {
                matchState.stats.aCorners++;
                setPitchPhase('away-corner', 2);
            }
        }

        logDiv.innerHTML += `<div><span class="text-slate-500">${matchState.min}'</span> - ${eventText}</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
        document.getElementById('sim-home-score').textContent = matchState.isHome ? matchState.mG : matchState.oG;
        document.getElementById('sim-away-score').textContent = matchState.isHome ? matchState.oG : matchState.mG;
        updateMatchStatsUI();
        renderMatchEvents('home');

    }, simSpeedMs);
}

window.matchTalk = function (type) {
    // Prevent selecting more than one talk option per match
    if (matchState.talkDone) return;
    matchState.talkDone = true;

    const logDiv = document.getElementById('match-narrative');
    if (type === 'animar') {
        matchState.talkMod = 0.01;
        logDiv.innerHTML += `<div class="text-blue-400 mt-2 text-xs italic">El equipo sale motivado para la 2Âª parte.</div>`;
        matchState.events.push({ min: 45, icon: 'ðŸ“£', text: 'Charla motivacional', side: matchState.isHome ? 'home' : 'away' });
    } else {
        if (Math.random() < 0.6) {
            matchState.talkMod = 0.02;
            logDiv.innerHTML += `<div class="text-green-400 mt-2 text-xs italic">Los jugadores reaccionan bien a la bronca.</div>`;
        } else {
            matchState.talkMod = -0.01;
            logDiv.innerHTML += `<div class="text-red-400 mt-2 text-xs italic">La plantilla se pone nerviosa tras los gritos.</div>`;
        }
        matchState.events.push({ min: 45, icon: 'ðŸ˜¤', text: 'Bronca al equipo', side: matchState.isHome ? 'home' : 'away' });
    }
    logDiv.scrollTop = logDiv.scrollHeight;

    // AI opponent also does a halftime talk
    const oppTalkRand = Math.random();
    const oppSide = matchState.isHome ? 'away' : 'home';
    if (oppTalkRand < 0.5) {
        matchState.events.push({ min: 45, icon: 'ðŸ“£', text: 'Charla motivacional (rival)', side: oppSide });
        logDiv.innerHTML += `<div class="text-orange-400 mt-1 text-xs italic">El tÃ©cnico rival motiva a su equipo.</div>`;
    } else {
        matchState.events.push({ min: 45, icon: 'ðŸ˜¤', text: 'Bronca al equipo (rival)', side: oppSide });
        logDiv.innerHTML += `<div class="text-orange-400 mt-1 text-xs italic">El tÃ©cnico rival reprende a sus jugadores.</div>`;
        matchState.oppProb += (Math.random() < 0.6 ? 0.01 : -0.005);
    }
    logDiv.scrollTop = logDiv.scrollHeight;
    renderMatchEvents('home');

    // Disable both talk buttons permanently for this match
    const btnM = document.getElementById('btn-talk-motivar');
    const btnB = document.getElementById('btn-talk-bronca');
    [btnM, btnB].forEach(btn => {
        if (!btn) return;
        btn.disabled = true;
        btn.classList.add('fm-dugout-btn-disabled');
        btn.onclick = null;
    });

    // Dugout update
    const dugNarr = document.getElementById('fm-dugout-narrative');
    if (dugNarr) dugNarr.innerHTML = '<div class="text-green-400 text-[10px]">Charla completada. Pulsa "JUGAR 2Âª PARTE" para continuar.</div>';
}

window.goToTacticsFromMatch = function () {
    document.getElementById('match-modal').classList.add('hidden');
    document.getElementById('app-layout').classList.remove('hidden');
    setNowPlayingVisibility();
    switchTab('tactics');

    const topBtn = document.getElementById('top-continue-btn');
    topBtn.innerHTML = 'VOLVER AL PARTIDO â±';
    topBtn.className = "btn-continue shadow-lg bg-yellow-600";
    topBtn.onclick = returnToMatch;
}

window.returnToMatch = function () {
    document.getElementById('app-layout').classList.add('hidden');
    document.getElementById('match-modal').classList.remove('hidden');
    setNowPlayingVisibility();

    const topBtn = document.getElementById('top-continue-btn');
    topBtn.innerHTML = 'CONTINUAR â­';
    topBtn.className = "btn-continue shadow-lg";
    topBtn.onclick = startMatch;
}

window.resumeMatch = function () {
    document.getElementById('match-halftime').classList.add('hidden');

    const newOvr = getTeamOvr();
    matchState.myProb = 0.08 + ((newOvr - currentOpponent.ovr) * 0.003);

    const logDiv = document.getElementById('match-narrative');
    logDiv.innerHTML += `<div class="mt-4"><strong class="text-white">45': Arranca la segunda mitad.</strong></div>`;
    logDiv.scrollTop = logDiv.scrollHeight;

    // Dugout update
    const dugNarr = document.getElementById('fm-dugout-narrative');
    if (dugNarr) dugNarr.innerHTML = '<div class="text-blue-400 text-[10px]">Segunda parte en juego...</div>';

    // Re-render formations in case of lineup changes
    const xi = getStartingXI();
    const myPlayers = xi.map(p => ({ name: p.name, pos: p.pos, ovr: calcPlayerOVR(p), img: p.img || '' }));
    const hTeamBadge = matchState.isHome ? state.team : currentOpponent.badge;
    const aTeamBadge = matchState.isHome ? currentOpponent.badge : state.team;
    if (matchState.isHome) {
        renderFormationPanel('fm-formation-home', myPlayers, hTeamBadge.c1 || '#2563eb');
    } else {
        renderFormationPanel('fm-formation-away', myPlayers, aTeamBadge.c1 || '#dc2626');
    }

    // Restart pitch animation
    animatePitchTokens();

    runMatchLoop(90);
}

function finishMatch(mG, oG) {
    stopPitchAnimation();
    document.getElementById('match-post').classList.remove('hidden');

    const logDiv = document.getElementById('match-narrative');
    logDiv.innerHTML += `<div class="mt-4 text-white font-bold uppercase border-t border-[#313145] pt-2">Fin del tiempo reglamentario.</div>`;

    // Dugout update
    const dugNarr = document.getElementById('fm-dugout-narrative');
    if (dugNarr) dugNarr.innerHTML = '<div class="text-amber-400 text-[10px] font-bold">Partido finalizado.</div>';
    logDiv.scrollTop = logDiv.scrollHeight;

    let ptsEarned = 0; let coins = 0; let rep = 0;

    if (mG > oG) { ptsEarned = 3; coins = 5000000; rep = 150; state.stats.wins++; }
    else if (mG === oG) { ptsEarned = 1; coins = 1500000; rep = 50; state.stats.draws++; }
    else { ptsEarned = 0; coins = 500000; rep = -10; state.stats.losses++; }

    state.stats.goals += mG;

    // Resolver todos los partidos de la jornada
    let results = [];
    state.nextFixtures.forEach(fix => {
        let hG = 0, aG = 0;
        if (fix.isUserMatch) {
            hG = matchState.isHome ? mG : oG;
            aG = matchState.isHome ? oG : mG;
        } else {
            let p = 0.5 + ((fix.homeOvr - fix.awayOvr) * 0.02);
            hG = Math.random() < p ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 2);
            aG = Math.random() > p ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 2);
        }

        results.push({ home: fix.home, away: fix.away, hG, aG });
        updateTeamStats(state.league.find(t => t.name === fix.home), hG, aG);
        updateTeamStats(state.league.find(t => t.name === fix.away), aG, hG);
    });

    state.history[state.stats.matchday.toString()] = results;

    // Evaluar Apuestas
    if (!state.betHistory) state.betHistory = [];
    let betResults = [];
    state.activeBets.forEach(b => {
        const actual = results.find(r => r.home === b.home && r.away === b.away);
        if (actual) {
            let actualWinner = actual.hG > actual.aG ? 'h' : (actual.aG > actual.hG ? 'a' : 'd');
            let predictedWinner = b.hG > b.aG ? 'h' : (b.aG > b.hG ? 'a' : 'd');
            let betRecord = { ...b, realHG: actual.hG, realAG: actual.aG };

            if (actual.hG === b.hG && actual.aG === b.aG) {
                let winAmt = b.amount * 2;
                if (b.currency === 'coins') state.economy.coins += winAmt; else state.economy.premium += winAmt;
                betResults.push(`Acierto EXACTO (${b.home}): +${winAmt}`);
                betRecord.result = 'exact'; betRecord.winnings = winAmt;
            } else if (actualWinner === predictedWinner) {
                let winAmt = Math.floor(b.amount * 1.5);
                if (b.currency === 'coins') state.economy.coins += winAmt; else state.economy.premium += winAmt;
                betResults.push(`Acierto GANADOR (${b.home}): +${winAmt}`);
                betRecord.result = 'winner'; betRecord.winnings = winAmt;
            } else {
                betResults.push(`Fallo (${b.home}): -${b.amount}`);
                betRecord.result = 'fail'; betRecord.winnings = 0;
            }
            state.betHistory.push(betRecord);
        }
    });
    // Keep last 20 bet results
    if (state.betHistory.length > 20) state.betHistory = state.betHistory.slice(-20);

    if (betResults.length > 0) addEmail('Apuestas Deportivas', 'Boleto de Jornada', betResults.join(' | '));
    state.activeBets = [];

    state.playedTeams.push(currentOpponent.name);
    state.stats.matches++;
    state.stats.matchday++;
    state.economy.coins += coins;
    state.stats.rep = Math.max(0, state.stats.rep + rep);

    state.flags.canTrain = true;
    state.flags.canTalk = true;

    // --- CondiciÃ³n FÃ­sica y Lesiones Post-Partido (Local) ---
    state.lineup.forEach(id => {
        if (!id) return;
        const p = state.roster.find(x => x.id === id);
        if (p) p.con = Math.max(30, p.con - 15);
    });
    // Reducir suspensiones e injurias de jugadores
    if (state.roster) {
        state.roster.forEach(p => {
            if (p.suspension > 0) p.suspension--;
            if (p.injuryMatches && p.injuryMatches > 0) {
                p.injuryMatches--;
                if (p.injuryMatches <= 0) p.con = 80;
            }
        });
    }

    generateFixtures(state); // Crear siguiente jornada (Para verla en apuestas y demÃ¡s)
    saveState();

    document.getElementById('match-coins').textContent = `+â‚¬${(coins / 1000000).toFixed(1)}M`;
    document.getElementById('match-pts').innerHTML = `+${ptsEarned} PTS<br><span class="text-[10px] ${rep > 0 ? 'text-blue-400' : 'text-red-400'}">REP: ${rep > 0 ? '+' : ''}${rep}</span>`;
}

window.endMatchAndReturn = function () {
    document.getElementById('match-modal').classList.add('hidden');
    document.getElementById('app-layout').classList.remove('hidden');
    setNowPlayingVisibility();

    if (state.stats.matchday > 38) {
        endSeason();
    } else {
        switchTab('league');
    }
}

/* =========================================================================
   FIN DE TEMPORADA Y TROFEOS
   ========================================================================= */
function endSeason() {
    document.getElementById('modal-season-end').classList.remove('hidden');

    const sorted = [...state.league].sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        return (b.gf - b.ga) - (a.gf - a.ga);
    });

    const userPos = sorted.findIndex(t => t.isUser) + 1;

    if (userPos === 1) {
        document.getElementById('season-trophy').classList.remove('hidden');
        document.getElementById('season-no-trophy').classList.add('hidden');
        state.stats.trophies++;
        addEmail('Directiva', 'Â¡CAMPEONES DE LIGA!', 'El club hace historia ganando LaLiga Tussi.');
    } else {
        document.getElementById('season-trophy').classList.add('hidden');
        document.getElementById('season-no-trophy').classList.remove('hidden');
        document.getElementById('season-pos').textContent = userPos + "Âº";
        addEmail('Directiva', 'RevisiÃ³n de Temporada', `Hemos finalizado en la posiciÃ³n ${userPos}. Debemos mejorar.`);
    }
    saveState();
}

window.startNewSeason = function () {
    state.stats.matchday = 1;
    state.playedTeams = [];
    state.history = {};
    state.activeBets = [];

    state.league.forEach(t => {
        t.pld = 0; t.w = 0; t.d = 0; t.l = 0; t.gf = 0; t.ga = 0; t.pts = 0;
    });

    state.roster.forEach(p => { p.morale = 100; p.con = 100; });
    generateFixtures(state);

    saveState();
    document.getElementById('modal-season-end').classList.add('hidden');
    switchTab('dash');
    showAlert("Â¡Arranca una nueva ediciÃ³n de LaLiga Tussi! Dinero y plantilla se conservan.");
}

/* =========================================================================
   FUNCIONES ADICIONALES - Nuevas Features
   ========================================================================= */

// Mobile sidebar toggle
window.toggleSidebar = function () {
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;
    sidebar.classList.toggle('sidebar-open');
    if (sidebar.classList.contains('sidebar-open')) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

// Close sidebar when clicking a nav button on mobile
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('main-sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar) sidebar.classList.remove('sidebar-open');
            if (overlay) overlay.classList.add('hidden');
        }
    });
});

// Show player info modal
window.showPlayerInfo = function (id) {
    const allPlayers = [...(state.roster || []), ...PLAYERS_DB];
    const p = allPlayers.find(x => x.id === id);
    if (!p) return;

    const getStatColor = v => v >= 85 ? '#4ade80' : v >= 70 ? '#38bdf8' : v >= 55 ? '#fbbf24' : '#f87171';
    const statBar = (label, val) => `
        <div class="stat-row">
            <span class="stat-label">${label}</span>
            <div class="stat-bar-container"><div class="stat-bar-fill" style="width:${val}%; background:${getStatColor(val)};"></div></div>
            <span class="stat-value" style="color:${getStatColor(val)}">${val}</span>
        </div>`;

    const pClass = `pos-${p.pos.toLowerCase()}`;
    const content = document.getElementById('player-info-content');
    content.innerHTML = `
        <img src="${p.img}" class="w-20 h-20 rounded-full border-4 border-yellow-400 mx-auto mb-3 shadow-lg">
        <h3 class="text-xl font-bold text-white mb-1">${p.name}</h3>
        <span class="pos-badge ${pClass} mb-4 inline-block">${p.pos}</span>
        <div class="text-4xl font-black text-yellow-400 mb-4 font-gaming">${calcPlayerOVR(p)}</div>
        <div class="text-left px-4 space-y-1">
            ${p.pos === 'POR' ? `
                ${statBar('SAL', p.sal)}
                ${statBar('PAR', p.par)}
                ${statBar('SAQ', p.saq)}
                ${statBar('REF', p.ref)}
                ${statBar('VEL', p.vel)}
                ${statBar('POS', p.posi)}
            ` : `
                ${statBar('PAC', p.pac)}
                ${statBar('SHO', p.sho)}
                ${statBar('PAS', p.pas)}
                ${statBar('DEF', p.def)}
                ${statBar('PHY', p.phy)}
            `}
        </div>
        <div class="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div class="bg-slate-800/50 p-2 rounded"><span class="text-slate-400">CondiciÃ³n</span><br><span class="text-white font-bold">${p.con || 100}%</span></div>
            <div class="bg-slate-800/50 p-2 rounded"><span class="text-slate-400">Moral</span><br><span class="text-white font-bold">${p.morale || 100}%</span></div>
        </div>`;
    document.getElementById('modal-player-info').classList.remove('hidden');
}

// Bet goal +/- buttons
window.adjustBetGoal = function (inputId, delta) {
    const input = document.getElementById(inputId);
    if (!input) return;
    let val = parseInt(input.value) + delta;
    if (val < 0) val = 0;
    if (val > 15) val = 15;
    input.value = val;
}

// Card number formatting (XXXX XXXX XXXX XXXX)
window.formatCardNumber = function (el) {
    let v = el.value.replace(/[^0-9]/g, '').slice(0, 16);
    el.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
}

// Card expiry formatting (MM/AA)
window.formatCardExpiry = function (el) {
    let v = el.value.replace(/[^0-9]/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    el.value = v;
}

// Payment method change handler
window.onPaymentMethodChange = function () {
    const method = document.getElementById('payment-method').value;
    const cardForm = document.getElementById('payment-card-form');
    if (method === 'visa' || method === 'mastercard') {
        cardForm.classList.remove('hidden');
    } else {
        cardForm.classList.add('hidden');
    }
    updatePaymentButton();
}

// Legal modal content
window.showLegalModal = function (type) {
    const title = document.getElementById('legal-modal-title');
    const body = document.getElementById('legal-modal-body');
    if (type === 'cookies') {
        title.textContent = 'PolÃ­tica de Cookies';
        body.innerHTML = `
            <p><strong>Â¿QuÃ© son las cookies?</strong></p>
            <p>Las cookies son pequeÃ±os archivos de texto que se almacenan en tu navegador cuando visitas un sitio web.</p>
            <p><strong>Cookies que utilizamos:</strong></p>
            <ul class="list-disc ml-5 space-y-1">
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento de la autenticaciÃ³n y guardado de partida.</li>
                <li><strong>Cookies de rendimiento:</strong> Nos ayudan a entender cÃ³mo interactÃºas con la aplicaciÃ³n.</li>
                <li><strong>Cookies de funcionalidad:</strong> Permiten recordar tus preferencias (volumen, idioma, tema).</li>
            </ul>
            <p><strong>Control de cookies:</strong> Puedes gestionar las cookies desde la configuraciÃ³n de tu navegador. Si desactivas las cookies esenciales, es posible que algunas funcionalidades no estÃ©n disponibles.</p>
            <p class="text-slate-500 text-[10px] mt-4">Ãšltima actualizaciÃ³n: Marzo 2026</p>`;
    } else if (type === 'aviso') {
        title.textContent = 'Aviso Legal';
        body.innerHTML = `
            <p><strong>Titular:</strong> Inafuma & Beben S.L. â€” Simulador de GestiÃ³n Deportiva.</p>
            <p><strong>Objeto:</strong> Esta aplicaciÃ³n web es un simulador de gestiÃ³n de club de fÃºtbol con fines de entretenimiento. No involucra dinero real ni apuestas reales.</p>
            <p><strong>Propiedad Intelectual:</strong> Todos los diseÃ±os, cÃ³digo y contenido multimedia de esta aplicaciÃ³n son propiedad del equipo de desarrollo.</p>
            <p><strong>LimitaciÃ³n de Responsabilidad:</strong> El uso de la aplicaciÃ³n se realiza bajo la exclusiva responsabilidad del usuario. No nos hacemos responsables de interrupciones del servicio o pÃ©rdida de datos.</p>
            <p><strong>Datos Personales:</strong> Solo se recopilan datos estrictamente necesarios (nombre de usuario y contraseÃ±a cifrada) para la funcionalidad del juego a travÃ©s de Firebase.</p>
            <p class="text-slate-500 text-[10px] mt-4">Ãšltima actualizaciÃ³n: Marzo 2026</p>`;
    }
    document.getElementById('modal-legal').classList.remove('hidden');
}

// League tab switching (Local / Multiplayer)
window.switchLeagueTab = function (tab) {
    document.getElementById('league-tab-local').classList.toggle('active', tab === 'local');
    document.getElementById('league-tab-multi').classList.toggle('active', tab === 'multi');
    document.getElementById('league-local-content').classList.toggle('hidden', tab !== 'local');
    document.getElementById('league-multi-content').classList.toggle('hidden', tab !== 'multi');
    if (tab === 'multi') loadMultiplayerLeaderboard();
}

// Load multiplayer leaderboard from Firestore (pvpStats only)
window.loadMultiplayerLeaderboard = function () {
    const tbody = document.getElementById('league-multi-tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="11" class="text-center text-slate-500 py-6 text-xs">Cargando clasificaciÃ³n multijugador...</td></tr>';

    db.collection('users').get().then(snap => {
        tbody.innerHTML = '';
        if (snap.empty) {
            tbody.innerHTML = '<tr><td colspan="11" class="text-center text-slate-500 py-6 text-xs">No hay jugadores registrados aÃºn.</td></tr>';
            return;
        }
        // Build array, sort by pvpStats.pts desc, then goal difference
        const rows = [];
        snap.forEach(doc => {
            const d = doc.data();
            const p = d.pvpStats || {};
            rows.push({
                uid: doc.id,
                manager: d.team?.manager || doc.id,
                club: d.team?.name || 'Sin club',
                pj: p.matches || 0,
                w: p.wins || 0,
                e: p.draws || 0,
                l: p.losses || 0,
                gf: p.gf || 0,
                ga: p.ga || 0,
                pts: p.pts || 0
            });
        });
        rows.sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
        rows.forEach((r, i) => {
            const isMe = auth.currentUser && r.uid === auth.currentUser.uid;
            const rowClass = isMe ? 'user-row' : '';
            const dg = r.gf - r.ga;
            tbody.innerHTML += `
            <tr class="${rowClass}">
                <td class="text-center font-bold">${i + 1}</td>
                <td class="text-white font-bold">${r.manager}</td>
                <td class="text-slate-300">${r.club}</td>
                <td>${r.pj}</td>
                <td>${r.w}</td>
                <td>${r.e}</td>
                <td>${r.l}</td>
                <td>${r.gf}</td>
                <td>${r.ga}</td>
                <td>${dg}</td>
                <td class="text-white font-bold text-sm bg-slate-800/50 text-center">${r.pts}</td>
            </tr>`;
        });
    }).catch(() => {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center text-red-400 py-6 text-xs">Error al cargar. IntÃ©ntalo de nuevo.</td></tr>';
    });
}

// Playlist de canciones
const MUSIC_PLAYLIST = [
    { src: 'music/We Are One (Ole Ola) [The Official 2014 FIFA World Cup Song] (Olodum Mix).mp3', title: 'We Are One (Ole Ola) â€” Pitbull ft. J.Lo' },
    { src: 'music/John Newman - Love Me Again - JohnNewmanVEVO.mp3', title: 'John Newman â€” Love Me Again' },
    { src: 'music/Joy Crookes - Feet Don\'t Fail Me Now (Official Video) - JoyCrookesVEVO.mp3', title: 'Joy Crookes â€” Feet Don\'t Fail Me Now' },
    { src: 'music/Avicii - Levels (Lyrics) - Creative Chaos.mp3', title: 'Avicii â€” Levels' },
    { src: 'music/Avicii - The Nights (Lyrics) my father told me - Unique Sound.mp3', title: 'Avicii â€” The Nights' },
    { src: 'music/Glass Animals - Heat Waves - LatinHype.mp3', title: 'Glass Animals â€” Heat Waves' },
    { src: 'music/Imagine Dragons - On Top Of The World (Official Music Video) - ImagineDragonsVEVO.mp3', title: 'Imagine Dragons â€” On Top Of The World' },
    { src: 'music/My Type - Saint Motel (Lyrics)  Pop Song - Astro.mp3', title: 'Saint Motel â€” My Type' },
    { src: 'music/Travis Scott - goosebumps (Official Video) ft. Kendrick Lamar - TravisScottVEVO.mp3', title: 'Travis Scott â€” Goosebumps ft. Kendrick Lamar' },
    { src: 'music/Warriors (ft. Imagine Dragons)  Worlds 2014 - League of Legends - League of Legends.mp3', title: 'Imagine Dragons â€” Warriors' },
    { src: 'music/Somos Carlos Kirk.mp3', title: 'Carlos Kirk â€” Somos' },
    { src: 'music/Willyrex Canta Paradise-Coldplay (mp3cut.net).mp3', title: 'Willyrex â€” Paradise (Coldplay)' },
    { src: 'music/Capital Cities - Safe And Sound - Hunter Seth.mp3', title: 'Capital Cities â€” Safe And Sound' },
    { src: 'music/CHVRCHES - WE SINK - coconutðŸ¤.mp3', title: 'CHVRCHES â€” We Sink' },
    { src: 'music/FIFA 14 - Amplify Dot - Get Down  Soundtrack - Silvo & Shani.mp3', title: 'Amplify Dot â€” Get Down' },
    { src: 'music/Skrillex & Damian Jr. Gong Marley - Make It Bun Dem [OFFICIAL VIDEO] - Skrillex.mp3', title: 'Skrillex & Damian Marley â€” Make It Bun Dem' },
    { src: 'music/Worship You - Vampire Weekend.mp3', title: 'Vampire Weekend â€” Worship You' },
    { src: 'music/Wretch 32 - 24 Hours (Official Audio) - Wretch 32.mp3', title: 'Wretch 32 â€” 24 Hours' },
    { src: 'music/Axwell __ Ingrosso, Axwell, Sebastian Ingrosso - More Than You Know - AxwellIngrossoVEVO.mp3', title: 'Axwell Î› Ingrosso â€” More Than You Know' }
];
let currentTrackIndex = -1;
let shuffledQueue = [];

function pickRandomTrack(excludeIndex) {
    if (MUSIC_PLAYLIST.length <= 1) return 0;
    // Bag-shuffle: no se repite ninguna canciÃ³n hasta que se hayan escuchado todas
    if (shuffledQueue.length === 0) {
        shuffledQueue = Array.from({ length: MUSIC_PLAYLIST.length }, (_, i) => i)
            .filter(i => i !== excludeIndex);
        // Fisher-Yates shuffle
        for (let i = shuffledQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
        }
    }
    return shuffledQueue.shift();
}

// Audio control - start after cookie acceptance, persist across reloads
function updateNowPlaying() {
    const titleEl = document.getElementById('now-playing-title');
    if (titleEl && currentTrackIndex >= 0 && currentTrackIndex < MUSIC_PLAYLIST.length) {
        titleEl.textContent = MUSIC_PLAYLIST[currentTrackIndex].title;
    }
}

function setNowPlayingVisibility() {
    const bar = document.getElementById('now-playing-bar');
    if (!bar) return;
    const matchLocal = document.getElementById('match-modal');
    const matchPvp = document.getElementById('pvp-match-modal');
    const inMatch = (matchLocal && !matchLocal.classList.contains('hidden'))
        || (matchPvp && !matchPvp.classList.contains('hidden'));
    bar.classList.toggle('hidden', inMatch);
}

window.skipToNextTrack = function () {
    const audio = document.getElementById('bg-music');
    if (!audio) return;
    currentTrackIndex = pickRandomTrack(currentTrackIndex);
    audio.src = MUSIC_PLAYLIST[currentTrackIndex].src;
    localStorage.setItem('inafuma_music_track', String(currentTrackIndex));
    localStorage.setItem('inafuma_music_time', '0');
    updateNowPlaying();
    audio.play().catch(() => { });
}

window.initBgMusic = function () {
    const audio = document.getElementById('bg-music');
    if (!audio) return;

    // Pick initial random track
    const savedTrack = parseInt(localStorage.getItem('inafuma_music_track') || '-1');
    if (savedTrack >= 0 && savedTrack < MUSIC_PLAYLIST.length) {
        currentTrackIndex = savedTrack;
    } else {
        currentTrackIndex = pickRandomTrack(-1);
    }
    audio.src = MUSIC_PLAYLIST[currentTrackIndex].src;
    localStorage.setItem('inafuma_music_track', String(currentTrackIndex));

    // Restore saved playback position
    const savedTime = parseFloat(localStorage.getItem('inafuma_music_time') || '0');
    if (savedTime > 0) audio.currentTime = savedTime;

    audio.volume = (state && state.settings && state.settings.volMusic !== undefined) ? state.settings.volMusic : 0.05;

    // When a song ends, pick a different random song and play it immediately
    audio.removeEventListener('ended', handleTrackEnded);
    audio.addEventListener('ended', handleTrackEnded);

    updateNowPlaying();
    setNowPlayingVisibility();

    // Save position periodically so music resumes after reload
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem('inafuma_music_time', String(audio.currentTime));
            localStorage.setItem('inafuma_music_playing', 'true');
            localStorage.setItem('inafuma_music_track', String(currentTrackIndex));
        }
    }, 2000);

    const tryPlay = () => {
        audio.play().catch(() => {
            // Autoplay blocked - will start on next user interaction
            document.addEventListener('click', function startMusic() {
                audio.play().catch(() => { });
                document.removeEventListener('click', startMusic);
            }, { once: true });
        });
    };

    // Auto-resume if was playing before reload, or if cookies accepted
    if (localStorage.getItem('inafuma_music_playing') === 'true' || localStorage.getItem('inafuma_cookies')) {
        tryPlay();
    }

    // Preload next track proactively
    preloadNextTrack();

    // Also preload when ~10 seconds remain in current track
    audio.addEventListener('timeupdate', function () {
        if (!preloadedNextTrack && audio.duration && audio.duration - audio.currentTime < 10) {
            preloadNextTrack();
        }
    });
}

let preloadedNextTrack = null;

function preloadNextTrack() {
    const nextIdx = pickRandomTrack(currentTrackIndex);
    const preload = new Audio();
    preload.src = MUSIC_PLAYLIST[nextIdx].src;
    preload.preload = 'auto';
    preloadedNextTrack = { index: nextIdx, audio: preload };
}

function handleTrackEnded() {
    const audio = document.getElementById('bg-music');
    if (!audio) return;
    if (preloadedNextTrack) {
        currentTrackIndex = preloadedNextTrack.index;
        audio.src = MUSIC_PLAYLIST[currentTrackIndex].src;
        preloadedNextTrack = null;
    } else {
        currentTrackIndex = pickRandomTrack(currentTrackIndex);
        audio.src = MUSIC_PLAYLIST[currentTrackIndex].src;
    }
    localStorage.setItem('inafuma_music_track', String(currentTrackIndex));
    localStorage.setItem('inafuma_music_time', '0');
    updateNowPlaying();
    audio.play().catch(() => { });
    // Preload the next one right away
    preloadNextTrack();
}

/* =========================================================================
   SISTEMA DE SOBRES / PACKS DE JUGADORES
   ========================================================================= */

const PACK_CONFIG = {
    single: { sobres: 1, cardsPerSobre: 4, cost: 5000 },
    triple: { sobres: 3, cardsPerSobre: 4, cost: 15000 },
    mega: { sobres: 5, cardsPerSobre: 4, cost: 25000 }
};

// Rareza: icono 2%, diamante 8%, oro 20%, plata 35%, bronce 35%
const RARITY_THRESHOLDS = [
    { rarity: 'icono', chance: 0.02, ovrMin: 94, ovrMax: 99, img: 'images/Icono3.png' },
    { rarity: 'diamante', chance: 0.08, ovrMin: 88, ovrMax: 93, img: 'images/Diamante3.png' },
    { rarity: 'oro', chance: 0.20, ovrMin: 82, ovrMax: 87, img: 'images/Oro3.png' },
    { rarity: 'plata', chance: 0.35, ovrMin: 76, ovrMax: 81, img: 'images/Plata3.png' },
    { rarity: 'bronce', chance: 0.35, ovrMin: 70, ovrMax: 75, img: 'images/Bronce.png' }
];

// Jugadores retirados / inactivos (iconos)
const RETIRED_PLAYER_IDS = new Set([506, 507]); // Neymar, Luis Suarez â€” add more IDs as needed

function getPlayerRarity(p) {
    const ovr = calcPlayerOVR(p);
    if (RETIRED_PLAYER_IDS.has(p.id)) return 'icono';
    if (ovr >= 94) return 'icono';
    if (ovr >= 88) return 'diamante';
    if (ovr >= 82) return 'oro';
    if (ovr >= 76) return 'plata';
    return 'bronce';
}

function getCardRarity(ovr) {
    if (ovr < 70) return 'Fuera de rango';
    if (ovr >= 94) return 'Icono';
    if (ovr >= 88) return 'Diamante';
    if (ovr >= 82) return 'Oro';
    if (ovr >= 76) return 'Plata';
    return 'Bronce';
}

function getRarityCardImage(rarity) {
    if (rarity === 'icono') return 'images/Icono3.png';
    if (rarity === 'diamante') return 'images/Diamante3.png';
    if (rarity === 'oro') return 'images/Oro3.png';
    if (rarity === 'plata') return 'images/Plata3.png';
    if (rarity === 'bronce') return 'images/Bronce.png';
    return 'images/Bronce.png';
}

function getRarityCSSClass(rarity) {
    if (rarity === 'icono') return 'rarity-icono';
    if (rarity === 'diamante') return 'rarity-diamante';
    if (rarity === 'oro') return 'rarity-oro';
    if (rarity === 'plata') return 'rarity-plata';
    if (rarity === 'bronce') return 'rarity-bronce';
    return 'rarity-bronce';
}

function rollCardRarity() {
    const roll = Math.random();
    let cumulative = 0;
    for (const tier of RARITY_THRESHOLDS) {
        cumulative += tier.chance;
        if (roll < cumulative) return tier;
    }
    return RARITY_THRESHOLDS[RARITY_THRESHOLDS.length - 1];
}

function pickPlayerByRarity(tier, excludeIds) {
    const allWithOvr = PLAYERS_DB.map(p => ({ ...p, ovr: calcPlayerOVR(p) }));
    let candidates = allWithOvr.filter(p =>
        p.ovr >= tier.ovrMin && p.ovr <= tier.ovrMax && !excludeIds.has(p.id)
    );
    // If no candidates at this tier, widen the search
    if (candidates.length === 0) {
        candidates = allWithOvr.filter(p => !excludeIds.has(p.id));
    }
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function generateSobreCards(count, excludeIds) {
    const cards = [];
    for (let i = 0; i < count; i++) {
        const tier = rollCardRarity();
        const player = pickPlayerByRarity(tier, excludeIds);
        if (player) {
            excludeIds.add(player.id);
            const actualRarity = getPlayerRarity(player);
            cards.push({
                player: JSON.parse(JSON.stringify(player)),
                rarity: actualRarity,
                rarityImg: getRarityCardImage(actualRarity)
            });
        }
    }
    return cards;
}

function generateSobreBonus() {
    const bonuses = [];
    // 10% chance premium coins (10000)
    if (Math.random() < 0.10) {
        bonuses.push({ type: 'premium', amount: 10000 });
    }
    // 40% chance normal coins
    if (Math.random() < 0.40) {
        const amount = (Math.floor(Math.random() * 10) + 1) * 500000; // 500K to 5M
        bonuses.push({ type: 'coins', amount: amount });
    }
    return bonuses;
}

// Generate starter pack: 14 players with minimum position requirements
function generateStarterPackCards() {
    const excludeIds = new Set();
    const cards = [];

    // Minimum requirements: 1 POR, 4 DEF, 4 MED, 2 DEL = 11, plus 3 random = 14
    const requirements = [
        { pos: 'POR', count: 1 },
        { pos: 'DEF', count: 4 },
        { pos: 'MED', count: 4 },
        { pos: 'DEL', count: 2 }
    ];

    // For starter pack, use lower tier players (rep 0 or low rep)
    const starterPool = PLAYERS_DB.filter(p => p.rep <= 800).map(p => ({ ...p, ovr: calcPlayerOVR(p) }));

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Pick required positions
    for (const req of requirements) {
        const pool = shuffle(starterPool.filter(p => p.pos === req.pos && !excludeIds.has(p.id)));
        for (let i = 0; i < req.count && i < pool.length; i++) {
            excludeIds.add(pool[i].id);
            const rarity = getPlayerRarity(pool[i]);
            cards.push({
                player: JSON.parse(JSON.stringify(pool[i])),
                rarity: rarity,
                rarityImg: getRarityCardImage(rarity)
            });
        }
    }

    // Fill remaining 3 random slots
    const remaining = 14 - cards.length;
    const leftover = shuffle(starterPool.filter(p => !excludeIds.has(p.id)));
    for (let i = 0; i < remaining && i < leftover.length; i++) {
        excludeIds.add(leftover[i].id);
        const rarity = getPlayerRarity(leftover[i]);
        cards.push({
            player: JSON.parse(JSON.stringify(leftover[i])),
            rarity: rarity,
            rarityImg: getRarityCardImage(rarity)
        });
    }

    // Shuffle the final cards so reveal order is random
    return shuffle(cards);
}

/* ---- Pack Reveal State ---- */
let packRevealState = {
    allSobres: [],       // Array of arrays of card objects
    currentSobre: 0,
    revealedCount: 0,
    allNewPlayers: [],   // Flat list of all players to add to roster
    allBonuses: [],      // All bonuses across all sobres
    isStarterPack: false,
    onComplete: null     // Callback after all sobres revealed
};

function buildCardHTML(card, index) {
    const p = card.player;
    const ovr = calcPlayerOVR(p);
    const rarityClass = getRarityCSSClass(card.rarity);

    return `
    <div class="pack-card" data-index="${index}" onclick="revealCard(this)">
        <div class="pack-card-inner">
            <div class="pack-card-front"></div>
            <div class="pack-card-back ${rarityClass}">
                <img src="${card.rarityImg}" class="pack-card-bg-img">
                <div class="pack-card-info-left">
                    <div class="pack-card-ovr">${ovr}</div>
                    <div class="pack-card-pos">${p.pos}</div>
                </div>
                <img src="${p.img}" class="pack-card-photo" onerror="this.src='${getAvatar(p.name)}'">
                <div class="pack-card-name">${p.name}</div>
                <div class="pack-card-stats-fifa">
                    <div class="pack-stat-col">
                        ${p.pos === 'POR' ? `
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.sal}</span><span class="pack-stat-lbl">SAL</span></div>
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.par}</span><span class="pack-stat-lbl">PAR</span></div>
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.saq}</span><span class="pack-stat-lbl">SAQ</span></div>
                        ` : `
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.pac}</span><span class="pack-stat-lbl">RIT</span></div>
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.sho}</span><span class="pack-stat-lbl">TIR</span></div>
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.pas}</span><span class="pack-stat-lbl">PAS</span></div>
                        `}
                    </div>
                    <div class="pack-stat-col">
                        ${p.pos === 'POR' ? `
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.ref}</span><span class="pack-stat-lbl">REF</span></div>
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.vel}</span><span class="pack-stat-lbl">VEL</span></div>
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.posi}</span><span class="pack-stat-lbl">POS</span></div>
                        ` : `
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.def}</span><span class="pack-stat-lbl">DEF</span></div>
                        <div class="pack-stat-row"><span class="pack-stat-val">${p.phy}</span><span class="pack-stat-lbl">FÃS</span></div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

window.revealCard = function (el) {
    if (el.classList.contains('revealed')) {
        // Already revealed â€” zoom in for close-up view
        zoomCard(el);
        return;
    }
    el.classList.add('revealed');
    packRevealState.revealedCount++;

    const stage = document.getElementById('pack-reveal-stage');
    const totalCards = stage.querySelectorAll('.pack-card').length;

    // Check if all cards in this sobre are revealed
    if (packRevealState.revealedCount >= totalCards) {
        showSobreCompleteActions();
    }
}

function zoomCard(el) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'pack-zoom-overlay';
    const clone = el.cloneNode(true);
    clone.classList.add('pack-zoom-card');
    clone.classList.remove('pack-card');
    clone.style.animation = 'none';
    clone.style.opacity = '1';
    clone.style.transform = 'none';
    clone.onclick = function (e) { e.stopPropagation(); };
    overlay.appendChild(clone);
    overlay.onclick = function () {
        overlay.classList.add('pack-zoom-closing');
        setTimeout(() => overlay.remove(), 250);
    };
    document.getElementById('modal-pack-reveal').appendChild(overlay);
}

function showSobreCompleteActions() {
    const actions = document.getElementById('pack-reveal-actions');
    actions.classList.remove('hidden');

    const isLastSobre = packRevealState.currentSobre >= packRevealState.allSobres.length - 1;
    const nextBtn = document.getElementById('pack-reveal-next-btn');
    const doneBtn = document.getElementById('pack-reveal-done-btn');

    if (isLastSobre) {
        nextBtn.classList.add('hidden');
        doneBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        doneBtn.classList.add('hidden');
    }

    // Show bonuses for this sobre
    const bonuses = packRevealState.allBonuses[packRevealState.currentSobre];
    if (bonuses && bonuses.length > 0) {
        const bonusEl = document.getElementById('pack-reveal-bonus');
        bonusEl.classList.remove('hidden');
        let bonusHTML = '';
        bonuses.forEach(b => {
            if (b.type === 'premium') {
                bonusHTML += `<div class="pack-bonus-premium text-xl">Â¡BONUS! +${b.amount.toLocaleString()} Monedas Premium â—ˆ</div>`;
            } else {
                bonusHTML += `<div class="pack-bonus-coins text-xl">Â¡BONUS! +â‚¬${(b.amount / 1000000).toFixed(1)}M</div>`;
            }
        });
        document.getElementById('pack-bonus-text').innerHTML = bonusHTML;
    }
}

window.packRevealNext = function () {
    packRevealState.currentSobre++;
    packRevealState.revealedCount = 0;
    document.getElementById('pack-reveal-actions').classList.add('hidden');
    document.getElementById('pack-reveal-bonus').classList.add('hidden');
    document.getElementById('pack-reveal-stage').classList.add('hidden');
    renderCurrentSobre();
}

window.packRevealClose = function () {
    // Add all new players to roster
    packRevealState.allNewPlayers.forEach(p => {
        // Check if player already in roster
        if (!state.roster.find(r => r.id === p.id)) {
            p.con = 100;
            p.morale = 100;
            p.ovr = calcPlayerOVR(p);
            state.roster.push(p);
        }
    });

    // Apply all bonuses
    packRevealState.allBonuses.flat().forEach(b => {
        if (b.type === 'premium') {
            state.economy.premium += b.amount;
        } else {
            state.economy.coins += b.amount;
        }
    });

    saveState();
    document.getElementById('modal-pack-reveal').classList.add('hidden');

    if (packRevealState.isStarterPack && packRevealState.onComplete) {
        packRevealState.onComplete();
    } else {
        updateUI();
        if (document.getElementById('tab-sobres') && document.getElementById('tab-sobres').style.display !== 'none') {
            renderSobresTab();
        }
    }
}

function renderCurrentSobre() {
    const sobre = packRevealState.allSobres[packRevealState.currentSobre];
    const stage = document.getElementById('pack-reveal-stage');
    const title = document.getElementById('pack-reveal-title');
    const subtitle = document.getElementById('pack-reveal-subtitle');
    const envelope = document.getElementById('pack-envelope');

    if (packRevealState.allSobres.length > 1) {
        title.textContent = `Sobre ${packRevealState.currentSobre + 1} de ${packRevealState.allSobres.length}`;
    } else {
        title.textContent = packRevealState.isStarterPack ? 'Sobre Inicial del Club' : 'Abriendo Sobre';
    }
    subtitle.textContent = `${sobre.length} cartas â€” Desliza hacia abajo para abrir`;

    // Pre-build card HTML but keep stage hidden
    stage.innerHTML = '';
    sobre.forEach((card, i) => {
        stage.innerHTML += buildCardHTML(card, i);
    });

    // Show envelope, hide cards
    stage.classList.add('hidden');
    stage.classList.remove('cards-entering');
    envelope.classList.remove('hidden', 'opening', 'tearing');
    const inner = envelope.querySelector('.pack-envelope-inner');
    if (inner) { inner.style.transform = ''; inner.style.transition = ''; }
}

/* ---- Pack swipe-to-tear logic ---- */
(function () {
    let startY = 0;
    let isDragging = false;
    const SWIPE_THRESHOLD = 80;

    function getEnvelope() { return document.getElementById('pack-envelope'); }

    function onPointerDown(e) {
        const env = getEnvelope();
        if (!env || env.classList.contains('opening') || env.classList.contains('tearing') || env.classList.contains('hidden')) return;
        isDragging = true;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        env.style.transition = 'none';
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        const env = getEnvelope();
        if (!env) return;
        const currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const delta = currentY - startY;
        if (delta > 0) {
            const progress = Math.min(delta / SWIPE_THRESHOLD, 1);
            const inner = env.querySelector('.pack-envelope-inner');
            if (inner) inner.style.transform = `translateY(${delta * 0.15}px) scale(${1 + progress * 0.04})`;
            const tearLine = env.querySelector('.pack-tear-line');
            if (tearLine) tearLine.style.borderColor = `rgba(250, 204, 21, ${0.4 + progress * 0.6})`;
        }
    }

    function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        const env = getEnvelope();
        if (!env) return;
        const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const delta = endY - startY;

        const inner = env.querySelector('.pack-envelope-inner');
        if (inner) { inner.style.transform = ''; inner.style.transition = ''; }
        env.style.transition = '';

        if (delta >= SWIPE_THRESHOLD) {
            openEnvelopeNow();
        }
    }

    document.addEventListener('mousedown', (e) => { if (e.target.closest('#pack-envelope')) onPointerDown(e); });
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchstart', (e) => { if (e.target.closest('#pack-envelope')) onPointerDown(e); }, { passive: true });
    document.addEventListener('touchmove', (e) => { onPointerMove(e); }, { passive: true });
    document.addEventListener('touchend', (e) => { onPointerUp(e); });
})();

function openEnvelopeNow() {
    const envelope = document.getElementById('pack-envelope');
    const stage = document.getElementById('pack-reveal-stage');
    const subtitle = document.getElementById('pack-reveal-subtitle');

    if (!envelope || envelope.classList.contains('opening')) return;

    envelope.classList.add('tearing');
    setTimeout(() => {
        envelope.classList.add('opening');
    }, 150);

    setTimeout(() => {
        envelope.classList.add('hidden');
        stage.classList.remove('hidden');
        stage.classList.add('cards-entering');
        subtitle.textContent = `${packRevealState.allSobres[packRevealState.currentSobre].length} cartas â€” Toca cada carta para revelarla`;
    }, 1000);
}

function startPackReveal(sobres, bonusesPerSobre, isStarter, onComplete) {
    packRevealState = {
        allSobres: sobres,
        currentSobre: 0,
        revealedCount: 0,
        allNewPlayers: sobres.flat().map(c => c.player),
        allBonuses: bonusesPerSobre,
        isStarterPack: isStarter,
        onComplete: onComplete || null
    };

    document.getElementById('pack-reveal-actions').classList.add('hidden');
    document.getElementById('pack-reveal-bonus').classList.add('hidden');
    document.getElementById('pack-reveal-next-btn').classList.add('hidden');
    document.getElementById('pack-reveal-done-btn').classList.add('hidden');
    document.getElementById('pack-reveal-stage').classList.add('hidden');

    renderCurrentSobre();
    document.getElementById('modal-pack-reveal').classList.remove('hidden');
}

/* ---- Buy Pack from Sobres tab ---- */
window.buyPack = function (packType) {
    if (!state) return;
    const config = PACK_CONFIG[packType];
    if (!config) return;

    if (state.economy.premium < config.cost) {
        return showAlert(`No tienes suficientes monedas premium. Necesitas â—ˆ${config.cost.toLocaleString()} y tienes â—ˆ${state.economy.premium.toLocaleString()}.`);
    }

    // Deduct premium
    state.economy.premium -= config.cost;

    // Generate all sobres
    const excludeIds = new Set(state.roster.map(p => p.id));
    const sobres = [];
    const bonuses = [];

    for (let s = 0; s < config.sobres; s++) {
        const cards = generateSobreCards(config.cardsPerSobre, excludeIds);
        sobres.push(cards);
        bonuses.push(generateSobreBonus());
    }

    saveState();
    startPackReveal(sobres, bonuses, false, null);
}

/* ---- Render Sobres Tab ---- */
function renderSobresTab() {
    const premEl = document.getElementById('sobres-premium');
    const coinsEl = document.getElementById('sobres-coins');
    if (premEl) premEl.textContent = (state.economy.premium || 0).toLocaleString();
    if (coinsEl) coinsEl.textContent = `${((state.economy.coins || 0) / 1000000).toFixed(1)}M`;
}


/ *   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
 
       S I S T E M A   D E   A M I G O S   Y   1 V S 1   P R I V A D O 
 
       = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =   * / 
 
 
 
 w i n d o w . s e n d F r i e n d R e q u e s t   =   a s y n c   f u n c t i o n   ( )   { 
 
         i f   ( ! s t a t e   | |   ! a u t h . c u r r e n t U s e r )   r e t u r n ; 
 
         c o n s t   s e a r c h N a m e   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' f r i e n d - s e a r c h - i n p u t ' ) . v a l u e . t r i m ( ) ; 
 
         i f   ( ! s e a r c h N a m e )   r e t u r n   s h o w A l e r t ( " I n t r o d u c e   u n   n o m b r e   d e   u s u a r i o . " ) ; 
 
         i f   ( s e a r c h N a m e . t o L o w e r C a s e ( )   = = =   s t a t e . a u t h . u s e r . t o L o w e r C a s e ( ) )   r e t u r n   s h o w A l e r t ( " N o   p u e d e s   e n v i a r t e   u n a   s o l i c i t u d   a   t i   m i s m o . " ) ; 
 
 
 
         t r y   { 
 
                 c o n s t   u s e r s R e f   =   d b . c o l l e c t i o n ( ' u s e r s ' ) ; 
 
                 c o n s t   s n a p s h o t   =   a w a i t   u s e r s R e f . w h e r e ( ' a u t h . u s e r ' ,   ' = = ' ,   s e a r c h N a m e ) . g e t ( ) ; 
 
                 i f   ( s n a p s h o t . e m p t y )   r e t u r n   s h o w A l e r t ( " U s u a r i o   n o   e n c o n t r a d o . " ) ; 
 
 
 
                 c o n s t   t a r g e t D o c   =   s n a p s h o t . d o c s [ 0 ] ; 
 
                 c o n s t   t a r g e t D a t a   =   t a r g e t D o c . d a t a ( ) ; 
 
                 c o n s t   t a r g e t I d   =   t a r g e t D o c . i d ; 
 
 
 
                 i f   ( t a r g e t D a t a . f r i e n d s   & &   t a r g e t D a t a . f r i e n d s . s o m e ( f   = >   f . u i d   = = =   a u t h . c u r r e n t U s e r . u i d ) )   { 
 
                         r e t u r n   s h o w A l e r t ( " Y a   s o i s   a m i g o s . " ) ; 
 
                 
        } 
 
                 i f   ( t a r g e t D a t a . f r i e n d R e q u e s t s   & &   t a r g e t D a t a . f r i e n d R e q u e s t s . s o m e ( r   = >   r . u i d   = = =   a u t h . c u r r e n t U s e r . u i d ) )   { 
 
                         r e t u r n   s h o w A l e r t ( " Y a   l e   h a s   e n v i a d o   u n a   s o l i c i t u d   p e n d i e n t e . " ) ; 
 
                 
        } 
 
 
 
                 c o n s t   n e w R e q   =   {   u i d :   a u t h . c u r r e n t U s e r . u i d ,   u s e r n a m e :   s t a t e . a u t h . u s e r ,   t i m e s t a m p :   D a t e . n o w ( )    } ; 
 
                 a w a i t   d b . c o l l e c t i o n ( ' u s e r s ' ) . d o c ( t a r g e t I d ) . u p d a t e ( { 
 
                         f r i e n d R e q u e s t s :   f i r e b a s e . f i r e s t o r e . F i e l d V a l u e . a r r a y U n i o n ( n e w R e q ) 
 
                 
        } ) ; 
 
 
 
                 s h o w A l e r t ( " S o l i c i t u d   d e   a m i s t a d   e n v i a d a   c o n   Ã © x i t o . " ) ; 
 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' f r i e n d - s e a r c h - i n p u t ' ) . v a l u e   =   " " ; 
 
         
    }   c a t c h   ( e r r )   { 
 
                 c o n s o l e . e r r o r ( " E r r o r   e n v i a n d o   s o l i c i t u d : " ,   e r r ) ; 
 
                 s h o w A l e r t ( " E r r o r   a l   e n v i a r   s o l i c i t u d :   "   +   e r r . m e s s a g e ) ; 
 
         
    } 
 
 
} 
 
 
 
 w i n d o w . a c c e p t F r i e n d R e q u e s t   =   a s y n c   f u n c t i o n   ( r e q U i d ,   r e q U s e r n a m e )   { 
 
         i f   ( ! s t a t e   | |   ! a u t h . c u r r e n t U s e r )   r e t u r n ; 
 
         t r y   { 
 
                 s t a t e . f r i e n d R e q u e s t s   =   s t a t e . f r i e n d R e q u e s t s . f i l t e r ( r   = >   r . u i d   ! = =   r e q U i d ) ; 
 
                 c o n s t   m y N e w F r i e n d   =   {   u i d :   r e q U i d ,   u s e r n a m e :   r e q U s e r n a m e ,   a d d e d A t :   D a t e . n o w ( )    } ; 
 
                 s t a t e . f r i e n d s . p u s h ( m y N e w F r i e n d ) ; 
 
 
 
                 a w a i t   d b . c o l l e c t i o n ( ' u s e r s ' ) . d o c ( a u t h . c u r r e n t U s e r . u i d ) . u p d a t e ( { 
 
                         f r i e n d R e q u e s t s :   s t a t e . f r i e n d R e q u e s t s , 
 
                         f r i e n d s :   s t a t e . f r i e n d s 
 
                 
        } ) ; 
 
 
 
                 c o n s t   t h e i r N e w F r i e n d   =   {   u i d :   a u t h . c u r r e n t U s e r . u i d ,   u s e r n a m e :   s t a t e . a u t h . u s e r ,   a d d e d A t :   D a t e . n o w ( )    } ; 
 
                 a w a i t   d b . c o l l e c t i o n ( ' u s e r s ' ) . d o c ( r e q U i d ) . u p d a t e ( { 
 
                         f r i e n d s :   f i r e b a s e . f i r e s t o r e . F i e l d V a l u e . a r r a y U n i o n ( t h e i r N e w F r i e n d ) 
 
                 
        } ) ; 
 
 
 
                 s h o w A l e r t ( ` H a s   a c e p t a d o   a   $ { r e q U s e r n a m e }   c o m o   a m i g o . ` ) ; 
 
                 r e n d e r F r i e n d s T a b ( ) ; 
 
         
    }   c a t c h   ( e r r )   { 
 
                 c o n s o l e . e r r o r ( " E r r o r   a c e p t a n d o : " ,   e r r ) ; 
 
                 s h o w A l e r t ( " E r r o r   a c e p t a n d o   a m i g o . " ) ; 
 
         
    } 
 
 
} 
 
 
 
 w i n d o w . r e j e c t F r i e n d R e q u e s t   =   a s y n c   f u n c t i o n   ( r e q U i d )   { 
 
         i f   ( ! s t a t e   | |   ! a u t h . c u r r e n t U s e r )   r e t u r n ; 
 
         s t a t e . f r i e n d R e q u e s t s   =   s t a t e . f r i e n d R e q u e s t s . f i l t e r ( r   = >   r . u i d   ! = =   r e q U i d ) ; 
 
         t r y   { 
 
                 a w a i t   d b . c o l l e c t i o n ( ' u s e r s ' ) . d o c ( a u t h . c u r r e n t U s e r . u i d ) . u p d a t e ( { 
 
                         f r i e n d R e q u e s t s :   s t a t e . f r i e n d R e q u e s t s 
 
                 
        } ) ; 
 
                 r e n d e r F r i e n d s T a b ( ) ; 
 
         
    }   c a t c h   ( e r r )   { 
 
                 c o n s o l e . e r r o r ( " E r r o r   d e n e g a n d o : " ,   e r r ) ; 
 
         
    } 
 
 
} 
 
 
 
 c o n s t   o r i g i n a l S h o w S u b p a g e F r i e n d s   =   w i n d o w . s h o w S u b p a g e ; 
 
 w i n d o w . s h o w S u b p a g e   =   a s y n c   f u n c t i o n   ( p a g e I d )   { 
 
         i f   ( p a g e I d   = = =   ' f r i e n d s ' )   { 
 
                 i f   ( a u t h . c u r r e n t U s e r )   { 
 
                         c o n s t   d o c   =   a w a i t   d b . c o l l e c t i o n ( ' u s e r s ' ) . d o c ( a u t h . c u r r e n t U s e r . u i d ) . g e t ( ) ; 
 
                         i f   ( d o c . e x i s t s )   { 
 
                                 c o n s t   d a t a   =   d o c . d a t a ( ) ; 
 
                                 i f   ( d a t a . f r i e n d R e q u e s t s )   s t a t e . f r i e n d R e q u e s t s   =   d a t a . f r i e n d R e q u e s t s ; 
 
                                 i f   ( d a t a . f r i e n d s )   s t a t e . f r i e n d s   =   d a t a . f r i e n d s ; 
 
                                 r e n d e r F r i e n d s T a b ( ) ; 
 
                         
            } 
 
                 
        } 
 
         
    } 
 
         i f   ( o r i g i n a l S h o w S u b p a g e F r i e n d s )   o r i g i n a l S h o w S u b p a g e F r i e n d s ( p a g e I d ) ; 
 
 
} 
 
 
 
 f u n c t i o n   r e n d e r F r i e n d s T a b ( )   { 
 
         c o n s t   c o u n t s E l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' f r i e n d - r e q u e s t s - c o u n t ' ) ; 
 
         c o n s t   f r i e n d s C o u n t E l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' f r i e n d s - c o u n t ' ) ; 
 
         i f   ( c o u n t s E l )   c o u n t s E l . t e x t C o n t e n t   =   s t a t e . f r i e n d R e q u e s t s   ?   s t a t e . f r i e n d R e q u e s t s . l e n g t h   :   0 ; 
 
         i f   ( f r i e n d s C o u n t E l )   f r i e n d s C o u n t E l . t e x t C o n t e n t   =   s t a t e . f r i e n d s   ?   s t a t e . f r i e n d s . l e n g t h   :   0 ; 
 
 
 
         c o n s t   r e q L i s t   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' f r i e n d - r e q u e s t s - l i s t ' ) ; 
 
         i f   ( r e q L i s t )   { 
 
                 r e q L i s t . i n n e r H T M L   =   ' ' ; 
 
                 i f   ( ! s t a t e . f r i e n d R e q u e s t s   | |   s t a t e . f r i e n d R e q u e s t s . l e n g t h   = = =   0 )   { 
 
                         r e q L i s t . i n n e r H T M L   =   ' < d i v   c l a s s = " t e x t - [ 1 0 p x ]   t e x t - s l a t e - 5 0 0   i t a l i c   t e x t - c e n t e r   m t - 4 "   i d = " e m p t y - r e q u e s t s - m s g " > N o   h a y   s o l i c i t u d e s < / d i v > ' ; 
 
                 
        }   e l s e   { 
 
                         s t a t e . f r i e n d R e q u e s t s . f o r E a c h ( r e q   = >   { 
 
                                 c o n s t   d i v   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
 
                                 d i v . c l a s s N a m e   =   " f l e x   j u s t i f y - b e t w e e n   i t e m s - c e n t e r   b g - [ # 2 7 2 7 3 8 ]   p - 3   r o u n d e d   b o r d e r   b o r d e r - [ # 3 1 3 1 4 5 ] " ; 
 
                                 d i v . i n n e r H T M L   =   ` 
 
                                         < d i v   c l a s s = " t e x t - x s   f o n t - b o l d   t e x t - w h i t e   u p p e r c a s e   t r a c k i n g - w i d e s t " > $ { r e q . u s e r n a m e } < / d i v > 
 
                                         < d i v   c l a s s = " f l e x   g a p - 2 " > 
 
                                                 < b u t t o n   o n c l i c k = " a c c e p t F r i e n d R e q u e s t ( ' $ { r e q . u i d } ' ,   ' $ { r e q . u s e r n a m e } ' ) "   c l a s s = " b g - g r e e n - 6 0 0   h o v e r : b g - g r e e n - 5 0 0   t e x t - w h i t e   p - 1   r o u n d e d   t r a n s i t i o n   t e x t - x s " > â S < / b u t t o n > 
 
                                                 < b u t t o n   o n c l i c k = " r e j e c t F r i e n d R e q u e s t ( ' $ { r e q . u i d } ' ) "   c l a s s = " b g - r e d - 6 0 0   h o v e r : b g - r e d - 5 0 0   t e x t - w h i t e   p - 1   r o u n d e d   t r a n s i t i o n   t e x t - x s " > â S < / b u t t o n > 
 
                                         < / d i v > 
 
                                 ` ; 
 
                                 r e q L i s t . a p p e n d C h i l d ( d i v ) ; 
 
                         
            } ) ; 
 
                 
        } 
 
         
    } 
 
 
 
         c o n s t   f r i e n d L i s t   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' f r i e n d s - l i s t ' ) ; 
 
         i f   ( f r i e n d L i s t )   { 
 
                 f r i e n d L i s t . i n n e r H T M L   =   ' ' ; 
 
                 i f   ( ! s t a t e . f r i e n d s   | |   s t a t e . f r i e n d s . l e n g t h   = = =   0 )   { 
 
                         f r i e n d L i s t . i n n e r H T M L   =   ' < d i v   c l a s s = " t e x t - [ 1 1 p x ]   t e x t - s l a t e - 5 0 0   i t a l i c   t e x t - c e n t e r   m t - 1 0 "   i d = " e m p t y - f r i e n d s - m s g " > A g r e g a   a m i g o s   p a r a   j u g a r   p a r t i d o s   1 v s 1   p r i v a d o s . < / d i v > ' ; 
 
                 
        }   e l s e   { 
 
                         s t a t e . f r i e n d s . f o r E a c h ( f   = >   { 
 
                                 c o n s t   d i v   =   d o c u m e n t . c r e a t e E l e m e n t ( ' d i v ' ) ; 
 
                                 d i v . c l a s s N a m e   =   " f l e x   j u s t i f y - b e t w e e n   i t e m s - c e n t e r   b g - [ # 2 7 2 7 3 8 ]   p - 3   r o u n d e d - x l   b o r d e r   b o r d e r - [ # 3 1 3 1 4 5 ] " ; 
 
                                 d i v . i n n e r H T M L   =   ` 
 
                                         < d i v   c l a s s = " f l e x   i t e m s - c e n t e r   g a p - 3 " > 
 
                                                 < i m g   s r c = " $ { g e t A v a t a r ( f . u s e r n a m e ) } "   c l a s s = " w - 8   h - 8   r o u n d e d - f u l l   b o r d e r   b o r d e r - [ # 3 1 3 1 4 5 ] " > 
 
                                                 < d i v   c l a s s = " t e x t - x s   f o n t - b o l d   t e x t - w h i t e   u p p e r c a s e   t r a c k i n g - w i d e s t " > $ { f . u s e r n a m e } < / d i v > 
 
                                         < / d i v > 
 
                                         < b u t t o n   o n c l i c k = " i n v i t e F r i e n d 1 v 1 ( ' $ { f . u i d } ' ) "   c l a s s = " b t n - a c t i o n   p y - 1   p x - 4   t e x t - [ 1 0 p x ]   t r a c k i n g - w i d e s t   s h a d o w - m d   f l e x   i t e m s - c e n t e r   g a p - 2 " > < s p a n > â a ï ¸  < / s p a n >   I N V I T A R < / b u t t o n > 
 
                                 ` ; 
 
                                 f r i e n d L i s t . a p p e n d C h i l d ( d i v ) ; 
 
                         
            } ) ; 
 
                 
        } 
 
         
    } 
 
 
} 
 
 
 
 / /   - - -   1 V 1   I N V I T A T I O N   L O G I C   ( S o c k e t )   - - - 
 
 l e t   p e n d i n g 1 v 1 I n v i t e   =   n u l l ; 
 
 
 
 w i n d o w . i n v i t e F r i e n d 1 v 1   =   f u n c t i o n   ( t a r g e t U i d )   { 
 
         i f   ( ! w i n d o w . s o c k e t   | |   ! w i n d o w . s o c k e t . c o n n e c t e d )   r e t u r n   s h o w A l e r t ( " N o   e s t Ã ¡ s   c o n e c t a d o   a l   s e r v i d o r   m u l t i p l a y e r . " ) ; 
 
         w i n d o w . s o c k e t . e m i t ( ' i n v i t e _ f r i e n d ' ,   {   t a r g e t U i d :   t a r g e t U i d ,   s e n d e r N a m e :   s t a t e . a u t h . u s e r ,   s e n d e r O v r :   s t a t e . s q u a d O v r   | |   5 0    } ) ; 
 
         s h o w A l e r t ( " I n v i t a c i Ã ³ n   e n v i a d a .   E s p e r a n d o   r e s p u e s t a   d e l   j u g a d o r . . . " ) ; 
 
 
} 
 
 
 
 f u n c t i o n   s e t u p P r i v a t e M a t c h S o c k e t E v e n t s ( s o c k )   { 
 
         s o c k . o n ( ' r e c e i v e _ i n v i t e ' ,   ( d a t a )   = >   { 
 
                 p e n d i n g 1 v 1 I n v i t e   =   d a t a ; 
 
                 c o n s t   m o d a l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' m o d a l - 1 v 1 - i n v i t e ' ) ; 
 
                 i f   ( m o d a l )   { 
 
                         d o c u m e n t . g e t E l e m e n t B y I d ( ' i n v i t e - s e n d e r - n a m e ' ) . t e x t C o n t e n t   =   d a t a . s e n d e r N a m e ; 
 
                         m o d a l . c l a s s L i s t . r e m o v e ( ' h i d d e n ' ) ; 
 
                 
        } 
 
         
    } ) ; 
 
 
 
         s o c k . o n ( ' i n v i t e _ r e s p o n s e ' ,   ( d a t a )   = >   { 
 
                 i f   ( ! d a t a . a c c e p t e d )   { 
 
                         s h o w A l e r t ( d a t a . m e s s a g e   | |   " I n v i t a c i Ã ³ n   r e c h a z a d a   o   f a l l i d a . " ) ; 
 
                 
        } 
 
         
    } ) ; 
 
 
 
         s o c k . o n ( ' p r i v a t e _ m a t c h _ s t a r t ' ,   ( d a t a )   = >   { 
 
                 c l o s e S u b p a g e ( ) ; 
 
                 c o n s t   m m   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' m a t c h - m o d a l ' ) ; 
 
                 i f   ( m m )   { 
 
                         m m . c l a s s L i s t . r e m o v e ( ' h i d d e n ' ) ; 
 
                         m m . s t y l e . d i s p l a y   =   ' f l e x ' ; 
 
                 
        } 
 
                 s i m I s R a n k e d   =   f a l s e ; 
 
                 s i m I s M u l t i p l a y e r   =   t r u e ; 
 
                 s i m M u l t i p l a y e r R o o m   =   d a t a . r o o m ; 
 
                 s i m M a t c h I n P r o g r e s s   =   t r u e ; 
 
                 s i m L a t e s t N a r r a t i v e T i m e   =   0 ; 
 
 
 
                 c o n s t   h o m e L a b e l   =   d a t a . i s P l a y e r 1   ?   s t a t e . t e a m . n a m e   :   d a t a . o p p o n e n t N a m e ; 
 
                 c o n s t   a w a y L a b e l   =   d a t a . i s P l a y e r 1   ?   d a t a . o p p o n e n t N a m e   :   s t a t e . t e a m . n a m e ; 
 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' s i m - h o m e - n a m e ' ) . t e x t C o n t e n t   =   h o m e L a b e l ; 
 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' s i m - a w a y - n a m e ' ) . t e x t C o n t e n t   =   a w a y L a b e l ; 
 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' s i m - h o m e - s c o r e ' ) . t e x t C o n t e n t   =   " 0 " ; 
 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' s i m - a w a y - s c o r e ' ) . t e x t C o n t e n t   =   " 0 " ; 
 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' m a t c h - n a r r a t i v e ' ) . i n n e r H T M L   =   " " ; 
 
 
 
                 s e t T i m e o u t ( ( )   = >   { 
 
                         i f   ( t y p e o f   s e n d M u l t i p l a y e r L i n e u p   = = =   ' f u n c t i o n ' )   s e n d M u l t i p l a y e r L i n e u p ( ) ; 
 
                 
        } ,   5 0 0 ) ; 
 
         
    } ) ; 
 
 
} 
 
 
 
 c o n s t   s o c k e t H o o k I n t e r v a l   =   s e t I n t e r v a l ( ( )   = >   { 
 
         i f   ( w i n d o w . s o c k e t   & &   w i n d o w . s o c k e t . h a s L i s t e n e r s )   { 
 
                 i f   ( ! w i n d o w . s o c k e t . _ p r i v a t e E v e n t s H o o k e d )   { 
 
                         s e t u p P r i v a t e M a t c h S o c k e t E v e n t s ( w i n d o w . s o c k e t ) ; 
 
                         w i n d o w . s o c k e t . _ p r i v a t e E v e n t s H o o k e d   =   t r u e ; 
 
                 
        } 
 
                 c l e a r I n t e r v a l ( s o c k e t H o o k I n t e r v a l ) ; 
 
         
    } 
 
 
} ,   1 0 0 0 ) ; 
 
 
 
 w i n d o w . a c c e p t 1 v 1 I n v i t e   =   f u n c t i o n   ( )   { 
 
         i f   ( ! p e n d i n g 1 v 1 I n v i t e   | |   ! w i n d o w . s o c k e t )   r e t u r n ; 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' m o d a l - 1 v 1 - i n v i t e ' ) . c l a s s L i s t . a d d ( ' h i d d e n ' ) ; 
 
         w i n d o w . s o c k e t . e m i t ( ' r e s p o n d _ i n v i t e ' ,   {   a c c e p t e d :   t r u e ,   t a r g e t S o c k e t I d :   p e n d i n g 1 v 1 I n v i t e . f r o m S o c k e t I d ,   s e n d e r N a m e :   s t a t e . a u t h . u s e r    } ) ; 
 
         p e n d i n g 1 v 1 I n v i t e   =   n u l l ; 
 
 
} 
 
 
 
 w i n d o w . r e j e c t 1 v 1 I n v i t e   =   f u n c t i o n   ( )   { 
 
         i f   ( ! p e n d i n g 1 v 1 I n v i t e   | |   ! w i n d o w . s o c k e t )   r e t u r n ; 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' m o d a l - 1 v 1 - i n v i t e ' ) . c l a s s L i s t . a d d ( ' h i d d e n ' ) ; 
 
         w i n d o w . s o c k e t . e m i t ( ' r e s p o n d _ i n v i t e ' ,   {   a c c e p t e d :   f a l s e ,   t a r g e t S o c k e t I d :   p e n d i n g 1 v 1 I n v i t e . f r o m S o c k e t I d    } ) ; 
 
         p e n d i n g 1 v 1 I n v i t e   =   n u l l ; 
 
 
} 
 
 
 
 / *   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
 
       S I S T E M A   D E   T O R N E O S   D E   F I R E B A S E 
 
       = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =   * / 
 
 
 
 l e t   u n s u b s c r i b e T o u r n a m e n t s   =   n u l l ; 
 
 l e t   c u r r e n t T o u r n a m e n t s   =   [ ] ; 
 
 
 
 c o n s t   o r i g i n a l S w i t c h T a b T r n   =   w i n d o w . s w i t c h T a b ; 
 
 w i n d o w . s w i t c h T a b   =   f u n c t i o n   ( t a b I d )   { 
 
         i f   ( o r i g i n a l S w i t c h T a b T r n )   o r i g i n a l S w i t c h T a b T r n ( t a b I d ) ; 
 
 
 
         i f   ( t a b I d   = = =   ' t o u r n a m e n t s ' )   { 
 
                 s t a r t T o u r n a m e n t s L i s t e n e r ( ) ; 
 
         
    }   e l s e   { 
 
                 s t o p T o u r n a m e n t s L i s t e n e r ( ) ; 
 
         
    } 
 
 
} 
 
 
 
 f u n c t i o n   s t a r t T o u r n a m e n t s L i s t e n e r ( )   { 
 
         i f   ( u n s u b s c r i b e T o u r n a m e n t s )   r e t u r n ; 
 
         u n s u b s c r i b e T o u r n a m e n t s   =   d b . c o l l e c t i o n ( ' t o u r n a m e n t s ' ) . o n S n a p s h o t ( s n a p   = >   { 
 
                 c u r r e n t T o u r n a m e n t s   =   [ ] ; 
 
                 s n a p . f o r E a c h ( d o c   = >   { 
 
                         c u r r e n t T o u r n a m e n t s . p u s h ( {   i d :   d o c . i d ,   . . . d o c . d a t a ( )    } ) ; 
 
                 
        } ) ; 
 
                 r e n d e r T o u r n a m e n t s L i s t ( ) ; 
 
         
    } ) ; 
 
 
} 
 
 
 
 f u n c t i o n   s t o p T o u r n a m e n t s L i s t e n e r ( )   { 
 
         i f   ( u n s u b s c r i b e T o u r n a m e n t s )   { 
 
                 u n s u b s c r i b e T o u r n a m e n t s ( ) ; 
 
                 u n s u b s c r i b e T o u r n a m e n t s   =   n u l l ; 
 
         
    } 
 
 
} 
 
 
 
 w i n d o w . r e n d e r T o u r n a m e n t s L i s t   =   f u n c t i o n   ( )   { 
 
         c o n s t   t b o d y   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t o u r n a m e n t s - t b o d y ' ) ; 
 
         c o n s t   s e a r c h E l   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t o u r n a m e n t s - s e a r c h - i n p u t ' ) ; 
 
         c o n s t   s e a r c h   =   s e a r c h E l   ?   s e a r c h E l . v a l u e . t o L o w e r C a s e ( )   :   " " ; 
 
         i f   ( ! t b o d y )   r e t u r n ; 
 
 
 
         t b o d y . i n n e r H T M L   =   ' ' ; 
 
 
 
         c o n s t   f i l t e r e d   =   c u r r e n t T o u r n a m e n t s . f i l t e r ( t   = >   t . n a m e . t o L o w e r C a s e ( ) . i n c l u d e s ( s e a r c h ) ) ; 
 
 
 
         i f   ( f i l t e r e d . l e n g t h   = = =   0 )   { 
 
                 t b o d y . i n n e r H T M L   =   ' < t r > < t d   c o l s p a n = " 6 "   c l a s s = " t e x t - c e n t e r   p y - 8   t e x t - s l a t e - 5 0 0   t e x t - x s   i t a l i c " > N o   h a y   t o r n e o s   d i s p o n i b l e s < / t d > < / t r > ' ; 
 
                 r e t u r n ; 
 
         
    } 
 
 
 
         f i l t e r e d . f o r E a c h ( t   = >   { 
 
                 c o n s t   i s P r i v a t e   =   t . p a s s w o r d   & &   t . p a s s w o r d . l e n g t h   >   0 ; 
 
                 c o n s t   m y R a n k I d x   =   g e t R a n k I n d e x ( s t a t e . c o m p e t i t i v e . r a n k ) ; 
 
                 c o n s t   r e q R a n k I d x   =   g e t R a n k I n d e x ( t . m i n R a n k   | |   ' N o v a t o ' ) ; 
 
 
 
                 l e t   a c t i o n H t m l   =   ' ' ; 
 
                 i f   ( t . c r e a t o r U i d   = = =   a u t h . c u r r e n t U s e r . u i d )   { 
 
                         a c t i o n H t m l   =   ` < b u t t o n   o n c l i c k = " d e l e t e T o u r n a m e n t ( ' $ { t . i d } ' ) "   c l a s s = " b g - r e d - 6 0 0   h o v e r : b g - r e d - 5 0 0   p x - 3   p y - 1   r o u n d e d   t e x t - [ 1 0 p x ]   t e x t - w h i t e   f o n t - b o l d   t r a n s i t i o n   w - f u l l " > E L I M I N A R < / b u t t o n > ` ; 
 
                 
        }   e l s e   i f   ( m y R a n k I d x   <   r e q R a n k I d x )   { 
 
                         a c t i o n H t m l   =   ` < d i v   c l a s s = " t e x t - [ 1 0 p x ]   t e x t - r e d - 4 0 0   f o n t - b o l d   u p p e r c a s e   t e x t - c e n t e r   b o r d e r - 2   b o r d e r - r e d - 5 0 0 / 5 0   r o u n d e d   p - 1 " > R A N G O   B A J O < / d i v > ` ; 
 
                 
        }   e l s e   i f   ( t . p a r t i c i p a n t s   & &   t . p a r t i c i p a n t s . i n c l u d e s ( a u t h . c u r r e n t U s e r . u i d ) )   { 
 
                         a c t i o n H t m l   =   ` < d i v   c l a s s = " t e x t - [ 1 0 p x ]   t e x t - g r e e n - 4 0 0   f o n t - b o l d   u p p e r c a s e   t e x t - c e n t e r   b o r d e r - 2   b o r d e r - g r e e n - 5 0 0 / 5 0   r o u n d e d   p - 1 " > I N S C R I T O < / d i v > ` ; 
 
                 
        }   e l s e   { 
 
                         i f   ( i s P r i v a t e )   { 
 
                                 a c t i o n H t m l   =   ` < b u t t o n   o n c l i c k = " p r o m p t J o i n T o u r n a m e n t ( ' $ { t . i d } ' ,   ' $ { t . m i n R a n k } ' ) "   c l a s s = " b g - y e l l o w - 6 0 0   h o v e r : b g - y e l l o w - 5 0 0   p x - 3   p y - 1   r o u n d e d   t e x t - [ 1 0 p x ]   t e x t - w h i t e   f o n t - b o l d   t r a n s i t i o n   w - f u l l   s h a d o w - [ 0 _ 0 _ 1 0 p x _ r g b a ( 2 3 4 , 1 7 9 , 8 , 0 . 4 ) ] " > U N I R S E   ð x  < / b u t t o n > ` ; 
 
                         
            }   e l s e   { 
 
                                 a c t i o n H t m l   =   ` < b u t t o n   o n c l i c k = " j o i n T o u r n a m e n t ( ' $ { t . i d } ' ) "   c l a s s = " b g - b l u e - 6 0 0   h o v e r : b g - b l u e - 5 0 0   p x - 3   p y - 1   r o u n d e d   t e x t - [ 1 0 p x ]   t e x t - w h i t e   f o n t - b o l d   t r a n s i t i o n   w - f u l l " > U N I R S E < / b u t t o n > ` ; 
 
                         
            } 
 
                 
        } 
 
 
 
                 c o n s t   t r   =   d o c u m e n t . c r e a t e E l e m e n t ( ' t r ' ) ; 
 
                 t r . c l a s s N a m e   =   " h o v e r : b g - [ # 1 c 1 c 2 8 ]   t r a n s i t i o n   b o r d e r - b   b o r d e r - [ # 3 1 3 1 4 5 ] " ; 
 
                 t r . i n n e r H T M L   =   ` 
 
                         < t d   c l a s s = " p l - 4   p y - 3   t e x t - x s   f o n t - b o l d   t e x t - w h i t e   u p p e r c a s e   t r a c k i n g - w i d e s t " > $ { t . n a m e } < / t d > 
 
                         < t d   c l a s s = " t e x t - c e n t e r   t e x t - x s   t e x t - s k y - 4 0 0   f o n t - b o l d " > $ { t . c r e a t o r N a m e } < / t d > 
 
                         < t d   c l a s s = " t e x t - c e n t e r   t e x t - x s   t e x t - s l a t e - 3 0 0   f o n t - m o n o " > $ { ( t . p a r t i c i p a n t s   | |   [ ] ) . l e n g t h }   J u g a d o r e s < / t d > 
 
                         < t d   c l a s s = " t e x t - c e n t e r   t e x t - x s   t e x t - s l a t e - 3 0 0   u p p e r c a s e " > $ { t . m i n R a n k } < / t d > 
 
                         < t d   c l a s s = " t e x t - c e n t e r   t e x t - l g " > $ { i s P r i v a t e   ?   ' ð x  '   :   ' ð xR ' } < / t d > 
 
                         < t d   c l a s s = " p r - 4 " > $ { a c t i o n H t m l } < / t d > 
 
                 ` ; 
 
                 t b o d y . a p p e n d C h i l d ( t r ) ; 
 
         
    } ) ; 
 
 
} 
 
 
 
 w i n d o w . o p e n C r e a t e T o u r n a m e n t M o d a l   =   f u n c t i o n   ( )   { 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' m o d a l - c r e a t e - t o u r n a m e n t ' ) . c l a s s L i s t . r e m o v e ( ' h i d d e n ' ) ; 
 
 
} 
 
 
 
 d o c u m e n t . g e t E l e m e n t B y I d ( ' c r e a t e - t o u r n a m e n t - f o r m ' ) . a d d E v e n t L i s t e n e r ( ' s u b m i t ' ,   a s y n c   ( e )   = >   { 
 
         e . p r e v e n t D e f a u l t ( ) ; 
 
         i f   ( ! s t a t e   | |   ! a u t h . c u r r e n t U s e r )   r e t u r n ; 
 
 
 
         c o n s t   n a m e   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t o u r n a m e n t - n a m e ' ) . v a l u e . t r i m ( ) ; 
 
         c o n s t   m i n R a n k   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t o u r n a m e n t - m i n - r a n k ' ) . v a l u e ; 
 
         c o n s t   p a s s w o r d   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t o u r n a m e n t - p a s s w o r d ' ) . v a l u e . t r i m ( ) ; 
 
 
 
         t r y   { 
 
                 a w a i t   d b . c o l l e c t i o n ( ' t o u r n a m e n t s ' ) . a d d ( { 
 
                         n a m e :   n a m e , 
 
                         m i n R a n k :   m i n R a n k , 
 
                         p a s s w o r d :   p a s s w o r d , 
 
                         c r e a t o r U i d :   a u t h . c u r r e n t U s e r . u i d , 
 
                         c r e a t o r N a m e :   s t a t e . a u t h . u s e r , 
 
                         p a r t i c i p a n t s :   [ a u t h . c u r r e n t U s e r . u i d ] , 
 
                         c r e a t e d A t :   f i r e b a s e . f i r e s t o r e . F i e l d V a l u e . s e r v e r T i m e s t a m p ( ) 
 
                 
        } ) ; 
 
 
 
                 s h o w A l e r t ( " T o r n e o   c r e a d o   c o n   Ã © x i t o . " ) ; 
 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' m o d a l - c r e a t e - t o u r n a m e n t ' ) . c l a s s L i s t . a d d ( ' h i d d e n ' ) ; 
 
                 d o c u m e n t . g e t E l e m e n t B y I d ( ' c r e a t e - t o u r n a m e n t - f o r m ' ) . r e s e t ( ) ; 
 
         
    }   c a t c h   ( e r r )   { 
 
                 c o n s o l e . e r r o r ( " E r r o r   c r e a t i n g   t o u r n a m e n t " ,   e r r ) ; 
 
                 s h o w A l e r t ( " E r r o r   a l   c r e a r   e l   t o r n e o . " ) ; 
 
         
    } 
 
 
} ) ; 
 
 
 
 w i n d o w . d e l e t e T o u r n a m e n t   =   a s y n c   f u n c t i o n   ( t i d )   { 
 
         s h o w C o n f i r m ( " Â ¿ S e g u r o   q u e   q u i e r e s   e l i m i n a r   t u   t o r n e o ? " ,   a s y n c   ( )   = >   { 
 
                 t r y   { 
 
                         a w a i t   d b . c o l l e c t i o n ( ' t o u r n a m e n t s ' ) . d o c ( t i d ) . d e l e t e ( ) ; 
 
                         s h o w A l e r t ( " T o r n e o   e l i m i n a d o . " ) ; 
 
                 
        }   c a t c h   ( e r r )   { 
 
                         c o n s o l e . e r r o r ( " E r r o r   d e l e t i n g " ,   e r r ) ; 
 
                 
        } 
 
         
    } ) ; 
 
 
} 
 
 
 
 w i n d o w . p r o m p t J o i n T o u r n a m e n t   =   f u n c t i o n   ( t i d ,   r e q R a n k )   { 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' j o i n - t o u r n a m e n t - i d ' ) . v a l u e   =   t i d ; 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' j o i n - t o u r n a m e n t - r e q - r a n k ' ) . v a l u e   =   r e q R a n k ; 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' j o i n - t o u r n a m e n t - p a s s w o r d ' ) . v a l u e   =   " " ; 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' m o d a l - j o i n - t o u r n a m e n t ' ) . c l a s s L i s t . r e m o v e ( ' h i d d e n ' ) ; 
 
 
} 
 
 
 
 w i n d o w . s u b m i t J o i n P r i v a t e T o u r n a m e n t   =   a s y n c   f u n c t i o n   ( )   { 
 
         c o n s t   t i d   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' j o i n - t o u r n a m e n t - i d ' ) . v a l u e ; 
 
         c o n s t   p w d   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' j o i n - t o u r n a m e n t - p a s s w o r d ' ) . v a l u e ; 
 
 
 
         c o n s t   t   =   c u r r e n t T o u r n a m e n t s . f i n d ( x   = >   x . i d   = = =   t i d ) ; 
 
         i f   ( ! t )   r e t u r n ; 
 
 
 
         i f   ( t . p a s s w o r d   ! = =   p w d )   { 
 
                 r e t u r n   s h o w A l e r t ( " C o n t r a s e Ã ± a   i n c o r r e c t a . " ) ; 
 
         
    } 
 
 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' m o d a l - j o i n - t o u r n a m e n t ' ) . c l a s s L i s t . a d d ( ' h i d d e n ' ) ; 
 
         j o i n T o u r n a m e n t ( t i d ) ; 
 
 
} 
 
 
 
 w i n d o w . j o i n T o u r n a m e n t   =   a s y n c   f u n c t i o n   ( t i d )   { 
 
         i f   ( ! s t a t e   | |   ! a u t h . c u r r e n t U s e r )   r e t u r n ; 
 
         t r y   { 
 
                 a w a i t   d b . c o l l e c t i o n ( ' t o u r n a m e n t s ' ) . d o c ( t i d ) . u p d a t e ( { 
 
                         p a r t i c i p a n t s :   f i r e b a s e . f i r e s t o r e . F i e l d V a l u e . a r r a y U n i o n ( a u t h . c u r r e n t U s e r . u i d ) 
 
                 
        } ) ; 
 
                 s h o w A l e r t ( " T e   h a s   i n s c r i t o   a l   t o r n e o . " ) ; 
 
         
    }   c a t c h   ( e r r )   { 
 
                 c o n s o l e . e r r o r ( " E r r o r   j o i n i n g " ,   e r r ) ; 
 
                 s h o w A l e r t ( " E r r o r   a l   u n i r t e   a l   t o r n e o . " ) ; 
 
         
    } 
 
 
} 
 
 
