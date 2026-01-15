import { Camera, Edit2, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  avatarUrl?: string;
}

export const ProfileCard = ({
  firstName,
  lastName,
  email,
  location,
  avatarUrl,
}: ProfileCardProps) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const handleEditProfile = () => {
    // Mock: Would open edit profile modal
    console.log("Edit profile clicked");
  };

  const handleChangePhoto = () => {
    // Mock: Would open file picker
    console.log("Change photo clicked");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />}
              <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={handleChangePhoto}
              className="absolute bottom-0 right-0 rounded-full border border-border bg-background p-1.5 shadow-md transition-colors hover:text-primary"
              aria-label="Alterar foto de perfil"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleChangePhoto()}
            >
              <Camera className="h-3 w-3" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-foreground">
              {firstName} {lastName}
            </h2>
            <div className="mt-1 flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> {email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {location}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleEditProfile}
            className="gap-2"
          >
            <Edit2 className="h-3 w-3" />
            Editar Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
