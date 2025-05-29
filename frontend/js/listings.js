import { apiRequest, getToken } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) {
    alert('Сначала авторизуйтесь');
    window.location = 'login.html';
    return;
  }

  const container = document.querySelector('.cards');
  const form = document.createElement('form');
  form.innerHTML = `
    <h3>Создать объявление</h3>
    <input name="title" placeholder="Заголовок" required>
    <textarea name="description" placeholder="Описание" required></textarea>
    <input name="price" type="number" step="0.01" placeholder="Цена" required>
    <input name="city" placeholder="Город" required>
    <input name="district" placeholder="Район" required>
    <input name="rooms" type="number" placeholder="Комнат" required>
    <select name="property_type">
      <option value="apartment">Apartment</option>
      <option value="house">House</option>
      <option value="room">Room</option>
    </select>
    <button type="submit">Создать</button>
  `;
  document.querySelector('.container').prepend(form);

  // Загрузка списка объявлений
  async function loadListings() {
    try {
      const data = await apiRequest('/listings/');
      container.innerHTML = '';
      data.results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <p><strong>€${item.price}</strong></p>
          <button data-id="${item.id}">Забронировать</button>
        `;
        container.append(card);
      });
    } catch (e) {
      alert('Ошибка загрузки объявлений');
    }
  }

  loadListings();

  // Обработка создания объявления
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    try {
      await apiRequest('/listings/', 'POST', payload);
      alert('Объявление создано');
      form.reset();
      loadListings();
    } catch (e) {
      alert('Ошибка создания');
    }
  });

  // Обработка бронирования
  container.addEventListener('click', async e => {
    if (e.target.tagName !== 'BUTTON') return;
    const listingId = e.target.dataset.id;
    const start = prompt('Дата начала (YYYY-MM-DD):');
    const end = prompt('Дата конца (YYYY-MM-DD):');
    if (!start || !end) return;

    try {
      await apiRequest('/bookings/', 'POST', {
        listing: listingId,
        start_date: start,
        end_date: end
      });
      alert('Бронь создана');
    } catch (err) {
      alert('Ошибка бронирования');
    }
  });
});
