import { Link } from "react-router-dom";
import { Clock, Shield, AlertTriangle, Wrench } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { sltSections } from "@/data/slt-data";
import { partsData } from "@/data/parts-data";

const modules = [
  {
    title: "SLT Lookup",
    description: "Search standard labour times by section, operation, or part number",
    icon: Clock,
    href: "/slt",
    stat: `${sltSections.reduce((a, s) => a + s.operations.length, 0)} operations`,
  },
  {
    title: "Parts Coverage",
    description: "Check Ford Protect warranty coverage across all plan tiers",
    icon: Shield,
    href: "/parts",
    stat: `${partsData.length} parts`,
  },
  {
    title: "Overlap Checker",
    description: "Validate multiple operations for claim conflicts",
    icon: AlertTriangle,
    href: "/overlaps",
    stat: "Real-time validation",
  },
  {
    title: "Scheduled Maintenance",
    description: "MBASIC service operations and fluid change intervals",
    icon: Wrench,
    href: "/maintenance",
    stat: "All drivetrains",
  },
];

const Index = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Ford Warranty & Service Tool
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          2022 U704A Everest — Quick access to SLT, parts coverage, overlap validation, and maintenance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <Link key={mod.href} to={mod.href}>
            <Card className="ford-card h-full group cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <mod.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {mod.stat}
                  </span>
                </div>
                <CardTitle className="text-lg mt-2">{mod.title}</CardTitle>
                <CardDescription>{mod.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="ford-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Vehicle Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Model</p>
              <p className="font-mono font-medium">U704A Everest</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Year</p>
              <p className="font-mono font-medium">2022</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">VIN Prefix</p>
              <p className="font-mono font-medium">MNBRXXMAWR</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Engines</p>
              <p className="font-mono font-medium text-xs">2.0L Panth / Pan Bi / 2.3L GTDI / 3.0L DSL</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
