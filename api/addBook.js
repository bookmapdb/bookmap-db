import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "허용되지 않은 메서드입니다. POST만 가능합니다." });
  }

  try {
    const newBook = req.body;

    // GitHub 저장소 설정
    const owner = "bookmapdb"; // ✅ 본인 GitHub 유저명/조직명으로 변경
    const repo = "bookmap-db"; // ✅ 저장소 이름
    const path = "books.json"; // 저장할 파일
    const token = process.env.GITHUB_TOKEN; // Vercel 환경변수에 저장

    const octokit = new Octokit({ auth: token });

    // 기존 books.json 가져오기
    const { data: fileData } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    const content = Buffer.from(fileData.content, "base64").toString("utf8");
    const books = JSON.parse(content);

    // 새 도서 추가
    books.push(newBook);

    // JSON 문자열 변환 (들여쓰기 포함)
    const updatedContent = JSON.stringify(books, null, 2);

    // GitHub에 커밋
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Add new book: ${newBook.title}`,
      content: Buffer.from(updatedContent, "utf8").toString("base64"),
      sha: fileData.sha, // 기존 파일의 SHA 필요
    });

    res.status(200).json({ message: "도서가 성공적으로 등록되었습니다.", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "도서 등록 중 오류 발생", details: error.message });
  }
}
