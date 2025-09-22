'use client';

import React, { useState } from 'react';

interface SubscriptionFormProps {
  className?: string;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ className = '' }) => {
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState<'weekly' | 'monthly' | null>(null);

  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86a33E6441c8C' },
    { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
  ];

  const chains = [
    { name: 'Ethereum', id: 'ethereum', icon: '⟠' },
    { name: 'Polygon', id: 'polygon', icon: '⬟' },
    { name: 'Arbitrum', id: 'arbitrum', icon: '🔷' },
    { name: 'Optimism', id: 'optimism', icon: '🔴' },
    { name: 'Base', id: 'base', icon: '🔵' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToken || !selectedChain || !recipientAddress || !paymentFrequency) {
      alert('Please fill in all fields');
      return;
    }
    
    console.log('Subscription details:', {
      token: selectedToken,
      chain: selectedChain,
      recipientAddress,
      paymentFrequency
    });
    
    // Here you would typically handle the subscription logic
    alert('Subscription created successfully!');
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Subscribe to N2M Loops</h2>
          <p className="text-white/70">Set up your recurring payments</p>
        </div>

        {/* Token Selection */}
        <div className="space-y-2">
          <label className="block text-white font-medium">Select Token</label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full bg-black/30 backdrop-blur-md border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-all duration-200"
          >
            <option value="" className="bg-gray-800 text-white">Choose a token</option>
            {tokens.map((token) => (
              <option key={token.symbol} value={token.symbol} className="bg-gray-800 text-white">
                {token.symbol} - {token.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chain Selection */}
        <div className="space-y-2">
          <label className="block text-white font-medium">Select Chain</label>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="w-full bg-black/30 backdrop-blur-md border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-all duration-200"
          >
            <option value="" className="bg-gray-800 text-white">Choose a chain</option>
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id} className="bg-gray-800 text-white">
                {chain.icon} {chain.name}
              </option>
            ))}
          </select>
        </div>

        {/* Recipient Address */}
        <div className="space-y-2">
          <label className="block text-white font-medium">Recipient Address</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-black/30 backdrop-blur-md border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white/50 transition-all duration-200"
          />
        </div>

        {/* Payment Frequency */}
        <div className="space-y-3">
          <label className="block text-white font-medium">Payment Frequency</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentFrequency('weekly')}
              className={`py-3 px-4 rounded-lg border transition-all duration-200 ${
                paymentFrequency === 'weekly'
                  ? 'bg-white/30 border-white/50 text-white'
                  : 'bg-black/30 border-white/30 text-white hover:bg-black/40'
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setPaymentFrequency('monthly')}
              className={`py-3 px-4 rounded-lg border transition-all duration-200 ${
                paymentFrequency === 'monthly'
                  ? 'bg-white/30 border-white/50 text-white'
                  : 'bg-black/30 border-white/30 text-white hover:bg-black/40'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          type="submit"
          className="w-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:bg-white/20 hover:border-white/50 hover:scale-105 shadow-lg"
        >
          Subscribe Now
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
