const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const readline = require("readline");
const config = require("./api/config_api");
// Configure the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Set the API key
const genAI = new GoogleGenerativeAI(config.apiKey);

const App = async function AI() {
  // Define colors
  const colorCode = "\x1b[36m"; // Blue color
  const greenColor = "\x1b[32m"; // Green color
  const warningColor = "\x1b[33m"; // Yellow color
  const resetCode = "\x1b[0m";

  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

  async function askQuestion() {
    // Get input data from the user
    rl.question("\n\x1b[33m@-> You: \x1b[0m", async (msg) => {
      if (!msg) {
        console.log(
          `${warningColor}` + "\n>>> You must enter a message!\x1b[0m"
        );
        askQuestion();
        return;
      }

      // Start the chat with predefined initial messages
      const chat = model.startChat({
        // Message type for this message (default: "text")
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        // Set the contents of the chat message to the specified
        contents: [
          {
            role: "user",
            parts: msg, // Use the user's input message
          },
          {
            role: "model",
            parts: "Hello, How can I help today?",
          },
        ],
        // Set the safety settings for the chat message and send it to the server
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      const result = await chat.sendMessage(msg);
      const text = (await result.response).text();
      const output = " AI: Generating response...\n";
      console.log(
        `${colorCode}\n${output}${resetCode}`,
        `${greenColor}\n>>>${resetCode}`,
        text
      );
      askQuestion();
    });
  }
  askQuestion();
};

module.exports = {
  start: async function () {
    await App();
  },
};
