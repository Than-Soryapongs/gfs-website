class MarketDashboard {
    constructor() {
        this.apiUrl = 'https://data.mef.gov.kh/api/v1/realtime-api/csx-summary';
        this.container = document.querySelector('.market-indices');
        this.lastUpdateTime = null;
        this.currentData = null;
        this.refreshInterval = null;
        this.isLoading = false;
        
        // Initialize dashboard
        this.init();
    }

    init() {
        this.showLoading();
        this.fetchData(true);
        this.startAutoRefresh();
    }

    async fetchData(forceUpdate = false) {
        if (this.isLoading && !forceUpdate) return;
        
        try {
            this.isLoading = true;
            
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const jsonData = await response.json();
            const data = jsonData.data;
            
            if (!data || data.length === 0) {
                throw new Error('No data received from API');
            }

            // Check if data has actually changed
            const newTimestamp = data[0]?.created_at;
            if (!forceUpdate && newTimestamp === this.lastUpdateTime) {
                this.isLoading = false;
                return;
            }

            this.lastUpdateTime = newTimestamp;
            this.currentData = data;
            this.renderDashboard(data);
            
        } catch (error) {
            console.error('Failed to fetch market data:', error);
            this.showError(error.message);
        } finally {
            this.isLoading = false;
        }
    }

    renderDashboard(data) {
        if (!this.container) return;

        // Take only top 5 stocks for the dashboard
        const topStocks = data.slice(0, 5);
        
        let html = '';
        
        topStocks.forEach(stock => {
            const isUp = stock.change_up_down === 'up';
            const isDown = stock.change_up_down === 'down';
            const changeClass = isUp ? 'positive' : isDown ? 'negative' : 'neutral';
            
            const arrowSvg = isUp 
                ? `<svg class="change-arrow" viewBox="0 0 20 20" fill="currentColor">
                     <path d="M10 4L4 10H8V16H12V10H16L10 4Z"/>
                   </svg>`
                : isDown 
                ? `<svg class="change-arrow" viewBox="0 0 20 20" fill="currentColor">
                     <path d="M10 16L16 10H12V4H8V10H4L10 16Z"/>
                   </svg>`
                : `<svg class="change-arrow" viewBox="0 0 20 20" fill="currentColor">
                     <path d="M4 10H16"/>
                   </svg>`;

            html += `
                <div class="stock-item">
                    <div class="stock-info">
                        <div class="stock-symbol">${stock.stock}</div>
                        <div class="stock-name">${this.getStockName(stock.stock)}</div>
                    </div>
                    <div class="stock-price">
                        <div class="stock-current-price">${this.formatNumber(stock.close)}</div>
                        <div class="stock-change ${changeClass}">
                            ${arrowSvg}
                            ${stock.change} (${this.calculatePercentage(stock.change, stock.close)}%)
                        </div>
                    </div>
                </div>
            `;
        });

        // Add summary statistics
        const totalVolume = data.reduce((sum, stock) => sum + parseFloat(stock.volume.replace(/,/g, '') || 0), 0);
        const totalValue = data.reduce((sum, stock) => sum + parseFloat(stock.value.replace(/,/g, '') || 0), 0);

        html += `
            <div class="summary-stats text-white">
                <div class="stat-item">
                    <div class="stat-label">Volume</div>
                    <div class="stat-value">${this.formatLargeNumber(totalVolume)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Value (KHR)</div>
                    <div class="stat-value">${this.formatLargeNumber(totalValue)}</div>
                </div>
            </div>
        `;

        if (this.lastUpdateTime) {
            html += `
                <div class="last-updated">
                    Last updated: ${this.formatDate(this.lastUpdateTime)}
                </div>
            `;
        }

        this.container.innerHTML = html;
    }

    showLoading() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="market-loading">
                <div class="spinner"></div>
                <span>Loading market data...</span>
            </div>
        `;
    }

    showError(message) {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="market-error">
                <h5>Unable to load market data</h5>
                <p>${message}</p>
                <button onclick="marketDashboard.fetchData(true)" class="btn btn-sm btn-outline-light mt-2">
                    Try Again
                </button>
            </div>
        `;
    }

    startAutoRefresh() {
        // Refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.fetchData();
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Utility methods
    formatNumber(value) {
        if (!value) return '0';
        const num = parseFloat(value.toString().replace(/,/g, ''));
        return num.toLocaleString();
    }

    formatLargeNumber(value) {
        if (!value) return '0';
        const num = parseFloat(value.toString().replace(/,/g, ''));
        
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    calculatePercentage(change, close) {
        if (!change || !close) return '0.00';
        
        const changeNum = parseFloat(change.toString().replace(/,/g, ''));
        const closeNum = parseFloat(close.toString().replace(/,/g, ''));
        const openNum = closeNum - changeNum;
        
        if (openNum === 0) return '0.00';
        
        const percentage = (changeNum / openNum) * 100;
        return Math.abs(percentage).toFixed(2);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStockName(symbol) {
        const stockNames = {
            'ABC': 'ACLEDA Bank PLC',
            'CGSM': 'CAMGSM Plc.',
            'DBDE': 'DBD Engineering PLC.',
            'GTI': 'Grand Twins International (Cambodia) PLC.',
            'JSL': 'JS Land',
            'MJQE': 'MENGLY J. QUACH EDUCATION PLC.',
            'PAS': 'Sihanoukville Autonomous Port',
            'PEPC': 'PESTECH (Cambodia) PLC.'
        };
        return stockNames[symbol] || symbol;
    }

    // Public methods for external control
    refresh() {
        this.fetchData(true);
    }

    destroy() {
        this.stopAutoRefresh();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Initialize dashboard when DOM is loaded
let marketDashboard = null;

document.addEventListener('DOMContentLoaded', function() {
    marketDashboard = new MarketDashboard();
});

// Handle page visibility to optimize performance
document.addEventListener('visibilitychange', function() {
    if (!marketDashboard) return;
    
    if (document.hidden) {
        marketDashboard.stopAutoRefresh();
    } else {
        marketDashboard.startAutoRefresh();
        marketDashboard.fetchData(true); // Refresh when page becomes visible
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (marketDashboard) {
        marketDashboard.destroy();
    }
});