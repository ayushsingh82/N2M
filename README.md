# N2M Loop - NEAR Intents Subscription Platform

A revolutionary subscription payment platform built on NEAR Protocol that eliminates the complexity of cross-chain payments. Subscribe to recurring payments without worrying about which token or which chain - NEAR intents handle everything automatically.

## 🚀 Problem Statement

Traditional subscription services face major challenges:

- **Chain Complexity**: Users must manage multiple wallets across different blockchains
- **Token Confusion**: Different tokens on different chains create friction
- **High Gas Fees**: Expensive transaction costs on various networks
- **Manual Management**: Users must manually execute recurring payments
- **Cross-Chain Barriers**: Difficulty in sending payments across different blockchains

## 💡 Solution: NEAR Intents Subscription Platform

Our platform solves these problems by leveraging NEAR Protocol's intent-based architecture:

- **Single Wallet**: Use only your NEAR wallet for all subscriptions
- **Any Token, Any Chain**: Send USDC, USDT, ETH, BTC to any blockchain automatically
- **Automated Execution**: Cron jobs handle recurring payments seamlessly
- **Cross-Chain Magic**: NEAR intents bridge all blockchains transparently
- **Gas Optimization**: Efficient cross-chain transfers with minimal fees

## 🏗️ Architecture

### Frontend (Next.js)
- **Subscription Form**: Easy setup with token/chain selection
- **Dashboard**: Manage active subscriptions with real-time status
- **Payment Processor**: Visual cron job monitoring and control
- **Beautiful UI**: Glassmorphism design with gradient backgrounds

### Backend (Node.js + NEAR Intents)
- **Payment Service**: Automated payment execution
- **Cron Scheduler**: Recurring payment management (5min, weekly, monthly)
- **Token Mapping**: Comprehensive token/chain database
- **Intent Integration**: Direct calls to NEAR intent functions

## 🎯 Key Features

### ✅ Subscription Management
- **Flexible Frequencies**: 5-minute, weekly, or monthly payments
- **Multiple Tokens**: USDC, USDT, ETH, BTC, and more
- **Cross-Chain Support**: Ethereum, Base, Arbitrum, Solana, Polygon
- **Real-time Status**: Live monitoring of subscription health

### ✅ Automated Payments
- **Cron Job Integration**: Professional-grade scheduling
- **Intent Execution**: Direct blockchain interaction
- **Error Handling**: Robust failure recovery
- **Transaction Logging**: Complete audit trail

### ✅ User Experience
- **One-Click Setup**: Simple subscription creation
- **Instant Payments**: Pay immediately without subscription
- **Edit Management**: Modify amounts and frequencies
- **Cancel Protection**: Confirmation dialogs prevent accidents

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Custom Components**: Glassmorphism UI design

### Backend
- **NEAR Protocol**: Blockchain infrastructure
- **NEAR Intents**: Cross-chain execution engine
- **Node.js**: Server-side runtime
- **TypeScript**: Type-safe backend development

### Cron Jobs
- **node-cron**: Simple cron scheduling
- **cron**: Advanced job management
- **Real-time Monitoring**: Live execution tracking

### Blockchain Integration
- **@near-js/accounts**: Account management
- **@near-js/tokens**: Token handling
- **@defuse-protocol/one-click-sdk**: Cross-chain swaps
- **Multi-token Support**: Comprehensive token mapping

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- NEAR wallet account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd n2m-loop
```

2. **Install frontend dependencies**
```bash
cd my-app
npm install
```

3. **Install backend dependencies**
```bash
cd intents
npm install
```

4. **Set up environment variables**
```bash
# Create .env file in intents directory
ACCOUNT_PRIVATE_KEY=your_near_private_key
ACCOUNT_ID=your_near_account_id
```

### Running the Application

1. **Start the frontend**
```bash
cd my-app
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

2. **Start the payment service**
```bash
cd intents
npm run payment:start
```

3. **Start cron job demo**
```bash
npm run cron:start
```

## 📱 Usage Guide

### Creating a Subscription

1. **Navigate to Subscribe Page**
   - Click "Subscribe" from the main page
   - Select your preferred token (USDC, USDT, ETH, etc.)
   - Choose the blockchain (Ethereum, Base, Arbitrum, etc.)
   - Enter the amount and recipient address
   - Select frequency (5min, weekly, monthly)

2. **Confirm Subscription**
   - Review all details
   - Click "Subscribe Now" to create recurring payments
   - Or click "Pay Instantly" for one-time payment

### Managing Subscriptions

1. **Dashboard Access**
   - View all active subscriptions
   - See next payment dates and amounts
   - Monitor subscription status

2. **Subscription Actions**
   - **Edit**: Modify payment amounts
   - **Cancel**: Stop recurring payments (with confirmation)

### Payment Processing

1. **Automated Execution**
   - Cron jobs execute payments automatically
   - Real-time logs show execution status
   - Error handling ensures reliability

2. **Manual Control**
   - Start/stop cron jobs as needed
   - Execute payments immediately
   - Monitor system health

## 🔧 Available Commands

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Backend Commands
```bash
# Payment Service
npm run payment:start        # Start payment cron jobs
npm run payment:execute <id> # Execute single payment
npm run payment:status       # Check service status

# Cron Jobs
npm run cron:start           # Start demo cron jobs
npm run cron:status          # Show job status
npm run cron:validate        # Validate cron expressions

# Token Management
npm run token:info <assetId> # Get token information
npm run token:chains         # List supported chains
npm run token:symbol <symbol> # Find tokens by symbol

# Function Examples
npm run examples:demo        # Run complete demonstration
npm run examples:account     # Test account functions
npm run examples:balance     # Check NEAR balance
```

## 🌐 Supported Networks & Tokens

### Blockchains
- **NEAR Protocol**: Native blockchain
- **Ethereum**: ETH, USDC, USDT, DAI
- **Base**: ETH, USDC
- **Arbitrum**: ETH, USDC, USDT
- **Solana**: USDC, USDT
- **Polygon**: USDC, USDT
- **BSC**: USDC, USDT
- **Optimism**: ETH, USDC, USDT
- **Avalanche**: USDC, USDT

### Payment Frequencies
- **5 Minutes**: For testing and rapid execution
- **Weekly**: Every Sunday at midnight UTC
- **Monthly**: First day of each month at midnight UTC

## 🔐 Security Features

### Environment Security
- Private keys stored securely in environment variables
- No hardcoded credentials in source code
- Proper error handling prevents data leaks

### Transaction Security
- Balance verification before execution
- Slippage protection on swaps
- Transaction timeout handling
- Comprehensive error logging

### User Protection
- Confirmation dialogs for destructive actions
- Clear error messages and status indicators
- Real-time transaction monitoring

## 📊 Monitoring & Analytics

### Real-time Logs
- Payment execution status
- Error tracking and resolution
- Performance metrics
- Cron job health monitoring

### Dashboard Analytics
- Active subscription count
- Payment success rates
- Token distribution across chains
- System health indicators

## 🧪 Testing & Development

### Demo Mode
- Safe simulation of payment execution
- No real blockchain transactions
- Perfect for testing and demonstration

### Production Mode
- Real NEAR intent execution
- Actual cross-chain transfers
- Live transaction monitoring

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style and standards
- Testing requirements
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **NEAR Protocol**: For the innovative intent-based architecture
- **Defuse Protocol**: For cross-chain swap capabilities
- **Next.js Team**: For the excellent React framework
- **Open Source Community**: For the amazing tools and libraries

## 📞 Support

- **Documentation**: Check the `/intents` directory for detailed guides
- **Issues**: Report bugs via GitHub issues
- **Discord**: Join our community for real-time support
- **Email**: Contact us at support@n2mloop.com

---

**Built with ❤️ on NEAR Protocol**

*Experience the future of subscription payments - where complexity disappears and cross-chain becomes effortless.*