const { ethers } = require("ethers");

// Reproduz buildMnemonic() e confirma que a nova derivação bate com a antiga
const CryptoJS = require("crypto-js");

function buildMnemonic() {
  const langEn = ethers.wordlists.en;
  const seed = Date.now().toString() + Math.random().toString() + Math.random().toString();
  let hash = CryptoJS.SHA256(seed).toString(CryptoJS.enc.Hex);
  const wordIndexes = [];
  for (let i = 0; i < 11; i++) {
    if (i > 0 && i % 4 === 0) {
      hash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(hash + i.toString())).toString(CryptoJS.enc.Hex);
    }
    const chunk = hash.slice(i * 3, i * 3 + 3);
    wordIndexes.push(parseInt(chunk, 16) & 0x7ff);
  }
  let bits = "";
  for (const idx of wordIndexes) bits += idx.toString(2).padStart(11, "0");
  const extraByte = parseInt(hash.slice(33, 35), 16);
  const extraBits = (extraByte & 0xfe).toString(2).padStart(8, "0").slice(0, 7);
  bits += extraBits;
  const entropyHex = BigInt("0b" + bits).toString(16).padStart(32, "0");
  const checksumHash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(entropyHex)).toString(CryptoJS.enc.Hex);
  const checksumBits = parseInt(checksumHash[0], 16).toString(2).padStart(4, "0");
  wordIndexes.push(parseInt(extraBits + checksumBits, 2) & 0x7ff);
  return wordIndexes.map((idx) => langEn.getWord(idx)).join(" ");
}

let ok = 0, fail = 0;
for (let i = 0; i < 200; i++) {
  const m = buildMnemonic();
  const oldAddr = ethers.Wallet.fromPhrase(m).address;
  const seedHex = ethers.pbkdf2(ethers.toUtf8Bytes(m), ethers.toUtf8Bytes("mnemonic"), 2048, 64, "sha512");
  const newAddr = ethers.HDNodeWallet.fromSeed(seedHex).derivePath("m/44'/60'/0'/0/0").address;
  oldAddr === newAddr ? ok++ : fail++;
}
console.log(`${ok}/200 endereços idênticos, ${fail} divergências`);
console.log(fail === 0 ? "✅ derivação compatível — seeds antigas continuam válidas" : "❌ INCOMPATÍVEL");
