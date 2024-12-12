import { LoginBody, LoginResponse, loginResponseSchema, registerBodySchema, RegisterResponse, registerResponseSchema } from "@/schemas/responses";

const backendUrl = process.env.EXPO_PUBLIC_API_URL as string;

const getToken = async (email: string) => {
  try {
    const response = await fetch(`${backendUrl}/api/user/send-reset-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    // setToast("Error getting profile data", true, 3000);
  }
};

const fetchLogin = async ({ username, password }: LoginBody) => {
  try {
    console.log("fetchLogin",`${backendUrl}/auth/login` );
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error as any);
    }

    loginResponseSchema.parse(data); 
    return data;
  } catch (error) {
    console.error("Error validating login response:", error);
    throw new Error("Invalid login response");
  }
};

const getProfileData = async (
  _id: string,
  token: string,
  setMockData: any,
  setToast: any
) => {
  try {
    const response = await fetch(`${backendUrl}/api/user/${_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log({ data });
    setMockData(data.data);
  } catch (error) {
    console.error(error);
    setToast("Error getting profile data", true, 3000);
  }
};

const updateProfileData = async (data: any, token: string, setToast: any) => {
  try {
    const response = await fetch(`${backendUrl}/api/user/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    console.log({ res });
    setToast("Profile updated successfully", false, 3000);
  } catch (error) {
    console.error(error);
    setToast("Error updating profile data", true, 3000);
  }
};

const getMatchData = async (
  token: string,
  setMatchData: any,
  page: number,
  setToast: any
) => {
  try {
    const response = await fetch(`${backendUrl}/match/get/${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log({ data });
    setMatchData(data.data);
  } catch (error) {
    console.error(error);
    setToast("Error getting match data", true, 3000);
  }
};

const postLike = async (data: any, token: string, setToast: any) => {
  try {
    const response = await fetch(`${backendUrl}/api/match/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    console.log({ res });
    setToast("Liked", false, 3000);
  } catch (error) {
    console.error(error);
    setToast("Error liking", true, 3000);
  }
};

const getChats = async (token: string, setChats: any, setToast: any) => {
  try {
    const response = await fetch(`${backendUrl}/api/chat`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log({ data });
    setChats(data.data);
  } catch (error) {
    console.error(error);
    setToast("Error getting chat data", true, 3000);
  }
};

const postMessage = async (data: any, token: string, setToast: any) => {
  try {
    const response = await fetch(`${backendUrl}/api/chat/message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    console.log({ res });
    setToast("Message sent", false, 3000);
  } catch (error) {
    console.error(error);
    setToast("Error sending message", true, 3000);
  }
};

const getMessage = async (
  chatId: string,
  token: string,
  setMessages: any,
  setToast: any
) => {
  try {
    const response = await fetch(`${backendUrl}/api/chat/message/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log({ data });
    setMessages(data.data);
  } catch (error) {
    console.error(error);
    setToast("Error getting message data", true, 3000);
  }
};

const fetchRegister = async (data: any) => {
  try {
    const response = await fetch(`${backendUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(data),
    });

    const res:RegisterResponse = await response.json();
    if (!response.ok) {
      console.log("Error eeeeeregistering", (res as any).error);
      throw new Error((res as any).error);
    }
    registerResponseSchema.parse(res);
    console.log({ res });
    return res;
  } catch (e) {
    return {success:false , error:(e as Error).message};
  }
};

export {
  getMatchData,
  postLike,
  getChats,
  postMessage,
  getMessage,
  getToken,
  getProfileData,
  updateProfileData,
  fetchLogin,
  fetchRegister,
};
