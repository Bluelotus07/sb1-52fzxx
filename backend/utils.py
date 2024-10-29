from bip39 import generate_mnemonic as gen_mnemonic
from hdwallet import BIP44HDWallet
from hdwallet.cryptocurrencies import (
    BitcoinMainnet, 
    EthereumMainnet, 
    LitecoinMainnet
)
from hdwallet.utils import generate_entropy
from typing import Dict, List

SUPPORTED_NETWORKS = {
    'BTC': BitcoinMainnet,
    'ETH': EthereumMainnet,
    'LTC': LitecoinMainnet
}

def generate_mnemonic(strength: int = 128) -> str:
    """Generate a new BIP39 mnemonic phrase."""
    entropy = generate_entropy(strength=strength)
    return gen_mnemonic(language="english", strength=strength)

def validate_mnemonic(mnemonic: str) -> bool:
    """Validate a BIP39 mnemonic phrase."""
    try:
        wallet = BIP44HDWallet(cryptocurrency=BitcoinMainnet)
        wallet.from_mnemonic(mnemonic=mnemonic)
        return True
    except Exception:
        return False

def recover_wallet(mnemonic: str, networks: List[str] = None, paths: List[str] = None) -> Dict:
    """
    Recover wallet information from a mnemonic phrase for multiple networks.
    
    Args:
        mnemonic: The BIP39 mnemonic phrase
        networks: List of network codes (BTC, ETH, LTC)
        paths: Optional custom derivation paths
    """
    if not networks:
        networks = ['BTC']
    
    if not paths:
        paths = ["m/44'/0'/0'/0/0"]
    
    result = {
        'mnemonic': mnemonic,
        'networks': {}
    }
    
    for network in networks:
        if network not in SUPPORTED_NETWORKS:
            continue
            
        crypto_class = SUPPORTED_NETWORKS[network]
        wallet = BIP44HDWallet(cryptocurrency=crypto_class)
        wallet.from_mnemonic(mnemonic=mnemonic)
        
        addresses = {}
        for path in paths:
            wallet.clean_derivation()
            wallet.from_path(path)
            addresses[path] = {
                'address': wallet.address(),
                'public_key': wallet.public_key(),
                'private_key': wallet.private_key(),
                'wif': wallet.wif() if hasattr(wallet, 'wif') else None
            }
        
        result['networks'][network] = addresses
    
    return result