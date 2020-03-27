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
  
  
