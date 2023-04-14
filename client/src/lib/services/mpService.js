import axios from "axios";

const url = "https://toksho-comics.onrender.com/preference";

class mpService {
  // Get preference ID
  static getPreference() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url);
        const data = res.data;
        resolve(data);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  // Create preference
  static createPreference(preference) {
    axios.post(url, preference);
  }
}

export default mpService;
