document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';
    const generateBtn = document.getElementById('generateBtn');
    const recoverBtn = document.getElementById('recoverBtn');
    const generatedMnemonic = document.getElementById('generatedMnemonic');
    const mnemonicInput = document.getElementById('mnemonicInput');
    const walletInfo = document.getElementById('walletInfo');
    const pathsInput = document.getElementById('pathsInput');
    const networkSelect = document.getElementById('networkSelect');

    // Load available networks
    async function loadNetworks() {
        try {
            const response = await fetch(`${API_URL}/networks`);
            const data = await response.json();
            
            if (data.success) {
                networkSelect.innerHTML = data.networks.map(network => 
                    `<label class="network-option">
                        <input type="checkbox" value="${network}" ${network === 'BTC' ? 'checked' : ''}>
                        ${network}
                    </label>`
                ).join('');
            }
        } catch (error) {
            console.error('Error loading networks:', error);
        }
    }

    loadNetworks();

    generateBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_URL}/generate`);
            const data = await response.json();
            
            if (data.success) {
                generatedMnemonic.textContent = data.mnemonic;
                generatedMnemonic.style.display = 'block';
            } else {
                alert('Error generating mnemonic: ' + data.error);
            }
        } catch (error) {
            alert('Error connecting to server');
        }
    });

    recoverBtn.addEventListener('click', async () => {
        const mnemonic = mnemonicInput.value.trim();
        const paths = pathsInput.value.trim().split('\n').filter(path => path.trim());
        const networks = Array.from(document.querySelectorAll('#networkSelect input:checked'))
            .map(input => input.value);
        
        if (!mnemonic) {
            alert('Please enter a mnemonic phrase');
            return;
        }

        if (!networks.length) {
            alert('Please select at least one network');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/recover`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    mnemonic,
                    networks,
                    paths: paths.length ? paths : undefined
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                displayWalletInfo(data.wallet);
            } else {
                alert('Error recovering wallet: ' + data.error);
            }
        } catch (error) {
            alert('Error connecting to server');
        }
    });

    function displayWalletInfo(wallet) {
        const container = document.getElementById('walletInfo');
        container.innerHTML = '';
        container.style.display = 'block';

        Object.entries(wallet.networks).forEach(([network, paths]) => {
            const networkDiv = document.createElement('div');
            networkDiv.className = 'network-info';
            networkDiv.innerHTML = `<h3>${network} Network</h3>`;

            Object.entries(paths).forEach(([path, info]) => {
                const pathDiv = document.createElement('div');
                pathDiv.className = 'path-info';
                pathDiv.innerHTML = `
                    <h4>Path: ${path}</h4>
                    <div class="info-row">
                        <span>Address:</span>
                        <span>${info.address}</span>
                    </div>
                    <div class="info-row">
                        <span>Public Key:</span>
                        <span>${info.public_key}</span>
                    </div>
                    <div class="info-row">
                        <span>Private Key:</span>
                        <span>${info.private_key}</span>
                    </div>
                    ${info.wif ? `
                    <div class="info-row">
                        <span>WIF:</span>
                        <span>${info.wif}</span>
                    </div>
                    ` : ''}
                `;
                networkDiv.appendChild(pathDiv);
            });

            container.appendChild(networkDiv);
        });
    }
});