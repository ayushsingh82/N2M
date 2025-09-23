import { SubscriptionManager } from './subscription-automation';

async function testSubscriptionSystem() {
  console.log('🧪 Testing Subscription System...\n');
  
  const manager = new SubscriptionManager();
  
  // Test 1: Check initial status
  console.log('Test 1: Initial Status');
  manager.getSubscriptionStatus();
  
  // Test 2: Change frequency to 5 minutes
  console.log('\nTest 2: Changing frequency to 5 minutes');
  manager.updateSubscriptionFrequency('demo-subscription', '5min');
  manager.getSubscriptionStatus();
  
  // Test 3: Change frequency to monthly
  console.log('\nTest 3: Changing frequency to monthly');
  manager.updateSubscriptionFrequency('demo-subscription', 'monthly');
  manager.getSubscriptionStatus();
  
  // Test 4: Change frequency to weekly
  console.log('\nTest 4: Changing frequency to weekly');
  manager.updateSubscriptionFrequency('demo-subscription', 'weekly');
  manager.getSubscriptionStatus();
  
  console.log('\n✅ All tests completed successfully!');
  console.log('\nTo start the automation service, run:');
  console.log('npm run subscription:start');
}

testSubscriptionSystem().catch(console.error);
