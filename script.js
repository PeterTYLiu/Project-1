let main = document.getElementById("main");

let loadPage = page => {
  main.innerHTML = null;
  main.appendChild(page);
};

let UNIXTimeIntoDate = UNIXTime => {
  let date = new Date(UNIXTime * 1000);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

// ===============================================================================
// Creates the home page and its functionality of suggesting meals based on city
// ===============================================================================

let homepage = document.createElement("div");

homepage.innerHTML = `<h1>Enter your city and get a perfect week of meal prep!</h1>`;

let searchField = document.createElement("input");
searchField.setAttribute("placeholder", "e.g. Chicago");
homepage.appendChild(searchField);

let searchButton = document.createElement("button");
searchButton.classList.add("button", "button-primary");
searchButton.innerHTML = "GO!";
homepage.appendChild(searchButton);

// Function to display five-day forcast and suggest meals
function fetchWeatherInfo() {
  let userInput = searchField.value.trim();
  let apiKey = "9d1ed7a3283bdd5ad280c6313828f1ed";
  let days = [];
  fetch(
    `https:api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${apiKey}`
  )
    .then(response => response.json())
    .then(forecast => {
      if (forecast.cod == "404") {
        return Promise.reject("City not found!");
      } else if (forecast.cod == "200") {
        const exactTime = "15:00:00";

        for (let i = 0; i < forecast.list.length; i++) {
          let timeOfDay = forecast.list[i];
          if (timeOfDay.dt_txt.includes(exactTime)) {
            let exactDate = new Date(timeOfDay.dt * 1000);
            let dayOfWeekNumeral = exactDate.getDay();
            let dayOfWeek;
            switch (dayOfWeekNumeral) {
              case 0:
                dayOfWeek = "Sunday";
                break;
              case 1:
                dayOfWeek = "Monday";
                break;
              case 2:
                dayOfWeek = "Tuesday";
                break;
              case 3:
                dayOfWeek = "Wednesday";
                break;
              case 4:
                dayOfWeek = "Thursday";
                break;
              case 5:
                dayOfWeek = "Friday";
                break;
              case 6:
                dayOfWeek = "Saturday";
            }

            days.push({
              temp: parseInt((timeOfDay.main.temp - 273.15).toFixed(0)),
              weather: timeOfDay.weather[0].main,
              weatherIcon: timeOfDay.weather[0].icon,
              dayOfWeek: dayOfWeek,
              date: UNIXTimeIntoDate(timeOfDay.dt)
            });
          }
        }
      }
    })
    .then(() => {
      // Create an object to save all data to
      let mealPrep = { city: userInput, days: [], shoppingList: {} };

      // Define a function that suggests a meal based on a day object
      let recommendRecipe = day => {
        let foodName;
        let foodImage;
        let recipeURL;
        let recipe = [];
        let ingredients = [];

        // variables for querying the API
        let foodID;
        let mainIngredient;
        let foodType;
        let randomOffset = Math.floor(Math.random() * 10) + 1;
        let apiKey2 = "7bdb822900d54db3b8439eef715f24a3";

        // determining the main ingredient based on temp
        if (day.temp <= 7) {
          mainIngredient = "chicken";
        } else if (day.temp <= 20) {
          mainIngredient = "pork";
        } else {
          mainIngredient = "vegetable";
        }

        // determining the type of food based on weather
        if (
          day.weather == "Rain" ||
          day.weather == "Thunderstorm" ||
          day.weather == "Drizzle"
        ) {
          foodType = "soup";
        } else if (day.weather == "Snow") {
          foodType = "sandwich";
        } else if (day.weather == "Clouds") {
          foodType = "pasta";
        } else {
          foodType = "salad";
        }

        // query the API for a random food based on foodType and mainIngredient
        fetch(
          `https://api.spoonacular.com/recipes/search?query=${mainIngredient}+${foodType}&apiKey=${apiKey2}&number=1&offset=${randomOffset}`
        )
          .then(response => response.json())
          .then(data => {
            let food = data.results[0];
            console.log(`Recommend ${food.title} for a ${day.weather} day.`);

            foodName = food.title;
            foodID = food.id;
            foodImage = food.image;
          })
          .then(() => {
            fetch(
              `https://api.spoonacular.com/recipes/${foodID}/information?apiKey=${apiKey2}`
            )
              .then(response => response.json())
              .then(data => {
                recipeURL = data.sourceUrl;
                let ingrInfo = data.extendedIngredients;
                ingrInfo.forEach(ingr => {
                  ingredients.push({
                    name: ingr.name,
                    qty: Math.floor(ingr.measures.metric.amount),
                    unit: ingr.measures.metric.unitShort
                  });
                });
              })
              .then(() => {
                fetch(
                  `https://api.spoonacular.com/recipes/${foodID}/analyzedInstructions?apiKey=${apiKey2}`
                )
                  .then(response => response.json())
                  .then(data => {
                    data[0].steps.forEach(step => recipe.push(step.step));
                  });
              });
          });
        // query the API to get the ingredients for that food

        // query the API to get the recipe for that food

        return {
          dayOfWeek: day.dayOfWeek,
          date: day.date,
          temp: day.temp,
          weather: day.weather.toLowerCase(),
          weatherIcon: day.weatherIcon,
          // Food info
          foodName: foodName,
          foodImage: foodImage,
          ingredients: ingredients,
          recipe: recipe,
          recipeURL: recipeURL
        };
      };

      // Loop through the days array, calling that function for each day
      days.forEach(day => mealPrep.days.push(recommendRecipe(day)));
      // Create a localStorage object based on the mealPrep object

      // Check work
      console.log(mealPrep);
    });
}

searchButton.addEventListener("click", fetchWeatherInfo);
searchField.addEventListener("keyup", event => {
  if (event.keyCode === 13) fetchWeatherInfo();
});

// Check localstorage to see if existing plan exists, if so put it in main

// If no localstorage, use the main page
if (!localStorage.mealPlan) {
  loadPage(homepage);
}
