import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface CandidateProfile {
  id: string;
  full_name: string;
  location: string;
  skills: string[];
  experience_level: string;
  bio: string;
  user_id: string;
}

interface MatchResult {
  id: string;
  full_name: string;
  location: string;
  skills: string[];
  experience_level: string;
  bio: string;
  match_score: number;
  matching_skills: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, requiredSkills, jobTitle } = await req.json();

    if (!jobId || !requiredSkills || !Array.isArray(requiredSkills)) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Starting AI matching for job:", jobTitle);
    console.log("Required skills:", requiredSkills);

    // Fetch all candidate profiles
    const { data: candidates, error: candidatesError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_type", "candidate")
      .not("skills", "is", null);

    if (candidatesError) {
      console.error("Error fetching candidates:", candidatesError);
      throw candidatesError;
    }

    console.log(`Found ${candidates?.length || 0} candidates to analyze`);

    if (!candidates || candidates.length === 0) {
      return new Response(
        JSON.stringify({ matches: [] }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Calculate match scores for each candidate
    const matches: MatchResult[] = candidates
      .map((candidate: CandidateProfile) => {
        const candidateSkills = candidate.skills || [];
        
        // Find matching skills (case-insensitive)
        const matchingSkills = requiredSkills.filter(requiredSkill =>
          candidateSkills.some(candidateSkill =>
            candidateSkill.toLowerCase().includes(requiredSkill.toLowerCase()) ||
            requiredSkill.toLowerCase().includes(candidateSkill.toLowerCase())
          )
        );

        // Calculate base match score based on skill overlap
        const skillMatchPercentage = matchingSkills.length / requiredSkills.length;
        let matchScore = Math.round(skillMatchPercentage * 100);

        // Apply experience level bonus
        const experienceLevelBonus = getExperienceLevelBonus(candidate.experience_level);
        matchScore = Math.min(100, matchScore + experienceLevelBonus);

        // Apply profile completeness bonus
        const completenessBonus = getProfileCompletenessBonus(candidate);
        matchScore = Math.min(100, matchScore + completenessBonus);

        return {
          id: candidate.id,
          full_name: candidate.full_name || "Anonymous",
          location: candidate.location || "",
          skills: candidateSkills,
          experience_level: candidate.experience_level || "",
          bio: candidate.bio || "",
          match_score: matchScore,
          matching_skills: matchingSkills,
        };
      })
      .filter(match => match.match_score > 20) // Only return candidates with >20% match
      .sort((a, b) => b.match_score - a.match_score) // Sort by match score descending
      .slice(0, 10); // Return top 10 matches

    console.log(`Generated ${matches.length} matches`);

    return new Response(
      JSON.stringify({ matches }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in AI matching function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function getExperienceLevelBonus(experienceLevel: string): number {
  const bonusMap: { [key: string]: number } = {
    "entry": 5,
    "mid": 10,
    "senior": 15,
    "lead": 10,
    "executive": 5,
  };
  
  return bonusMap[experienceLevel?.toLowerCase()] || 0;
}

function getProfileCompletenessBonus(candidate: CandidateProfile): number {
  let bonus = 0;
  
  if (candidate.bio && candidate.bio.length > 50) bonus += 5;
  if (candidate.location) bonus += 3;
  if (candidate.skills && candidate.skills.length >= 5) bonus += 5;
  if (candidate.experience_level) bonus += 2;
  
  return bonus;
}

serve(handler);