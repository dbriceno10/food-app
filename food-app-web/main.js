// window.onload = () => {};
const UrlApi = 'https://food-app-dbriceno10.vercel.app/api/meals';
fetch(UrlApi)
  .then((response) => response.json())
  .then((data) => {
    const mealsList = document.getElementById('meals-list');
    const template = data.map((element) => `<li>${element.name}</li>`).join('');
    mealsList.innerHTML = template;
  });
