import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as userApi from "@/apis/userApi";
import { RootState } from "@/services/redux/store";
import {
  setUser,
  updateUser,
  logout as logoutAction,
} from "@/services/redux/userSlice";

// Types for better type safety
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "restaurant_owner";
  avatar?: string;
  isVerified?: boolean;
}

// Main Authentication Hook
export const useAuth = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<
    "customer" | "restaurant_owner" | null
  >(null);
  const [userData, setUserData] = useState<User | null>(null);

  // Auth state getters
  const isLogin = Boolean(userState.token && userState.userId);
  const userId = userState.userId;
  const token = userState.token;
  const isCustomer = userRole === "customer";
  const isRestaurantOwner = userRole === "restaurant_owner";

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Login function
  const login = useCallback(
    async (loginData: LoginData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userApi.loginUser(loginData);

        if (!response.success) {
          throw new Error(response.message || "Login failed");
        }

        const { user, token } = response.data;

        // Save to AsyncStorage
        await AsyncStorage.multiSet([
          ["userToken", token],
          ["userId", user.id],
          ["userRole", user.role],
          ["userData", JSON.stringify(user)],
        ]);

        // Update Redux store
        dispatch(
          setUser({
            userId: user.id,
            token,
            image: user.avatar || null,
          })
        );

        // Store additional user data in component state
        setUserRole(user.role);
        setUserData(user);

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);

        // Clear Redux state on login error
        dispatch(logoutAction());

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  // Register Customer
  const registerCustomer = useCallback(async (registerData: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.registerCustomer(registerData);

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register Restaurant Owner
  const registerRestaurantOwner = useCallback(
    async (registerData: RegisterData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userApi.registerRestaurantOwner(registerData);

        if (!response.success) {
          throw new Error(response.message || "Registration failed");
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        "userToken",
        "userId",
        "userRole",
        "userData",
      ]);

      // Clear Redux store
      dispatch(logoutAction());

      // Clear component state
      setUserRole(null);
      setUserData(null);

      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Check authentication status on app start
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);

      const [token, userId, role, userData] = await AsyncStorage.multiGet([
        "userToken",
        "userId",
        "userRole",
        "userData",
      ]);

      if (token[1] && userId[1] && role[1]) {
        let user = null;

        // Try to parse stored user data
        if (userData[1]) {
          try {
            user = JSON.parse(userData[1]);
          } catch (parseError) {
            console.warn("Failed to parse stored user data");
          }
        }

        // If no stored user data, fetch from API
        if (!user) {
          try {
            const response = await userApi.getCustomerInfo(userId[1]);
            user = response.data;
          } catch (fetchError) {
            console.warn("Failed to fetch user data on auth check");
            // Don't throw here, continue with basic auth info
            user = {
              id: userId[1],
              role: role[1],
            };
          }
        }

        // Update Redux store
        dispatch(
          setUser({
            userId: userId[1],
            token: token[1],
            image: user?.avatar || null,
          })
        );

        // Update component state
        setUserRole(role[1] as "customer" | "restaurant_owner");
        setUserData(user);
      } else {
        // No auth data found, clear auth state
        dispatch(logoutAction());
        setUserRole(null);
        setUserData(null);
      }
    } catch (err) {
      console.error("Auth check error:", err);
      dispatch({
        type: "auth/clearAuth",
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Change password
  const changePassword = useCallback(
    async (passwordData: ChangePasswordData) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await userApi.changePassword({
          userId,
          ...passwordData,
        });

        if (!response.success) {
          throw new Error(response.message || "Password change failed");
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Password change failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!userId) return null;

    setLoading(true);
    try {
      const response = await userApi.getCustomerInfo(userId);
      const updatedUser = response.data;

      // Update AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

      // Update Redux store
      dispatch(
        updateUser({
          image: updatedUser.avatar || null,
        })
      );

      // Update component state
      setUserData(updatedUser);

      return updatedUser;
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      setError("Failed to refresh user data");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

  // Update usage time
  const updateUsageTime = useCallback(
    async (usageTime: number) => {
      if (!userId) return;

      try {
        await userApi.setUsageTime({
          userId,
          usageTime,
        });
      } catch (err) {
        console.error("Failed to update usage time:", err);
        // Don't throw error for usage time updates
      }
    },
    [userId]
  );

  // Auto-check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    // Auth State
    isLogin,
    isAuthenticated: isLogin,
    isCustomer,
    isRestaurantOwner,
    user: userData,
    userId,
    token,
    loading,
    error,

    // Auth Actions
    login,
    logout,
    registerCustomer,
    registerRestaurantOwner,
    changePassword,
    checkAuthStatus,
    refreshUser,
    updateUsageTime,
    clearError,
  };
};

// User Profile Management Hook
export const useUserProfile = () => {
  const { user, userId, isLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [points, setPoints] = useState(0);

  // Get customer detailed info
  const getCustomerInfo = useCallback(
    async (targetUserId?: string) => {
      const id = targetUserId || userId;
      if (!id) {
        throw new Error("User ID is required");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await userApi.getCustomerInfo(id);

        if (!response.success) {
          throw new Error(response.message || "Failed to get user info");
        }

        setCustomerInfo(response.data);
        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get user info";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Edit customer info
  const editCustomerInfo = useCallback(
    async (formData: FormData) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await userApi.editCustomerInfo({
          userId,
          formData,
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to update profile");
        }

        // Refresh customer info after successful edit
        await getCustomerInfo();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, getCustomerInfo]
  );

  // Get user points
  const getUserPoints = useCallback(async () => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await userApi.getPoint(userId);

      if (!response.success) {
        throw new Error(response.message || "Failed to get points");
      }

      setPoints(response.data.points || 0);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get points";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Auto-load customer info when user is authenticated
  useEffect(() => {
    if (isLogin && userId) {
      getCustomerInfo();
      getUserPoints();
    }
  }, [isLogin, userId, getCustomerInfo, getUserPoints]);

  return {
    customerInfo,
    points,
    loading,
    error,
    getCustomerInfo,
    editCustomerInfo,
    getUserPoints,
  };
};

// Address Management Hook
export const useAddress = () => {
  const { userId, isLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<string[]>([]);

  // Get addresses
  const getAddresses = useCallback(async () => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await userApi.getAddresses(userId);

      if (!response.success) {
        throw new Error(response.message || "Failed to get addresses");
      }

      setAddresses(response.data || []);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get addresses";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add address
  const addAddress = useCallback(
    async (address: string) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await userApi.addAddress({
          userId,
          address,
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to add address");
        }

        // Refresh addresses after successful add
        await getAddresses();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add address";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, getAddresses]
  );

  // Edit address
  const editAddress = useCallback(
    async (prevAddress: string, newAddress: string) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await userApi.editAddress({
          userId,
          prevAddress,
          newAddress,
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to edit address");
        }

        // Refresh addresses after successful edit
        await getAddresses();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to edit address";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, getAddresses]
  );

  // Delete address
  const deleteAddress = useCallback(
    async (address: string) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await userApi.deleteAddress({
          userId,
          address,
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to delete address");
        }

        // Refresh addresses after successful delete
        await getAddresses();
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete address";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, getAddresses]
  );

  // Auto-load addresses when user is authenticated
  useEffect(() => {
    if (isLogin && userId) {
      getAddresses();
    }
  }, [isLogin, userId, getAddresses]);

  return {
    addresses,
    loading,
    error,
    getAddresses,
    addAddress,
    editAddress,
    deleteAddress,
  };
};

// SMS Verification Hook
export const useSmsVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send verification code
  const sendVerificationCode = useCallback(
    async (id: string, phone: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userApi.sendVerificationCode({ id, phone });

        if (!response.success) {
          throw new Error(
            response.message || "Failed to send verification code"
          );
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send code";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Check verification code
  const checkCode = useCallback(async (id: string, code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.checkCode({ id, code });

      if (!response.success) {
        throw new Error(response.message || "Invalid verification code");
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid code";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check code without deleting (for verification display)
  const checkCodeNoDelete = useCallback(async (id: string, code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.checkCodeNoDeleteCode({ id, code });

      if (!response.success) {
        throw new Error(response.message || "Invalid verification code");
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid code";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send code by phone (for password reset)
  const sendCodeByPhone = useCallback(async (phone: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.sendCodeByPhone({ phone });

      if (!response.success) {
        throw new Error(response.message || "Failed to send code");
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send code";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(
    async (resetData: {
      id: string;
      code: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userApi.resetPassword(resetData);

        if (!response.success) {
          throw new Error(response.message || "Password reset failed");
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Password reset failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    sendVerificationCode,
    checkCode,
    checkCodeNoDelete,
    sendCodeByPhone,
    resetPassword,
  };
};
