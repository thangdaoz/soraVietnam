// Test script to verify the Video API connection
// Run with: node test-api.mjs

const VIDEO_API_URL = 'https://api.kie.ai';
const VIDEO_API_KEY = 'c83ae9e8b9e112f05c981bfebc0a7d1a';

async function testVideoAPI() {
  console.log('🧪 Testing Video API Connection...\n');
  
  const testPrompt = 'A cat playing with a ball of yarn';
  const callbackUrl = 'http://localhost:3001/api/video-callback';
  
  const requestBody = {
    model: 'sora-2-text-to-video',
    callBackUrl: callbackUrl,
    input: {
      prompt: testPrompt,
      aspect_ratio: 'landscape',
    },
  };
  
  console.log('📤 Request Details:');
  console.log('URL:', `${VIDEO_API_URL}/api/v1/jobs/createTask`);
  console.log('API Key:', VIDEO_API_KEY.substring(0, 10) + '...');
  console.log('Request Body:', JSON.stringify(requestBody, null, 2));
  console.log('\n⏳ Sending request...\n');
  
  try {
    const response = await fetch(`${VIDEO_API_URL}/api/v1/jobs/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VIDEO_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('📥 Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('\n📄 Raw Response:');
    console.log(responseText);
    
    // Try to parse as JSON
    try {
      const responseData = JSON.parse(responseText);
      console.log('\n✅ Parsed JSON Response:');
      console.log(JSON.stringify(responseData, null, 2));
      
      if (responseData.code === 200 && responseData.data?.taskId) {
        console.log('\n🎉 SUCCESS! Task created with ID:', responseData.data.taskId);
      } else {
        console.log('\n❌ API returned error:');
        console.log('Code:', responseData.code);
        console.log('Message:', responseData.message);
      }
    } catch (parseError) {
      console.log('\n⚠️  Could not parse response as JSON');
    }
    
  } catch (error) {
    console.error('\n❌ Request failed with error:');
    console.error(error.message);
    console.error(error);
  }
}

// Run the test
testVideoAPI();
