/**
 * HBG Financial Transparency Widget
 * Drop-in JavaScript component for homesbeforegrowth.org
 * 
 * Usage: 
 * <div id="hbg-financial-widget"></div>
 * <script src="financial-widget.js"></script>
 */

class HBGFinancialWidget {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.apiBase = options.apiBase || 'https://hbg-budget-app-7.onrender.com';
    this.container = document.getElementById(containerId);
    this.theme = options.theme || 'default';
    this.showRecent = options.showRecent !== false;
    this.maxCategories = options.maxCategories || 5;
    
    if (!this.container) {
      console.error(`HBG Financial Widget: Container #${containerId} not found`);
      return;
    }
    
    this.init();
  }
  
  async init() {
    this.showLoading();
    
    try {
      const data = await this.fetchFinancialData();
      this.render(data);
    } catch (error) {
      console.error('Failed to load financial data:', error);
      this.showError();
    }
  }
  
  async fetchFinancialData() {
    const response = await fetch(`${this.apiBase}/api/public/financial-summary`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  showLoading() {
    this.container.innerHTML = `
      <div class="hbg-widget hbg-loading">
        <div class="loading-spinner"></div>
        <p>Loading financial data...</p>
      </div>
    `;
  }
  
  showError() {
    this.container.innerHTML = `
      <div class="hbg-widget hbg-error">
        <h3>Financial Transparency</h3>
        <p>Financial data is temporarily unavailable. Please check back later.</p>
        <p><small>For the latest information, contact us directly.</small></p>
      </div>
    `;
  }
  
  render(data) {
    const { summary, expensesByCategory, recentTransactions, financialYear, party } = data;
    
    const topCategories = expensesByCategory
      .slice(0, this.maxCategories)
      .filter(cat => cat.amount > 0);
    
    const recentTxs = this.showRecent 
      ? recentTransactions.slice(0, 3)
      : [];
    
    this.container.innerHTML = `
      <div class="hbg-widget hbg-${this.theme}">
        <div class="widget-header">
          <h3>Financial Transparency</h3>
          <span class="financial-year">${financialYear}</span>
        </div>
        
        <div class="financial-summary">
          <div class="summary-grid">
            <div class="metric income">
              <span class="label">Total Income</span>
              <span class="value">$${this.formatCurrency(summary.totalIncome)}</span>
            </div>
            <div class="metric expenses">
              <span class="label">Total Expenses</span>
              <span class="value">$${this.formatCurrency(summary.totalExpenses)}</span>
            </div>
            <div class="metric net ${summary.netPosition >= 0 ? 'positive' : 'negative'}">
              <span class="label">Net Position</span>
              <span class="value">$${this.formatCurrency(summary.netPosition)}</span>
            </div>
          </div>
        </div>
        
        ${topCategories.length > 0 ? `
          <div class="expense-breakdown">
            <h4>Top Expense Categories</h4>
            <div class="category-list">
              ${topCategories.map(cat => `
                <div class="category-item">
                  <span class="category-name">${cat.category}</span>
                  <span class="category-amount">$${this.formatCurrency(cat.amount)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${recentTxs.length > 0 ? `
          <div class="recent-transactions">
            <h4>Recent Transactions</h4>
            <div class="transaction-list">
              ${recentTxs.map(tx => `
                <div class="transaction-item ${tx.type.toLowerCase()}">
                  <div class="transaction-info">
                    <span class="transaction-description">${this.truncate(tx.description, 40)}</span>
                    <span class="transaction-date">${this.formatDate(tx.date)}</span>
                  </div>
                  <span class="transaction-amount">$${this.formatCurrency(tx.amount)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="widget-footer">
          <p><small>Data updated in real-time • Last updated: ${new Date().toLocaleDateString('en-AU')}</small></p>
        </div>
      </div>
    `;
    
    this.addStyles();
  }
  
  formatCurrency(amount) {
    return Number(amount).toLocaleString('en-AU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short'
    });
  }
  
  truncate(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
  
  addStyles() {
    if (document.getElementById('hbg-widget-styles')) return;
    
    const styles = `
      <style id="hbg-widget-styles">
        .hbg-widget {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          border: 1px solid #e5e7eb;
          font-family: 'Inter', sans-serif;
        }
        
        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .widget-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .financial-year {
          background: #f3f4f6;
          color: #6b7280;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .financial-summary {
          margin-bottom: 2rem;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
        }
        
        .metric {
          text-align: center;
          padding: 1rem;
          border-radius: 8px;
          background: #f9fafb;
        }
        
        .metric.income {
          background: #dcfce7;
          border: 1px solid #bbf7d0;
        }
        
        .metric.expenses {
          background: #fef3c7;
          border: 1px solid #fde68a;
        }
        
        .metric.net.positive {
          background: #dbeafe;
          border: 1px solid #bfdbfe;
        }
        
        .metric.net.negative {
          background: #fee2e2;
          border: 1px solid #fecaca;
        }
        
        .metric .label {
          display: block;
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .metric .value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }
        
        .expense-breakdown {
          margin-bottom: 2rem;
        }
        
        .expense-breakdown h4 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .category-list {
          display: grid;
          gap: 0.75rem;
        }
        
        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 6px;
        }
        
        .category-name {
          font-weight: 500;
          color: #374151;
        }
        
        .category-amount {
          font-weight: 600;
          color: #1f2937;
        }
        
        .recent-transactions {
          margin-bottom: 2rem;
        }
        
        .recent-transactions h4 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .transaction-list {
          display: grid;
          gap: 0.75rem;
        }
        
        .transaction-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 6px;
          border-left: 4px solid #e5e7eb;
        }
        
        .transaction-item.income {
          border-left-color: #22c55e;
        }
        
        .transaction-item.expense {
          border-left-color: #f59e0b;
        }
        
        .transaction-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .transaction-description {
          font-weight: 500;
          color: #374151;
        }
        
        .transaction-date {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .transaction-amount {
          font-weight: 600;
          color: #1f2937;
        }
        
        .widget-footer {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .widget-footer p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .hbg-loading {
          text-align: center;
          padding: 3rem 2rem;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .hbg-error {
          text-align: center;
          padding: 2rem;
        }
        
        .hbg-error h3 {
          margin: 0 0 1rem 0;
          color: #dc2626;
        }
        
        .hbg-error p {
          margin: 0 0 0.5rem 0;
          color: #6b7280;
        }
        
        .hbg-error small {
          color: #9ca3af;
        }
        
        @media (max-width: 768px) {
          .hbg-widget {
            padding: 1.5rem;
          }
          
          .summary-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .widget-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
  window.HBGFinancialWidget = HBGFinancialWidget;
} 