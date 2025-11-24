import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Logo } from "./components/Logo";
import { NameFields } from "./components/NameFields";
import { EmailField } from "./components/EmailField";
import { PasswordField } from "./components/PasswordField";
import { ConfirmPasswordField } from "./components/ConfirmPasswordField";
import { PasswordRequirements } from "./components/PasswordRequirements";
import { RegisterActions } from "./components/RegisterActions";
import { DashboardPreview } from "./components/DashboardPreview";

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isLoading,
    isLoaded,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    watchedPassword,
    passwordRequirements,
  } = useRegisterForm();

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden">
      <section className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center bg-white">
        <div className="max-w-lg mx-auto w-full px-4 sm:px-0 min-h-screen">
          <Logo />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <NameFields register={register} errors={errors} />
            <EmailField register={register} errors={errors} />
            
            <div className="space-y-2">
              <PasswordField
                register={register}
                errors={errors}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              {watchedPassword && (
                <PasswordRequirements passwordRequirements={passwordRequirements} />
              )}
            </div>

            <ConfirmPasswordField
              register={register}
              errors={errors}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />

            <RegisterActions
              isValid={isValid}
              isLoading={isLoading}
              isLoaded={isLoaded}
            />
          </form>
        </div>
      </section>

      <DashboardPreview />
    </main>
  );
}

