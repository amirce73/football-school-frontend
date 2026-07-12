import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "../api";

export interface User {
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  birthDate?: string;
  fatherName?: string;
  gender?: string;
  height?: number;
  weight?: number;
  birthCertificateNo?: string;
  bloodGroup?: string;
  healthStatus?: string;
  maritalStatus?: string;
  militaryServiceStatus?: string;
  religion?: string;
  occupation?: string;
  description?: string;
  contact?: {
    mobile?: string;
    guardianMobile?: string;
    tel?: string;
    postalCode?: string;
    address?: string;
    emergencyPhone?: string;
    email?: string;
    telegram?: string;
    instagram?: string;
    linkedIn?: string;
    facebook?: string;
    website?: string;
    parentsWorkAddress?: string;
  };
  passport?: {
    passportNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    englishName?: string;
    englishSurname?: string;
    description?: string;
  };
  sports?: {
    mainPosition?: string;
    preferredFoot?: string;
    hasNationalTeam?: boolean;
    competitionSeason?: string;
    playingAbility?: string;
    sportsInsuranceNumber?: string;
    shirtSize?: string;
    shortsSize?: string;
    footballShoeSize?: string;
    slipperSize?: string;
    sportsWarmerSize?: string;
    sportsSlogan?: string;
    description?: string;
  };
  club?: {
    clubName?: string;
    shirtNumber?: number;
    ageCategory?: string;
    contractStart?: string;
  };
  isIdentityVerified?: boolean;
  isBankVerified?: boolean;
  isPostalVerified?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  panelType: 'club' | 'school' | null;
  setPanelType: (type: 'club' | 'school' | null) => void;
  login: (newToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  simulateVerification: (type: 'identity' | 'bank' | 'postal', data: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [panelType, setPanelTypeState] = useState<'club' | 'school' | null>(() => {
    return (localStorage.getItem('panelType') as 'club' | 'school' | null) || null;
  });

  const setPanelType = (type: 'club' | 'school' | null) => {
    if (type) {
      localStorage.setItem('panelType', type);
    } else {
      localStorage.removeItem('panelType');
    }
    setPanelTypeState(type);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('panelType');
    setUser(null);
    setPanelTypeState(null);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const simulateVerification = (type: 'identity' | 'bank' | 'postal', data: any) => {
    if (!user) return;
    const updatedUser = { ...user };
    if (type === 'identity') {
      updatedUser.isIdentityVerified = true;
      updatedUser.firstName = data.firstName;
      updatedUser.lastName = data.lastName;
      updatedUser.birthDate = data.birthDate;
      updatedUser.nationalId = data.nationalId;
      updatedUser.fatherName = data.fatherName;
      updatedUser.birthCertificateNo = data.birthCertificateNo;
    } else if (type === 'bank') {
      updatedUser.isBankVerified = true;
      updatedUser.bankDetails = data;
    } else if (type === 'postal') {
      updatedUser.isPostalVerified = true;
      if (!updatedUser.contact) updatedUser.contact = {};
      updatedUser.contact.postalCode = data.postalCode;
      updatedUser.contact.address = data.address;
    }
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, panelType, setPanelType, login, logout, refreshUser, simulateVerification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
