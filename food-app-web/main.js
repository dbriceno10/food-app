const UrlApiMeals = 'https://food-app-dbriceno10.vercel.app/api/meals';
const UrlApiOrders = 'https://food-app-dbriceno10.vercel.app/api/orders';
const UrlApiRegister =
  'https://food-app-dbriceno10.vercel.app/api/auth/register';
const UrlApiLogin = 'https://food-app-dbriceno10.vercel.app/api/auth/login';
const UrlApiMe = 'https://food-app-dbriceno10.vercel.app/api/auth/me';
let mealsState = [];
let user = {};
let route = 'login'; //login, register,orders

const checkLocalStorage = () => {
  if(localStorage.getItem("token") === "undefined" || null) {
    localStorage.removeItem("token")
  }
  if(localStorage.getItem("user") === "undefined" || null) {
    localStorage.removeItem("user")
  }
}

const btnLogout = document.getElementById("logout-btn") 
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  setTimeout(() => {
    renderLogin()
  }, 1000)
})

const hideLogoutBtn = ()=> {
  checkLocalStorage()
  const logoutW = document.getElementById("logout")
  const testUser = localStorage.getItem("user")
  const testToken = localStorage.getItem("token")
  if(testUser === null || testToken === null) {
    logoutW.classList.add("hidden")
  } else {
    logoutW.classList.remove("hidden")
  }
}

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
  const view = `<li data-id=${order._id}>${meal.name} - User Id: ${order.user_id}</li>`;
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
        text: 'You must select a meal',
        icon: 'error',
      });
      submit.removeAttribute('disabled');
      return errorMessage;
    }
    const order = {
      meal_id: mealIdValue,
      user_id: user._id,
    };
    const token = localStorage.getItem('token');
    fetch(UrlApiOrders, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
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
        });
    });
};

const renderApp = () => {
  hideLogoutBtn()
  const token = localStorage.getItem('token');
  if (token) {
    user = JSON.parse(localStorage.getItem('user')); //La info en el local storage viene como un string, por lo que debemos parsearlo para transformarlo en un json
    return renderOrders();
  }
  renderLogin();
};

const renderOrders = () => {
  hideLogoutBtn()
  const ordersView = document.getElementById('orders-view');
  document.getElementById('app').innerHTML = ordersView.innerHTML;
  initializeForm();
  initializeData();
};

const renderLogin = () => {
hideLogoutBtn()
  const loginTemplate = document.getElementById('login-template');
  document.getElementById('app').innerHTML = loginTemplate.innerHTML;
  const btnCNA = document.getElementById('register-btn');
  btnCNA.addEventListener('click', () => {
    renderRegister();
  });
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
      .catch((error) => {
        console.log(error);
        const errorMessage = swal({
          title: 'Error',
          text: 'Invalid username and / or password',
          icon: 'error',
        });
        return errorMessage;
      })
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
      .then((fetchedUser) => {
        localStorage.setItem('user', JSON.stringify(fetchedUser));
        user = fetchedUser;
        renderOrders();
      });
  };
};

const renderRegister = () => {
  hideLogoutBtn()
  const registerTemplate = document.getElementById('register-template');
  document.getElementById('app').innerHTML = registerTemplate.innerHTML;
  const btnL = document.getElementById('login-btn');
  btnL.addEventListener('click', () => {
    renderLogin();
  });
  const registerForm = document.getElementById('register-form');
  registerForm.onsubmit = (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('emailR').value;
    const password = document.getElementById('passwordR').value;

    fetch(UrlApiRegister, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    }).then((element) => {
      if (element.status !== 201) {
        const errorMessage = swal({
          title: 'Error',
          text: 'User already exists',
          icon: 'error',
        });
        return errorMessage;
      } else {
        const errorMessage = swal({
          title: 'Ok',
          text: 'User created successfully',
          icon: 'success',
        }).then(() => {
          setTimeout(() => {
            renderLogin();
          }, 1000);
        });
        return errorMessage;
      }
    });
  };
};

window.onload = () => {
  renderApp();
};
