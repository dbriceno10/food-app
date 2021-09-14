const UrlApiMeals = 'https://food-app-dbriceno10.vercel.app/api/meals';
const UrlApiOrders = 'https://food-app-dbriceno10.vercel.app/api/orders';

const stringToHTML = (string) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(string, 'text/html');
  const child = document.body.firstChild; //fristChild es el primer elemento que se encuentra en nuestra etiqueta de body, es decir, el elemento li que estamos imprimiendo
  return child;
};

const addClickEventToMeals = (element, meal) => {
  element.addEventListener('click', () => {
    const mealsList = document.getElementById('meals-list');
    //children nos regresa una colección de onjetos html, el cual se parece a un arreglo pero no lo es, se puede iterar (tiene índices). No tiene los métodos forEach y map
    const arrayMealsList = Array.from(mealsList.children); //trasformamos a un arreglo
    arrayMealsList.forEach((element) => element.classList.remove('selected'));
    element.classList.add('selected');
    const mealsIdImput = document.getElementById('meals-id'); //el input de tipo hidden lo vamos a utilizar para capturar el id del meal
    mealsIdImput.value = meal._id;
  });
};

const renderMeals = (meal) => {
  const view = `<li data-id=${meal._id}>${meal.name}</li>`;
  const element = stringToHTML(view);
  addClickEventToMeals(element, meal);
  return element;
};

const renderOrder = (order, meals) => {
  const meal = meals.find((elementMeal) => elementMeal._id === order.meal_id);
  const view = `<li data-id=${order._id}>${meal.name} - ${order.user_id}</li>`;
  const element = stringToHTML(view);
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
      user_id: 'id_de_prueba2',
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
    .then((dataMeals) => {
      const mealsList = document.getElementById('meals-list');
      const submit = document.getElementById('submit');
      const listMealsItems = dataMeals.map(renderMeals);
      mealsList.removeChild(mealsList.firstElementChild); //Remove child recibe como argumento un elemento html, le pasamos el primer elemento hijo (Loading...) en este caso para eliminarlo
      listMealsItems.forEach((element) => mealsList.appendChild(element));
      submit.removeAttribute('disabled');
      fetch(UrlApiOrders)
        .then((response) => response.json())
        .then((dataOrders) => {
          const ordersList = document.getElementById('orders-list');
          const listOrders = dataOrders.map((orderData) =>
            renderOrder(orderData, dataMeals)
          );
          ordersList.removeChild(ordersList.firstElementChild);
          listOrders.forEach((element) => ordersList.appendChild(element));
          console.log(dataOrders);
        });
    });
};
