async function loadBooks() {
  const res = await fetch("books.json");
  const books = await res.json();

  const categories = new Set();
  const levels = new Set();

  books.forEach(book => {
    book.category.split(",").forEach(c => categories.add(c.trim()));
    levels.add(book.level);
  });

  const categoryFilter = document.getElementById("categoryFilter");
  const levelFilter = document.getElementById("levelFilter");

  categories.forEach(c => {
    const label = document.createElement("label");
    label.className = "flex items-center gap-2 text-sm";
    label.innerHTML = `<input type="checkbox" value="${c}" class="category-check"> ${c}`;
    categoryFilter.appendChild(label);
  });

  levels.forEach(l => {
    const label = document.createElement("label");
    label.className = "flex items-center gap-2 text-sm";
    label.innerHTML = `<input type="checkbox" value="${l}" class="level-check"> ${l}`;
    levelFilter.appendChild(label);
  });

  function renderBooks() {
    const selectedCategories = Array.from(document.querySelectorAll(".category-check:checked")).map(c => c.value);
    const selectedLevels = Array.from(document.querySelectorAll(".level-check:checked")).map(c => c.value);

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

  // 체크박스 변화 시 즉시 반영
  categoryFilter.addEventListener("change", renderBooks);
  levelFilter.addEventListener("change", renderBooks);

  renderBooks();
}
loadBooks();
