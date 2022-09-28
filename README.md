# Solana Twitter

## Set up
```
yarn install
cargo install
```

## Running

**localnet**
```
anchor build
solana-test-validator (or with --reset)
anchor deploy
anchor test --skip-local-validator
```

**devnet**
```
anchor build
anchor deploy
```
