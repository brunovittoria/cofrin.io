import { useLoginForm } from "@/hooks/useLoginForm";
import { Logo } from "./components/Logo";
import { EmailField } from "./components/EmailField";
import { PasswordField } from "./components/PasswordField";
import { LoginActions } from "./components/LoginActions";
import { DashboardPreview } from "./components/DashboardPreview";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isLoading,
    isLoaded,
  } = useLoginForm();

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden">
      <section className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center bg-white">
        <div className="max-w-lg mx-auto w-full px-4 sm:px-0 min-h-screen">
          <Logo />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <EmailField register={register} errors={errors} />
            <PasswordField register={register} errors={errors} />
            <LoginActions
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
