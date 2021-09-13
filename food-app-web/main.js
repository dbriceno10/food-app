// window.onload = () => {};

fetch('https://food-app-dbriceno10.vercel.app/api/meals')
    .then((response) => response.json())
    .then((data) => console.log(data));
