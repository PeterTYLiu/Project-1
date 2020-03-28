let main = document.getElementById("main");

let loadPage = page => {
  main.innerHTML = null;
  main.appendChild(page);
};

let UNIXTimeIntoDate = UNIXTime => {
  let date = new Date(UNIXTime * 1000);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

let combineIngredients = arr => {
  let combinedObject = {};

  arr.forEach(subArray => {
    subArray.forEach(item => {
      if (!combinedObject[item.name]) {
        combinedObject[item.name] = {
          qty: item.qty,
          unit: item.unit,
          bought: false
        };
      } else if (combinedObject[item.name].unit == item.unit) {
        combinedObject[item.name].qty += item.qty;
      }
    });
  });

  return combinedObject;
};

// ===============================================================================
// Creates the shopping list
// ===============================================================================

let shoppingList;
let createShoppingList = () => {
  shoppingList = document.createElement("div");
  shoppingList.setAttribute("style", "margin-bottom: 10rem");
  shoppingList.innerHTML = `<h2 style="padding: 2rem; margin: 0px;">Shopping List</h2><p style="padding: 0rem 2rem;">This list combines the ingredients of all your meals, in the exact quantities!`;

  let mealPrep = JSON.parse(localStorage.mealPrep);
  let list = mealPrep.shoppingList;

  let entries = Object.entries(list);

  entries.forEach(entry => {
    let listItem = document.createElement("div");
    listItem.setAttribute("style", "padding: 1rem 2rem");
    let isChecked = entry[1].bought == true ? "checked" : null;

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("style", "height: 3rem; width: 3rem");
    checkbox.setAttribute("name", `${entry[0]}`);
    checkbox.setAttribute(isChecked, "");
    listItem.append(checkbox);

    checkbox.addEventListener("click", () => {
      if (mealPrep.shoppingList[entry[0]].bought == false) {
        mealPrep.shoppingList[entry[0]].bought = true;
        localStorage.mealPrep = JSON.stringify(mealPrep);
      } else {
        mealPrep.shoppingList[entry[0]].bought = false;
        localStorage.mealPrep = JSON.stringify(mealPrep);
      }
    });

    let ingredient = document.createElement("p");
    ingredient.setAttribute(
      "style",
      "display: inline-block; padding-left: 3rem; margin: 0px;"
    );
    ingredient.innerHTML = `<strong>${entry[0].slice(1, -1)}</strong><br /> ${
      entry[1].qty
    } ${entry[1].unit}`;
    listItem.appendChild(ingredient);

    shoppingList.appendChild(listItem);
  });

  let footer = document.createElement("div");
  footer.classList.add("footer");

  let mealsButton = document.createElement("div");
  mealsButton.classList.add("footer-button");
  mealsButton.innerHTML = "MEALS";
  footer.appendChild(mealsButton);
  mealsButton.addEventListener("click", () => {
    loadPage(listingPage);
  });

  let shoppingButton = document.createElement("div");
  shoppingButton.classList.add("footer-button-active", "footer-button");
  shoppingButton.innerHTML = "SHOPPING LIST";
  footer.appendChild(shoppingButton);

  shoppingList.appendChild(footer);
};
// ===============================================================================
// Creates the city weather listing page
// ===============================================================================

let listingPage;
let createListingPage = () => {
  listingPage = document.createElement("div");
  listingPage.setAttribute("style", "margin-bottom: 10rem");
  listingPage.innerHTML = `<h2 style="display: inline-block; padding: 2rem; margin: 0px;">My Meals</h2>`;

  let resetButton = document.createElement("a");
  resetButton.innerText = "RESET";
  resetButton.setAttribute(
    "style",
    "display: inline-block; float: right; cursor: pointer; margin: 2rem"
  );
  listingPage.appendChild(resetButton);

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("mealPrep");
    errorMessage.innerText = null;
    loadPage(homepage);
  });

  let mealPrep = JSON.parse(localStorage.mealPrep);
  mealPrep.days.forEach(day => {
    let card = document.createElement("div");
    card.classList.add("card");
    let cardHeader = document.createElement("div");
    cardHeader.classList.add("cardHeader");
    cardHeader.innerHTML = `<h6>${day.dayOfWeek}, ${day.date}</h6><span>${day.temp} °C</span><img src="https://openweathermap.org/img/wn/${day.weatherIcon}.png">`;

    card.appendChild(cardHeader);

    let cardBody = document.createElement("div");
    cardBody.classList.add("container", "cardBody");

    let tempStr;
    if (day.temp <= 7) {
      tempStr = "chilly";
    } else if (day.temp <= 20) {
      tempStr = "mild";
    } else {
      tempStr = "warm";
    }

    cardBody.innerHTML = `<div class="row">
        <div class="five columns"> <img src="https://spoonacular.com/recipeImages/${day.foodImage}-312x150.jpg"> </div>
        <div class="seven columns" style="padding-top: 2rem"> <p style="margin-bottom: 0px;">It'll be ${tempStr} ${day.dayOfWeek} with ${day.weather}, we recommend some <strong>${day.foodName}</strong><br /><br /><a href="${day.recipeURL}" target="_blank">View recipe ➚</a></p>
        </div>
    </div>`;

    // let recipeLink = document.createElement("a");
    // recipeLink.setAttribute("id", day.dayOfWeek);
    // recipeLink.innerText = "View recipe";
    // cardBody.appendChild(recipeLink);

    card.appendChild(cardBody);

    listingPage.appendChild(card);
  });

  let footer = document.createElement("div");
  footer.classList.add("footer");

  let mealsButton = document.createElement("div");
  mealsButton.classList.add("footer-button-active", "footer-button");
  mealsButton.innerHTML = "MEALS";
  footer.appendChild(mealsButton);

  let shoppingButton = document.createElement("div");
  shoppingButton.classList.add("footer-button");
  shoppingButton.innerHTML = "SHOPPING LIST";
  footer.appendChild(shoppingButton);
  shoppingButton.addEventListener("click", () => {
    createShoppingList();
    loadPage(shoppingList);
  });

  listingPage.appendChild(footer);
};

// ===============================================================================
// Creates the home page and its functionality of suggesting meals based on city
// ===============================================================================

let homepage = document.createElement("div");

homepage.innerHTML = `<h1>Enter your city and get a perfect week of meal prep!</h1>`;

let searchField = document.createElement("input");
searchField.setAttribute("placeholder", "e.g. Chicago");
homepage.appendChild(searchField);

let errorMessage = document.createElement("p");
errorMessage.setAttribute("style", "text-align: center");
homepage.appendChild(errorMessage);

let searchButton = document.createElement("button");
searchButton.classList.add("button", "button-primary");
searchButton.innerHTML = "GO!";
homepage.appendChild(searchButton);

// Function to display five-day forcast and suggest meals
function fetchWeatherInfo() {
  let userInput = searchField.value.trim();
  let apiKey = "9d1ed7a3283bdd5ad280c6313828f1ed";

  let mealPrep = { city: userInput, days: [], shoppingList: {} };

  fetch(
    `https:api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${apiKey}`
  )
    .then(response => response.json())
    .then(forecast => {
      let days = [];
      if (forecast.cod == "404") {
        errorMessage.innerText = "City not found!";
        return Promise.reject("City not found!");
      } else if (forecast.cod == "200") {
        errorMessage.innerText = "Suggesting meals...";
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
      return days;
    })
    .then(days => {
      // Define a function that suggests a meal based on a day and its weather
      let recommendRecipe = day => {
        let dayWithFood = {
          dayOfWeek: day.dayOfWeek,
          date: day.date,
          temp: day.temp,
          weather: day.weather.toLowerCase(),
          weatherIcon: day.weatherIcon,
          // Food info
          foodName: "",
          foodImage: "",
          ingredients: [],
          recipe: [],
          recipeURL: ""
        };

        // variables for querying the API
        let foodID;
        let mainIngredient;
        let foodType;
        let randomOffset = Math.floor(Math.random() * 10) + 1;
        let apiKey2 = "3327fb866cab47ffbf755a2e86bc1ed6";

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
          `https://api.spoonacular.com/recipes/search?query=${mainIngredient}+${foodType}&apiKey=${apiKey2}&number=1&offset=${randomOffset}&instructionsRequired=true`
        )
          .then(response => response.json())
          .then(data => {
            let food = data.results[0];
            console.log(`Recommend ${food.title} for a ${day.weather} day.`);

            dayWithFood.foodName = food.title;
            foodID = food.id;
            dayWithFood.foodImage = food.id;
          })
          .then(() => {
            fetch(
              `https://api.spoonacular.com/recipes/${foodID}/information?apiKey=${apiKey2}`
            )
              .then(response => response.json())
              .then(data => {
                dayWithFood.recipeURL = data.sourceUrl;
                let ingrInfo = data.extendedIngredients;
                ingrInfo.forEach(ingr => {
                  dayWithFood.ingredients.push({
                    name: `"${ingr.name}"`,
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
                    data[0].steps.forEach(step => {
                      dayWithFood.recipe.push(step.step);
                    });
                    counter++;
                    console.log(counter);

                    daysWithRecipes.push(dayWithFood);

                    if (counter == 5) {
                      console.log(daysWithRecipes);

                      let allIngredients = [];
                      mealPrep.days = daysWithRecipes;
                      daysWithRecipes.forEach(day => {
                        allIngredients.push(day.ingredients);
                      });

                      mealPrep.shoppingList = combineIngredients(
                        allIngredients
                      );

                      localStorage.mealPrep = JSON.stringify(mealPrep); // Create a localStorage object based on the mealPrep object

                      console.log(mealPrep); // Check work
                      console.log(localStorage); // Check work
                      createListingPage();
                      loadPage(listingPage);
                    }
                  });
              });
          });
        // query the API to get the ingredients for that food

        // query the API to get the recipe for that food
        return dayWithFood;
      };
      let daysWithRecipes = [];
      // Loop through the days array, calling that function for each day
      let counter = 0;
      console.log(days);
      days.forEach(day => {
        setTimeout(recommendRecipe(day), counter * 1000);
      });
    });
}

searchButton.addEventListener("click", fetchWeatherInfo);
searchField.addEventListener("keyup", event => {
  if (event.keyCode === 13) fetchWeatherInfo();
});

// Check localstorage to see if existing plan exists, if so put it in main

// If no localstorage, use the main page
if (!localStorage.mealPrep) {
  loadPage(homepage);
} else {
  createListingPage();
  loadPage(listingPage);
}
