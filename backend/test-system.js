import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Test configuration
const testConfig = {
  phoneNumber: '+1234567890', // Replace with actual test number
  patientName: 'John Doe',
  medicationName: 'Aspirin',
  medicationTime: '9:00 AM',
  dosage: '100mg',
  instructions: 'Take with food',
  patientId: 'test-patient-123',
  language: 'en'
};

async function testMurfVoice() {
  console.log('🧪 Testing Murf AI Voice Generation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/test/murf-voice`, {
      text: 'Hello, this is a test message for medication reminder.',
      language: 'en',
      voiceProfile: 'en-US-Neural2-F'
    });
    
    console.log('✅ Murf Voice Test Result:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Murf Voice Test Failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGeminiResponse() {
  console.log('🧪 Testing Gemini AI Response...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/test/gemini-response`, {
      patientResponse: 'I am feeling a bit tired today and have a slight headache.',
      patientContext: {
        name: testConfig.patientName,
        medication: testConfig.medicationName,
        dosage: testConfig.dosage,
        instructions: testConfig.instructions
      },
      language: 'en'
    });
    
    console.log('✅ Gemini AI Test Result:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Gemini AI Test Failed:', error.response?.data || error.message);
    return false;
  }
}

async function testHindiVoice() {
  console.log('🧪 Testing Hindi Voice Generation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/test/murf-voice`, {
      text: 'नमस्ते, यह आपकी दवा की याद दिलाने के लिए एक संदेश है।',
      language: 'hi',
      voiceProfile: 'hi-IN-Neural2-A'
    });
    
    console.log('✅ Hindi Voice Test Result:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Hindi Voice Test Failed:', error.response?.data || error.message);
    return false;
  }
}

async function testHindiGeminiResponse() {
  console.log('🧪 Testing Hindi Gemini AI Response...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/test/gemini-response`, {
      patientResponse: 'मैं आज थोड़ा थका हुआ महसूस कर रहा हूं और मुझे सिरदर्द है।',
      patientContext: {
        name: testConfig.patientName,
        medication: testConfig.medicationName,
        dosage: testConfig.dosage,
        instructions: testConfig.instructions
      },
      language: 'hi'
    });
    
    console.log('✅ Hindi Gemini AI Test Result:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Hindi Gemini AI Test Failed:', error.response?.data || error.message);
    return false;
  }
}

async function testAvailableVoices() {
  console.log('🧪 Testing Available Voices...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/voices?language=en`);
    console.log('✅ Available Voices Test Result:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Available Voices Test Failed:', error.response?.data || error.message);
    return false;
  }
}

async function testCallInitiation() {
  console.log('🧪 Testing Call Initiation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/calls/initiate`, testConfig);
    console.log('✅ Call Initiation Test Result:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Call Initiation Test Failed:', error.response?.data || error.message);
    return false;
  }
}

async function testActiveCalls() {
  console.log('🧪 Testing Active Calls...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/calls/active`);
    console.log('✅ Active Calls Test Result:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Active Calls Test Failed:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting EchoCare System Tests...\n');
  
  const tests = [
    { name: 'Murf Voice Generation', fn: testMurfVoice },
    { name: 'Gemini AI Response', fn: testGeminiResponse },
    { name: 'Hindi Voice Generation', fn: testHindiVoice },
    { name: 'Hindi Gemini AI Response', fn: testHindiGeminiResponse },
    { name: 'Available Voices', fn: testAvailableVoices },
    { name: 'Call Initiation', fn: testCallInitiation },
    { name: 'Active Calls', fn: testActiveCalls }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n📋 Running: ${test.name}`);
    const success = await test.fn();
    results.push({ name: test.name, success });
    console.log(`📊 ${test.name}: ${success ? 'PASSED' : 'FAILED'}\n`);
  }
  
  // Summary
  console.log('📈 Test Summary:');
  console.log('================');
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}`);
  });
  
  console.log(`\n🎯 Overall Result: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! System is ready for use.');
  } else {
    console.log('⚠️  Some tests failed. Please check your configuration.');
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export {
  testMurfVoice,
  testGeminiResponse,
  testHindiVoice,
  testHindiGeminiResponse,
  testAvailableVoices,
  testCallInitiation,
  testActiveCalls,
  runAllTests
}; 