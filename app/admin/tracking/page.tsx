// app/admin/tracking/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { TrendingUp, Users, DollarSign, BarChart3, ExternalLink } from "lucide-react";
import { getTrackingStatistics, type TrackingStatistics } from "@/lib/api/admin";

export default function TrackingPage() {
  const [stats, setStats] = useState<TrackingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  async function loadStatistics() {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrackingStatistics();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Fehler beim Laden der Statistiken");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white flex items-center justify-center">
        <Spinner size="lg" className="text-[#E8C7C3]" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-red-700">
            <p className="font-semibold mb-2">Fehler beim Laden</p>
            <p>{error || "Unbekannter Fehler"}</p>
          </div>
        </div>
      </div>
    );
  }

  const trackingPercentage = stats.totalBookings > 0
    ? ((stats.bookingsWithTracking / stats.totalBookings) * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">
            Marketing Tracking
          </h1>
          <p className="text-[#8A8A8A]">
            Letzte 30 Tage - Woher kommen deine Kunden?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-[#8A8A8A] mb-1">Gesamt Buchungen</div>
                  <div className="text-3xl font-bold text-[#1E1E1E]">{stats.totalBookings}</div>
                </div>
                <div className="p-3 bg-[#E8C7C3]/20 rounded-xl">
                  <Users className="text-[#E8C7C3]" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-[#8A8A8A] mb-1">Mit Tracking</div>
                  <div className="text-3xl font-bold text-[#C09995]">{stats.bookingsWithTracking}</div>
                  <div className="text-xs text-[#8A8A8A] mt-1">{trackingPercentage}% erfasst</div>
                </div>
                <div className="p-3 bg-[#C09995]/20 rounded-xl">
                  <BarChart3 className="text-[#C09995]" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-[#8A8A8A] mb-1">Gesamt Umsatz</div>
                  <div className="text-3xl font-bold text-[#E8C7C3]">{stats.totalRevenue.toFixed(2)} CHF</div>
                </div>
                <div className="p-3 bg-[#E8C7C3]/20 rounded-xl">
                  <DollarSign className="text-[#E8C7C3]" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-[#8A8A8A] mb-1">Ø Buchungswert</div>
                  <div className="text-3xl font-bold text-[#D8B0AC]">{stats.averageBookingValue.toFixed(2)} CHF</div>
                </div>
                <div className="p-3 bg-[#D8B0AC]/20 rounded-xl">
                  <TrendingUp className="text-[#D8B0AC]" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4 flex items-center gap-2">
                <BarChart3 size={24} className="text-[#E8C7C3]" />
                Traffic-Quellen (UTM Source)
              </h2>

              {stats.utmSources.length === 0 ? (
                <div className="text-center py-8 text-[#8A8A8A]">
                  <p className="mb-4">Noch keine Daten vorhanden</p>
                  <p className="text-sm">
                    Nutze UTM-Links um zu tracken woher deine Kunden kommen!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.utmSources.map((source, index) => (
                    <div key={source.name} className="border-l-4 border-[#E8C7C3] pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-lg text-[#1E1E1E] capitalize">
                            {source.name}
                          </div>
                          <div className="text-sm text-[#8A8A8A]">
                            {source.bookingCount} Buchungen • {source.revenue.toFixed(2)} CHF Umsatz
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#E8C7C3]">
                            {source.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-[#F5EDEB] rounded-full h-2">
                        <div
                          className="bg-[#E8C7C3] h-2 rounded-full transition-all"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4 flex items-center gap-2">
                <BarChart3 size={24} className="text-[#D8B0AC]" />
                Medium (UTM Medium)
              </h2>

              {stats.utmMediums.length === 0 ? (
                <div className="text-center py-8 text-[#8A8A8A]">
                  <p>Noch keine Daten vorhanden</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.utmMediums.map((medium) => (
                    <div key={medium.name} className="border-l-4 border-[#D8B0AC] pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-lg text-[#1E1E1E] capitalize">
                            {medium.name}
                          </div>
                          <div className="text-sm text-[#8A8A8A]">
                            {medium.bookingCount} Buchungen • {medium.revenue.toFixed(2)} CHF
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#D8B0AC]">
                            {medium.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-[#F5EDEB] rounded-full h-2">
                        <div
                          className="bg-[#D8B0AC] h-2 rounded-full transition-all"
                          style={{ width: `${medium.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <Card className="mb-6 border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-6">
            <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-[#C09995]" />
              Kampagnen (UTM Campaign)
            </h2>

            {stats.utmCampaigns.length === 0 ? (
              <div className="text-center py-8 text-[#8A8A8A]">
                <p>Noch keine Kampagnen-Daten vorhanden</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.utmCampaigns.map((campaign) => (
                  <div key={campaign.name} className="border-2 border-[#E8C7C3]/30 rounded-xl p-4 hover:border-[#E8C7C3] transition-colors bg-white">
                    <div className="font-bold text-lg text-[#1E1E1E] mb-2">
                      {campaign.name}
                    </div>
                    <div className="space-y-1 text-sm text-[#8A8A8A]">
                      <div className="flex justify-between">
                        <span>Buchungen:</span>
                        <span className="font-semibold text-[#1E1E1E]">{campaign.bookingCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Umsatz:</span>
                        <span className="font-semibold text-[#C09995]">{campaign.revenue.toFixed(2)} CHF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Anteil:</span>
                        <span className="font-semibold text-[#E8C7C3]">{campaign.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-6">
            <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4 flex items-center gap-2">
              <ExternalLink size={24} className="text-[#8A8A8A]" />
              Top Referrer (Woher kamen Besucher?)
            </h2>

            {stats.topReferrers.length === 0 ? (
              <div className="text-center py-8 text-[#8A8A8A]">
                <p>Noch keine Referrer-Daten vorhanden</p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.topReferrers.map((referrer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-[#E8C7C3]/30 rounded-lg hover:bg-[#F5EDEB] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#E8C7C3]/20 rounded-full flex items-center justify-center">
                        <span className="text-[#E8C7C3] font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="text-sm text-[#8A8A8A] font-mono break-all">
                        {referrer.referrer}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span className="px-3 py-1 bg-[#E8C7C3]/20 text-[#1E1E1E] rounded-full text-sm font-semibold">
                        {referrer.count} Besuche
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="mt-6 border-2 border-[#E8C7C3]/30 bg-[#F5EDEB] shadow-xl">
          <CardBody className="p-6">
            <h3 className="font-bold text-lg text-[#1E1E1E] mb-3">💡 Tracking-Tipp</h3>
            <div className="space-y-2 text-sm text-[#8A8A8A]">
              <p>
                <strong className="text-[#1E1E1E]">Nutze UTM-Links</strong> für deine Instagram, Facebook und Google Ads um genau zu sehen welche Kanäle Buchungen bringen!
              </p>
              <p className="font-mono text-xs bg-white p-2 rounded border border-[#E8C7C3]/30 text-[#1E1E1E]">
                https://limktree-keinfriseur.vercel.app?utm_source=instagram&utm_medium=story&utm_campaign=winter2025
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}