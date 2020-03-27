// function commbineFood() {
//   let arr = [
//     [
//       { name: "baby spinach", qty: 709, unit: "ml" },
//       { name: "butter", qty: 3, unit: "Tbsps" },
//       { name: "carrots", qty: 118, unit: "ml" },
//       { name: "celery", qty: 118, unit: "ml" },
//       { name: "chicken broth", qty: 946, unit: "ml" },
//       { name: "chicken meat", qty: 473, unit: "ml" },
//       { name: "coarse salt", qty: 6, unit: "servings" },
//       { name: "flour", qty: 78, unit: "ml" },
//       { name: "fresh basil", qty: 1, unit: "Tbsp" },
//       { name: "garlic", qty: 4, unit: "cloves" },
//       { name: "olive oil", qty: 2, unit: "Tbsps" },
//       { name: "onion", qty: 177, unit: "ml" },
//       { name: "potato gnocchi", qty: 453, unit: "g" },
//       { name: "romano", qty: 6, unit: "servings" }
//     ],

//     [
//       { name: "baby peas", qty: 236, unit: "ml" },
//       { name: "butter", qty: 1, unit: "Tbsp" },
//       { name: "cheese", qty: 236, unit: "ml" },
//       { name: "diced ham", qty: 340, unit: "g" },
//       { name: "heavy cream", qty: 59, unit: "ml" },
//       { name: "low sodium chicken broth", qty: 236, unit: "ml" },
//       { name: "onion", qty: 473, unit: "ml" },
//       { name: "salt and pepper", qty: 4, unit: "servings" },
//       { name: "tortellini", qty: 255, unit: "g" }
//     ],

//     [
//       { name: "canned tomatoes", qty: 411, unit: "g" },
//       { name: "cooked chicken breast", qty: 236, unit: "ml" },
//       { name: "escarole", qty: 473, unit: "ml" },
//       { name: "fat-free less-sodium chicken broth", qty: 396, unit: "g" },
//       { name: "olive oil", qty: 2, unit: "tsps" }
//     ],

//     [
//       { name: "canned tomatoes", qty: 793, unit: "g" },
//       { name: "chili powder", qty: 1, unit: "tsp" },
//       { name: "cilantro", qty: 59, unit: "ml" },
//       { name: "fat-free chicken broth", qty: 709, unit: "ml" },
//       { name: "garlic cloves", qty: 2, unit: "" },
//       { name: "green chilies", qty: 113, unit: "g" },
//       { name: "green onions", qty: 2, unit: "" },
//       { name: "lime", qty: 1, unit: "" },
//       { name: "lowfat shredded mozzarella cheese", qty: 28, unit: "g" },
//       { name: "skinless boneless chicken breasts", qty: 226, unit: "g" },
//       { name: "whole kernel corn", qty: 432, unit: "g" }
//     ],

//     [
//       { name: "blue cheese", qty: 118, unit: "ml" },
//       { name: "buffalo wing sauce", qty: 177, unit: "ml" },
//       { name: "celery", qty: 2, unit: "stalks" },
//       { name: "dry mustard", qty: 2, unit: "tsps" },
//       { name: "elbow macaroni", qty: 453, unit: "g" },
//       { name: "flour", qty: 2, unit: "Tbsps" },
//       { name: "fresh parsley", qty: 2, unit: "Tbsps" },
//       { name: "garlic", qty: 2, unit: "cloves" },
//       { name: "half n half", qty: 591, unit: "ml" },
//       { name: "onion", qty: 1, unit: "small" },
//       { name: "panko breadcrumbs", qty: 236, unit: "ml" },
//       { name: "pepper jack cheese", qty: 473, unit: "ml" },
//       { name: "rotisserie chicken", qty: 709, unit: "ml" },
//       { name: "sharp cheddar cheese", qty: 453, unit: "g" },
//       { name: "sour cream", qty: 157, unit: "ml" },
//       { name: "unsalted butter", qty: 7, unit: "Tbsps" }
//     ]
//   ];
//   combinedIngQty(arr);
// }

function combinedIngQty(fivedays) {

    //seperate 5 days in to each day array,(day1[],) day2, day3 day 4 and day5
    // scan through each item in first with other days sum and move it up.
    let combinedarray = [];
    let dayonearray = [];
    let daytwoarray = [];
    let daythreearray = [];
    let dayfourarray = [];
    let dayfivearray = [];
  
    dayonearray = fivedays[0];
    daytwoarray = fivedays[1];
    daythreearray = fivedays[2];
    dayfourarray = fivedays[3];
    dayfivearray = fivedays[4];
  
    function merge(dayonearray, daytwoarray, daythreearray, dayfourarray, dayfivearray) {
  
      // Merge the arrays, and set up an output array.
      let merged = [...dayonearray, ...daytwoarray, ...daythreearray, ...dayfourarray, ...dayfivearray];
      let out = [];
      // Loop over the merged array
      for (let obj of merged) {
  
        // Destructure the object in the current iteration to get
        // its id and quantity values
        let { name, qty, unit } = obj;
  
        // Find the object in out that has the same id
        let found = out.find(obj => obj.name === name && obj.unit === unit);
  
        // If an object *is* found add this object's quantity to it...
        if (found) {
          found.qty += qty;
          
          // ...otherwise push a copy of the object to out
        } else {
          out.push({ ...obj });
        }
      }
      return out;
      console.log(out)
    }
    console.log(merge(dayonearray, daytwoarray, daythreearray, dayfourarray, dayfivearray));
  
  }
  
  