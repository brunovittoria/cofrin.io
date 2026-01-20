import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountTab, SubscriptionTab } from "./components";
import { useSettingsStore } from "@/stores";

export const SettingsPage = () => {
  const activeTab = useSettingsStore((state) => state.activeTab);
  const setActiveTab = useSettingsStore((state) => state.setActiveTab);
  
  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Configurações
        </h1>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "account" | "subscription")} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <AccountTab />
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <SubscriptionTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
