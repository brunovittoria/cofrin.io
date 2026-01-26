import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIn } from "@/hooks/api/useCheckIns";
import { formatCurrency, formatDate, moodOptions } from "@/lib/goalUtils";

interface GoalHistoryProps {
  checkIns: CheckIn[];
}

export const GoalHistory = ({ checkIns }: GoalHistoryProps) => {
  if (checkIns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Evolução</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Nenhum check-in registrado ainda. Faça seu primeiro check-in para acompanhar
            seu progresso!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Histórico de Evolução</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checkIns.map((checkIn, index) => {
            const mood = moodOptions.find((m) => m.value === checkIn.mood);

            return (
              <div
                key={checkIn.id}
                className={`flex items-center justify-between py-3 ${
                  index < checkIns.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    {mood ? (
                      <span className="text-lg">{mood.emoji}</span>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {checkIn.note || "Check-in realizado"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(checkIn.date)}
                    </p>
                  </div>
                </div>
                {checkIn.added_value > 0 && (
                  <span className="font-medium text-green-600">
                    + {formatCurrency(checkIn.added_value)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
