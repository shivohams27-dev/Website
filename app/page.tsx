import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Research } from "@/components/Research";
import { Team } from "@/components/Team";
import { Contact } from "@/components/Contact";
import { InitialLoader } from "@/components/InitialLoader";
import { SiteConfig, Project, ResearchPaper, TeamMember, StageColor } from "@/lib/types";

// Force dynamic rendering to ensure fresh data (in production you might use ISR)
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch all data server-side
  const [
    { data: configData },
    { data: projectsData },
    { data: researchData },
    { data: teamData },
    { data: stageColorsData }
  ] = await Promise.all([
    supabase.from("site_config").select("*").single(),
    supabase.from("projects").select("*").order("order_index"),
    supabase.from("research_papers").select("*").order("order_index"),
    supabase.from("team_members").select("*").order("order_index"),
    supabase.from("stage_colors").select("*").order("stage")
  ]);

  const config = configData as SiteConfig;
  const projects = (projectsData || []) as Project[];
  const research = (researchData || []) as ResearchPaper[];
  const team = (teamData || []) as TeamMember[];
  const stageColors = (stageColorsData || []) as StageColor[];

  return (
    <InitialLoader>
      <main className="site-shell relative min-h-screen bg-background">
        <Navbar />
        
        <Hero config={config} />
        
        <Projects 
          projects={projects} 
          stageColors={stageColors} 
          exploreUrl={config?.join_lab_url || "#"} 
        />
        
        <Research 
          papers={research} 
          stageColors={stageColors} 
          exploreUrl={config?.join_lab_url || "#"} 
        />
        
        <Team members={team} />
        
        <Contact config={config} />
      </main>
    </InitialLoader>
  );
}
