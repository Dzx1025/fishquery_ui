import { MapPin, Fish, MessageCircleQuestion, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: MessageCircleQuestion,
    title: "Instant Answers",
    description:
      "Ask about bag limits, size restrictions, and seasonal closures in plain English.",
  },
  {
    icon: MapPin,
    title: "Location Aware",
    description:
      "Get rules specific to your exact fishing spot. Regulations change across zones.",
  },
  {
    icon: Fish,
    title: "Species Identification",
    description:
      "Not sure what you caught? Describe it or upload a photo for instant ID and rules.",
  },
  {
    icon: ShieldCheck,
    title: "Always Up-to-Date",
    description:
      "Our database is synced with the latest official government fisheries publications.",
  },
];

export function LandingFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto px-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:text-cyan-200 group-hover:bg-cyan-500/30 transition-colors">
              <feature.icon size={24} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
