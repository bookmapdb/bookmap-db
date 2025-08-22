export default async function handler(req, res) {
  const API_URL =
    "https://script.google.com/macros/s/AKfycbwUf72FOMV7NiHQZ3YVWFRrBHtkjY8pD6OZ4oXMJ7nUB2oSMKKYyq3EX9brCBMqo9Vs/exec";

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("API 프록시 오류:", error);
    res.status(500).json({ error: error.message });
  }
}
