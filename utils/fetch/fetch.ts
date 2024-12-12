import {
  LoginBody,
  LoginResponse,
  loginResponseSchema,
  registerBodySchema,
  RegisterResponse,
  registerResponseSchema,
} from "@/schemas/responses";
import { string } from "zod";

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

    const data: LoginResponse = await response.json();
    if (!response.ok) {
      throw new Error((data as any).error as any);
    }
    console.log(JSON.stringify(data, null, 2));
    
    loginResponseSchema.parse(data);

    return data;
  } catch (error) {
    console.log(error);
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

interface ProfileData {
  full_name: string;
  bio: string;
  gender: string;
  birthdate: Date | null;
  country: string;
  photos: string[];
}

const updateProfileData = async (
  { full_name, bio, gender, birthdate, country, photos }: ProfileData,
  token: string
) => {
  try {
    const body= JSON.stringify({
      full_name: full_name,
      bio: bio,
      gender: gender,
      birthdate: birthdate?.toString(),
      country: country,
      photos: photos,
    })

    const response = await fetch(`${backendUrl}/user/info`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "Application/json",
      },
      body
    });
    console.log(body);

    const res = await response.json();
  } catch (error) {
    console.log(error);
  }
};



const postLike = async (token: string, target: any) => {
  try {
    const response = await fetch(`${backendUrl}/match/like`, {
      method: "POST",
      headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "Application/json"
      },
      body: JSON.stringify({
          target: target
      })
  });

    const res = await response.json();
    console.log({ res });
  } catch (error) {
    console.error(error);
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

    const res: RegisterResponse = await response.json();
    if (!response.ok) {
      console.log("Error eeeeeregistering", (res as any).error);
      throw new Error((res as any).error);
    }
    registerResponseSchema.parse(res);
    console.log({ res });
    return res;
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
};

interface MatchData {
  success: boolean;
  data: {
    next: null| string ;
    people: {
      id: string;
      name: string;
      imageUrl: string;
       
    }[];
  }
}
const getMatchData = async ( token: string, page: number= 1) => {
  console.log("token", token);
  try {
    const response = await fetch(`${backendUrl}/match/get/${page}`, {
      headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "Application/json"
      },
  });
    const data: MatchData = await response.json();
    console.log(JSON.stringify( data, null, 2) );
    
    return data;
  } catch (error) {
    console.error(error);
    return { success: false,    data: {
      next: null,
      people: [{
        id: "",
        name: "",
        imageUrl: "",
         
      }]
    } };
  }
}



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
