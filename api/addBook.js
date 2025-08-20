import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "허용되지 않은 메소드" });
  }

  try {
    const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME, FILE_PATH } = process.env;
    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME || !FILE_PATH) {
      return res.status(500).json({ error: "환경변수가 설정되지 않았습니다." });
    }

    const newBook = {
      id: Date.now(),
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      category: req.body.category,
      division: req.body.division,
      level: req.body.level,
      original_title: req.body.original_title || "",
      original_buy_link: req.body.original_buy_link || "",
      buy_link: req.body.buy_link,
      image: req.body.image,
      reason: req.body.reason,
    };

    // 1. 기존 books.json 가져오기
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const getRes = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!getRes.ok) {
      throw new Error("기존 파일 불러오기 실패");
    }

    const fileData = await getRes.json();
    const content = Buffer.from(fileData.content, "base64").toString("utf-8");
    const books = JSON.parse(content);

    // 2. 새 책 추가
    books.push(newBook);

    // 3. GitHub 업데이트
    const updatedContent = Buffer.from(JSON.stringify(books, null, 2)).toString("base64");
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: `Add new book: ${newBook.title}`,
        content: updatedContent,
        sha: fileData.sha,
      }),
    });

    if (!putRes.ok) {
      throw new Error("파일 업데이트 실패");
    }

    return res.status(200).json({ message: "도서 등록 성공!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
