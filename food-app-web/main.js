const UrlApiMeals = 'https://food-app-dbriceno10.vercel.app/api/meals';
const UrlApiOrders = 'https://food-app-dbriceno10.vercel.app/api/orders';
const UrlApiRegister = 'https://food-app-dbriceno10.vercel.app/api/auth/register';
const UrlApiLogin = 'https://food-app-dbriceno10.vercel.app/api/auth/login';
const UrlApiMe = 'https://food-app-dbriceno10.vercel.app/api/auth/me';
let mealsState = [];

let route = 'login'; //login, register,orders

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
    const arrayMealsList = Array.from(mealsList.children); //trasformamos en un arreglo
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

const initializeForm = () => {
  const orderForm = document.getElementById('order');
  orderForm.onsubmit = (event) => {
    event.preventDefault();
    const submit = document.getElementById('submit');
    submit.setAttribute('disabled', true); //luego de hacer el submit, bloqueamos el botón mientras se agrega el elemento
    const mealId = document.getElementById('meals-id');
    const mealIdValue = mealId.value;
    if (!mealIdValue) {
      const errorMessage = swal({
        title: 'Error',
        text: 'Debe seleccionar un plato',
        icon: 'error',
      });
      return errorMessage;
      // return alert('Debe seleccionar un plato');
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
    })
      .then((element) => element.json())
      .then((response) => {
        const renderedOrder = renderOrder(response, mealsState);
        const ordersList = document.getElementById('orders-list');
        ordersList.appendChild(renderedOrder);
        submit.removeAttribute('disabled');
      });
  };
};

const initializeData = () => {
  fetch(UrlApiMeals)
    .then((response) => response.json())
    .then((dataMeals) => {
      mealsState = dataMeals;
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
          // console.log(dataOrders);
        });
    });
};

const renderApp = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return renderOrders();
  }
  renderLogin();
};

const renderOrders = () => {
  const ordersView = document.getElementById('orders-view');
  document.getElementById('app').innerHTML = ordersView.innerHTML;
  initializeForm();
  initializeData();
};

const renderLogin = () => {
  const loginTemplate = document.getElementById('login-template');
  document.getElementById('app').innerHTML = loginTemplate.innerHTML;

  const loginForm = document.getElementById('login-form');
  loginForm.onsubmit = (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(UrlApiLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((element) => element.json())
      .then((response) => {
        localStorage.setItem('token', response.token);
        route = 'orders';
        return response.token; //Ahora en nuestro siguiente .then() encadenado vamos a tener acceso a nuestro token sin necesidad de acceder a localStorage
      })
      .then((token) => {
        //En esta siguiente llamada, el parámetro que pasemos es nuestro token
        return fetch(UrlApiMe, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        });
      })
      .then((element) => element.json())
      .then((user) => console.log(user));
  };
};

window.onload = () => {
  renderApp();
};
