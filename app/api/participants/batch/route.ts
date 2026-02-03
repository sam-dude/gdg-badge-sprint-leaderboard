import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// POST - Batch create/update participants
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participants } = body;

    if (!Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json(
        { error: "Participants array is required" },
        { status: 400 },
      );
    }

    const supabase = createClient();
    const results = {
      created: 0,
      updated: 0,
      errors: [] as any[],
    };

    for (const p of participants) {
      const {
        name,
        email,
        badges = 0,
        posts = 0,
        googleDevProfileUrl,
        googleSkillsProfileUrl,
      } = p;

      if (!name || !email) {
        results.errors.push({
          name,
          email,
          error: "Name and email are required",
        });
        continue;
      }

      const totalPoints = badges * 25 + posts * 10;

      // Check if participant exists
      const { data: existing } = await supabase
        .from("participants")
        .select("id")
        .eq("email", email)
        .single();

      if (existing) {
        // Update existing participant
        await supabase
          .from("participants")
          .update({
            name,
            google_dev_profile_url: googleDevProfileUrl || null,
            google_skills_profile_url: googleSkillsProfileUrl || null,
          })
          .eq("id", existing.id);

        await supabase
          .from("scores")
          .update({
            google_dev_badges: Math.floor(badges / 2),
            google_skills_badges: Math.ceil(badges / 2),
            social_media_posts: posts,
            total_points: totalPoints,
            updated_at: new Date().toISOString(),
          })
          .eq("participant_id", existing.id);

        results.updated++;
      } else {
        // Create new participant
        const { data: newParticipant, error: participantError } = await supabase
          .from("participants")
          .insert({
            name,
            email,
            google_dev_profile_url: googleDevProfileUrl || null,
            google_skills_profile_url: googleSkillsProfileUrl || null,
          })
          .select()
          .single();

        if (participantError) {
          results.errors.push({ name, email, error: participantError.message });
          continue;
        }

        const { error: scoreError } = await supabase.from("scores").insert({
          participant_id: newParticipant.id,
          google_dev_badges: Math.floor(badges / 2),
          google_skills_badges: Math.ceil(badges / 2),
          social_media_posts: posts,
          total_points: totalPoints,
        });

        if (scoreError) {
          results.errors.push({ name, email, error: scoreError.message });
          // Cleanup
          await supabase
            .from("participants")
            .delete()
            .eq("id", newParticipant.id);
          continue;
        }

        results.created++;
      }
    }

    return NextResponse.json(
      {
        message: "Batch operation completed",
        results,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in batch operation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
