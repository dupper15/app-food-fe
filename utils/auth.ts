import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  _id: string;
}

export const getUserIdFromToken = (
  accessToken: string | null
): string | null => {
  try {
    if (!accessToken) return null;

    const decoded = jwtDecode<CustomJwtPayload>(accessToken);

    return decoded._id || null;
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return null;
  }
};
