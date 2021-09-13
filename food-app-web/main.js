// window.onload = () => {};
const renderItem = (item) => {
  // return `<li>${item}</li>`
  return `<li data-id=${item._id}>${item.name}</li>`
}


const UrlApi = 'https://food-app-dbriceno10.vercel.app/api/meals';
fetch(UrlApi)
  .then((response) => response.json())
  .then((data) => {
    const mealsList = document.getElementById('meals-list');
    const submit = document.getElementById('submit');
    // const template = data.map(element => renderItem(element.name)).join('');
    const template = data.map(renderItem).join('');
    mealsList.innerHTML = template;
    submit.removeAttribute('disabled')
  });
