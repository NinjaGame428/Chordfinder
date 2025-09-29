#!/usr/bin/env node

/**
 * Get Firebase Configuration from existing project
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envFilePath = path.join(__dirname, '.env.local');

console.log('🔥 Connect to Your Existing Firebase Project 🔥\n');
console.log('To get your Firebase configuration:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Select your existing project (or create a new one)');
console.log('3. Go to Project Settings (gear icon) → General tab');
console.log('4. Scroll down to "Your apps" section');
console.log('5. Click "Add app" → Web app (</> icon)');
console.log('6. Register your app with nickname: "chords-finder-web"');
console.log('7. Copy the Firebase configuration object\n');

const questions = [
  {
    name: 'projectId',
    query: 'Enter your Firebase Project ID: ',
    validation: (input) => input.length > 3,
    errorMessage: 'Invalid Project ID. It should be longer than 3 characters.'
  },
  {
    name: 'apiKey',
    query: 'Enter your Firebase API Key: ',
    validation: (input) => input.length > 10,
    errorMessage: 'Invalid API Key. It should be longer than 10 characters.'
  },
  {
    name: 'authDomain',
    query: 'Enter your Firebase Auth Domain (e.g., your-project.firebaseapp.com): ',
    validation: (input) => input.includes('.firebaseapp.com'),
    errorMessage: 'Invalid Auth Domain. It should contain ".firebaseapp.com".'
  },
  {
    name: 'storageBucket',
    query: 'Enter your Firebase Storage Bucket (e.g., your-project.appspot.com): ',
    validation: (input) => input.includes('.appspot.com'),
    errorMessage: 'Invalid Storage Bucket. It should contain ".appspot.com".'
  },
  {
    name: 'messagingSenderId',
    query: 'Enter your Firebase Messaging Sender ID: ',
    validation: (input) => input.length > 5,
    errorMessage: 'Invalid Messaging Sender ID. It should be longer than 5 characters.'
  },
  {
    name: 'appId',
    query: 'Enter your Firebase App ID: ',
    validation: (input) => input.length > 10,
    errorMessage: 'Invalid App ID. It should be longer than 10 characters.'
  }
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question.query, (answer) => {
      if (question.validation && !question.validation(answer)) {
        console.error(`\n❌ ${question.errorMessage}\n`);
        resolve(askQuestion(question)); // Ask again if validation fails
      } else {
        resolve(answer.trim());
      }
    });
  });
}

async function configureFirebase() {
  const answers = {};
  for (const q of questions) {
    answers[q.name] = await askQuestion(q);
  }

  const { projectId, apiKey, authDomain, storageBucket, messagingSenderId, appId } = answers;

  // Create .env.local file
  console.log('\n--- Creating .env.local ---');
  let envContent = `# Firebase Configuration\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_API_KEY=${apiKey}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${authDomain}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_PROJECT_ID=${projectId}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${storageBucket}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_APP_ID=${appId}\n`;

  try {
    fs.writeFileSync(envFilePath, envContent, 'utf8');
    console.log(`✅ .env.local created successfully at ${envFilePath}`);
  } catch (error) {
    console.error(`❌ Error writing to .env.local: ${error.message}`);
    rl.close();
    return;
  }

  console.log('\n--- Next Steps ---');
  console.log('1. Make sure Authentication is enabled in your Firebase project:');
  console.log('   - Go to Authentication → Sign-in method');
  console.log('   - Enable Email/Password');
  console.log('\n2. Make sure Firestore Database is created:');
  console.log('   - Go to Firestore Database → Create database');
  console.log('   - Choose "Start in test mode"');
  console.log('\n3. Test your Firebase connection:');
  console.log('   npm run dev');
  console.log('   Visit: http://localhost:3000/firebase-test');
  console.log('\n4. Test user registration:');
  console.log('   Visit: http://localhost:3000/register');

  console.log('\n--- Setup Complete! ---');
  console.log('Your Firebase configuration is ready! 🎉');
  rl.close();
}

configureFirebase();
