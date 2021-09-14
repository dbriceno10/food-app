// window.onload = () => {};
const stringToHTML = (string) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(string, 'text/html');
  const child = document.body.firstChild; //fristChild es el primer elemento que se encuentra en nuestra etiqueta de body, es decir, el elemento li que estamos imprimiendo
  return child;
};
const renderItem = (item) => {
  const view = `<li data-id=${item._id}>${item.name}</li>`;
  const element = stringToHTML(view);

  element.addEventListener('click', () => {
    element.classList.add('selected');
    setTimeout(() => {
      element.classList.remove('selected');
    }, 1000);
  });
  return element;
};

const UrlApi = 'https://food-app-dbriceno10.vercel.app/api/meals';
fetch(UrlApi)
  .then((response) => response.json())
  .then((data) => {
    const mealsList = document.getElementById('meals-list');
    const submit = document.getElementById('submit');
    const listItems = data.map(renderItem);
    mealsList.removeChild(mealsList.firstElementChild); //Remove child recibe como argumento un elemento html, le pasamos el primer elemento hijo (Loading...) en este caso para eliminarlo
    listItems.forEach((element) => mealsList.appendChild(element));
    submit.removeAttribute('disabled');
  });
