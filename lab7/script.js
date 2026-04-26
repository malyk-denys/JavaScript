const content = document.getElementById('content');
const catalogBtn = document.getElementById('catalogBtn');
const startBtn = document.getElementById('startBtn');

async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error('Помилка завантаження файлу: ' + path);
  }

  return await response.json();
}

async function showCatalog() {
  try {
    const categories = await loadJson('data/categories.json');

    content.innerHTML = `
      <h2>Каталог побутової техніки</h2>
      <p>Оберіть категорію, щоб завантажити її товари без перезавантаження сторінки.</p>
      <div class="category-list">
        ${categories.map(category => `
          <div class="category-card" onclick="showCategory('${category.shortname}')">
            <h3>${category.name}</h3>
            <p>${category.notes}</p>
          </div>
        `).join('')}
        <div class="category-card special-card" onclick="showSpecials()">
          <h3>Specials</h3>
          <p>Випадкова категорія каталогу.</p>
        </div>
      </div>
    `;
  } catch (error) {
    content.innerHTML = `<p>${error.message}</p>`;
  }
}

async function showCategory(shortname) {
  try {
    const category = await loadJson(`data/${shortname}.json`);

    content.innerHTML = `
      <h2>${category.categoryName}</h2>
      <p>${category.categoryDescription}</p>
      <div class="products-grid">
        ${category.items.map(item => `
          <article class="product-card">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p class="price">${item.price} грн</p>
          </article>
        `).join('')}
      </div>
      <button class="back-btn" onclick="showCatalog()">Назад до каталогу</button>
    `;
  } catch (error) {
    content.innerHTML = `<p>${error.message}</p>`;
  }
}

async function showSpecials() {
  try {
    const categories = await loadJson('data/categories.json');
    const randomIndex = Math.floor(Math.random() * categories.length);
    const randomCategory = categories[randomIndex];

    showCategory(randomCategory.shortname);
  } catch (error) {
    content.innerHTML = `<p>${error.message}</p>`;
  }
}

catalogBtn.addEventListener('click', showCatalog);
startBtn.addEventListener('click', showCatalog);
