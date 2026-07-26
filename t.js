const { ethers } = require("ethers");
const m = "test test test test test test test test test test test junk";

let t = Date.now();
const w = ethers.Wallet.fromPhrase(m);
console.log("fromPhrase:", Date.now() - t, "ms  ->", w.address);

// caminho equivalente: seed via PBKDF2 + derivePath padrão Ethereum
const seedHex = ethers.pbkdf2(
  ethers.toUtf8Bytes(m),
  ethers.toUtf8Bytes("mnemonic"),
  2048,
  64,
  "sha512"
);
const node = ethers.HDNodeWallet.fromSeed(seedHex).derivePath("m/44'/60'/0'/0/0");
console.log("fromSeed  :", node.address);
console.log(w.address === node.address ? "✅ MESMO endereço" : "❌ DIVERGE — quebraria import da seed");
