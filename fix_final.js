const fs = require('fs');

const lines = fs.readFileSync('app.js', 'utf8').split(/\r?\n/);
let targetIndex = -1;

for (let i = 5120; i < 5150; i++) {
    if (lines[i] && lines[i].includes("document.getElementById('pvp-halftime-actions').classList.add('hidden');") &&
        lines[i-1] && lines[i-1].includes("}")) {
        targetIndex = i;
        break;
    }
}

if (targetIndex !== -1) {
    console.log(`Injecting missing listener at line ${targetIndex + 1}`);
    lines.splice(targetIndex, 0, "        pvpSocket.on('match_ready', (data) => {");
    
    lines.push("");
    lines.push("/* Password Visibility Toggle */");
    lines.push("window.togglePasswordVisibility = function(inputId, btn) {");
    lines.push("    const input = document.getElementById(inputId);");
    lines.push("    if (input.type === 'password') {");
    lines.push("        input.type = 'text';");
    lines.push("        btn.innerHTML = '<svg class=\"w-5 h-5 eye-icon\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21\"></path></svg>';");
    lines.push("    } else {");
    lines.push("        input.type = 'password';");
    lines.push("        btn.innerHTML = '<svg class=\"w-5 h-5 eye-icon\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\"></path><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z\"></path></svg>';");
    lines.push("    }");
    lines.push("};");
    
    fs.writeFileSync('app.js', lines.join('\n'), 'utf8');
} else {
    console.log("Could not find the injection point in lines 5120-5150!");
}
