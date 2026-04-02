import { useGetAdminStats, useListPets } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { PawPrint, CheckCircle2, Clock, AlertCircle, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from "@/lib/utils";

export function AdminDashboardPage() {
  const { data: stats } = useGetAdminStats();
  const { data: petsData, isLoading: petsLoading, isError: petsError } = useListPets();
  const pets = Array.isArray(petsData) ? petsData : [];

  const chartData = stats ? [
    { name: 'Verified', count: stats.verified, fill: 'hsl(var(--success))' },
    { name: 'Pending', count: stats.pending, fill: 'hsl(var(--warning))' },
    { name: 'Incomplete', count: stats.incomplete, fill: 'hsl(var(--muted-foreground))' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-foreground">Platform Administration</h1>
        <p className="text-muted-foreground mt-2">Overview of registrations and verification statuses.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Pets" value={stats?.total || 0} icon={PawPrint} color="bg-primary/10 text-primary" />
        <StatCard title="Verified" value={stats?.verified || 0} icon={CheckCircle2} color="bg-green-100 text-green-600" />
        <StatCard title="Pending Review" value={stats?.pending || 0} icon={Clock} color="bg-amber-100 text-amber-600" />
        <StatCard title="Recent (7d)" value={stats?.recentRegistrations || 0} icon={Activity} color="bg-blue-100 text-blue-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Chart */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Pets Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-slate-50 border-y border-border">
                    <tr>
                      <th className="px-6 py-3 font-medium">Pet ID</th>
                      <th className="px-6 py-3 font-medium">Pet Name</th>
                      <th className="px-6 py-3 font-medium">Owner</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {petsLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading registrations…</td>
                      </tr>
                    ) : petsError ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-destructive">Unable to load pets — API server not connected.</td>
                      </tr>
                    ) : pets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No registrations found.</td>
                      </tr>
                    ) : pets.map((pet) => (
                      <tr key={pet.id} className="bg-white hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium">{pet.petId}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">{pet.name}</div>
                          <div className="text-xs text-muted-foreground">{pet.species}</div>
                        </td>
                        <td className="px-6 py-4">{pet.owner?.name}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={pet.status} />
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDate(pet.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-display font-bold">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}
