import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Member {
  id: number; 
  name: string;
  phone_number: string;
  profile_picture: string | number;
  email: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  address: string;
  joining_date:string;
  notes: string;
  plan_name: string;
  plan_amount: number;
  plan_duration: string;
  plan_duration_days: string;
  full_name: string;
  phone:string;
  referral:string;
  chance_of_joining: string;
  followup_date:string;
}

interface MemberContextType {
  member: Member[];
  setMember: React.Dispatch<React.SetStateAction<Member[]>>;
  removeMember: (id: number) => void; 
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<Member[]>([]); // Store a list of members

  const removeMember = (id: number) => {
    setMember((prevMembers) => prevMembers.filter((member) => member.id !== id));
  };

  return (
    <MemberContext.Provider value={{ member, setMember, removeMember }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = (): MemberContextType => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
};
