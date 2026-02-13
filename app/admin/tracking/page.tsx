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
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-6 text-red-700">
            <p className="font-semibold mb-2 text-sm sm:text-base">Fehler beim Laden</p>
            <p className="text-sm sm:text-base">{error || "Unbekannter Fehler"}</p>
          </div>
        </div>
      </div>
    );
  }

  const trackingPercentage = stats.totalBookings > 0
    ? ((stats.bookingsWithTracking / stats.totalBookings) * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E1E1E] mb-2">
            Marketing Tracking
          </h1>
          <p className="text-sm sm:text-base text-[#8A8A8A]">
            Letzte 30 Tage - Woher kommen deine Kunden?
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 mb-6 sm:mb-8">
          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs sm:text-sm text-[#8A8A8A] mb-1">Gesamt Buchungen</div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#1E1E1E]">{stats.totalBookings}</div>
                </div>
                <div className="p-2 sm:p-3 bg-[#E8C7C3]/20 rounded-xl">
                  <Users className="text-[#E8C7C3]" size={20} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs sm:text-sm text-[#8A8A8A] mb-1">Mit Tracking</div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#C09995]">{stats.bookingsWithTracking}</div>
                  <div className="text-xs text-[#8A8A8A] mt-1">{trackingPercentage}% erfasst</div>
                </div>
                <div className="p-2 sm:p-3 bg-[#C09995]/20 rounded-xl">
                  <BarChart3 className="text-[#C09995]" size={20} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs sm:text-sm text-[#8A8A8A] mb-1">Gesamt Umsatz</div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#E8C7C3]">{stats.totalRevenue.toFixed(2)} CHF</div>
                </div>
                <div className="p-2 sm:p-3 bg-[#E8C7C3]/20 rounded-xl">
                  <DollarSign className="text-[#E8C7C3]" size={20} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs sm:text-sm text-[#8A8A8A] mb-1">Ø Buchungswert</div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#D8B0AC]">{stats.averageBookingValue.toFixed(2)} CHF</div>
                </div>
                <div className="p-2 sm:p-3 bg-[#D8B0AC]/20 rounded-xl">
                  <TrendingUp className="text-[#D8B0AC]" size={20} />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Charts Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* UTM Sources */}
          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-[#E8C7C3]" />
                <span>Traffic-Quellen</span>
              </h2>

              {stats.utmSources.length === 0 ? (
                <div className="text-center py-8 text-[#8A8A8A]">
                  <p className="text-sm sm:text-base mb-2">Noch keine Daten vorhanden</p>
                  <p className="text-xs sm:text-sm">
                    Nutze UTM-Links um zu tracken woher deine Kunden kommen!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.utmSources.map((source) => (
                    <div key={source.name} className="border-l-4 border-[#E8C7C3] pl-3 sm:pl-4 py-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <div className="font-bold text-base sm:text-lg text-[#1E1E1E] capitalize break-words">
                            {source.name}
                          </div>
                          <div className="text-xs sm:text-sm text-[#8A8A8A] break-words">
                            {source.bookingCount} Buchungen • {source.revenue.toFixed(2)} CHF
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-bold text-[#E8C7C3]">
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

          {/* UTM Mediums */}
          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-[#D8B0AC]" />
                <span>Medium</span>
              </h2>

              {stats.utmMediums.length === 0 ? (
                <div className="text-center py-8 text-[#8A8A8A]">
                  <p className="text-sm sm:text-base">Noch keine Daten vorhanden</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.utmMediums.map((medium) => (
                    <div key={medium.name} className="border-l-4 border-[#D8B0AC] pl-3 sm:pl-4 py-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <div className="font-bold text-base sm:text-lg text-[#1E1E1E] capitalize break-words">
                            {medium.name}
                          </div>
                          <div className="text-xs sm:text-sm text-[#8A8A8A] break-words">
                            {medium.bookingCount} Buchungen • {medium.revenue.toFixed(2)} CHF
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-bold text-[#D8B0AC]">
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

        {/* Campaigns */}
        <Card className="mb-6 border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#C09995]" />
              <span>Kampagnen</span>
            </h2>

            {stats.utmCampaigns.length === 0 ? (
              <div className="text-center py-8 text-[#8A8A8A]">
                <p className="text-sm sm:text-base">Noch keine Kampagnen-Daten vorhanden</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {stats.utmCampaigns.map((campaign) => (
                  <div key={campaign.name} className="border-2 border-[#E8C7C3]/30 rounded-xl p-3 sm:p-4 hover:border-[#E8C7C3] transition-colors bg-white">
                    <div className="font-bold text-base sm:text-lg text-[#1E1E1E] mb-2 break-words">
                      {campaign.name}
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm text-[#8A8A8A]">
                      <div className="flex justify-between gap-2">
                        <span>Buchungen:</span>
                        <span className="font-semibold text-[#1E1E1E]">{campaign.bookingCount}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span>Umsatz:</span>
                        <span className="font-semibold text-[#C09995]">{campaign.revenue.toFixed(2)} CHF</span>
                      </div>
                      <div className="flex justify-between gap-2">
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

        {/* Top Referrers */}
        <Card className="mb-6 border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-4 flex items-center gap-2">
              <ExternalLink size={20} className="text-[#8A8A8A]" />
              <span>Top Referrer</span>
            </h2>

            {stats.topReferrers.length === 0 ? (
              <div className="text-center py-8 text-[#8A8A8A]">
                <p className="text-sm sm:text-base">Noch keine Referrer-Daten vorhanden</p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.topReferrers.map((referrer, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-[#E8C7C3]/30 rounded-lg hover:bg-[#F5EDEB] transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-[#E8C7C3]/20 rounded-full flex items-center justify-center">
                        <span className="text-[#E8C7C3] font-bold text-xs sm:text-sm">{index + 1}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-[#8A8A8A] font-mono break-all">
                        {referrer.referrer}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-0 sm:ml-4">
                      <span className="px-2 sm:px-3 py-1 bg-[#E8C7C3]/20 text-[#1E1E1E] rounded-full text-xs sm:text-sm font-semibold">
                        {referrer.count} Besuche
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Tip Card */}
        <Card className="mt-6 border-2 border-[#E8C7C3]/30 bg-[#F5EDEB] shadow-xl">
          <CardBody className="p-4 sm:p-6">
            <h3 className="font-bold text-base sm:text-lg text-[#1E1E1E] mb-3">💡 Tracking-Tipp</h3>
            <div className="space-y-2 text-xs sm:text-sm text-[#8A8A8A]">
              <p className="break-words">
                <strong className="text-[#1E1E1E]">Nutze UTM-Links</strong> für deine Instagram, Facebook und Google Ads um genau zu sehen welche Kanäle Buchungen bringen!
              </p>
              <p className="font-mono text-xs bg-white p-2 sm:p-3 rounded border border-[#E8C7C3]/30 text-[#1E1E1E] break-all">
                https://limktree-keinfriseur.vercel.app?utm_source=instagram&utm_medium=story&utm_campaign=winter2025
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}