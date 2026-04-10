import { ExternalLink, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FORD_LINKS = [
  {
    label: "OWS",
    description: "Ford Warranty Processing (OWS Claims)",
    url: "https://www.warrantyprocessing.dealerconnection.com/prweb/SSOServlet",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
  },
  {
    label: "PTS",
    description: "Ford Tech Service (PTS / Workshop Manual)",
    url: "https://www.fordtechservice.dealerconnection.com/",
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    label: "DAS",
    description: "GWMS Dealer Dashboard",
    url: "https://go.ford/GWMSDealerDashboard",
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  },
  {
    label: "Ford SSO",
    description: "Ford Corporate Single Sign-On",
    url: "https://corp.sts.ford.com/adfs/ls/",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
  },
];

const LOCAL_APPS = [
  {
    label: "BSI 2.0",
    description: "Open BSI Desktop App",
    path: "C:\\BSI\\BSI 2.0\\BSI.exe",
  },
  {
    label: "Automate",
    description: "Mortimers Progress Client",
    path: 'C:\\Program Files (x86)\\Common Files\\Progress Software\\WebClient\\prowcini.exe',
    args: '"Automate/mortimers_rs" -s',
  },
];

export function QuickLinks() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1.5 flex-wrap">
        {FORD_LINKS.map((link) => (
          <Tooltip key={link.label}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-7 text-[11px] gap-1 border ${link.color} font-medium`}
                onClick={() => window.open(link.url, "_blank")}
              >
                <ExternalLink className="h-3 w-3" />
                {link.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {link.description}
            </TooltipContent>
          </Tooltip>
        ))}

        <div className="w-px h-5 bg-border mx-1" />

        {LOCAL_APPS.map((app) => (
          <Tooltip key={app.label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  navigator.clipboard.writeText(
                    app.args ? `"${app.path}" ${app.args}` : `"${app.path}"`
                  );
                }}
              >
                <Monitor className="h-3 w-3" />
                {app.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-xs">
              <p className="font-medium">{app.description}</p>
              <p className="text-muted-foreground mt-0.5 font-mono text-[10px]">Click to copy launch command</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
