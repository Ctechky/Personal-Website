// Test script to check which Gemini models are available
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.VITE_API_KEY;

const modelsToTest = [
    'gemini-2.5-pro',
    'gemini-2.0-flash-exp', 
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-pro'
];

async function testModel(modelName) {
    try {
        console.log(`\n🧪 Testing model: ${modelName}`);
        
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Test with a simple prompt
        const result = await model.generateContent("Hello, respond with just 'OK'");
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName}: OK (Response: "${text.trim()}")`);
        return { model: modelName, status: 'OK', response: text.trim() };
        
    } catch (error) {
        console.log(`❌ ${modelName}: FAILED`);
        console.log(`   Error: ${error.message}`);
        return { model: modelName, status: 'FAILED', error: error.message };
    }
}

async function testAllModels() {
    console.log('🚀 Testing Gemini Models...');
    console.log('API Key:', API_KEY ? 'Found' : 'Not found');
    
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        console.error('❌ API Key is not set. Please set VITE_API_KEY environment variable.');
        return;
    }
    
    const results = [];
    
    for (const modelName of modelsToTest) {
        const result = await testModel(modelName);
        results.push(result);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n📊 SUMMARY:');
    console.log('==================================================');
    
    const workingModels = results.filter(r => r.status === 'OK');
    const failedModels = results.filter(r => r.status === 'FAILED');
    
    if (workingModels.length > 0) {
        console.log('✅ WORKING MODELS:');
        workingModels.forEach(m => console.log(`   - ${m.model}: ${m.response}`));
    }
    
    if (failedModels.length > 0) {
        console.log('\n❌ FAILED MODELS:');
        failedModels.forEach(m => console.log(`   - ${m.model}: ${m.error}`));
    }
    
    if (workingModels.length > 0) {
        console.log(`\n🎯 RECOMMENDATION: Use "${workingModels[0].model}" (first working model)`);
    } else {
        console.log('\n🎯 RECOMMENDATION: No models working - check API key or permissions');
    }
    
    console.log('==================================================');
}

testAllModels();
