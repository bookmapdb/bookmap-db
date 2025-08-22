async function loadBooks() {
  const res = await fetch("https://script.google.com/macros/s/AKfycbwUf72FOMV7NiHQZ3YVWFRrBHtkjY8pD6OZ4oXMJ7nUB2oSMKKYyq3EX9brCBMqo9Vs/exec");
  const books = await res.json();


  const categories = new Set();
  const levels = new Set(["입문", "초급", "중급", "고급", "전문"]); // 전문 추가
  const divisions = new Set(["국내서", "국외서"]); // 도서구분 추가

  books.forEach(book => {
    book.category.split(",").forEach(c => categories.add(c.trim()));
    if (book.level) levels.add(book.level);
    if (book.division) divisions.add(book.division);
  });

  const categoryFilter = document.getElementById("categoryFilter");
  const levelFilter = document.getElementById("levelFilter");
  const divisionFilter = document.getElementById("divisionFilter");

  // 버튼 생성 함수
  function createFilterButtons(items, container, className) {
    items.forEach(i => {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.value = i;
      btn.className = `${className} px-3 py-1 border rounded-full text-sm hover:bg-blue-100`;
      btn.addEventListener("click", () => {
        btn.classList.toggle("bg-blue-600");
        btn.classList.toggle("text-white");
        renderBooks();
      });
      container.appendChild(btn);
    });
  }

  createFilterButtons(categories, categoryFilter, "category-btn");
  createFilterButtons(levels, levelFilter, "level-btn");
  createFilterButtons(divisions, divisionFilter, "division-btn");

  function renderBooks() {
    const selectedCategories = Array.from(document.querySelectorAll(".category-btn.bg-blue-600")).map(b => b.value);
    const selectedLevels = Array.from(document.querySelectorAll(".level-btn.bg-blue-600")).map(b => b.value);
    const selectedDivisions = Array.from(document.querySelectorAll(".division-btn.bg-blue-600")).map(b => b.value);

    const filtered = books.filter(book => {
      const catMatch = selectedCategories.length === 0 || selectedCategories.some(c => book.category.includes(c));
      const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(book.level);
      const divMatch = selectedDivisions.length === 0 || selectedDivisions.includes(book.division);
      return catMatch && levelMatch && divMatch;
    });

    document.getElementById("bookList").innerHTML = filtered.map(book => `
      <div class="bg-white rounded-xl shadow p-4 flex flex-col">
        <img src="${book.image}" alt="${book.title}" class="h-48 w-full object-cover rounded-lg mb-4">
        <h3 class="font-bold text-lg mb-2">${book.title}</h3>
        <p class="text-sm text-gray-600">저자: ${book.author}</p>
        <p class="text-sm text-gray-600">출판사: ${book.publisher}</p>
        <p class="text-sm text-gray-600">카테고리: ${book.category}</p>
        <p class="text-sm text-gray-600">도서구분: ${book.division || "미정"}</p>
        <p class="text-sm text-gray-600">단계: ${book.level}</p>
        <p class="text-sm text-gray-500 mt-2">${book.reason || ""}</p>
        <div class="mt-auto flex gap-2 pt-4">
          <a href="book-detail.html?id=${book.id}" class="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700">상세보기</a>
          <a href="${book.buy_link}" target="_blank" class="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700">구매링크</a>
        </div>
        ${book.original_buy_link ? `<a href="${book.original_buy_link}" target="_blank" class="mt-2 block text-center text-sm text-blue-600 underline">원서 구매링크</a>` : ""}
      </div>`).join("");
  }

  renderBooks();
}

loadBooks();
