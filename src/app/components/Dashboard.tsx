import { motion } from "motion/react";
import { ProductivityGarden } from "./ProductivityGarden";
import { useConnectedIntegrations } from "../integrationsContext";

export function Dashboard() {
  const connectedIds = useConnectedIntegrations();

  return (
    <div className="min-h-screen px-8 py-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl mb-2 text-zen-charcoal font-light">
            Your Productivity Garden
          </h1>
          <p className="text-lg text-zen-charcoal-light">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {connectedIds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0]">
            <h2 className="text-2xl font-semibold text-zen-charcoal mb-4">No integrations connected</h2>
            <p className="text-zen-charcoal-light mb-6">
              Please connect an integration in the Settings to see your productivity garden.
            </p>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0]">
            <h2 className="text-2xl font-semibold text-zen-charcoal mb-4">No integration data available</h2>
            <p className="text-zen-charcoal-light mb-6">
              Your integrations are connected, but there is no data to display yet.
            </p>
            <div className="mt-8">
              <ProductivityGarden
                activityData={{ github: 0, slack: 0 }}
                enabledIntegrationIds={connectedIds}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
