import axios from "axios";

const url = `${import.meta.env.VITE_API_BACK_URL}/preference`;

class mpService {
  static getPreference() {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((res) => {
          const data = res.data;
          resolve(data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  static createPreference(preference) {
    axios.post(url, preference);
  }
}

export default mpService;
