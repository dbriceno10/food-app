const UrlApiMeals = 'https://food-app-dbriceno10.vercel.app/api/meals';
const UrlApiOrders = 'https://food-app-dbriceno10.vercel.app/api/orders';

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
    const mealsList = document.getElementById('meals-list');
    //children nos regresa una colección de onjetos html, el cual se parece a un arreglo pero no lo es, se puede iterar (tiene índices). No tiene los métodos forEach y map
    const arrayMealsList = Array.from(mealsList.children); //trasformamos a un arreglo
    arrayMealsList.forEach((element) => element.classList.remove('selected'));
    element.classList.add('selected');
    const mealsIdImput = document.getElementById('meals-id'); //el input de tipo hidden lo vamos a utilizar para capturar el id del meal
    mealsIdImput.value = item._id;
  });
  return element;
};

window.onload = () => {
  const orderForm = document.getElementById('order');
  orderForm.onsubmit = (event) => {
    event.preventDefault();
    const mealId = document.getElementById('meals-id');
    const mealIdValue = mealId.value;
    if (!mealIdValue) {
      const errorMessage = swal({
        title: 'Error',
        text: 'Debe seleccionar un plato',
        icon: 'error',
      });
      return errorMessage;
      // alert("Debe seleccionar un plato")
    }
    const order = {
      meal_id: mealIdValue,
      user_id: 'id_de_prueba',
    };

    fetch(UrlApiOrders, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    }).then((element) => console.log(element));
  };

  fetch(UrlApiMeals)
    .then((response) => response.json())
    .then((data) => {
      const mealsList = document.getElementById('meals-list');
      const submit = document.getElementById('submit');
      const listItems = data.map(renderItem);
      mealsList.removeChild(mealsList.firstElementChild); //Remove child recibe como argumento un elemento html, le pasamos el primer elemento hijo (Loading...) en este caso para eliminarlo
      listItems.forEach((element) => mealsList.appendChild(element));
      submit.removeAttribute('disabled');
    });
};
