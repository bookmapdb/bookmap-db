// api/addBook.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const newBook = req.body;

  const repo = "bookmapdb/bookmap-db"; // 본인 GitHub 저장소 경로
  const filePath = "books.json";       // DB 파일
  const branch = "main";
  const token = process.env.GITHUB_TOKEN;

  // 현재 books.json 불러오기
  const getUrl = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;
  const getRes = await fetch(getUrl, {
    headers: { Authorization: `token ${token}` }
  });
  const file = await getRes.json();
  const content = Buffer.from(file.content, "base64").toString("utf8");
  const books = JSON.parse(content);

  // 새 책 추가
  newBook.id = Date.now();
  books.push(newBook);

  // 다시 저장 (commit)
  const updateRes = await fetch(getUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Add new book",
      content: Buffer.from(JSON.stringify(books, null, 2)).toString("base64"),
      sha: file.sha,
      branch,
    }),
  });

  if (updateRes.ok) {
    res.status(200).json({ message: "Book added successfully!" });
  } else {
    res.status(500).json({ error: "Failed to update books.json" });
  }
}
