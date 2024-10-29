from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import generate_mnemonic, validate_mnemonic, recover_wallet, SUPPORTED_NETWORKS

app = Flask(__name__)
CORS(app)

@app.route('/api/networks', methods=['GET'])
def get_networks():
    return jsonify({
        'success': True,
        'networks': list(SUPPORTED_NETWORKS.keys())
    })

@app.route('/api/generate', methods=['GET'])
def generate():
    try:
        mnemonic = generate_mnemonic()
        return jsonify({'success': True, 'mnemonic': mnemonic})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/recover', methods=['POST'])
def recover():
    try:
        data = request.get_json()
        mnemonic = data.get('mnemonic', '')
        networks = data.get('networks', ['BTC'])
        paths = data.get('paths', ["m/44'/0'/0'/0/0"])
        
        if not validate_mnemonic(mnemonic):
            return jsonify({'success': False, 'error': 'Invalid mnemonic phrase'}), 400
        
        wallet_info = recover_wallet(mnemonic, networks, paths)
        return jsonify({'success': True, 'wallet': wallet_info})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)