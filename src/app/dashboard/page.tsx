'use client';

import { useState, useEffect } from 'react';
import GradientBlinds from '../components/gradientBlinkd';

interface SubscriptionData {
  token: string;
  chain: string;
  recipientAddress: string;
  paymentFrequency: 'weekly' | 'monthly' | 'instantly';
  amount: string;
  nextPayment: string;
  status: 'active' | 'paused' | 'cancelled' | 'paid';
}

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionData | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [actionSubscription, setActionSubscription] = useState<SubscriptionData | null>(null);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    setSubscriptions([
      {
        token: 'USDC',
        chain: 'Base',
        recipientAddress: '0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1',
        paymentFrequency: 'instantly',
        amount: '0.1',
        nextPayment: 'Completed',
        status: 'paid'
      },
      {
        token: 'USDC',
        chain: 'Ethereum',
        recipientAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        paymentFrequency: 'monthly',
        amount: '1',
        nextPayment: '2025-09-25',
        status: 'active'
      },
      {
        token: 'USDT',
        chain: 'Polygon',
        recipientAddress: '0x8ba1f109551bD432803012645Hac136c',
        paymentFrequency: 'weekly',
        amount: '2',
        nextPayment: '2025-09-25',
        status: 'active'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'paused': return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      case 'paid': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getChainIcon = (chain: string) => {
    switch (chain) {
      case 'Ethereum': return '⟠';
      case 'Polygon': return '⬟';
      case 'Arbitrum': return '🔷';
      case 'Optimism': return '🔴';
      case 'Base': return '🔵';
      default: return '⛓️';
    }
  };

  const handleEditClick = (subscription: SubscriptionData) => {
    setEditingSubscription(subscription);
    setEditAmount(subscription.amount);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingSubscription && editAmount) {
      setSubscriptions(prev => 
        prev.map(sub => 
          sub === editingSubscription 
            ? { ...sub, amount: editAmount }
            : sub
        )
      );
      setIsEditModalOpen(false);
      setEditingSubscription(null);
      setEditAmount('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingSubscription(null);
    setEditAmount('');
  };

  const handleCancelClick = (subscription: SubscriptionData) => {
    setActionSubscription(subscription);
    setIsCancelModalOpen(true);
  };

  const handleCancelAction = () => {
    if (actionSubscription) {
      // Here you would typically cancel the subscription
      console.log('Cancelling subscription:', actionSubscription);
      alert(`Subscription cancelled! ${actionSubscription.token} payments will stop.`);
      
      // Update subscription status
      setSubscriptions(prev => 
        prev.map(sub => 
          sub === actionSubscription 
            ? { ...sub, status: 'cancelled' as const }
            : sub
        )
      );
    }
    setIsCancelModalOpen(false);
    setActionSubscription(null);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setActionSubscription(null);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0">
        <GradientBlinds
          gradientColors={['#FF9FFC', '#5227FF']}
          angle={45}
          noise={0.2}
          blindCount={12}
          blindMinWidth={50}
          spotlightRadius={0.3}
          spotlightSoftness={1}
          spotlightOpacity={0.6}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
        />
        {/* Dark overlay to reduce intensity */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Back Button */}
      <button 
        onClick={() => window.history.back()}
        className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 shadow-xl"
      >
        ← Back
      </button>

      {/* Subscribe Button */}
      <a 
        href="/subscribe"
        className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 shadow-xl"
      >
        Subscribe
      </a>

      {/* Dashboard Content */}
      <div className="relative z-10 min-h-screen p-6 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl mb-4">
              Dashboard
            </h1>
            <p className="text-xl text-white/90 drop-shadow-lg">
              Manage your multichain subscriptions
            </p>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-black/20 backdrop-blur-lg border border-white/40 rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Token</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Chain</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Recipient Address</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Frequency</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Next Payment</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription, index) => (
                    <tr key={index} className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getChainIcon(subscription.chain)}</span>
                          <span className="text-white font-semibold">{subscription.token}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/90">{subscription.chain}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-mono text-sm">
                          {subscription.recipientAddress.slice(0, 6)}...{subscription.recipientAddress.slice(-4)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">{subscription.amount} {subscription.token}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/90 capitalize">{subscription.paymentFrequency}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/90">{subscription.nextPayment}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(subscription.status)}`}>
                          {subscription.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditClick(subscription)}
                            className="bg-white/10 backdrop-blur-md border border-white/30 text-white py-1 px-3 rounded-lg transition-all duration-200 hover:bg-white/20 text-xs"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleCancelClick(subscription)}
                            className="bg-red-500/20 border border-red-500/30 text-red-400 py-1 px-3 rounded-lg transition-all duration-200 hover:bg-red-500/30 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State */}
          {subscriptions.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-black/20 backdrop-blur-lg border border-white/40 rounded-2xl p-12 shadow-2xl max-w-md mx-auto">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Subscriptions Yet</h3>
                <p className="text-white/70 mb-6">Create your first multichain subscription</p>
                <a 
                  href="/subscribe"
                  className="inline-block bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-white/20"
                >
                  Get Started
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancelEdit}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-black/30 backdrop-blur-lg border border-white/40 rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Edit Amount
            </h3>
            
            {editingSubscription && (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white/70 text-sm mb-2">Subscription Details:</p>
                  <p className="text-white font-semibold">
                    {editingSubscription.token} on {editingSubscription.chain}
                  </p>
                  <p className="text-white/70 text-sm">
                    To: {editingSubscription.recipientAddress.slice(0, 6)}...{editingSubscription.recipientAddress.slice(-4)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    New Amount ({editingSubscription.token})
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="Enter new amount"
                    step="0.01"
                    min="0"
                    className="w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white/50 transition-all duration-200"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-white/20 backdrop-blur-md border border-white/40 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-white/30 hover:border-white/60"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-red-500/30"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseCancelModal}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-black/30 backdrop-blur-lg border border-white/40 rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Cancel Subscription
            </h3>
            
            {actionSubscription && (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white/70 text-sm mb-2">Subscription Details:</p>
                  <p className="text-white font-semibold">
                    {actionSubscription.token} on {actionSubscription.chain}
                  </p>
                  <p className="text-white/70 text-sm">
                    Amount: {actionSubscription.amount} {actionSubscription.token}
                  </p>
                  <p className="text-white/70 text-sm">
                    Frequency: {actionSubscription.paymentFrequency}
                  </p>
                  <p className="text-white/70 text-sm">
                    To: {actionSubscription.recipientAddress.slice(0, 6)}...{actionSubscription.recipientAddress.slice(-4)}
                  </p>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 font-semibold text-center">
                    Are you sure you want to cancel this subscription?
                  </p>
                  <p className="text-red-400/70 text-sm text-center mt-2">
                    This will stop all future payments for this subscription.
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleCancelAction}
                    className="flex-1 bg-red-500/20 border border-red-500/40 text-red-400 font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-red-500/30 hover:border-red-500/60"
                  >
                    Yes, Cancel
                  </button>
                  <button
                    onClick={handleCloseCancelModal}
                    className="flex-1 bg-white/10 border border-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-white/20"
                  >
                    Keep Active
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
