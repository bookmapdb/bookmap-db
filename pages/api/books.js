export default async function handler(req, res) {
  // ✅ CORS 헤더 추가
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ 프리플라이트 요청 처리
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const API_URL =
    "https://script.google.com/macros/s/AKfycbwUf72FOMV7NiHQZ3YVWFRrBHtkjY8pD6OZ4oXMJ7nUB2oSMKKYyq3EX9brCBMqo9Vs/exec";

  try {
    const response = await fetch(API_URL); // ✅ GET은 Content-Type 제거
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
