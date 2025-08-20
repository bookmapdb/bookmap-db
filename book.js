async function loadBooks() {
  const res = await fetch("books.json");
  const books = await res.json();

  const categories = new Set();
  const levels = new Set();

  // 카테고리/단계 수집
  books.forEach(book => {
    book.category.split(",").forEach(c => categories.add(c.trim()));
    levels.add(book.level);
  });

  const categoryFilter = document.getElementById("categoryFilter");
  const levelFilter = document.getElementById("levelFilter");

  // ✅ 버튼 생성 함수
  function createFilterButton(value, className) {
    const btn = document.createElement("button");
    btn.textContent = value;
    btn.className = `px-3 py-1 border rounded-full text-sm ${className} transition`;
    btn.dataset.value = value;
    btn.dataset.active = "false";

    btn.addEventListener("click", () => {
      btn.dataset.active = btn.dataset.active === "true" ? "false" : "true";
      btn.classList.toggle("bg-blue-600");
      btn.classList.toggle("text-white");
      renderBooks();
    });

    return btn;
  }

  // 카테고리 버튼 생성
  categories.forEach(c => {
    categoryFilter.appendChild(createFilterButton(c, "category-btn"));
  });

  // 단계 버튼 생성
  levels.forEach(l => {
    levelFilter.appendChild(createFilterButton(l, "level-btn"));
  });

  // ✅ 도서 렌더링
  function renderBooks() {
    const selectedCategories = Array.from(document.querySelectorAll(".category-btn"))
      .filter(btn => btn.dataset.active === "true")
      .map(btn => btn.dataset.value);

    const selectedLevels = Array.from(document.querySelectorAll(".level-btn"))
      .filter(btn => btn.dataset.active === "true")
      .map(btn => btn.dataset.value);

    const filtered = books.filter(book => {
      const catMatch = selectedCategories.length === 0 || selectedCategories.some(c => book.category.includes(c));
      const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(book.level);
      return catMatch && levelMatch;
    });

    document.getElementById("bookList").innerHTML = filtered.map(book => `
      <div class="bg-white rounded-xl shadow p-4 flex flex-col">
        <img src="${book.image}" alt="${book.title}" class="h-48 w-full object-cover rounded-lg mb-4">
        <h3 class="font-bold text-lg mb-2">${book.title}</h3>
        <p class="text-sm text-gray-600">저자: ${book.author}</p>
        <p class="text-sm text-gray-600">출판사: ${book.publisher}</p>
        <p class="text-sm text-gray-600">카테고리: ${book.category}</p>
        <p class="text-sm text-gray-600">단계: ${book.level}</p>
        <p class="text-sm text-gray-500 mt-2">${book.reason || ""}</p>
        <div class="mt-auto flex gap-2 pt-4">
          <a href="book-detail.html?id=${book.id}" class="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700">상세보기</a>
          <a href="${book.buy_link}" target="_blank" class="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700">구매링크</a>
        </div>
      </div>`).join("");
  }

  renderBooks();
}
loadBooks();
