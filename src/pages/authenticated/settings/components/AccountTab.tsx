import { ProfileCard } from "./ProfileCard";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { AddressForm } from "./AddressForm";
import { PasswordForm } from "./PasswordForm";

// Mock data for the account tab
const MOCK_USER = {
  firstName: "João",
  lastName: "Silva",
  email: "joao.silva@email.com",
  birthDate: "1990-03-15",
  phone: "(11) 98765-4321",
  location: "São Paulo, Brasil",
  avatarUrl: undefined,
};

const MOCK_ADDRESS = {
  country: "Brasil",
  city: "São Paulo",
  postalCode: "01310-100",
};

export const AccountTab = () => {
  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <ProfileCard
        firstName={MOCK_USER.firstName}
        lastName={MOCK_USER.lastName}
        email={MOCK_USER.email}
        location={MOCK_USER.location}
        avatarUrl={MOCK_USER.avatarUrl}
      />

      <PersonalInfoForm
        defaultValues={{
          firstName: MOCK_USER.firstName,
          lastName: MOCK_USER.lastName,
          birthDate: MOCK_USER.birthDate,
          phone: MOCK_USER.phone,
          email: MOCK_USER.email,
        }}
      />

      <PasswordForm />

      <AddressForm defaultValues={MOCK_ADDRESS} />
    </div>
  );
};
