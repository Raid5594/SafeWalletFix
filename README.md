## Technical Stack
1. React - is used for creating user interface
2. NodeJS/Express - is used for creating backend
3. Truffle/Ganache - is used for creating and testing smart contracts

## How to run
1. Download this repository to your local machine
[How](https://github.com/Raid5594/SafeWallet.git)
2. Open this project in your terminal
[How](https://www.groovypost.com/howto/open-command-window-terminal-window-specific-folder-windows-mac-linux/)
3. Ensure that you have installed nodejs (^v11.9.0) and npm (^6.10.3)
3. Choose your preferred way for run the app and do the corresponding steps

### Run localy
1. In the root directory run the following command in the terminal:
2. Run  `npm run dev`

## How to compile/deploy smart contracts
1. Make sure the follwing are installed: truffle(^v5.0.28), solidity (^v0.5.0), web3.js(^v1.0.0)
2. Ensure that Ganache is running and listening on RPC Server HTTP://127.0.0.1:7545
3. Run  `npm run contractsCompile` to compile the smart contracts
4. Run  `npm run contractsDeploy` to deploy the smart contracts to the test network (Ganache)
