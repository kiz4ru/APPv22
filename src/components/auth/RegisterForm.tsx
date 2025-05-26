// filepath: [RegisterForm.tsx](http://_vscodecontentref_/0)
import { useState } from 'react';
//import { useTranslation } from 'react-i18next';
import { RegisterStep1 } from './steps/RegisterStep1';
import { RegisterStep2 } from './steps/RegisterStep2';
import { RegisterStep3 } from './steps/RegisterStep3';

interface RegisterFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
  loading?: boolean;
}

export function RegisterForm({ onSubmit, onBack, loading = false }: RegisterFormProps) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<any>({
    name: '',
    email: '',
    password: '',
    age: '',
    preferences: {
      cleanliness: 3,
      noise: 3,
      schedule: 'flexible',
      smoking: false,
      pets: false,
    },
    // ...otros campos de los siguientes pasos
  });

  const handleUpdate = (data: any) => {
    setUserData((prev: any) => ({
      ...prev,
      ...data,
      preferences: {
        ...prev.preferences,
        ...(data.preferences || {}),
      },
    }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleFinalSubmit = () => {
    onSubmit(userData);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {step === 1 && (
        <RegisterStep1
          userData={userData}
          onUpdate={handleUpdate}
          onNext={handleNext}
          onBack={onBack}
        />
      )}
      {step === 2 && (
        <RegisterStep2
          userData={userData}
          onUpdate={handleUpdate}
          onNext={handleNext}
          onBack={handlePrev}
        />
      )}
      {step === 3 && (
        <RegisterStep3
          userData={userData}
          onUpdate={handleUpdate}
          onSubmit={handleFinalSubmit}
          onBack={handlePrev}
          loading={loading}
        />
      )}
    </div>
  );
}