'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Mock payment data structure
interface PaymentData {
  id: string;
  recipientAddress: string;
  amount: string;
  token: string;
  chain: string;
  frequency: '5min' | 'weekly' | 'monthly';
  nextPayment: Date;
  status: 'active' | 'paused' | 'cancelled';
  lastExecuted?: Date;
}

interface PaymentProcessorProps {
  className?: string;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ className = '' }) => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [cronJobs, setCronJobs] = useState<Map<string, NodeJS.Timeout>>(new Map());

  // Initialize with demo payment data
  useEffect(() => {
    const demoPayments: PaymentData[] = [
      {
        id: 'demo-1',
        recipientAddress: '0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1',
        amount: '0.1',
        token: 'USDC',
        chain: 'Base',
        frequency: '5min',
        nextPayment: new Date(Date.now() + 5 * 60 * 1000),
        status: 'active'
      },
      {
        id: 'demo-2',
        recipientAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        amount: '100',
        token: 'USDC',
        chain: 'Ethereum',
        frequency: 'weekly',
        nextPayment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        id: 'demo-3',
        recipientAddress: '0x8ba1f109551bD432803012645Hac136c',
        amount: '50',
        token: 'USDT',
        chain: 'Polygon',
        frequency: 'monthly',
        nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active'
      }
    ];
    setPayments(demoPayments);
  }, []);

  // Add log entry
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]); // Keep last 50 logs
  }, []);

  // Mock function to call intent payment functions
  const executePayment = useCallback(async (payment: PaymentData): Promise<boolean> => {
    try {
      addLog(`🚀 Starting payment execution for ${payment.id}`);
      
      // Simulate calling intent functions
      addLog(`📊 Checking NEAR balance...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addLog(`💰 Depositing NEAR as multi-token...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addLog(`🔄 Getting quote for ${payment.token} on ${payment.chain}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addLog(`⚡ Executing swap...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addLog(`🏦 Withdrawing ${payment.amount} ${payment.token} to ${payment.recipientAddress.slice(0, 6)}...${payment.recipientAddress.slice(-4)}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addLog(`✅ Payment completed successfully!`);
      
      return true;
    } catch (error) {
      addLog(`❌ Payment failed: ${error}`);
      return false;
    }
  }, [addLog]);

  // Calculate next payment time based on frequency
  const calculateNextPayment = useCallback((frequency: '5min' | 'weekly' | 'monthly'): Date => {
    const now = new Date();
    switch (frequency) {
      case '5min':
        return new Date(now.getTime() + 5 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }, []);

  // Process a single payment
  const processPayment = useCallback(async (payment: PaymentData) => {
    setIsProcessing(true);
    addLog(`🔄 Processing payment ${payment.id} (${payment.frequency})`);
    
    const success = await executePayment(payment);
    
    if (success) {
      // Update payment with new next payment time
      setPayments(prev => prev.map(p => 
        p.id === payment.id 
          ? { 
              ...p, 
              lastExecuted: new Date(),
              nextPayment: calculateNextPayment(p.frequency)
            }
          : p
      ));
      addLog(`✅ Payment ${payment.id} scheduled for next ${payment.frequency} execution`);
    }
    
    setIsProcessing(false);
  }, [executePayment, addLog, calculateNextPayment]);

  // Start cron job for a payment
  const startCronJob = useCallback((payment: PaymentData) => {
    const intervalMs = payment.frequency === '5min' 
      ? 5 * 60 * 1000 
      : payment.frequency === 'weekly' 
        ? 7 * 24 * 60 * 60 * 1000 
        : 30 * 24 * 60 * 60 * 1000;

    const intervalId = setInterval(() => {
      processPayment(payment);
    }, intervalMs);

    setCronJobs(prev => new Map(prev.set(payment.id, intervalId)));
    addLog(`⏰ Started cron job for payment ${payment.id} (${payment.frequency})`);
  }, [processPayment, addLog]);

  // Stop cron job for a payment
  const stopCronJob = useCallback((paymentId: string) => {
    const intervalId = cronJobs.get(paymentId);
    if (intervalId) {
      clearInterval(intervalId);
      setCronJobs(prev => {
        const newMap = new Map(prev);
        newMap.delete(paymentId);
        return newMap;
      });
      addLog(`⏹️ Stopped cron job for payment ${paymentId}`);
    }
  }, [cronJobs, addLog]);

  // Start all cron jobs
  const startAllCronJobs = useCallback(() => {
    payments.forEach(payment => {
      if (payment.status === 'active' && !cronJobs.has(payment.id)) {
        startCronJob(payment);
      }
    });
    addLog(`🚀 Started all cron jobs (${payments.length} payments)`);
  }, [payments, cronJobs, startCronJob, addLog]);

  // Stop all cron jobs
  const stopAllCronJobs = useCallback(() => {
    cronJobs.forEach((intervalId, paymentId) => {
      clearInterval(intervalId);
    });
    setCronJobs(new Map());
    addLog(`🛑 Stopped all cron jobs`);
  }, [cronJobs, addLog]);

  // Execute payment immediately
  const executeNow = useCallback((payment: PaymentData) => {
    processPayment(payment);
  }, [processPayment]);

  // Toggle payment status
  const togglePaymentStatus = useCallback((paymentId: string) => {
    setPayments(prev => prev.map(payment => {
      if (payment.id === paymentId) {
        const newStatus = payment.status === 'active' ? 'paused' : 'active';
        
        if (newStatus === 'active') {
          startCronJob(payment);
        } else {
          stopCronJob(paymentId);
        }
        
        return { ...payment, status: newStatus };
      }
      return payment;
    }));
  }, [startCronJob, stopCronJob]);

  // Auto-start cron jobs when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startAllCronJobs();
    }, 2000); // Start after 2 seconds

    return () => {
      clearTimeout(timer);
      stopAllCronJobs();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllCronJobs();
    };
  }, [stopAllCronJobs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'paused': return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case '5min': return 'text-blue-400 bg-blue-400/20';
      case 'weekly': return 'text-purple-400 bg-purple-400/20';
      case 'monthly': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Payment Processor</h2>
        <p className="text-white/70">Automated payment execution with cron jobs</p>
      </div>

      {/* Control Panel */}
      <div className="bg-black/20 backdrop-blur-lg border border-white/40 rounded-2xl p-6 mb-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Control Panel</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={startAllCronJobs}
            disabled={isProcessing}
            className="bg-green-500/20 border border-green-500/30 text-green-400 py-2 px-4 rounded-lg transition-all duration-200 hover:bg-green-500/30 disabled:opacity-50"
          >
            🚀 Start All Cron Jobs
          </button>
          <button
            onClick={stopAllCronJobs}
            disabled={isProcessing}
            className="bg-red-500/20 border border-red-500/30 text-red-400 py-2 px-4 rounded-lg transition-all duration-200 hover:bg-red-500/30 disabled:opacity-50"
          >
            🛑 Stop All Cron Jobs
          </button>
          <button
            onClick={() => setLogs([])}
            className="bg-white/10 border border-white/30 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:bg-white/20"
          >
            🗑️ Clear Logs
          </button>
        </div>
        <div className="mt-4 text-white/70 text-sm">
          Active Cron Jobs: {cronJobs.size} | Processing: {isProcessing ? 'Yes' : 'No'}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-black/20 backdrop-blur-lg border border-white/40 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Token</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Chain</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Frequency</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Next Payment</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <span className="text-white font-mono text-sm">{payment.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-semibold">{payment.token}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/90">{payment.chain}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-semibold">{payment.amount} {payment.token}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getFrequencyColor(payment.frequency)}`}>
                      {payment.frequency.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/90 text-sm">
                      {payment.nextPayment.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => executeNow(payment)}
                        disabled={isProcessing}
                        className="bg-blue-500/20 border border-blue-500/30 text-blue-400 py-1 px-3 rounded-lg transition-all duration-200 hover:bg-blue-500/30 text-xs disabled:opacity-50"
                      >
                        Execute Now
                      </button>
                      <button
                        onClick={() => togglePaymentStatus(payment.id)}
                        disabled={isProcessing}
                        className={`py-1 px-3 rounded-lg transition-all duration-200 text-xs disabled:opacity-50 ${
                          payment.status === 'active'
                            ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {payment.status === 'active' ? 'Pause' : 'Resume'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-black/20 backdrop-blur-lg border border-white/40 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Execution Logs</h3>
        <div className="bg-black/30 rounded-lg p-4 h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-white/50 text-center">No logs yet...</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-white/80 text-sm font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;
