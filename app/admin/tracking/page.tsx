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
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white p-8">
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
    <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-barber-black mb-2">
            Marketing Tracking
          </h1>
          <p className="text-barber-grey-600">
            Letzte 30 Tage - Woher kommen deine Kunden?
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-barber-grey-600 mb-1">Gesamt Buchungen</div>
                  <div className="text-3xl font-bold text-barber-black">{stats.totalBookings}</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-barber-grey-600 mb-1">Mit Tracking</div>
                  <div className="text-3xl font-bold text-green-600">{stats.bookingsWithTracking}</div>
                  <div className="text-xs text-barber-grey-500 mt-1">{trackingPercentage}% erfasst</div>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <BarChart3 className="text-green-600" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-barber-grey-600 mb-1">Gesamt Umsatz</div>
                  <div className="text-3xl font-bold text-barber-red">{stats.totalRevenue.toFixed(2)} €</div>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <DollarSign className="text-barber-red" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-barber-grey-600 mb-1">Ø Buchungswert</div>
                  <div className="text-3xl font-bold text-barber-gold">{stats.averageBookingValue.toFixed(2)} €</div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <TrendingUp className="text-barber-gold" size={24} />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* UTM Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-barber-black mb-4 flex items-center gap-2">
                <BarChart3 size={24} className="text-barber-red" />
                Traffic-Quellen (UTM Source)
              </h2>

              {stats.utmSources.length === 0 ? (
                <div className="text-center py-8 text-barber-grey-600">
                  <p className="mb-4">Noch keine Daten vorhanden</p>
                  <p className="text-sm">
                    Nutze UTM-Links um zu tracken woher deine Kunden kommen!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.utmSources.map((source, index) => (
                    <div key={source.name} className="border-l-4 border-barber-red pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-lg text-barber-black capitalize">
                            {source.name}
                          </div>
                          <div className="text-sm text-barber-grey-600">
                            {source.bookingCount} Buchungen • {source.revenue.toFixed(2)} € Umsatz
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-barber-red">
                            {source.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-barber-grey-100 rounded-full h-2">
                        <div
                          className="bg-barber-red h-2 rounded-full transition-all"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* UTM Medium */}
          <Card>
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-barber-black mb-4 flex items-center gap-2">
                <BarChart3 size={24} className="text-blue-600" />
                Medium (UTM Medium)
              </h2>

              {stats.utmMediums.length === 0 ? (
                <div className="text-center py-8 text-barber-grey-600">
                  <p>Noch keine Daten vorhanden</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.utmMediums.map((medium) => (
                    <div key={medium.name} className="border-l-4 border-blue-600 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-lg text-barber-black capitalize">
                            {medium.name}
                          </div>
                          <div className="text-sm text-barber-grey-600">
                            {medium.bookingCount} Buchungen • {medium.revenue.toFixed(2)} €
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {medium.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-barber-grey-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
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

        {/* UTM Campaigns */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <h2 className="text-2xl font-bold text-barber-black mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-green-600" />
              Kampagnen (UTM Campaign)
            </h2>

            {stats.utmCampaigns.length === 0 ? (
              <div className="text-center py-8 text-barber-grey-600">
                <p>Noch keine Kampagnen-Daten vorhanden</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.utmCampaigns.map((campaign) => (
                  <div key={campaign.name} className="border-2 border-barber-grey-200 rounded-xl p-4 hover:border-barber-red transition-colors">
                    <div className="font-bold text-lg text-barber-black mb-2">
                      {campaign.name}
                    </div>
                    <div className="space-y-1 text-sm text-barber-grey-600">
                      <div className="flex justify-between">
                        <span>Buchungen:</span>
                        <span className="font-semibold text-barber-black">{campaign.bookingCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Umsatz:</span>
                        <span className="font-semibold text-green-600">{campaign.revenue.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Anteil:</span>
                        <span className="font-semibold text-barber-red">{campaign.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardBody className="p-6">
            <h2 className="text-2xl font-bold text-barber-black mb-4 flex items-center gap-2">
              <ExternalLink size={24} className="text-purple-600" />
              Top Referrer (Woher kamen Besucher?)
            </h2>

            {stats.topReferrers.length === 0 ? (
              <div className="text-center py-8 text-barber-grey-600">
                <p>Noch keine Referrer-Daten vorhanden</p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.topReferrers.map((referrer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-barber-grey-200 rounded-lg hover:bg-barber-grey-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="text-sm text-barber-grey-700 font-mono break-all">
                        {referrer.referrer}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {referrer.count} Besuche
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 border-2 border-blue-200 bg-blue-50">
          <CardBody className="p-6">
            <h3 className="font-bold text-lg text-blue-900 mb-3">💡 Tracking-Tipp</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <strong>Nutze UTM-Links</strong> für deine Instagram, Facebook und Google Ads um genau zu sehen welche Kanäle Buchungen bringen!
              </p>
              <p className="font-mono text-xs bg-white p-2 rounded border border-blue-200">
                https://limktree-keinfriseur.vercel.app?utm_source=instagram&utm_medium=story&utm_campaign=winter2025
              </p>
              <p className="text-xs text-blue-700">
                Mehr Infos in der <code className="bg-white px-1 py-0.5 rounded">TRACKING_SETUP.md</code> Datei!
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
