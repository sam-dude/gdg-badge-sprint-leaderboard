import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET all participants with their scores
export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("participants")
      .select(
        `
        id,
        name,
        email,
        google_dev_profile_url,
        google_skills_profile_url,
        created_at,
        scores (
          google_dev_badges,
          google_skills_badges,
          social_media_posts,
          total_points,
          last_scraped,
          updated_at
        )
      `,
      )
      .order("scores(total_points)", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to match frontend format
    const participants =
      data?.map((p: any) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        googleDevProfileUrl: p.google_dev_profile_url,
        googleSkillsProfileUrl: p.google_skills_profile_url,
        badges:
          (p.scores?.google_dev_badges || 0) +
          (p.scores?.google_skills_badges || 0),
        posts: p.scores?.social_media_posts || 0,
        points: p.scores?.total_points || 0,
        lastScraped: p.scores?.last_scraped,
        createdAt: p.created_at,
        updatedAt: p.scores?.updated_at,
      })) || [];

    return NextResponse.json({ participants }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new participant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      badges = 0,
      posts = 0,
      googleDevProfileUrl,
      googleSkillsProfileUrl,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    // Calculate points: (badges * 25) + (posts * 10)
    const totalPoints = badges * 25 + posts * 10;

    // Insert participant
    const { data: participant, error: participantError } = await supabase
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
      console.error("Error creating participant:", participantError);
      return NextResponse.json(
        { error: participantError.message },
        { status: 500 },
      );
    }

    // Insert score
    const { data: score, error: scoreError } = await supabase
      .from("scores")
      .insert({
        participant_id: participant.id,
        google_dev_badges: Math.floor(badges / 2), // Split badges evenly
        google_skills_badges: Math.ceil(badges / 2),
        social_media_posts: posts,
        total_points: totalPoints,
      })
      .select()
      .single();

    if (scoreError) {
      console.error("Error creating score:", scoreError);
      // Cleanup: delete participant if score creation fails
      await supabase.from("participants").delete().eq("id", participant.id);
      return NextResponse.json({ error: scoreError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        participant: {
          id: participant.id,
          name: participant.name,
          email: participant.email,
          googleDevProfileUrl: participant.google_dev_profile_url,
          googleSkillsProfileUrl: participant.google_skills_profile_url,
          badges,
          posts,
          points: totalPoints,
          createdAt: participant.created_at,
          updatedAt: score.updated_at,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
