# Bitcoin Wallet Recovery Bot

A tool for generating and recovering Bitcoin wallets using BIP39 mnemonic phrases.

## Features

- Generate new BIP39 mnemonic phrases
- Recover Bitcoin wallets from existing mnemonic phrases
- Display wallet information including address, public key, private key, and WIF

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Serve the frontend files using a local server of your choice.

## Usage

1. Open the application in your web browser
2. To generate a new mnemonic phrase, click the "Generate" button
3. To recover a wallet, enter your 12-word mnemonic phrase and click "Recover Wallet"

## Security Notes

- Never share your mnemonic phrase or private keys with anyone
- This tool is for educational purposes only
- Always verify transactions and addresses before sending funds

## License

MIT License