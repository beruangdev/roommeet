import { exec } from "child_process";

if (process.argv.length <= 2) {
    console.log("[1] Penggunaan: node command.js push -m <PESAN>");
    process.exit(1);
}

const option = process.argv[2];
const message = process.argv[3];

if (option === "-m") {
    console.log(`Pesan yang diterima: ${message}`);
} else {
    console.log("[2] Penggunaan: node command.js push -m <PESAN>");
}

const command = `git add . && git commit -m "${message}" && git push`;
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`Hasil dari perintah ${command}:`);
    console.log(stdout);
    if (stderr) {
        console.error(`stderr: ${stderr}`);
    }
});
