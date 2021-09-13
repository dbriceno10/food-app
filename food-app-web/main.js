// window.onload = () => {};
const UrlApi = 'https://food-app-dbriceno10.vercel.app/api/meals';
fetch(UrlApi)
  .then((response) => response.json())
  .then((data) => console.log(data));
