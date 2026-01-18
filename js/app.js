/**
 * TradeSync Pro Payment Page - API Client
 * Version 5.0 - Direct Blockchain Payments
 */

const API_BASE_URL = 'https://tradesync-license-server-production.up.railway.app';

const PaymentAPI = {
    async getPaymentInfo() {
        const response = await fetch(`${API_BASE_URL}/api/payment/info`);
        if (!response.ok) throw new Error('Failed to get payment info');
        return response.json();
    },

    async createOrder(data) {
        data.network = 'TRC20';

        const response = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async checkOrder(orderId) {
        const response = await fetch(`${API_BASE_URL}/api/payment/check/${orderId}`);
        return response.json();
    },

    async getOrderDetails(orderId) {
        const response = await fetch(`${API_BASE_URL}/api/payment/order/${orderId}`);
        return response.json();
    },

    async verifyPayment(orderId) {
        const response = await fetch(`${API_BASE_URL}/api/payment/verify/${orderId}`, {
            method: 'POST'
        });
        return response.json();
    }
};

function copyToClipboard(text, successMessage = 'Copied!') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMessage);
        }).catch(() => {
            fallbackCopy(text);
            showToast(successMessage);
        });
    } else {
        fallbackCopy(text);
        showToast(successMessage);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); } catch (err) { }
    document.body.removeChild(textArea);
}

function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function generateQRCode(elementId, data, size = 200) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
    element.src = qrUrl;
    element.onerror = function () {
        this.parentElement.innerHTML = `
            <div style="padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center;">
                <p style="color: #6b7280;">QR Code unavailable</p>
                <p style="font-size: 12px;">Please copy the address manually</p>
            </div>
        `;
    };
}
