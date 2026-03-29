import { useParams } from "wouter";
import { useGetPet, PetStatus } from "@workspace/api-client-react";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import { Loader2, PawPrint, Hash, User, Phone, Mail, Syringe, ClipboardList, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PetProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: pet, isLoading, isError } = useGetPet(id);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !pet) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-muted-foreground">
        <PawPrint className="w-16 h-16 mb-4 opacity-20" />
        <h2 className="text-2xl font-bold text-foreground">Pet Not Found</h2>
        <p>The pet profile you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const isVerified = pet.status === PetStatus.Verified;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Header Profile Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
        {/* Background decorative blob */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${isVerified ? 'bg-green-500' : 'bg-primary'}`} />

        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-8 border-white shadow-xl overflow-hidden shrink-0 bg-muted relative z-10">
          {pet.photoUrl ? (
            <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
              <PawPrint className="w-20 h-20" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-2">{pet.name}</h1>
              <p className="text-lg text-muted-foreground">{pet.species} • {pet.breed}</p>
            </div>
            <StatusBadge status={pet.status} className="scale-110 md:scale-100 origin-center md:origin-right" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/50">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Age</p>
              <p className="font-semibold text-lg">{pet.age} Years</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Gender</p>
              <p className="font-semibold text-lg">{pet.gender}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Pet ID</p>
              <p className="font-mono font-semibold text-lg bg-muted/50 px-2 py-0.5 rounded inline-block">{pet.petId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Owner & Details */}
        <div className="space-y-8">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" /> Owner Information
            </h3>
            {pet.owner ? (
              <div className="space-y-4">
                <p className="font-semibold text-lg">{pet.owner.name}</p>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4" /> <span>{pet.owner.phone}</span>
                </div>
                {pet.owner.email && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-4 h-4" /> <span>{pet.owner.email}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Owner information unavailable.</p>
            )}
          </div>

          {pet.microchipId && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <Hash className="w-5 h-5 text-primary" /> Microchip ID
              </h3>
              <p className="font-mono text-lg">{pet.microchipId}</p>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground text-center">
            Registered on {formatDate(pet.createdAt)}
          </div>
        </div>

        {/* Right Column - Medical History */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Vaccinations */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
              <Syringe className="w-6 h-6 text-primary" /> Vaccination History
            </h3>
            
            {!pet.vaccinations || pet.vaccinations.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No vaccination records found.</p>
            ) : (
              <div className="space-y-4">
                {pet.vaccinations.map(vax => (
                  <div key={vax.id} className="flex flex-col sm:flex-row justify-between p-4 rounded-xl border border-border/50 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground">{vax.type}</span>
                        {vax.verified && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Vet Verified
                          </Badge>
                        )}
                      </div>
                      {vax.notes && <p className="text-sm text-muted-foreground">{vax.notes}</p>}
                    </div>
                    <div className="mt-2 sm:mt-0 text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> {formatDate(vax.date)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Notes */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
              <ClipboardList className="w-6 h-6 text-primary" /> Medical Records
            </h3>
            
            {!pet.medicalRecords || pet.medicalRecords.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No medical records found.</p>
            ) : (
              <div className="space-y-6">
                {pet.medicalRecords.map(record => (
                  <div key={record.id} className="relative pl-6 border-l-2 border-primary/20">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                    <div className="text-sm text-primary font-medium mb-1">
                      {formatDate(record.createdAt)}
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-foreground/80 border border-border/50">
                      {record.notes}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
