import axios from 'axios';

class Webservice {
  constructor() {}

  __config() {
      const token = 'no_token'; // localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    return config;
  }

  async get(uri: string) {
    try {
      const config = this.__config();
      const value = await axios.get(uri, config).then((res) => {
        return res.data;
      });
      return value;
    } catch (error) {
      throw error;
    }
  }

  async post(uri: string, content: any) {
    try {
      const config = this.__config();
      const value = await axios.post(uri, content, config).then((res) => {
        return res.data;
      });
      return value;
    } catch (error) {
      throw error;
    }
  }

  async put(uri: string, content: any) {
    try {
      const config = this.__config();
      const value = await axios.put(uri, content, config).then((res) => {
        return res.data;
      });
      return value;
    } catch (error) {
      throw error;
    }
  }

  async patch(uri: string, content: any) {
    try {
      const config = this.__config();
      const value = await axios.patch(uri, content, config).then((res) => {
        return res.data;
      });
      return value;
    } catch (error) {
      throw error;
    }
  }

  async delete(uri: string) {
    try {
      const config = this.__config();
      const value = await axios.delete(uri, config).then((res) => {
        return res.data;
      });
      return value;
    } catch (error) {
      throw error;
    }
  }
}

export default Webservice;
