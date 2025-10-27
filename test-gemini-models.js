// Test different Gemini models
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

// Manually load .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envLines = envContent.split('\n');
for (const line of envLines) {
  const match = line.match(/^GEMINI_API_KEY=(.+)$/);
  if (match) {
    process.env.GEMINI_API_KEY = match[1].trim();
  }
}

async function testModel(modelName) {
  console.log(`\nTesting model: ${modelName}...`);
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });

    const prompt = "Say 'Hello!' if you can hear me.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`✅ SUCCESS with ${modelName}!`);
    console.log(`Response: ${text.substring(0, 100)}`);
    return true;
    
  } catch (error) {
    console.log(`❌ FAILED with ${modelName}`);
    console.log(`Error: ${error.message.substring(0, 150)}...`);
    return false;
  }
}

async function testAllModels() {
  console.log("Testing Gemini API with different models...");
  console.log("API Key present:", !!process.env.GEMINI_API_KEY);
  
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro",
  ];
  
  for (const model of models) {
    const success = await testModel(model);
    if (success) {
      console.log(`\n🎉 RECOMMENDED MODEL: ${model}`);
      break;
    }
  }
}

testAllModels();

