// window.onload = () => {};
const stringToHTML = (string) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(string, 'text/html');
  const child = document.body.firstChild; //fristChild es el primer elemento que se encuentra en nuestra etiqueta de body, es decir, el elemento li que estamos imprimiendo
  return child;
};
const renderItem = (item) => {
  // return `<li>${item}</li>`;
  const view = `<li data-id=${item._id}>${item.name}</li>`;
  const element = stringToHTML(view);
  console.log(element);
  return element;
};

const UrlApi = 'https://food-app-dbriceno10.vercel.app/api/meals';
fetch(UrlApi)
  .then((response) => response.json())
  .then((data) => {
    const mealsList = document.getElementById('meals-list');
    const submit = document.getElementById('submit');
    // const template = data.map(element => renderItem(element.name)).join('');
    const listItems = data.map(renderItem);
    listItems.forEach((element) => mealsList.appendChild(element));
    submit.removeAttribute('disabled');
  });
