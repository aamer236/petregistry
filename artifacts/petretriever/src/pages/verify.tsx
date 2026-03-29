import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVerifyPet } from "@workspace/api-client-react";
import { StatusBadge } from "@/components/status-badge";
import { Search, Loader2, PawPrint, Phone, Hash } from "lucide-react";

export function VerifyPage() {
  const [activeTab, setActiveTab] = useState("petId");
  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<{ petId?: string; phone?: string; microchipId?: string } | null>(null);

  const { data: results, isLoading, isError } = useVerifyPet(submittedQuery || {}, {
    query: { enabled: !!submittedQuery }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    
    setSubmittedQuery({
      petId: activeTab === "petId" ? searchValue : undefined,
      phone: activeTab === "phone" ? searchValue : undefined,
      microchipId: activeTab === "microchip" ? searchValue : undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-bold">Verify Pet Identity</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Lookup a pet's verified profile, medical history, and owner contact information.
        </p>
      </div>

      <div className="glass-card p-2 sm:p-4 rounded-3xl mb-12">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchValue(""); }} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-2xl h-auto">
            <TabsTrigger value="petId" className="rounded-xl py-3 data-[state=active]:shadow-sm">
              <PawPrint className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Pet ID</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="rounded-xl py-3 data-[state=active]:shadow-sm">
              <Phone className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Owner Phone</span>
            </TabsTrigger>
            <TabsTrigger value="microchip" className="rounded-xl py-3 data-[state=active]:shadow-sm">
              <Hash className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Microchip</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 px-2 sm:px-4 pb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  activeTab === "petId" ? "Enter Pet ID (e.g. PR-12345)" :
                  activeTab === "phone" ? "Enter Phone Number" :
                  "Enter Microchip Number"
                }
                className="pl-12 h-14 text-lg rounded-xl bg-white border-2 focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 rounded-xl" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </Button>
          </form>
        </Tabs>
      </div>

      {/* Results Section */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-muted-foreground">
          <PawPrint className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg">No pets found matching that information.</p>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold mb-4">Search Results ({results.length})</h2>
          {results.map((pet) => (
            <Link key={pet.id} href={`/pet/${pet.id}`}>
              <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center sm:items-start group cursor-pointer hover:bg-slate-50/50">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted shrink-0 border-4 border-white shadow-sm">
                  {pet.photoUrl ? (
                    <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                      <PawPrint className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{pet.name}</h3>
                    <StatusBadge status={pet.status} />
                  </div>
                  <div className="text-muted-foreground text-sm space-y-1 mb-4">
                    <p>{pet.breed} • {pet.age} years old • {pet.gender}</p>
                    <p>Pet ID: <span className="font-mono text-foreground">{pet.petId}</span></p>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-medium">
                    <span className="text-primary bg-primary/10 px-3 py-1 rounded-lg">
                      View Full Profile & Records →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
