const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const readline = require("readline");
const config_api = require("./api/config_api");

// Configure the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const genAI = new GoogleGenerativeAI(config_api.apiKey);

const App = async function AI() {
  // Define colors
  const colorCode = "\x1b[36m"; // Blue color
  const greenColor = "\x1b[32m"; // Green color
  const warningColor = "\x1b[33m"; // Yellow color
  const resetCode = "\x1b[0m";

  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-001	" });

  async function askQuestion() {
    // Get input data from the user
    rl.question("\n\x1b[35m@-> You: \x1b[0m", async (msg) => {
      // Check if the user entered a message
      if (!msg) {
        console.log(
          `${warningColor}` +
            "\n>>> Warning: Please write a message or ask a question before sending it to me!\x1b[0m"
        );
        askQuestion();
        return;
      }

      const chat = model.startChat({
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        // Set the contents of the chat message to the specified
        contents: [
          {
            role: "MDC",
            parts: msg, // Use the user's input message
          },
          {
            role: "model",
            parts: "data",
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
