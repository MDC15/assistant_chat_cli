const readline = require("readline");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const config_api = require("./api/config_api");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const genAI = new GoogleGenerativeAI(config_api.apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

const colors = {
  blue: "\x1b[36m",
  green: "\x1b[32m",
  warning: "\x1b[33m",
  reset: "\x1b[0m",
  magenta: "\x1b[35m",
};

async function typeEffect(text) {
  for (const char of text) {
    process.stdout.write(char);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

async function askQuestion() {
  rl.question(`\n${colors.magenta}@-> You: ${colors.reset}`, async (msg) => {
    try {
      if (!msg) {
        console.log(
          `${colors.warning}\n>>> System: Please message or ask questions before sending to AI.${colors.reset}`
        );
        return askQuestion();
      }

      const chat = model.startChat({
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.8,
          topK: 40,
          topP: 0.9,
        },
        contents: [
          {
            role: "user",
            parts: "My name is MDC, I am a technology developer.",
          },
          { role: "model", parts: "oh hello" },
          { role: "user", parts: msg },
          { role: "model", parts: "data" },
        ],
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
      process.stdout.write(`${colors.blue}\n${output}${colors.reset}`);
      await typeEffect(`${colors.green}\n>>> ${text}\n\x1b[0m`);
      askQuestion();
    } catch (error) {
      console.error("An error occurred:", error);
      askQuestion();
    }
  });
}

module.exports = {
  start: async function () {
    try {
      await askQuestion();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
