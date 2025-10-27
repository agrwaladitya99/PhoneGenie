// List available models for this API key
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

async function listModels() {
  console.log("Listing available models...");
  console.log("API Key:", process.env.GEMINI_API_KEY?.substring(0, 15) + "...");
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try to list models
    const models = await genAI.listModels();
    
    console.log("\n✅ Available models:");
    for (const model of models) {
      console.log(`  - ${model.name}`);
      console.log(`    Supported methods: ${model.supportedGenerationMethods?.join(', ')}`);
    }
    
  } catch (error) {
    console.error("\n❌ Error listing models:");
    console.error(error.message);
    
    // Check if this is an API key issue
    if (error.message.includes('API key')) {
      console.log("\n⚠️  This API key might not be valid for Google AI Studio.");
      console.log("Please get a new key from: https://makersuite.google.com/app/apikey");
    }
  }
}

listModels();

