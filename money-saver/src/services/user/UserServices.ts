import { API_ENDPOINTS, apiRequest } from "@/lib/api";

export function UserServices() {

  const registerUser = async (registerUserPayload: any) => {
    

    console.log(registerUserPayload);

    try {
      const response = await apiRequest(API_ENDPOINTS.REGISTER_USER, {
        method: "POST",
        body: JSON.stringify(registerUserPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      
      // return the response data
      return data;
    } catch (error) {
      console.error("Error registering user:", error);
    } 

    const loginUserPaylod = {
      email: registerUserPayload.email,
      password: registerUserPayload.password,
    }

    loginUser(loginUserPaylod)

  };

  const loginUser = async (loginUserPayload: any) => {
    console.log(loginUserPayload);

    try {
      const response = await apiRequest(API_ENDPOINTS.LOGIN_USER, {
        method: "POST",
        body: JSON.stringify(loginUserPayload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };

  return {
    registerUser,
    loginUser,
  };
};    