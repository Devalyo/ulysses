const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports.getAIresponse =  async (prompt) => {

    prompt = (process.env.EMIRIPROMPT) + prompt

  try {
    const res = await model.generateContent([prompt]);
    return (res.response.text() || "no more A.I.....");
  } catch (e) {
    console.error("nooo", e.message, e);
    throw new Error("AI PEIDOU");
  }
}

