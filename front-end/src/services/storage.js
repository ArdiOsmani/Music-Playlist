const storageService = {

    set(key, value) {
      try {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
      } catch (error) {
        console.error("Error saving to storage", error);
      }
    },
  

    get(key) {
      try {
        const jsonValue = localStorage.getItem(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
      } catch (error) {
        console.error("Error reading from storage", error);
        return null;
      }
    },
  

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing from storage", error);
      }
    },
  

    clear() {
      try {
        localStorage.clear();
      } catch (error) {
        console.error("Error clearing storage", error);
      }
    },
  

    setUserData(data) {
      this.set("userData", data);
    },
  
    getUserData() {
      return this.get("userData");
    },
  
    removeUserData() {
      this.remove("userData");
    },
  

    setUserToken(token) {
      this.set("userToken", token);
    },
  
    getUserToken() {
      return this.get("userToken");
    },
  
    removeUserToken() {
      this.remove("userToken");
    },
  };
  
  export default storageService;
  