# Subscription Automation System

This system provides automated recurring payments using NEAR blockchain and cross-chain intents.

## Features

- **Automated Payments**: Set up recurring payments with configurable frequencies
- **Multiple Frequencies**: Weekly, Monthly, and 5-minute intervals
- **Cross-Chain Support**: Uses NEAR intents for cross-chain transactions
- **Demo Configuration**: Pre-configured with fixed recipient, amount, chain, and token for testing

## Setup

1. **Environment Variables**: Create a `.env` file in the intents directory:
```bash
ACCOUNT_PRIVATE_KEY=your_near_private_key_here
ACCOUNT_ID=your_near_account_id_here
```

2. **Install Dependencies**:
```bash
npm install
```

## Usage

### Start the Automation Service
```bash
npm run subscription:start
```
This will start the automation service that checks for due payments every minute.

### Check Subscription Status
```bash
npm run subscription:status
```
Shows current subscription configuration and next execution times.

### Change Payment Frequency

**Set to Weekly:**
```bash
npm run subscription:weekly
```

**Set to Monthly:**
```bash
npm run subscription:monthly
```

**Set to 5 Minutes (for testing):**
```bash
npm run subscription:5min
```

### Execute Payment Immediately
```bash
npm run subscription:execute
```
Executes the subscription payment immediately without waiting for the scheduled time.

## Demo Configuration

The system comes pre-configured with:
- **Recipient**: `demo-recipient.near`
- **Amount**: `0.1 NEAR`
- **Token**: `nep141:sol.omft.near`
- **Chain**: `near`

## How It Works

1. **Subscription Manager**: Manages subscription schedules and execution
2. **Payment Execution**: 
   - Deposits NEAR as multi-token
   - Gets cross-chain quote
   - Executes transfer to recipient
   - Waits for execution completion
3. **Automation**: Checks every minute for due payments and executes them

## Production Considerations

- Update the demo configuration with real recipient addresses
- Implement proper error handling and retry logic
- Add logging and monitoring
- Consider gas fee optimization
- Implement subscription management UI

## Stopping the Service

Press `Ctrl+C` to gracefully stop the automation service.

## Troubleshooting

- Ensure your NEAR account has sufficient balance
- Check that environment variables are correctly set
- Verify network connectivity
- Check console logs for detailed error messages
