import axios from "axios";

export const getRecomendations = async (req, res) => {
  try {
    const { interests } = req.body;

    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "tinyllama",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates recommendations in JSON format.",
        },
        {
          role: "user",
          content: `Give me a list of 5 fun product and activity recommendations in JSON format (array of strings only, no descriptions) for a person interested in: ${interests.join(
            ", "
          )}.`,
        },
      ],
    });

    const content = response.data.message.content;

    const recommendations = JSON.parse(content); // если ты уверен, что придёт JSON
    res.status(200).json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
