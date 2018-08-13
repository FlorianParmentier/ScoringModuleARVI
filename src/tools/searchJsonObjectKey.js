const math = require('mathjs');

/**
 This function search a key in a json Object
 params :
       - jsonObject: object in which the function will search
       - searchedKeys: list of keys to find the searched object.
  
 The function will start by searching last key given, then two last, etc.
 It stop to search when it can return a value. If there are two occurence for a key, the function can not return anything and try with one more key
  
 Return found value or 'undefined' if no unique value is found
  
 Exemples :
 person = {
    firstName: 'John',
    lastName: 'Doe',
    mother: {
        firstName: 'Jane',
        lastName: 'Doe',
    }
 }

 searchJsonObjectKey(person, ["firstName"]) //Will return 'undefined' because object have two "firstName" keys
 searchJsonObjectKey(person, ["mother", "firstName"]) //Will return 'Jane'
 searchJsonObjectKey(person, ["anotherField", "mother", "firstName"]) //Will return 'Jane' because the function can find an unique value only with two last keys
 */
module.exports = searchJsonObjectKey = (jsonObject, searchedKeys) => {
    let i = 0;
    //At each loop, function will use one more key, strating from the last key given
    while (i < searchedKeys.length) {
        let keys = searchedKeys.slice(searchedKeys.length - 1 - i);

        //This function search key inside the object using recursivity
        searchObjectKey = (jsonObject, keys) => {
            let keyOccurence = 0;
            let value = 'undefined';

            let j = 0;
            let notFound = false;
            let object = Object.assign(jsonObject);
            //Check if the current object got the search key...
            while (j < keys.length && !notFound) {
                if (object.hasOwnProperty(keys[j])) {
                    object = object[keys[j]];
                    j++;
                }
                else {
                    notFound = true;
                }
            }
            //... if it has, save the value...
            if (!notFound) {
                value = object;
                keyOccurence++;
            }
            //... then search in childs objects...
            let objectKeys = Object.keys(jsonObject);
            for (let k = 0; k < objectKeys.length; k++) {
                if (math.typeof(jsonObject[objectKeys[k]]) === 'Object') {
                    const result = searchObjectKey(jsonObject[objectKeys[k]], keys);
                    if (result[1] > 0) {
                        value = result[0];
                        keyOccurence += result[1];
                    }
                }
            }

            return [keyOccurence >= 2 ? 'undefined' : value, keyOccurence]
        }

        const result = searchObjectKey(jsonObject, keys)
        //... and continue until a unique value is found
        if (result[1] === 1) {
            return result[0];
        }
        i++;
    }
}
